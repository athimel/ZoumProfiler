angular.module('zoumProfilerApp')
    .directive('mouchage', function() {
        return {
            restrict: 'E',
            templateUrl: 'mouchage/mouchage.html'
        };
    })
    .controller('MouchageController', ['$scope', function ($scope) {

        $scope.mouches = ['Crobate', 'Héros', 'Lunettes', 'Miel', 'Nabolisants', 'Rivatant', 'Telaite', 'Vertie', 'Xidant'];

    }]);


