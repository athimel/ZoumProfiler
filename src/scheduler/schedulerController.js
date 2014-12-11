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

        $scope._newPlanItem = function() {
            return { critical: true };
        };

        $scope.target = { pvMin:100, pvMax:150, percent:0, armP:0, armM:0 };
        $scope.plan = [
            //{ troll:{ name:"DZZ", profile:"lvl43" }, fight:base.compsMap["cdb5"], deg:127, pv:97 },
            $scope._newPlanItem()
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
                $scope.plan.push( $scope._newPlanItem() );
                delete $scope.availableFights;
            }
        };

        $scope.planTotalPv = function() {
            var encaissed = 0;
            angular.forEach($scope.plan, function(pi) {
                if (pi.realPv && pi.realPv > 0) {
                    encaissed += pi.realPv;
                } else if (pi.pv) {
                    encaissed += pi.pv;
                }
            });
            var remainingMin = $filter('remainingMin')($scope.target) - encaissed;
            var remainingMax = $filter('remainingMax')($scope.target) - encaissed;
            return encaissed + " (reste entre " + remainingMin + " et " + remainingMax + "PV)";
        };

        $scope.planTotalDeg = function() {
            var encaissed = 0;
            angular.forEach($scope.plan, function(pi) {
                if (pi.deg) {
                    encaissed += pi.deg;
                }
            });
            return encaissed;
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

        $scope._computeDegAndPv = function(planItem) {
            planItem.deg = planItem.fight.DEG;
            if (!planItem.fight.DEG_CRITIQ) {
                planItem.critical = false;
            }
            if (planItem.critical) {
                planItem.deg = planItem.fight.DEG_CRITIQ;
            }
            planItem.pv = Math.max(planItem.deg - $scope.getAppliedArmForFight(planItem.fight), 1);
        };

        $scope.fightSelected = function(planItem) {
            $scope._computeDegAndPv(planItem);
            delete $scope.availableFights;
            $scope.plan.push( $scope._newPlanItem() );
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

        $scope.criticalChanged = function(planItem) {
            $scope._computeDegAndPv(planItem);
        };

        $scope.realPvChanged = function(planItem) {
            // Nothing to do
        };

    }]);


