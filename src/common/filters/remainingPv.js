angular.module('ZoumProfiler')
    .filter('remainingMin', function() {
        return function(input) {
            var result = input.pvMin*(100-input.percent)/100;
            return result;
        };
    })
    .filter('remainingMax', function() {
        return function(input) {
            var result = input.pvMax*(100-input.percent)/100;
            return result;
        };
    });
