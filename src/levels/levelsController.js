angular.module('ZoumProfiler')
    .directive('levels', function() {
        return {
            restrict: 'E',
            templateUrl: 'levels/levels.html'
        };
    })
    .controller('LevelsController', ['$scope', '$http', 'monsters', function ($scope, $http, monsters) {

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

        $scope.selectView = function(view) {
            if (!view.refreshed) {
                angular.forEach(view.monsters, function(monster) {
                    $scope._computeMonsterDetails(view.origin, monster);
                });
                view.refreshed = true;
            }
            $scope.selectedView = view;
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

            if (origin) {
                var xDistance = Math.abs(origin.x - monster.posX);
                var yDistance = Math.abs(origin.y - monster.posY);
                var nDistance = Math.abs(origin.n - monster.posN);
                monster.horizontalDistance = Math.max(xDistance, yDistance);
                monster.verticalDistance = nDistance;
                monster.distance = Math.max(monster.horizontalDistance, monster.verticalDistance);
            }

            if (angular.isUndefined(monster.nival) || angular.isUndefined(monster.ageBonus)) {
                console.error(monster);
            }
        };

        $scope._parseView = function(trollId, data) {

            var result = {
                trollId: trollId,
                date: new Date(),
                monsters: [],
                refreshed: true
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
                    }
                }
            });

            angular.forEach(result.monsters, function(monster) {
                $scope._computeMonsterDetails(result.origin, monster);
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
            $http.get('rest/views/list.php')
                .success(function(data) {

                    $scope.views = data.views;
                    angular.forEach($scope.views, function(view) {
                        view.refreshed = false;
                    });

                })
                .error(function() {
                    console.log("ERROR");
                });
        };

        $scope._saveViewToServer = function(view) {
            var data = "view=" + JSON.stringify(view);
            $http.post('rest/views/save.php', data)
                .success(function(data) {
                    console.log(data);
                    if (data.result != "CREATED") {
                        $scope._addErrorMessage("Impossible d'enregistrer la vue : " + data.result);
                    }
                })
                .error(function(error) {
                    $scope._addErrorMessage("Impossible d'enregistrer la vue : " + error);
                });
        };

        $scope._loadAllViewsFromServer();



    }]);


