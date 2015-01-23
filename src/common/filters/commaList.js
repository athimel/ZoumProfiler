angular.module('ZoumProfiler')
    .filter('commaList', function() {
        return function(input) {
            var result = "";
            angular.forEach(input, function(elem) {
                if (result.length > 0) {
                    result += ", ";
                }
                result += elem;
            });
            return result;
        };
    });


