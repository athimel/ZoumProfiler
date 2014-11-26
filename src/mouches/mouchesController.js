angular.module('ZoumProfiler')
    .directive('mouches', function() {
        return {
            restrict: 'E',
            templateUrl: 'mouches/mouches.html'
        };
    })
    .controller('MouchesController', ['$scope', 'base', function ($scope, base) {

        $scope.mouches = base.mouches;

        $scope.moucheChanged = function(mouche) {
            // Nothing to do for the moment. Will be necessary to trigger the refreshComputed in some cases
        };

    }]);


