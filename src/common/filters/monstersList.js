angular.module('ZoumProfiler')
    .filter('monstersList', function() {
        return function(input) {
            var result = "";
            angular.forEach(input, function(elem) {
                if (result.length > 0) {
                    result += "\n";
                }
                result += elem.id + " - " + elem.name + " " + elem.nival;
            });
            return result;
        };
    });


