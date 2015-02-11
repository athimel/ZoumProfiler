angular.module('ZoumProfiler')
    .filter('cavList', function() {
        return function(input) {

            // Monstres
            var monsters = "";
            angular.forEach(input.monsters, function(monster) {
                if (monsters.length > 0) {
                    monsters += "\n";
                }
                monsters += monster.id + " - " + monster.name + " " + monster.nival;
            });

            // Trolls
            var trolls = "";
            angular.forEach(input.trolls, function(troll) {
                if (trolls.length > 0) {
                    trolls += ",";
                }
                trolls += troll.id;
            });

            var result = "";
            if (monsters.length > 0) {
                result += "Monstres:\n";
                result += monsters;
            }

            if (trolls.length > 0) {
                if (result.length > 0) {
                    result += "\n";
                }
                result += "Trolls:\n";
                result += trolls;
            }

            return result;
        };
    });


