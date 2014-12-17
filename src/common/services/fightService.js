angular.module('ZoumProfiler')
    .factory('fight', function () {
        var fight = {};

        fight.getProjoMaxDistance = function(profile) {
            var vueMax = profile.caracs["VUE"] + profile.bm["VUE"];
//            1-4 : 1 case
//            5-9 : 2 cases
//            10-15 : 3 cases
//            16-22 : 4 cases
//            23-30 : 5 cases
//            31-39 : 6 cases
//            40-49 : 7 cases
//            50-60 : 8 cases
//            61-72 : 9 cases
            if (vueMax >= 73) {
                return 10;
            } else if (vueMax >= 61) {
                return 9;
            } else if (vueMax >= 50) {
                return 8;
            } else if (vueMax >= 40) {
                return 7;
            } else if (vueMax >= 31) {
                return 6;
            } else if (vueMax >= 23) {
                return 5;
            } else if (vueMax >= 16) {
                return 4;
            } else if (vueMax >= 10) {
                return 3;
            } else if (vueMax >= 5) {
                return 2;
            } else {
                return 1;
            }
        };

        fight.getAppliedArmForFight = function(compOrSort, armP, armM) {
            var result;
            switch (compOrSort.baseId) {
                // sorts
                case 'vampi':
                case 'rp':
                case 'projo':
                    result = armM;
                    break;

                // frene
                case 'frene':
                    result = (armP + armM) * 2;
                    break;

                // BS
                case 'bs':
                    result = Math.floor((armP + armM) / 2);
                    break;

                // No ARM
                case 'siphon':
                case 'piege_feu':
                    result = 0;
                    break;

                // any other physical fight
                default:
                    result = armP + armM;
                    break;
            }
            return result;
        };

        /**
         * Take a sort or comp and computes its fight values (ATT, DEG, ...)
         */
        fight.computeFightCapabilities = function(base, profile, compOrSort, compOrSortDeBase) {
            var result = { name: compOrSort.name, baseId: compOrSortDeBase.id };

            // Compute ATT
            switch (compOrSortDeBase.id) {
                case 'ca':
                    var d6AttCa = Math.floor(profile.caracs['ATT'] / 2);
                    result.ATT = d6AttCa * 3.5 + Math.floor((profile.bp['ATT'] + profile.bm['ATT']) / 2);
                    break;
                case 'projo':
                    result.ATT = profile.caracs['VUE'] * 3.5 + profile.bm['ATT'];
                    break;
                case 'ap':
                    result.ATT = base.getAttForAp(compOrSort, profile);
                    break;
                case 'bs':
                    var d6AttBS = Math.floor(profile.caracs['ATT'] / 3) * 2;
                    if (profile.caracs['ATT'] % 3 == 2) {
                        d6AttBS++;
                    }
                    result.ATT = d6AttBS * 3.5 + Math.floor((profile.bp['ATT'] + profile.bm['ATT']) / 2);
                    break;
                case 'rp':
                case 'piege_feu':
                    result.ATT = '-';
                    break;
                case 'vampi':
                    var d6AttVampi = Math.floor(profile.caracs['DEG'] / 3) * 2;
                    if (profile.caracs['DEG'] % 3 == 2) {
                        d6AttVampi++;
                    }
                    result.ATT = d6AttVampi * 3.5 + profile.bm['ATT'];
                    break;

                default:
                    result.ATT = profile.caracs['ATT'] * 3.5 + profile.bp['ATT'] + profile.bm['ATT'];
            }

            // Compute DEG
            switch (compOrSortDeBase.id) {
                case 'piege_feu':
                    var d3DegPiege = Math.floor((profile.caracs['VUE'] + profile.caracs['ESQ']) / 2);
                    result.DEG = d3DegPiege * 2;
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    break;
                case 'projo':
                    var porteeMax = fight.getProjoMaxDistance(profile);
                    var d3DegProjo = Math.floor(profile.caracs['VUE'] / 2);
                    result.DEG = d3DegProjo * 2 + profile.bm['DEG'] + porteeMax * 2;
                    result.DEG_CRITIQ = base.degCritiqueSort(profile, d3DegProjo) + porteeMax * 2;
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;
                case 'cdb':
                    var degForCdb = base.getDegForCdB(compOrSort, profile);
                    result.DEG = degForCdb.DEG;
                    result.DEG_CRITIQ = degForCdb.DEG_CRITIQ;
                    break;
                case 'bs':
                    var d3DegBs = Math.floor(profile.caracs['ATT'] / 2);
                    var bmDegBs = Math.floor((profile.bp['DEG'] + profile.bm['DEG']) / 2);
                    result.DEG = d3DegBs * 2 + bmDegBs;
                    result.DEG_CRITIQ = base.degCritiqueNoBonus(profile, d3DegBs) + bmDegBs;
                    break;
                case 'rp':
                    result.DEG = profile.caracs['DEG'] * 2 + profile.bm['DEG'];
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    break;
                case 'vampi':
                    result.DEG = profile.caracs['DEG'] * 2 + profile.bm['DEG'];
                    result.DEG_CRITIQ = base.degCritiqueSort(profile, profile.caracs['DEG']);
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;
                case 'frene':
                    result.DEG = (profile.caracs['DEG'] * 2 + profile.bp['DEG'] + profile.bm['DEG']) * 2;
                    result.DEG_CRITIQ = base.degCritiqueComp(profile, profile.caracs['DEG']) * 2;
                    break;
                case 'siphon':
                    result.DEG = profile.caracs['REG'] * 2 + profile.bm['DEG'];
                    result.DEG_CRITIQ = base.degCritiqueSort(profile, profile.caracs['REG']);
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;

                default:
                    result.DEG = profile.caracs['DEG'] * 2 + profile.bp['DEG'] + profile.bm['DEG'];
                    result.DEG_CRITIQ = base.degCritiqueComp(profile, profile.caracs['DEG']);
            }

            return result;
        };

        fight.getFightCapabilities = function(base, profile) {
            var result = [];

            // Attaque normale
            var anComputed = fight.computeFightCapabilities(base, profile, base.an, base.an);
            result.push(anComputed);

            // Compétences
            angular.forEach(base.sorts, function(sort) {
                if (base.combatCompsSortsMap[sort.id]) {
                    if (sort.reservedFor) {
                        if (sort.reservedFor === profile.race) {
                            var sortComputed = fight.computeFightCapabilities(base, profile, sort, sort);
                            result.push(sortComputed);
                        }
                    } else {
// TODO AThimel 25/10/2014 Include users owned sorts
                    }
                }
            });

            // Sortilèges
            angular.forEach(base.comps, function(comp) {
                if (base.combatCompsSortsMap[comp.id]) {
                    if (comp.reservedFor) {
                        if (comp.reservedFor === profile.race) {
                            var reservedCompComputed = fight.computeFightCapabilities(base, profile, comp, comp);
                            result.push(reservedCompComputed);
                        }
                    } else {
                        for (var lvl = comp.levels; lvl >= 1; lvl--) {
                            var compId = base.getCompId(comp, lvl);
                            if (profile.comps[compId] === true) {
                                var compComputed = fight.computeFightCapabilities(base, profile, base.compsMap[compId], comp);
                                result.push(compComputed);
                                break;
                            }
                        }
                    }
                }
            });

            return result;
        };

        return fight;
    });
