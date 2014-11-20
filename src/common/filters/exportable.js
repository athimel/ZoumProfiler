angular.module('ZoumProfiler')
    .filter('exportable', function() {
        return function(input, comps, getCompId) {
            var result = angular.copy(input);
            angular.forEach(comps, function (comp) {
                if (comp.levels > 1) {
                    for (var lvl = 1; lvl < comp.levels; lvl++) {
                        var compIdHigherLvl = getCompId(comp, lvl + 1);
                        if (result.comps[compIdHigherLvl] === true) {
                            var compId = getCompId(comp, lvl);
                            delete result.comps[compId];
                        }
                    }
                }
            });
            return result;
        };
    });
