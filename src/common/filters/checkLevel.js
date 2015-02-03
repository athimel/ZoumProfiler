angular.module('ZoumProfiler')
    .filter('checkLevel', function() {
        return function(monsters, lvlMin, lvlMax) {
            var result = [];
            angular.forEach(monsters, function(monster) {
                if ((!lvlMin || monster.nival >= lvlMin) && (!lvlMax || monster.nival <= lvlMax)) {
                    result.push(monster);
                }
            });
            return result;
        };
    });
