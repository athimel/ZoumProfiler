angular.module('ZoumProfiler')
    .filter('filterMonster', function() {
        return function(monsters, filter) {
            var result = [];
            var includeGowap = filter.includeGowap;
            var includeZombi = filter.includeZombi;
            var lvlMin = filter.minLevel;
            var lvlMax = filter.maxLevel;
            var maxDistance = filter.maxDistance;
            var searchPattern = filter.searchPattern;

            var predicates = [];

            predicates.push(function(monster) {
                return !monster.distance || monster.distance <= maxDistance;
            });

            predicates.push(function(monster) {
                return angular.isUndefined(monster.nival) || ((angular.isUndefined(lvlMin) || monster.nival >= lvlMin) && (angular.isUndefined(lvlMax) || monster.nival <= lvlMax));
            });

            if (!includeGowap) {
                predicates.push(function(monster) {
                    var isAGowap = monster.baseName.substr(0, 5) == "Gowap";
                    return !isAGowap;
                });
            }

            if (!includeZombi) {
                predicates.push(function(monster) {
                    var isAZombi = monster.baseName.substr(0, 9) == "Zombi de ";
                    return !isAZombi;
                });
            }

            if (angular.isDefined(searchPattern)) {
                searchPattern = searchPattern.toLowerCase();
                predicates.push(function(monster) {
                    return monster.baseName.toLowerCase().indexOf(searchPattern) > -1;
                });
            }

            var predicatesLength = predicates.length;

            angular.forEach(monsters, function(monster) {
                for (var i = 0; i < predicatesLength; i++) {
                    var predicate = predicates[i];
                    if (!predicate(monster)) {
                        console.log("break at " + i);
                        return;
                    }
                }
                // Aucun prédicat n'a mis fin à la boucle
                result.push(monster);
            });

            filter.filteredMonstersCount = result.length;
            return result;
        };
    });

