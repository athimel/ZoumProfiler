angular.module('ZoumProfiler')
    .directive('import', function() {
        return {
            restrict: 'E',
            templateUrl: 'import/import.html'
        };
    })
    .controller('ImportController', ['$scope', '$filter', 'base', function ($scope, $filter, base) {

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.import = {};

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

        $scope.importProfile = function() {
            $scope._importProfileFromJson($scope.import.json);
            delete $scope.import.json;
        };

        /* ********************************************* */
        /* **                 Startup                 ** */
        /* ********************************************* */

        if (angular.isDefined($scope.importContext.startupImportJson)) {
            $scope._importProfileFromJson($scope.importContext.startupImportJson);
            delete $scope.importContext.startupImportJson;
        }

    }]);
