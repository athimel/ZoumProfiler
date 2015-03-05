angular.module('ZoumProfiler')
    .filter('orDash', function() {
        return function(input) {
            var result;
            if (angular.isDefined(input)) {
                result = input;
            } else {
                result = '-';
            }
            return result;
        };
    });


