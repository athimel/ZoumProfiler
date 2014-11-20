angular.module('ZoumProfiler')
    .directive('export', function() {
        return {
            restrict: 'E',
            templateUrl: 'export/export.html'
        };
    })
    .controller('ExportController', ['$scope', '$filter', '$location', 'base', function ($scope, $filter, $location, base) {

        /* ********************************************* */
        /* **           Base stuff exposed            ** */
        /* ********************************************* */

        $scope.degCritiqueComp = base.degCritiqueComp;
        $scope.getCompId = base.getCompId;

        /* ********************************************* */
        /* **          Controller's methods           ** */
        /* ********************************************* */

        $scope._getCompOrSortShortName = function(compOrSortId) {
            var result = compOrSortId;
            var compOrSort = base.getCompOrSort(compOrSortId);
            if (compOrSort) {
                if (compOrSort.short) {
                    result = compOrSort.short; // HE or CdM4
                } else {
                    if (compOrSort.levels > 1) {
                        result = compOrSortId; // cdm4
                    } else {
                        result = compOrSort.id; // he
                    }
                }
            }
            return result;
        };

        $scope.compsList = function() {
            var result = "";
            angular.forEach(base.comps, function(comp) {
                if (comp.reservedFor) {
                    if (comp.reservedFor === $scope.profile.race) {
                        result += $scope._getCompOrSortShortName(comp.id) + "|";
                    }
                } else {
                    for (var lvl = comp.levels; lvl >= 1; lvl--) {
                        var compId = base.getCompId(comp, lvl);
                        if ($scope.profile.comps[compId] === true) {
                            result += $scope._getCompOrSortShortName(compId) + "|";
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
            angular.forEach(base.sorts, function(sort) {
                if (sort.reservedFor) {
                    if (sort.reservedFor === $scope.profile.race) {
                        result += $scope._getCompOrSortShortName(sort.id) + "|";
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
            angular.forEach(base.comps, function(comp) {
                if (comp.id == "ap") {
                    for (var lvl = comp.levels; lvl >= 1; lvl--) {
                        var compId = base.getCompId(comp, lvl);
                        if ($scope.profile.comps[compId] === true) {
                            var compWithLevel = base.compsMap[compId];
                            result = " - moy. " + $scope._getCompOrSortShortName(compId) + " " + base.getAttForAp(compWithLevel, $scope.profile);
                            break;
                        }
                    }
                }
            });
            return result;
        };

        $scope.degWithCdB = function() {
            var result = "";
            angular.forEach(base.comps, function(comp) {
                if (comp.id == "cdb") {
                    for (var lvl = comp.levels; lvl >= 1; lvl--) {
                        var compId = base.getCompId(comp, lvl);
                        if ($scope.profile.comps[compId] === true) {
                            var compWithLevel = base.compsMap[compId];
                            var degForCdb = base.getDegForCdB(compWithLevel, $scope.profile);
                            result = " - moy. " + $scope._getCompOrSortShortName(compId) + " " + degForCdb.DEG + "/" + degForCdb.DEG_CRITIQ;
                            break;
                        }
                    }
                }
            });
            return result;
        };

        $scope.getShareProfileUrl = function() {
            var profile = $filter('exportable')($scope.profile, base.comps, base.getCompId);
            var urlSafeJson = encodeURIComponent(JSON.stringify(profile));

            var absUrl = $location.absUrl();
            var hashIndex = absUrl.indexOf('#');
            if (hashIndex != -1) {
                absUrl = absUrl.substring(0, hashIndex);
            }

            var result = absUrl + "#?import=" + urlSafeJson;
            // result = "http://zoumbox.org/mh/ZoumProfiler/#?import=" + urlSafeJson;
            return result;
        };

    }]);


