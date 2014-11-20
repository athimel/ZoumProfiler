angular.module('ZoumProfiler')
    .filter('duration', function() {
        return function(input) {
            var sign = input < 0 ? "-" : "";
            input = Math.abs(input);
            var hours = Math.floor(input / 60);
            var min = input - (hours * 60);
            return sign + hours + "h" + (min < 10 ? "0" : "") + min;
        };
    });


