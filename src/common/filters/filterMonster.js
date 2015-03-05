angular.module('ZoumProfiler')
    .filter('filterMonster', function() {
        return function(monsters, filter) {
            var result = [];
            var includeGowap = filter.includeGowap;
            var includeZombi = filter.includeZombi;
            var lvlMin = filter.minLevel;
            var lvlMax = filter.maxLevel;
            var maxDistance = filter.maxDistance;
            angular.forEach(monsters, function(monster) {
                if (!monster.distance || monster.distance <= maxDistance) {
                    if (angular.isUndefined(monster.nival) || ((angular.isUndefined(lvlMin) || monster.nival >= lvlMin) && (angular.isUndefined(lvlMax) || monster.nival <= lvlMax))) {
                        var isAGowap = monster.baseName.substr(0, 5) == "Gowap";
                        if (!isAGowap || includeGowap) {
                            var isAZombi = monster.baseName.substr(0, 9) == "Zombi de ";
                            if (!isAZombi || includeZombi) {
                                result.push(monster);
                            }
                        }
                    }
                }
            });
            filter.filteredMonstersCount = result.length;
            return result;
        };
    });
