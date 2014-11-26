angular.module('ZoumProfiler')
    .filter('onlyNotEmpty', function() {
        return function(mouches, profile) {
            var result = [];
            angular.forEach(mouches, function(mouche) {
                if (profile.mouches[mouche.type] && profile.mouches[mouche.type] > 0) {
                    result.push(mouche);
                }
            });
            return result;
        };
    });
