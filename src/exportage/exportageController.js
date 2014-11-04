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
                        result += $scope.getCompOrSortShortName(comp.id) + "|";
                    }
                } else {
                    for (var lvl = comp.levels; lvl >= 1; lvl--) {
                        var compId = $scope.getCompId(comp, lvl);
                        if ($scope.profile.comps[compId] === true) {
                            result += $scope.getCompOrSortShortName(compId) + "|";
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

        $scope.attWithAP = function() {
            var result = "";
            angular.forEach($scope.comps, function(comp) {
                if (comp.id == "ap") {
                    for (var lvl = comp.levels; lvl >= 1; lvl--) {
                        var compId = $scope.getCompId(comp, lvl);
                        if ($scope.profile.comps[compId] === true) {
                            var compWithLevel = $scope.compsMap[compId];
                            result = " - moy. " + $scope.getCompOrSortShortName(compId) + " " + $scope.getAttForAp(compWithLevel);
                            break;
                        }
                    }
                }
            });
            return result;
        };

        $scope.degWithCdB = function() {
            var result = "";
            angular.forEach($scope.comps, function(comp) {
                if (comp.id == "cdb") {
                    for (var lvl = comp.levels; lvl >= 1; lvl--) {
                        var compId = $scope.getCompId(comp, lvl);
                        if ($scope.profile.comps[compId] === true) {
                            var compWithLevel = $scope.compsMap[compId];
                            var degForCdb = $scope.getDegForCdB(compWithLevel);
                            result = " - moy. " + $scope.getCompOrSortShortName(compId) + " " + degForCdb.DEG + "/" + degForCdb.DEG_CRITIQ;
                            break;
                        }
                    }
                }
            });
            return result;
        };

    }]);


