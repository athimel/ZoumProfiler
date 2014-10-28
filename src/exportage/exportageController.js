angular.module('zoumProfilerApp')
    .directive('exportage', function() {
        return {
            restrict: 'E',
            templateUrl: 'exportage/exportage.html'
        };
    })
    .controller('ExportageController', ['$scope', function ($scope) {

}]);


