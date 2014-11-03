angular.module('zoumProfilerApp')
    .directive('exportage', function() {
        return {
            restrict: 'E',
            templateUrl: 'exportage/exportage.html'
        };
    })
    .controller('ExportageController', ['$scope', function ($scope) {

        $scope.compList = function() {
            var result = "";
            angular.forEach($scope.comps, function(comp) {
                if (comp.reservedFor) {
                    if (comp.reservedFor === $scope.profile.race) {
                        result += comp.id + "|";
                    }
                } else {
                    for (var lvl = comp.levels; lvl >= 1; lvl--) {
                        var compId = comp.id + lvl;
                        if ($scope.profile.comps[compId] === true) {
                            if (comp.levels > 1) {
                                result += compId + "|"; // cdm4
                            } else {
                                result += comp.id + "|"; // he
                            }

                            break;
                        }
                    }
                }
            });
            if (result.length > 1) {
                result = result.substring(0, result.length - 1);
            }
            return result;
        };


    }]);


