angular.module('ZoumProfiler')
    .directive('fight', function() {
        return {
            restrict: 'E',
            templateUrl: 'fight/fight.html'
        };
    })
    .controller('FightController', ['$scope', 'base', 'fight', function ($scope, base, fight) {

        $scope.fightCapabilities = [];
        $scope.fight = { armP:0, armM:0 };

        $scope._refreshFightCapabilities = function() {
            $scope.fightCapabilities = fight.getFightCapabilities(base, $scope.profile);

            angular.forEach($scope.fightCapabilities, function (compOrSort) {
                var arm = fight.getAppliedArmForFight(compOrSort, $scope.fight.armP, $scope.fight.armM);
                compOrSort.DEG_AA = Math.max(compOrSort.DEG - arm, 1);
                if (compOrSort.DEG_CRITIQ) {
                    compOrSort.DEG_CRITIQ_AA = Math.max(compOrSort.DEG_CRITIQ - arm, 1);
                }
                if (compOrSort.DEG_RESIST) {
                    compOrSort.DEG_RESIST_AA = Math.max(compOrSort.DEG_RESIST - arm, 1);
                }
                if (compOrSort.DEG_RESIST_CRITIQ) {
                    compOrSort.DEG_RESIST_CRITIQ_AA = Math.max(compOrSort.DEG_RESIST_CRITIQ - arm, 1);
                }
            });
        };

        $scope.armChanged = function() {
            $scope._refreshFightCapabilities();
        };

        $scope.$on('_startRefreshFightCapabilities', function() {
            $scope._refreshFightCapabilities();
        });

        /* ********************************************* */
        /* **                 Startup                 ** */
        /* ********************************************* */

        $scope._refreshFightCapabilities();

    }]);
