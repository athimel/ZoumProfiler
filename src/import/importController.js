angular.module('ZoumProfiler')
    .directive('import', function() {
        return {
            restrict: 'E',
            templateUrl: 'import/import.html'
        };
    })
    .controller('ImportController', ['$scope', '$filter', '$http', 'base', function ($scope, $filter, $http, base) {

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.import = {};
        $scope._mhToZoumprofilerCompsIndex = {
            '18': 'insultes',
             '3': 'am',
            '16': 'cdm',
            '12': 'de',
            '21': 'pistage',
             '8': 'cdb',
            '14': 'charger',
            '44': 'course',
            '11': 'ca',
             '7': 'frene',
             '5': 'idc',
             '9': 'ap',
            '29': 'miner',
            '30': 'tailler',
            '27': 'dressage',
            '10': 'parer',
            '17': 'he',
            '24': 'bidouiller',
            '45': 'interposer',
            '43': 'baroufle',
            '23': 'lancer',
            '26': 'grattage',
            '37': 'marquage',
            '40': 'reparation',
            '25': 'melange',
            '35': 'planter',
            '38': 'retraite',
            '15': 'piege_feu',
            '28': 'shamaner',
            '42': 'rotobaffe',
            '19': 'em',
            '33': 'necro',
            '46': 'painthure',
            '41': 'golem_cuir'

        };
        $scope._mhToZoumprofilerSortsIndex = {
             '3': 'vampi',
             '6': 'ada',
            '10': 'idt',
            '27': 'bam',
            '28': 'gds'
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
                $scope.profiles.push(newProfile);
                $scope._saveToStorage();
                $scope._addSuccessMessage("Le profil <b>" + $filter('prettyName')(newProfile) + "</b> a bien été ajouté à votre liste de profils");
            }
            $scope._reset();
        };

        $scope._importProfileFromJson = function(profileJson) {
            var newProfile = angular.fromJson(profileJson);
            $scope._importProfile(newProfile);
        };

        $scope.importProfileFromJson = function() {
            $scope._importProfileFromJson($scope.import.json);
            delete $scope.import.spTrollId;
            delete $scope.import.spTrollPassword;
            delete $scope.import.json;
        };


        $scope.importProfileFromSp = function() {

            var newProfile = { comps : {cdm1 : true}, id : $scope._randomId() };
            $scope._checkCaracMin(newProfile);
            $scope._checkBonus(newProfile);

            // FIXME AThimel 13/12/2014 This XHR success cascade is ugly, find a better way

            var urlCaract = "proxy/sp.php?script=SP_Caract.php&trollId=" + $scope.import.spTrollId + "&trollPassword=" + $scope.import.spTrollPassword;
            $http.get(urlCaract).
                success(function(dataCaract) {

                    var caractLines = dataCaract.split('\n');
                    angular.forEach(caractLines, function(line) {

                        // Type; Attaque; Esquive; Dégats; Régénération; PVMax; PVActuels; Portée deVue; RM; MM; Armure; Duree du Tour; Poids; Concentration
                        var cells = line.split(';');

                        if (cells.length >= 12) {
                            var tab;
                            switch (cells[0]) {
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
                            tab['PV'] = parseInt(cells[5]);
                            tab['VUE'] = parseInt(cells[7]);
                            tab['ARM'] = parseInt(cells[10]);
                            tab['TOUR'] = parseInt(cells[11]);
                        }
                    });



                    var urlComp = "proxy/sp.php?script=SP_Aptitudes2.php&trollId=" + $scope.import.spTrollId + "&trollPassword=" + $scope.import.spTrollPassword;
                    $http.get(urlComp).
                        success(function(dataComp) {
                            
                            var compsLines = dataComp.split('\n');
                            angular.forEach(compsLines, function(line) {

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
                                            // TODO AThimel Implement sortileges
                                            break;
                                    }
                                }
                            });


                            var urlProfile = "proxy/sp.php?script=SP_ProfilPublic2.php&trollId=" + $scope.import.spTrollId + "&trollPassword=" + $scope.import.spTrollPassword;
                            $http.get(urlProfile).
                                success(function(dataProfile) {

                                    var cells = dataProfile.split(';');

                                    if (cells.length >= 4) {
                                        newProfile.name = cells[1];
                                        newProfile.profile = "sp" + cells[3];
                                        newProfile.race = cells[2];

                                        console.log(newProfile);

                                        $scope._importProfile(newProfile);

                                        delete $scope.import.spTrollId;
                                        delete $scope.import.spTrollPassword;
                                        delete $scope.import.json;
                                    }

                                }).
                                error(function(data) {
                                    $scope._addErrorMessage("Import impossible: " + data);
                                });

                        }).
                        error(function(data) {
                            $scope._addErrorMessage("Import impossible: " + data);
                        });


                }).
                error(function(data) {
                    $scope._addErrorMessage("Import impossible: " + data);
                });

        };

        /* ********************************************* */
        /* **                 Startup                 ** */
        /* ********************************************* */

        if (angular.isDefined($scope.importContext.startupImportJson)) {
            $scope._importProfileFromJson($scope.importContext.startupImportJson);
            delete $scope.importContext.startupImportJson;
        }

    }]);


// http://sp.mountyhall.com/SP_Aptitudes2.php?Numero = 104259 & Motdepasse = LDXWYC8Z
/*
C;18;90;0;2;
C;18;90;0;1;
C;3;93;0;1;
C;16;90;0;5;
C;16;90;0;4;
C;16;90;0;3;
C;16;90;0;2;
C;16;90;0;1;
C;12;90;5;1;
C;21;90;0;1;
C;8;90;0;5;
C;8;90;0;4;
C;8;90;0;3;
C;8;90;0;2;
C;8;87;0;1;
C;14;83;0;1;
C;44;90;0;1;
C;11;90;0;1;
C;7;90;0;1;
C;5;69;0;1;
C;9;43;0;2;
C;9;81;0;1;
S;3;80;0;1
S;6;75;0;1
S;10;80;0;1
S;27;80;0;1
S;28;67;0;1
*/

// http://sp.mountyhall.com/SP_Caract.php?Numero = 104259 & Motdepasse = LDXWYC8Z
/*
BMM;9;3;7;7;20;0;2;2606;1184;6;-160;0;0
BMP;7;0;2;-4;0;0;-1;0;0;17;0;156;10
CAR;14;13;30;6;140;160;4;2102;3116;3;573;0;0
*/

// http://sp.mountyhall.com/SP_ProfilPublic2.php?Numero = 104259 & Motdepasse = LDXWYC8Z
/*
104259;DevelZimZoum;Kastar;43;2011-01-21 14:07:48;;http://zoumbox.org/mh/syndikhd/104259_300.png;49;539;12;1900;20;0
*/

