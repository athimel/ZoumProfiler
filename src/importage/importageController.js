angular.module('zoumProfilerApp')
    .directive('importage', function() {
        return {
            restrict: 'E',
            templateUrl: 'importage/importage.html'
        };
    })
    .controller('ImportageController', ['$scope', function ($scope) {

        $scope.importProfile = function() {
            var newProfile = angular.fromJson($scope.import.json);
            $scope.profiles.push(newProfile);
            $scope.saveToStorage();
            $scope.reset();
        };

    }]);
