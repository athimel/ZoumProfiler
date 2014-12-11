angular.module('ZoumProfiler')
    .filter('orDash', function() {
        return function(input) {
            var result;
            if (input) {
                result = input;
            } else {
                result = '-';
            }
            return result;
        };
    });


