angular.module('ZoumProfiler')
    .filter('remainingPv', function() {
        return function(input) {

            return (input.pvMin*(100-input.percent)/100) + " à " + (input.pvMax*(100-input.percent)/100);
        };
    });


