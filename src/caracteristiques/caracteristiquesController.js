angular.module('ZoumProfiler')
    .directive('caracteristiques', function() {
        return {
            restrict: 'E',
            templateUrl: 'caracteristiques/caracteristiques.html'
        };
    })
    .controller('CaracteristiquesController', ['$scope', 'base', function ($scope, base) {

        $scope.caracs = base.caracs;

        $scope.degCritiqueComp = base.degCritiqueComp;

        $scope.checkTourValue = function() {
            var newValue = $scope.profile.caracs['TOUR'];
            if (angular.isDefined(newValue) && newValue > 470 && newValue < 720) {
                var currentValue = $scope.computed.currentTour;
                if (base.tourValues.indexOf(newValue) == -1 && angular.isDefined(currentValue)) {
                    var currentIndex = base.tourValues.indexOf(currentValue);
                    var newComputedValue;
                    var newIndex = 0;
                    if (currentIndex == -1) {
                        // Increase or decrease one by one until a known value is reached
                        var value = newValue;
                        if (currentValue > newValue) {
                            while (base.tourValues.indexOf(value) == -1) {
                                value--;
                            }
                        } else {
                            while (base.tourValues.indexOf(value) == -1) {
                                value++;
                            }
                        }
                        newIndex = base.tourValues.indexOf(value);
                    } else {
                        // Go directly to the next known value
                        if (currentValue > newValue) {
                            newIndex = currentIndex + 1;
                        } else {
                            newIndex = Math.max(currentIndex - 1, 0);
                        }
                    }
                    newComputedValue = base.tourValues[newIndex];
                    $scope.profile.caracs['TOUR'] = newComputedValue;
                }
            }
        };

        $scope.caracChanged = function(caracId) {
            if (caracId == 'TOUR') {
                $scope.checkTourValue();
            }
            $scope._refreshComputed();
        };

        $scope.bonusChanged = function(caracId) {
            if (($scope.profile.race == base.races[5] && caracId == 'VUE')
                || caracId == 'ATT'
                || caracId == 'ESQ'
                || caracId == 'DEG'
                || ($scope.profile.race == base.races[0] && caracId == 'REG')) {

                $scope._startRefreshFightCapabilities();
            }
        };

    }]);


