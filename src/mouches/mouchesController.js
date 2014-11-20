angular.module('ZoumProfiler')
    .directive('mouches', function() {
        return {
            restrict: 'E',
            templateUrl: 'mouches/mouches.html'
        };
    })
    .controller('MouchesController', ['$scope', function ($scope) {

        $scope.mouches = ['Crobate', 'Héros', 'Lunettes', 'Miel', 'Nabolisants', 'Rivatant', 'Telaite', 'Vertie', 'Xidant'];

    }]);


