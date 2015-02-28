angular.module('ZoumProfiler')
    .directive('import', function() {
        return {
            restrict: 'E',
            templateUrl: 'import/import.html'
        };
    })
    .controller('ImportController', ['$scope', '$filter', '$http', 'base', 'profiling', function ($scope, $filter, $http, base, profiling) {

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.import = {};
        $scope._mhToZoumprofilerCompsIndex = {
            '1': 'bs',
            '2': 'ra',
            '3': 'am',
            '4': 'camou',
            '5': 'idc',
            '6': 'balayage',
            '7': 'frene',
            '8': 'cdb',
            '9': 'ap',
            '10': 'parer',
            '11': 'ca',
            '12': 'de',
            '14': 'charger',
            '15': 'piege_feu',
            '16': 'cdm',
            '17': 'he',
            '18': 'insultes',
            '19': 'em',
            '21': 'pistage',
            '23': 'lancer',
            '24': 'bidouiller',
            '25': 'melange',
            '26': 'grattage',
            '27': 'dressage',
            '28': 'shamaner',
            '29': 'miner',
            '30': 'tailler',
            '33': 'necro',
            '35': 'planter',
            '37': 'marquage',
            '38': 'retraite',
            '40': 'reparation',
            '41': 'golem_cuir',
            '42': 'rotobaffe',
            '43': 'baroufle',
            '44': 'course',
            '45': 'interposer',
            '46': 'painthure'
        };
        $scope._mhToZoumprofilerSortsIndex = {
             '1': 'projo',
             '2': 'hypno',
             '3': 'vampi',
             '4': 'rp',
             '5': 'add',
             '6': 'ada',
             '7': 'ade',
             '8': 'explo',
             '9': 'vl',
            '10': 'idt',
            '11': 'vt',
            '12': 'fp',
            '13': 'tp',
            '14': 'siphon',
            '15': 'invi',
            '16': 'ae',
            '17': 'sacro',
            '18': 'glue',
            '19': 'fa',
            '20': 'aa',
            '21': 'projection',
            '22': 'va',
            '23': 'vlc',
            '24': 'telek',
            '27': 'bam',
            '28': 'gds',
            '29': 'bum',
            '33': 'levitation',
            '34': 'prem',
            '35': 'pum',
            '36': 'obsi'
        };

        /* ********************************************* */
        /* **          Controller's methods           ** */
        /* ********************************************* */

        $scope._importProfile = function(newProfile) {
            if (newProfile.comps) {
                angular.forEach(base.comps, function (comp) {
                    if (comp.levels > 1) {
                        for (var lvl = comp.levels; lvl >= 1; lvl--) {
                            var compIdHigherLvl = base.getCompId(comp, lvl + 1);
                            if (newProfile.comps[compIdHigherLvl] === true) {
                                var compId = base.getCompId(comp, lvl);
                                newProfile.comps[compId] = true;
                            }
                        }
                    }
                });
            }

            var profileAlreadyExists = false;
            angular.forEach($scope.profiles, function(profile) {
                var areEquals = angular.equals(profile, newProfile);
                if (!areEquals && profile.id == newProfile.id) {
                    newProfile.id = $scope._randomId();
                }
                profileAlreadyExists |= areEquals;
            });
            if (profileAlreadyExists) {
                $scope._addWarningMessage("Un profil identique existe déjà dans votre liste de profils");
            } else {
                if ($scope.isAuthenticated()) {
                    newProfile.type = "remote";
                } else {
                    newProfile.type = "local";
                }
                $scope.profiles.push(newProfile);
                $scope._save(newProfile);
                $scope._addSuccessMessage("Le profil <b>" + $filter('prettyName')(newProfile) + "</b> a bien été ajouté à votre liste de profils");
            }
            $scope._reset();
        };

        $scope._importProfileFromJson = function(profileJson) {
            var newProfile = angular.fromJson(profileJson);
            delete newProfile['_id'];
            delete newProfile['_internal'];
            $scope._importProfile(newProfile);
        };

        $scope.importProfileFromJson = function() {
            $scope._importProfileFromJson($scope.import.json);
            delete $scope.import.spTrollId;
            delete $scope.import.spTrollPassword;
            delete $scope.import.json;
        };


        $scope.importProfileFromSp = function() {

            var newProfile = { comps : {cdm1 : true}, sorts : {idt : true}, id : $scope._randomId() };
            profiling._checkCaracMin(newProfile);
            profiling._checkBonus(newProfile);

            var importDuringLast24h = false;

            var lastImportTxt = localStorage.getItem("lastImportFor" + $scope.import.spTrollId);
            if (lastImportTxt) {
                var lastImport = parseInt(lastImportTxt);
                var now = new Date().getTime();
                importDuringLast24h = (now - lastImport < 86400000);
                $scope._addErrorMessage("Vous avez déjà fait un import de ce profil dans les dernières 24h.");
            }

            if (!importDuringLast24h) {
                // FIXME AThimel 13/12/2014 This XHR success cascade is ugly, find a better way

                var urlCaract = "proxy/sp.php?script=SP_Caract.php&trollId=" + $scope.import.spTrollId + "&trollPassword=" + $scope.import.spTrollPassword;
                $http.get(urlCaract).
                    success(function (dataCaract) {

                        if (dataCaract.substring(0, 6) == "Erreur") {
                            $scope._addErrorMessage(dataCaract);
                        } else {
                            var caractLines = dataCaract.split('\n');
                            angular.forEach(caractLines, function (line) {

                                // Type; Attaque; Esquive; Dégats; Régénération; PVMax; PVActuels; Portée deVue; RM; MM; Armure; Duree du Tour; Poids; Concentration
                                var cells = line.split(';');

                                if (cells.length >= 12) {
                                    var tab;
                                    var type = cells[0];
                                    switch (type) {
                                        case 'CAR':
                                            tab = newProfile.caracs;
                                            break;
                                        case 'BMM':
                                            tab = newProfile.bm;
                                            break;
                                        case 'BMP':
                                            tab = newProfile.bp;
                                            break;
                                    }
                                    tab['ATT'] = parseInt(cells[1]);
                                    tab['ESQ'] = parseInt(cells[2]);
                                    tab['DEG'] = parseInt(cells[3]);
                                    tab['REG'] = parseInt(cells[4]);
                                    if (type == 'CAR') {
                                        tab['PV'] = parseInt(cells[5]);
                                        tab['VUE'] = parseInt(cells[7]);
                                    } else { // Put all in BM
                                        newProfile.bm['PV'] = newProfile.bm['PV'] + parseInt(cells[5]);
                                        newProfile.bm['VUE'] = newProfile.bm['VUE'] + parseInt(cells[7]);
                                    }

                                    tab['ARM'] = parseInt(cells[10]);
                                    if (type == 'CAR') {
                                        tab['TOUR'] = parseInt(cells[11]);
                                    }
                                }
                            });


                            var urlComp = "proxy/sp.php?script=SP_Aptitudes2.php&trollId=" + $scope.import.spTrollId + "&trollPassword=" + $scope.import.spTrollPassword;
                            $http.get(urlComp).
                                success(function (dataComp) {

                                    if (dataComp.substring(0, 6) == "Erreur") {
                                        $scope._addErrorMessage(dataComp);
                                    } else {
                                        var compsLines = dataComp.split('\n');
                                        angular.forEach(compsLines, function (line) {

                                            var cells = line.split(';');

                                            if (cells.length >= 5) {
                                                switch (cells[0]) {
                                                    case "C":
                                                        var mhBaseCompId = cells[1];
                                                        var baseCompId = $scope._mhToZoumprofilerCompsIndex[mhBaseCompId];
                                                        var compLvl = cells[4];
                                                        var compId = baseCompId + compLvl;
                                                        var comp = base.getCompOrSort(compId);
                                                        newProfile.comps[comp.id] = true;
                                                        break;
                                                    case "S":
                                                        var mhBaseSortId = cells[1];
                                                        var baseSortId = $scope._mhToZoumprofilerSortsIndex[mhBaseSortId];
                                                        var sortId = baseSortId;
                                                        var sort = base.getCompOrSort(sortId);
                                                        newProfile.sorts[sort.id] = true;
                                                        break;
                                                }
                                            }
                                        });


                                        var urlProfile = "proxy/sp.php?script=SP_ProfilPublic2.php&trollId=" + $scope.import.spTrollId + "&trollPassword=" + $scope.import.spTrollPassword;
                                        $http.get(urlProfile).
                                            success(function (dataProfile) {

                                                if (dataProfile.substring(0, 6) == "Erreur") {
                                                    $scope._addErrorMessage(dataProfile);
                                                } else {
                                                    var cells = dataProfile.split(';');

                                                    if (cells.length >= 4) {
                                                        newProfile.name = cells[1];
                                                        newProfile.profile = "sp" + cells[3];
                                                        newProfile.race = cells[2];

                                                        localStorage.setItem("lastImportFor" + $scope.import.spTrollId, "" + new Date().getTime());

                                                        $scope._importProfile(newProfile);

                                                        delete $scope.import.spTrollId;
                                                        delete $scope.import.spTrollPassword;
                                                        delete $scope.import.json;

                                                        $scope._addWarningMessage(
                                                            "Le profil importé tient compte de vos bonus/malus en " +
                                                            "cours, pensez à ajuster votre profil après l'import !");

                                                    }
                                                }

                                            }).
                                            error(function (data) {
                                                $scope._addErrorMessage("Import impossible: " + data);
                                            });

                                    }
                                }).
                                error(function (data) {
                                    $scope._addErrorMessage("Import impossible: " + data);
                                });

                        }

                    }).
                    error(function (data) {
                        $scope._addErrorMessage("Import impossible: " + data);
                    });
            }

        };

        /* ********************************************* */
        /* **                 Startup                 ** */
        /* ********************************************* */

        if (angular.isDefined($scope.importContext.startupImportJson)) {
            $scope._importProfileFromJson($scope.importContext.startupImportJson);
            delete $scope.importContext.startupImportJson;
        }

    }]);

