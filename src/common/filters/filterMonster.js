angular.module('ZoumProfiler')
    .filter('filterMonster', function() {
        return function(monsters, levelContext) {
            var result = [];
            var includeGowap = levelContext.includeGowap;
            var lvlMin = levelContext.minLevel;
            var lvlMax = levelContext.maxLevel;
            var maxDistance = levelContext.maxDistance;
            angular.forEach(monsters, function(monster) {
                if (!monster.distance || monster.distance <= maxDistance) {
                    if (angular.isUndefined(monster.nival) || ((angular.isUndefined(lvlMin) || monster.nival >= lvlMin) && (angular.isUndefined(lvlMax) || monster.nival <= lvlMax))) {
                        var isAGowap = monster.baseName.substr(0, 5) == "Gowap";
                        //console.log(monster.baseName + " -> nival : " + monster.nival);
                        //console.log("isAGowap?" + isAGowap);
                        //console.log("includeGowap?" + includeGowap);
                        if (!isAGowap || includeGowap) {
                            result.push(monster);
                        }
                    }
                }
            });
            levelContext.filteredMonstersCount = result.length;
            return result;
        };
    });
