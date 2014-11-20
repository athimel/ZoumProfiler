angular.module('zoumProfilerApp')
    .directive('fight', function() {
        return {
            restrict: 'E',
            templateUrl: 'fight/fight.html'
        };
    })
    .controller('FightController', ['$scope', 'base', function ($scope, base) {

        $scope.fightCapabilities = [];

        $scope._getProjoMaxDistance = function(profile) {
            var vueMax = profile.caracs["VUE"] + profile.bm["VUE"];
//            1-4 : 1 case
//            5-9 : 2 cases
//            10-15 : 3 cases
//            16-22 : 4 cases
//            23-30 : 5 cases
//            31-39 : 6 cases
//            40-49 : 7 cases
//            50-60 : 8 cases
//            61-72 : 9 cases
            if (vueMax >= 73) {
                return 10;
            } else if (vueMax >= 61) {
                return 9;
            } else if (vueMax >= 50) {
                return 8;
            } else if (vueMax >= 40) {
                return 7;
            } else if (vueMax >= 31) {
                return 6;
            } else if (vueMax >= 23) {
                return 5;
            } else if (vueMax >= 16) {
                return 4;
            } else if (vueMax >= 10) {
                return 3;
            } else if (vueMax >= 5) {
                return 2;
            } else {
                return 1;
            }
        };

        /**
         * Take a sort or comp and computes its fight values (ATT, DEG, ...)
         */
        $scope._computeFightCapabilities = function(compOrSort, compOrSortDeBase) {
            var result = { name: compOrSort.name };

            // Compute ATT
            switch (compOrSortDeBase.id) {
                case 'ca':
                    var d6AttCa = Math.floor($scope.profile.caracs['ATT'] / 2);
                    result.ATT = d6AttCa * 3.5 + Math.floor(($scope.profile.bp['ATT'] + $scope.profile.bm['ATT']) / 2);
                    break;
                case 'projo':
                    result.ATT = $scope.profile.caracs['VUE'] * 3.5 + $scope.profile.bm['ATT'];
                    break;
                case 'ap':
                    result.ATT = base.getAttForAp(compOrSort, $scope.profile);
                    break;
                case 'bs':
                    var d6AttBS = Math.floor($scope.profile.caracs['ATT'] / 3) * 2;
                    if ($scope.profile.caracs['ATT'] % 3 == 2) {
                        d6AttBS++;
                    }
                    result.ATT = d6AttBS * 3.5 + Math.floor(($scope.profile.bp['ATT'] + $scope.profile.bm['ATT']) / 2);
                    break;
                case 'rp':
                case 'piege_feu':
                    result.ATT = '-';
                    break;
                case 'vampi':
                    var d6AttVampi = Math.floor($scope.profile.caracs['DEG'] / 3) * 2;
                    if ($scope.profile.caracs['DEG'] % 3 == 2) {
                        d6AttVampi++;
                    }
                    result.ATT = d6AttVampi * 3.5 + $scope.profile.bm['ATT'];
                    break;

                default:
                    result.ATT = $scope.profile.caracs['ATT'] * 3.5 + $scope.profile.bp['ATT'] + $scope.profile.bm['ATT'];
            }

            // Compute DEG
            switch (compOrSortDeBase.id) {
                case 'piege_feu':
                    var d3DegPiege = Math.floor(($scope.profile.caracs['VUE'] + $scope.profile.caracs['ESQ']) / 2);
                    result.DEG = d3DegPiege * 2;
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    break;
                case 'projo':
                    var porteeMax = $scope._getProjoMaxDistance($scope.profile);
                    var d3DegProjo = Math.floor($scope.profile.caracs['VUE'] / 2);
                    result.DEG = d3DegProjo * 2 + $scope.profile.bm['DEG'] + porteeMax * 2;
                    result.DEG_CRITIQ = base.degCritiqueSort($scope.profile, d3DegProjo) + porteeMax * 2;
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;
                case 'cdb':
                    var degForCdb = base.getDegForCdB(compOrSort, $scope.profile);
                    result.DEG = degForCdb.DEG;
                    result.DEG_CRITIQ = degForCdb.DEG_CRITIQ;
                    break;
                case 'bs':
                    var d3DegBs = Math.floor($scope.profile.caracs['ATT'] / 2);
                    var bmDegBs = Math.floor(($scope.profile.bp['DEG'] + $scope.profile.bm['DEG']) / 2);
                    result.DEG = d3DegBs * 2 + bmDegBs;
                    result.DEG_CRITIQ = base.degCritiqueNoBonus($scope.profile, d3DegBs) + bmDegBs;
                    break;
                case 'rp':
                    result.DEG = $scope.profile.caracs['DEG'] * 2 + $scope.profile.bm['DEG'];
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    break;
                case 'vampi':
                    result.DEG = $scope.profile.caracs['DEG'] * 2 + $scope.profile.bm['DEG'];
                    result.DEG_CRITIQ = base.degCritiqueSort($scope.profile, $scope.profile.caracs['DEG']);
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;
                case 'frene':
                    result.DEG = ($scope.profile.caracs['DEG'] * 2 + $scope.profile.bp['DEG'] + $scope.profile.bm['DEG']) * 2;
                    result.DEG_CRITIQ = base.degCritiqueComp($scope.profile, $scope.profile.caracs['DEG']) * 2;
                    break;
                case 'siphon':
                    result.DEG = $scope.profile.caracs['REG'] * 2 + $scope.profile.bm['DEG'];
                    result.DEG_CRITIQ = base.degCritiqueSort($scope.profile, $scope.profile.caracs['REG']);
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;

                default:
                    result.DEG = $scope.profile.caracs['DEG'] * 2 + $scope.profile.bp['DEG'] + $scope.profile.bm['DEG'];
                    result.DEG_CRITIQ = base.degCritiqueComp($scope.profile, $scope.profile.caracs['DEG']);
            }

            return result;
        };

        $scope._refreshFightCapabilities = function() {
            var result = [];
            angular.forEach(base.sorts, function(sort) {
                if (base.combatCompsSortsMap[sort.id]) {
                    if (sort.reservedFor) {
                        if (sort.reservedFor === $scope.profile.race) {
                            var sortComputed = $scope._computeFightCapabilities(sort, sort);
                            result.push(sortComputed);
                        }
                    } else {
// TODO AThimel 25/10/2014 Include users owned sorts
                    }
                }
            });
            angular.forEach(base.comps, function(comp) {
                if (base.combatCompsSortsMap[comp.id]) {
                    if (comp.reservedFor) {
                        if (comp.reservedFor === $scope.profile.race) {
                            var reservedCompComputed = $scope._computeFightCapabilities(comp, comp);
                            result.push(reservedCompComputed);
                        }
                    } else {
                        for (var lvl = comp.levels; lvl >= 1; lvl--) {
                            var compId = base.getCompId(comp, lvl);
                            if ($scope.profile.comps[compId] === true) {
                                var compComputed = $scope._computeFightCapabilities(base.compsMap[compId], comp);
                                result.push(compComputed);
                                break;
                            }
                        }
                    }
                }
            });
            $scope.fightCapabilities = result;
        };

        $scope.$on('_startRefreshFightCapabilities', function() {
            $scope._refreshFightCapabilities();
        });

        // Compute on controller startup
        $scope._refreshFightCapabilities();

    }]);
