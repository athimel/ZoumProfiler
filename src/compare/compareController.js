angular.module('zoumProfilerApp')
    .directive('compare', function() {
        return {
            restrict: 'E',
            templateUrl: 'compare/compare.html'
        };
    })
    .controller('CompareController', ['$scope', 'base', function ($scope, base) {

        $scope.caracs = base.caracs;

        $scope.degCritiqueComp = base.degCritiqueComp;

        $scope.isBest = function(caracOrCompId, profileId) {
            return $scope.compare.best[caracOrCompId] && $scope.compare.best[caracOrCompId][profileId];
        };

        $scope._computeBest = function(profiles) {
            var result = {};
            angular.forEach(base.caracs, function(carac) {
                var bestValue = carac.type == 'T' ? 999 : -999;
                var bestProfileId = {};
                angular.forEach(profiles, function(profile) {
                    var value = $scope.getCaracAverage(profile, carac);
                    if (value == bestValue) {
                        bestProfileId[profile.id] = true;
                    } else if ((carac.type == 'T' && value <= bestValue) || (carac.type != 'T' && value >= bestValue)) {
                        bestValue = value;
                        bestProfileId = {};
                        bestProfileId[profile.id] = true;
                    }
                });
                var count = Object.keys(bestProfileId).length;
                if (count > 0 && count < profiles.length) {
                    result[carac.id] = bestProfileId;
                }
            });

            angular.forEach(Object.keys(base.compsMap), function(compId) {
                var bestProfileId = {};
                angular.forEach(profiles, function(profile) {
                    if (profile.comps[compId]) {
                        bestProfileId[profile.id] = true;
                    }
                });
                var count = Object.keys(bestProfileId).length;
                if (count > 0 && count < profiles.length) {
                    result[compId] = bestProfileId;
                }
            });
            return result;
        };

        $scope._initCompare = function() {
            $scope._reset();
            $scope.compare.profiles = [];
            $scope.compare.comps = [];
            var compsAdded = {};
            var compareIds = $scope.getCompareIds();
            angular.forEach(compareIds, function(id) {
                angular.forEach($scope.profiles, function(profile) {
                    if(profile.id == id) {
                        $scope.compare.profiles.push(profile);
                        $scope._checkBonus(profile); // In case this is an old profile without bp/bm
                        angular.forEach(Object.keys(profile.comps), function(compId) {
                            if(profile.comps[compId] === true && angular.isUndefined(compsAdded[compId])) {
                                $scope.compare.comps.push(base.compsMap[compId]);
                                compsAdded[compId] = true;
                            }
                        });
                    }
                });
            });
            $scope.compare.best = $scope._computeBest($scope.compare.profiles);
            $scope.compare.show = true;
        };

        $scope.$on('startCompareUseCase', function() {
            $scope._initCompare();
        });

    }]);


