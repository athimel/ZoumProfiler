angular.module('ZoumProfiler')
    .directive('mouches', function() {
        return {
            restrict: 'E',
            templateUrl: 'mouches/mouches.html'
        };
    })
    .controller('MouchesController', ['$scope', 'base', function ($scope, base) {

        $scope.mouches = base.mouches;

        console.log($scope.mouches);

        $scope.moucheChanged = function(mouche) {
            console.log(mouche);
        };

    }]);


