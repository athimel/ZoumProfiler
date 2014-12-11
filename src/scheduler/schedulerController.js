angular.module('ZoumProfiler')
    .directive('scheduler', function() {
        return {
            restrict: 'E',
            templateUrl: 'scheduler/scheduler.html'
        };
    })
    .controller('SchedulerController', ['$scope', '$filter', 'base', 'fight', function ($scope, $filter, base, fight) {

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.target = { pvMin:100, pvMax:150, percent:0, armP:0, armM:0 };
        $scope.plan = [
            //{ troll:{ name:"DZZ", profile:"lvl43" }, fight:base.compsMap["cdb5"], deg:127, pv:97 },
            { }
        ];



        /* ********************************************* */
        /* **          Controller's methods           ** */
        /* ********************************************* */

        $scope.pvMinChanged = function() {
            if ($scope.target.pvMin > $scope.target.pvMax) {
                $scope.target.pvMax = $scope.target.pvMin;
            }
        };

        $scope.pvMaxChanged = function() {
            if ($scope.target.pvMax < $scope.target.pvMin) {
                $scope.target.pvMin = $scope.target.pvMax;
            }
        };

        $scope.removePlanItem = function(item) {
            var index = $scope.plan.indexOf(item);
            $scope.plan.splice(index, 1);

            if ($scope.plan.length == index) { // That means the last element has been removed
                $scope.plan.push( { } );
                delete $scope.availableFights;
            }
        };

        $scope.planTotalPv = function() {
            var encaissed = 0;
            angular.forEach($scope.plan, function(pi) {
                if (pi.pv) {
                    encaissed += pi.pv;
                }
            });
            var remainingMin = $filter('remainingMin')($scope.target) - encaissed;
            var remainingMax = $filter('remainingMax')($scope.target) - encaissed;
            return encaissed + " (reste entre " + remainingMin + " et " + remainingMax + "PV)";
        };

        $scope.trollSelected = function(planItem) {
            $scope.availableFights = fight.getFightCapabilities(base, planItem.troll);
        };

        $scope.getAppliedArmForFight = function(figth) {
            var result;
            switch (figth.baseId) {
                // sorts
                case 'vampi':
                case 'rp':
                case 'projo':
                    result = $scope.target.armM;
                    break;

                // frene
                case 'frene':
                    result = ($scope.target.armP + $scope.target.armM) * 2;
                    break;

                // BS
                case 'bs':
                    result = Math.floor(($scope.target.armP + $scope.target.armM) / 2);
                    break;

                // No ARM
                case 'siphon':
                case 'piege_feu':
                    result = 0;
                    break;

                // any other physical fight
                default:
                    result = $scope.target.armP + $scope.target.armM;
                    break;
            }
            return result;
        };

        $scope.fightSelected = function(planItem) {
            planItem.deg = (planItem.fight.DEG_CRITIQ ? planItem.fight.DEG_CRITIQ : planItem.fight.DEG);
            planItem.pv = Math.max(planItem.deg - $scope.getAppliedArmForFight(planItem.fight), 1);
            delete $scope.availableFights;
            $scope.plan.push( { } );
        };

        $scope.armChanged = function() {
            angular.forEach($scope.plan, function(planItem) {
                if (planItem.deg) {
                    planItem.pv = Math.max(planItem.deg - $scope.getAppliedArmForFight(planItem.fight), 1);
                } else {
                    delete planItem.deg;
                }
            });
        };
    }]);

