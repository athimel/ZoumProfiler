angular.module('zoumProfilerApp')
    .directive('comparaisage', function() {
        return {
            restrict: 'E',
            templateUrl: 'comparaisage/comparaisage.html'
        };
    })
    .controller('ComparaisageController', ['$scope', function ($scope) {

        $scope.isBest = function(caracOrCompId, profileId) {
            return $scope.compare.best[caracOrCompId] && $scope.compare.best[caracOrCompId][profileId];
        };
    }]);


