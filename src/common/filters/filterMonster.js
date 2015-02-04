angular.module('ZoumProfiler')
    .filter('filterMonster', function() {
        return function(monsters, levelContext) {
            var result = [];
            var includeGowap = levelContext.includeGowap;
            var includeZombi = levelContext.includeZombi;
            var lvlMin = levelContext.minLevel;
            var lvlMax = levelContext.maxLevel;
            var maxDistance = levelContext.maxDistance;
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
            levelContext.filteredMonstersCount = result.length;
            return result;
        };
    });
