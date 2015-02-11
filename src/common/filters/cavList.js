angular.module('ZoumProfiler')
    .filter('cavList', function() {
        return function(input) {
            var result = "";

            // Monstres
            if (input.monsters && input.monsters.length > 0) {
                result += "Monstres:";
            }
            angular.forEach(input.monsters, function(monster) {
                if (result.length > 0) {
                    result += "\n";
                }
                result += monster.id + " - " + monster.name + " " + monster.nival;
            });

            // Trolls
            if (input.trolls && input.trolls.length > 0) {
                if (result.length > 0) {
                    result += "\n";
                }
                result += "Trolls:";
            }
            angular.forEach(input.trolls, function(troll) {
                if (result.length > 0) {
                    result += "\n";
                }
                result += troll.id;
                if (troll.name) {
                    result += " - " + troll.name;
                }
                if (troll.nival) {
                    result += " " + troll.nival;
                }
            });
            return result;
        };
    });


