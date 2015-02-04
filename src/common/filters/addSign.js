angular.module('ZoumProfiler')
    .filter('addSign', function() {
        return function(input) {
            return (input >= 0 ? "+" : "") + input;
        };
    });


