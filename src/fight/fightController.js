angular.module('ZoumProfiler')
    .directive('fight', function() {
        return {
            restrict: 'E',
            templateUrl: 'fight/fight.html'
        };
    })
    .controller('FightController', ['$scope', 'base', 'fight', function ($scope, base, fight) {

        $scope.fightCapabilities = [];

        $scope._refreshFightCapabilities = function() {
            $scope.fightCapabilities = fight.getFightCapabilities(base, $scope.profile);
        };

        $scope.$on('_startRefreshFightCapabilities', function() {
            $scope._refreshFightCapabilities();
        });

        /* ********************************************* */
        /* **                 Startup                 ** */
        /* ********************************************* */

        $scope._refreshFightCapabilities();

    }]);
