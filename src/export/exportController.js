angular.module('zoumProfilerApp')
    .directive('export', function() {
        return {
            restrict: 'E',
            templateUrl: 'export/export.html'
        };
    })
    .controller('ExportController', ['$scope', '$filter', function ($scope, $filter) {

        $scope.compsList = function() {
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

        $scope.sortsList = function() {
            var result = "";
            angular.forEach($scope.sorts, function(sort) {
                if (sort.reservedFor) {
                    if (sort.reservedFor === $scope.profile.race) {
                        result += $scope.getCompOrSortShortName(sort.id) + "|";
                    }
                } else {
                    // TODO AThimel 04/11/2014 Do it for owned sorts
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

        $scope.getShareProfileUrl = function() {
            var profile = $filter('exportable')($scope.profile, $scope.comps, $scope.getCompId);
            var urlSafeJson = encodeURIComponent(JSON.stringify(profile));
            var result = "http://zoumbox.org/mh/ZoumProfiler/#?import=" + urlSafeJson;
//            result = "file:///home/thimel/WORK/perso/ZoumProfiler/dist/index.html#?import=" + urlSafeJson;
            return result;
        };

    }]);


