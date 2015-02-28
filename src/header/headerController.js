angular.module('ZoumProfiler')
    .directive('header', function() {
        return {
            restrict: 'E',
            templateUrl: 'header/header.html'
        };
    })
    .controller('HeaderController', ['$scope', function ($scope) {

        $scope.raceChanged = function() {
            $scope._checkCaracMin($scope.profile);
            $scope._refreshComputed();
        };

    }]);
