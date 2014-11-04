angular.module('zoumProfilerApp')
    .directive('importage', function() {
        return {
            restrict: 'E',
            templateUrl: 'importage/importage.html'
        };
    })
    .controller('ImportageController', ['$scope', function ($scope) {

        $scope.importProfile = function() {
            var newProfile = angular.fromJson($scope.import.json);
            angular.forEach($scope.comps, function(comp) {
                if (comp.levels > 1) {
                    for (var lvl = comp.levels; lvl >= 1; lvl--) {
                        var compIdHigherLvl = $scope.getCompId(comp, lvl + 1);
                        if (newProfile.comps[compIdHigherLvl] === true) {
                            var compId = $scope.getCompId(comp, lvl);
                            newProfile.comps[compId] = true;
                        }
                    }
                }
            });
            $scope.profiles.push(newProfile);
            $scope.saveToStorage();
            $scope.reset();
        };

    }]);
