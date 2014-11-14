angular.module('zoumProfilerApp')
    .directive('import', function() {
        return {
            restrict: 'E',
            templateUrl: 'import/import.html'
        };
    })
    .controller('ImportController', ['$scope', function ($scope) {

        $scope.importProfile = function() {
            var newProfile = angular.fromJson($scope.import.json);
            $scope._importProfile(newProfile);
        };

    }]);
