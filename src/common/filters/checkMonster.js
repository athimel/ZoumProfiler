angular.module('ZoumProfiler')
    .filter('checkMonster', function() {
        return function(monsters, lvlMin, lvlMax, includeGowap) {
            var result = [];
            angular.forEach(monsters, function(monster) {
                if (!monster.nival || ((!lvlMin || monster.nival >= lvlMin) && (!lvlMax || monster.nival <= lvlMax))) {
                    var isAGowap = monster.baseName.substr(0, 5) == "Gowap";
                    //console.log(monster.baseName + " -> nival : " + monster.nival);
                    //console.log("isAGowap?" + isAGowap);
                    //console.log("includeGowap?" + includeGowap);
                    if (!isAGowap || includeGowap) {
                        result.push(monster);
                    }
                }
            });
            return result;
        };
    });
