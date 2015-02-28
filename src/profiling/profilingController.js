angular.module('ZoumProfiler')
    .directive('profiling', function() {
        return {
            restrict: 'E',
            templateUrl: 'profiling/profiling.html'
        };
    })
    .controller('ProfilingController', ['$scope', '$filter', '$window', 'base', 'profiling',
        function ($scope, $filter, $window, base, profiling) {

        /* ********************************************* */
        /* **           Base stuff exposed            ** */
        /* ********************************************* */

        $scope.races = base.races;
        $scope.config = base.config;

        $scope.sharableType = "profile";

        $scope._onProfileSaved = function (profile) {
            if (!profile || profile == $scope.profile) {
                $scope.originalProfile = angular.copy($scope.profile);
            }
        };

        $scope.saveProfile = function () {
            $scope._save($scope.profile);
            $scope._onProfileSaved();
        };

        $scope.cancelModifications = function () {
            angular.copy($scope.originalProfile, $scope.profile);
            $scope._refreshComputed();
        };

        $scope._withoutInternal = function(o) {
            var result = o;
            if (result['_internal']) {
                result = angular.copy(result);
                delete result['_internal'];
            }
            return result;
        };

        $scope.hasModification = function () {
            var o1 = $scope._withoutInternal($scope.profile);
            var o2 = $scope._withoutInternal($scope.originalProfile);
            return !angular.equals(o1, o2);
        };

        $scope._checkMouches = function (profile) {
            if (angular.isUndefined(profile.mouches)) {
                profile.mouches = {};
            }
            angular.forEach(base.mouches, function (mouche) {
                if (angular.isUndefined(profile.mouches[mouche.type])) {
                    profile.mouches[mouche.type] = 0;
                }
            });
        };

        $scope.checkBonus = function () {
            profiling._checkBonus($scope.profile);
        };

        $scope._refreshComputed = function () {
            var newComputed = $scope._newComputed();
            angular.forEach(base.caracs, function (carac) {
                newComputed.amelioCount[carac.id] = $scope._computeAmelioCount($scope.profile, carac);
                newComputed.invested[carac.id] = $scope._computeInvested($scope.profile, carac);
                newComputed.piCaracts += newComputed.invested[carac.id];
                newComputed.nextCosts[carac.id] = $scope._computeNextCost($scope.profile, carac);
            });
            newComputed.currentTour = $scope.profile.caracs['TOUR'];
            if ($scope.profile.comps) {
                angular.forEach(Object.keys($scope.profile.comps), function (compId) {
                    if ($scope.profile.comps[compId] === true) {
                        newComputed.piComps += base.compsMap[compId].cost;
                    }
                });
            }
            newComputed.totalPi = newComputed.piCaracts + newComputed.piComps;
            if (newComputed.totalPi >= base.config.maxPi) {
                newComputed.level = 60;
            } else if (newComputed.totalPi < 20) {
                newComputed.level = 1;
            } else {
                for (var i = 2; i < 60; i++) {
                    if (newComputed.totalPi >= base.levels['n' + i]) {
                        newComputed.level = i;
                    } else {
                        break;
                    }
                }
            }
            angular.forEach(base.caracs, function (carac) {
                newComputed.percentInvested[carac.id] = 100 * newComputed.invested[carac.id] / newComputed.piCaracts;
            });
            newComputed.percentCaracts = 100 * newComputed.piCaracts / newComputed.totalPi;
            newComputed.percentComps = 100 * newComputed.piComps / newComputed.totalPi;
            $scope.computed = newComputed;

            $scope._startRefreshFightCapabilities();
        };

        $scope._newComputed = function () {
            return {
                amelioCount: {},
                invested: {},
                nextCosts: {},
                piCaracts: 0,
                piComps: -10,
                totalPi: 0,
                percentCaracts: 0,
                percentComps: 0,
                percentInvested: {},
                level: 1
            };
        };

        $scope._cost = function (race, carac) {
            if (angular.isDefined(carac['cost' + race])) {
                return carac['cost' + race];
            } else {
                return carac.cost;
            }
        };

        $scope._computeAmelioCount = function (profile, carac) {
            var current = profile.caracs[carac.id];
            var result = 0;
            if (carac.id == 'TOUR') {
                for (var i = carac.max; i > current;) {
                    result++;
                    i -= Math.max(30 - 3 * (result - 1), 2.5);
                }
            } else {
                var min = profiling._min(profile.race, carac);
                result = current - min;
                if (carac.id == 'PV') {
                    result = Math.floor(result / 10);
                }
            }
            return result;
        };

        $scope._computeInvested = function (profile, carac) {
            var cost = $scope._cost(profile.race, carac);
            var amelioCount = $scope._computeAmelioCount(profile, carac);
            var result = 0;
            for (var i = 0; i <= amelioCount; i++) {
                result += i * cost;
            }
            return result;
        };

        $scope._computeNextCost = function (profile, carac) {
            var cost = $scope._cost(profile.race, carac);
            var count = $scope._computeAmelioCount(profile, carac) + 1;
            var result = count * cost;
            return result;
        };

        $scope._checkCaracMin = profiling._checkCaracMin;

        $scope._onProfileSelected = function (profile) {
            profiling._checkCaracMin(profile);
            $scope._checkMouches(profile);
            $scope.profile = profile;
            if ($scope.profile.type == "remote") {
                $scope.sharable = $scope.profile;
            }
            $scope.originalProfile = angular.copy($scope.profile);
            $scope.checkBonus();
            $scope._refreshComputed();
        };

        $scope._checkSavedProfile = function() {
            if (angular.isDefined($scope.profile) && $scope.hasModification()) {
                var message = "Vous avez des modifications sur le profil " + $filter('prettyName')($scope.profile) + ", voulez-vous les enregistrer ?";
                if ($window.confirm(message)) {
                    $scope.saveProfile();
                } else {
                    $scope.cancelModifications();
                }
            }
        };

        $scope._onLeaveProfiling = function() {
            $scope._checkSavedProfile();

            delete $scope.profile;
            delete $scope.sharable;
            delete $scope.originalProfile;
            delete $scope.computed;
        };

        $scope.moveFromLocalToRemote = function () {
            $scope._checkSavedProfile(); // save to local storage
            $scope.profile.type = "remote"; // set remote
            $scope.saveProfile();
            $scope._saveAllToLocalStorage(); // write to local storage
        };

        $scope.$on('onProfileSaved', function(event, profile) {
            $scope._onProfileSaved(profile);
        });

        $scope.$on('onProfileSelected', function(event, profile) {
            $scope._onProfileSelected(profile);
        });

        $scope.$on("onLeaveProfiling", function() {
            $scope._onLeaveProfiling();
        });
    }]);


