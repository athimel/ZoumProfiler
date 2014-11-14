angular.module('zoumProfilerApp')
    .directive('compare', function() {
        return {
            restrict: 'E',
            templateUrl: 'compare/compare.html'
        };
    })
    .controller('CompareController', ['$scope', function ($scope) {

        $scope.isBest = function(caracOrCompId, profileId) {
            return $scope.compare.best[caracOrCompId] && $scope.compare.best[caracOrCompId][profileId];
        };
    }]);


