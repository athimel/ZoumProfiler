angular.module('ZoumProfiler')
    .directive('levels', function() {
        return {
            restrict: 'E',
            templateUrl: 'levels/levels.html'
        };
    })
    .controller('LevelsController', ['$scope', '$http', '$modal', 'monsters', function ($scope, $http, $modal, monsters) {

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.selectedView;
        $scope.views = [];
        $scope.levelContext = { minLevel:10, maxLevel:99, includeGowap:false, includeZombi:false, maxDistance: 20 };

        /* ********************************************* */
        /* **          Controller's methods           ** */
        /* ********************************************* */

        $scope.minLevelChanged = function() {
            if ($scope.levelContext.minLevel > $scope.levelContext.maxLevel) {
                $scope.levelContext.maxLevel = $scope.levelContext.minLevel;
            }
        };

        $scope.maxLevelChanged = function() {
            if ($scope.levelContext.maxLevel < $scope.levelContext.minLevel) {
                $scope.levelContext.minLevel = $scope.levelContext.maxLevel;
            }
        };

        $scope._refreshView = function(view) {
            angular.forEach(view.monsters, function (monster) {
                $scope._computeMonsterDetails(view.origin, monster);
            });
            view.refreshed = true;
        };

        $scope.selectView = function(view) {
            if (!view.fetched) {
                $scope._fetchViewFromServer(view);
            } else {
                if (!view.refreshed) {
                    $scope._refreshView(view);
                }
                delete $scope._viewGrid;
                $scope.selectedView = view;
            }
        };

        $scope._extractAge = function(monster) {
            var name = monster.name.trim();
            var index = name.indexOf("[");
            var endIndex = name.indexOf("]", index);
            monster.age = name.substr(index + 1, endIndex - index - 1).trim();
            monster.baseName = name.substr(0, index).trim();
        };

        $scope._extractTemplate = function(monster) {
            delete monster.template;

            var name = monster.baseName.trim() + " ";
            if (name.substr(0, 6) == "Archi-") {
                monster.template = name.substr(6).trim();
                monster.baseName = name.substr(6).trim();
            } else {
                var templatesNames = Object.keys(monsters.templates);
                for (var i = 0; i < templatesNames.length; i++) {
                    var template = templatesNames[i];
                    var index = name.indexOf(template + " "); // +" " Pour s'assurer que le mot est complet
                    if (index >= 0) {
                        monster.template = template;
                        monster.baseName = (name.substr(0, index) + name.substr(index + monster.template.length)).trim();

                        // Cas particulier du Nécromant/Sorcière (template et nom de monstre)
                        if (monster.baseName.length == 0) {
                            delete monster.template;
                            monster.baseName = name.trim();
                        }

                        // Car particulier de la "Voleuse Sorcière" (template avant le nom)
                        if ((monster.template == "Sorcière" || monster.template == "Nécromant") && angular.isDefined(monsters.templates[monster.baseName])) {
                            var tmp = monster.baseName;
                            monster.baseName = monster.template;
                            monster.template = tmp;
                        }

                        // Cas particulier du Frondeur vs Grand Frondeur
                        if (monster.template == "Frondeur" && monster.baseName.substr(0, 5) == "Grand") {
                            monster.template = "Grand Frondeur";
                            monster.baseName = name.substr(14).trim();
                        }
                        break;
                    }
                }
            }
        };

        $scope._extractFamilyAndBaseNival = function(monster) {
            delete monster.family;
            delete monster.baseNival;
            delete monster.nival;

            var name = monster.baseName.trim();

            var familyNames = Object.keys(monsters.families);
            for (var i=0; i<familyNames.length; i++) {
                var family = familyNames[i];
                if (angular.isDefined(monsters.families[family][name])) {
                    monster.family = family;
                    monster.baseNival = monsters.families[family][name];
                    break;
                }
            }
            if (!monster.family) {
                console.error(monster);
            }
        };

        $scope._computeMonsterDetails = function(origin, monster) {

            delete monster.templateBonus;
            delete monster.ageBonus;

            $scope._extractAge(monster);
            $scope._extractTemplate(monster);
            $scope._extractFamilyAndBaseNival(monster);

            monster.templateBonus = monsters.templates[monster.template];
            if (monster.family) {
                monster.ageBonus = monsters.ages[monster.family][monster.age];
            }

            monster.nival = monster.baseNival;
            if (monster.ageBonus) {
                monster.nival += monster.ageBonus;
            }
            if (monster.templateBonus) {
                monster.nival += monster.templateBonus;
            }

            $scope._computeDistance(origin, monster);

            if (angular.isUndefined(monster.nival) || angular.isUndefined(monster.ageBonus)) {
                console.error(monster);
            }
        };

        $scope._computeDistance = function(origin, elem) {

            if (origin) {
                var xDistance = Math.abs(origin.x - elem.posX);
                var yDistance = Math.abs(origin.y - elem.posY);
                var nDistance = Math.abs(origin.n - elem.posN);
                elem.horizontalDistance = Math.max(xDistance, yDistance);
                elem.verticalDistance = nDistance;
                elem.distance = Math.max(elem.horizontalDistance, elem.verticalDistance);
            }

        };

        $scope._computeTrollDetails = function(origin, troll) {

            //$scope._computeDistance(origin, troll); // AThimel 20150211 No need to compute distance so far

        };

        $scope._parseView = function(trollId, data) {

            var result = {
                trollId: trollId,
                date: new Date(),
                trolls: [],
                monsters: [],
                refreshed: true,
                fetched: true
            };

            var viewLines = data.split('\n');
            var inTrollsPart = false;
            var inMonstersPart = false;
            var inOriginPart = false;
            angular.forEach(viewLines, function (line) {
                if (line == "#DEBUT TROLLS") {
                    inTrollsPart = true;
                } else if (line == "#FIN TROLLS") {
                    inTrollsPart = false;
                } else if (line == "#DEBUT MONSTRES") {
                    inMonstersPart = true;
                } else if (line == "#FIN MONSTRES") {
                    inMonstersPart = false;
                } else if (line == "#DEBUT ORIGINE") {
                    inOriginPart = true;
                } else if (line == "#FIN ORIGINE") {
                    inOriginPart = false;
                } else {
                    if (inMonstersPart) {

                        var cells = line.split(';');

                        var monster = {
                            id: parseInt(cells[0]),
                            name: cells[1],
                            posX: parseInt(cells[2]),
                            posY: parseInt(cells[3]),
                            posN: parseInt(cells[4])
                        };

                        result.monsters.push(monster);
                    } else if (inOriginPart) {
                        var cells = line.split(';');

                        result.scope = parseInt(cells[0]);
                        result.origin = {
                            x: parseInt(cells[1]),
                            y: parseInt(cells[2]),
                            n: parseInt(cells[3])
                        };
                    } else if (inTrollsPart) {

                        var cells = line.split(';');

                        var troll = {
                            id: parseInt(cells[0]),
                            posX: parseInt(cells[1]),
                            posY: parseInt(cells[2]),
                            posN: parseInt(cells[3])
                        };

                        result.trolls.push(troll);
                    }
                }
            });

            angular.forEach(result.monsters, function(monster) {
                $scope._computeMonsterDetails(result.origin, monster);
            });

            angular.forEach(result.trolls, function(troll) {
                $scope._computeTrollDetails(result.origin, troll);
            });

            return result;
        };

        $scope.downloadViewFromSp = function() {

            var urlProfile = "proxy/sp.php?script=SP_Vue2.php&trollId=" + $scope.levelContext.spTrollId + "&trollPassword=" + $scope.levelContext.spTrollPassword;
            $http.get(urlProfile).
                success(function (data) {

                    if (data.substring(0, 6) == "Erreur") {
                        $scope._addErrorMessage(data);
                    } else {
                        //console.log(data);
                        var view = $scope._parseView($scope.levelContext.spTrollId, data);
                        $scope.views.push(view);
                        $scope.selectView(view);
                        $scope._saveViewToServer(view);
                    }

                }).
                error(function (data) {
                    $scope._addErrorMessage("Import impossible: " + data);
                });

        };



        $scope._loadAllViewsFromServer = function() {
            $http.get('rest/views/listExtracts.php')
                .success(function(data) {

                    $scope.views = data.views;
                    angular.forEach($scope.views, function(view) {
                        view.refreshed = false;
                        view.fetched = false;
                    });

                })
                .error(function() {
                    console.log("ERROR");
                });
        };

        $scope._fetchViewFromServer = function(view) {
            var viewId = view["_id"]["$id"];
            $http.get('rest/views/get.php?viewId=' + viewId)
                .success(function(data) {

                    angular.copy(data, view);

                    view.fetched = true;
                    view.refreshed = false;

                    $scope.selectView(view);
                })
                .error(function() {
                    console.log("ERROR");
                });
        };

        $scope._saveViewToServer = function(view) {
            var data = "view=" + JSON.stringify(view);
            $http.post('rest/views/save.php', data)
                .success(function(data) {
                    if (data.result != "CREATED") {
                        $scope._addErrorMessage("Impossible d'enregistrer la vue : " + data.result);
                    }
                })
                .error(function(error) {
                    $scope._addErrorMessage("Impossible d'enregistrer la vue : " + error);
                });
        };

        $scope.deleteView = function(view) {
            var data = "viewId=" + view['_id']['$id'];
            $http.post('rest/views/delete.php', data)
                .success(function(data) {
                    var index = $scope.views.indexOf(view);
                    $scope.views.splice(index, 1);
                    if (angular.equals(view, $scope.selectedView)) {
                        delete $scope.selectedView;
                    }
                })
                .error(function(error) {
                    $scope._addErrorMessage("Impossible de supprimer la vue : " + error);
                });
        };

        $scope._getNDim = function(grid, elem) {
            var xDim = grid[elem.posX];
            if (!xDim) {
                xDim = {};
                grid[elem.posX] = xDim;
            }

            var yDim = xDim[elem.posY];
            if (!yDim) {
                yDim = {};
                xDim[elem.posY] = yDim;
            }

            var nDim = yDim[elem.posN];
            if (!nDim) {
                nDim = { monsters:[], trolls:[] };
                yDim[elem.posN] = nDim;
            }
            return nDim;
        };

        $scope.viewAroundMonster = function(targetMonster) {

            if (!$scope._viewGrid) {
                $scope._viewGrid = {};

                angular.forEach($scope.selectedView.monsters, function(monster) {
                    var nDim = $scope._getNDim($scope._viewGrid, monster);
                    nDim.monsters.push(monster);
                });

                angular.forEach($scope.selectedView.trolls, function(troll) {
                    var nDim = $scope._getNDim($scope._viewGrid, troll);
                    nDim.trolls.push(troll);
                });
            }

            var modalInstance = $modal.open({
                templateUrl: 'aroundMonster.html',
                controller: 'AroundMonsterController',
                size: 'lg',
                resolve: {
                    viewGrid: function () {
                        return $scope._viewGrid;
                    },
                    targetMonster: function () {
                        return targetMonster;
                    },
                    limits: function () {
                        var origin = $scope.selectedView.origin;
                        var scope = $scope.selectedView.scope ? $scope.selectedView.scope : parseInt($scope.selectedView.distance);
                        var nScope = Math.floor((scope+1)/2);
                        return {
                            lowerX: origin.x - scope,
                            upperX: origin.x + scope,
                            lowerY: origin.y - scope,
                            upperY: origin.y + scope,
                            lowerN: origin.n + nScope,
                            upperN: origin.n - nScope
                        };
                    }
                }
            });
        };

        $scope._loadAllViewsFromServer();

    }]);


angular.module('ZoumProfiler')
    .controller('AroundMonsterController', ['$scope', '$modalInstance', 'targetMonster', 'viewGrid', 'limits', function ($scope, $modalInstance, targetMonster, viewGrid, limits) {

        $scope.targetMonster = targetMonster;
        $scope.limits = limits;

        $scope.showCavDetails = function(cav) {
            $scope.highlightedCav = cav;
        };

        $scope._computeGrid = function(posX, posY, posN) {

            if (typeof posX == "string") {
                posX = parseInt(posX);
            }
            if (typeof posY == "string") {
                posY = parseInt(posY);
            }
            if (typeof posN == "string") {
                posN = parseInt(posN);
            }

            $scope.viewMeta = {
                posX: posX,
                posY: posY,
                posN: posN,
                monstersCount: 0,
                trollsCount: 0
            };

            var size = 10;
            var nSize = Math.floor((size+1)/2);

            $scope.aroundMonstersGrid = {};
            for (var y = posY - size; y <= posY + size; y++) {
                var subGrid = {};
                $scope.aroundMonstersGrid[y] = subGrid;
                for (var x = posX - size ; x <= posX + size ; x++) {
                    var subSubGrid = {};
                    subGrid[x] = subSubGrid;
                    if (viewGrid[x] && viewGrid[x][y]) {
                        for (var n = posN - size; n <= posN + nSize; n++) {
                            var viewCav = viewGrid[x][y][n];
                            if (viewCav) {
                                var cav = subSubGrid[n];
                                if (!cav) {
                                    cav = {
                                        posX: x,
                                        posY: y,
                                        posN: n,
                                        monsters:[],
                                        trolls:[]
                                    };
                                    subSubGrid[n] = cav;
                                }
                                angular.forEach(viewCav.monsters, function(monster){
                                    cav.monsters.push(monster);
                                    $scope.viewMeta.monstersCount++;
                                });
                                angular.forEach(viewCav.trolls, function(troll){
                                    cav.trolls.push(troll);
                                    $scope.viewMeta.trollsCount++;
                                });
                            }
                        }
                    }
                }
            }

            var xRange = [];
            for (var x4r = posX - size ; x4r <= posX + size ; x4r++) {
                xRange.push(x4r);
            }
            $scope.xRange = xRange;

            var yRange = [];
            for (var y4r = posY + size ; y4r >= posY - size ; y4r--) {
                yRange.push(y4r);
            }
            $scope.yRange = yRange;

            $scope.minN = posN + nSize;
            $scope.maxN = posN - nSize;

        };


        $scope.closeAroundMonster = function() {
            $modalInstance.dismiss('cancel');
        };

        $scope.centerView = function(posX, posY, posN) {
            $scope._computeGrid(posX, posY, posN);
        };

        $scope._computeGrid($scope.targetMonster.posX, $scope.targetMonster.posY, $scope.targetMonster.posN);

    }]);