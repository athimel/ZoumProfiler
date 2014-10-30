'use strict';

angular.module('zoumProfilerApp', ['ui.bootstrap', 'ngSanitize'])
    .controller('ZoumProfilerController', ['$scope', '$window', function($scope, $window) {

        /* ********************************************* */
        /* **                Static data              ** */
        /* ********************************************* */

        $scope.config = { maxPi : 18290 };

        $scope.races = ['Darkling', 'Durakuir', 'Kastar', 'Nkrwapu', 'Skrim', 'Tomawak'];

        $scope.caracs = [
            {id : 'TOUR', type : 'T', min : 470, max : 720, cost : 18},
            {id : 'PV', type : 'D1', min : 30, max : 580, step : 10, minDurakuir : 40, cost : 16, costDurakuir : 12, costNkrwapu : 15},
            {id : 'VUE', type : 'D1', min : 3, max : 58, step : 1, minTomawak : 4, cost : 16, costTomawak : 12, costNkrwapu : 15},
            {id : 'ATT', type : 'D6', min : 3, max : 58, step : 1, minSkrim : 4, cost : 16, costSkrim : 12, costNkrwapu : 15},
            {id : 'ESQ', type : 'D6', min : 3, max : 50, step : 1, cost : 16, costNkrwapu : 15},
            {id : 'DEG', type : 'D3', min : 3, max : 58, step : 1, minKastar : 4, cost : 16, costKastar : 12, costNkrwapu : 15},
            {id : 'REG', type : 'D3', min : 1, max : 42, step : 1, minDarkling : 2, cost : 30, costDarkling : 22, costNkrwapu : 29},
            {id : 'ARM', type : 'D3', min : 1, max : 35, step : 1, cost : 30, costNkrwapu : 29}
        ];

        $scope.comps = [
            { id : 'cdm', levels : 5, cost : 10, name : "Connaissance des monstres", type : "Connaissance" },
            { id : 'idc', levels : 1, cost : 10, name : "Identification des champignons", type : "Connaissance" },
            { id : 'insultes', levels : 3, cost : 10, name : "Insultes", type : "Utile" },
            { id : 'miner', levels : 1, cost : 10, name : "Miner", type : "Utile" },
            { id : 'tailler', levels : 1, cost : 10, name : "Tailler", type : "Artisanat" },
            { id : 'pistage', levels : 1, cost : 10, name : "Pistage", type : "Utile" },
            { id : 'bidouiller', levels : 1, cost : 20, name : "Bidouille", type : "Artisanat" },
            { id : 'course', levels : 1, cost : 20, name : "Course", type : "Déplacement" },
            { id : 'de', levels : 1, cost : 20, name : "Déplacement Éclair", type : "Déplacement" },
            { id : 'ca', levels : 1, cost : 20, name : "Contre-Attaquer", type : "Combat" },
            { id : 'dressage', levels : 1, cost : 20, name : "Dressage", type : "Utile" },
            { id : 'parer', levels : 2, cost : 20, name : "Parer", type : "Combat" },
            { id : 'interposer', levels : 2, cost : 20, name : "S'interposer", type : "Combat" },
            { id : 'he', levels : 1, cost : 20, name : "Hurlement Effrayan", type : "Combat" },
            { id : 'lancer', levels : 1, cost : 30, name : "Lancer de potions", type : "Combat" },
            { id : 'marquage', levels : 1, cost : 30, name : "Marquage", type : "Utile" },
            { id : 'reparation', levels : 1, cost : 30, name : "Réparation", type : "Artisanat" },
            { id : 'grattage', levels : 1, cost : 30, name : "Grattage", type : "Artisanat" },
            { id : 'baroufle', levels : 4, cost : 30, name : "Baroufle", type : "Utile" },
            { id : 'planter', levels : 1, cost : 40, name : "Planter un champignon", type : "Artisanat" },
            { id : 'retraite', levels : 2, cost : 40, name : "Retraite", type : "Combat" },
            { id : 'melange', levels : 1, cost : 40, name : "Mélange Magique", type : "Artisanat" },
            { id : 'shamaner', levels : 1, cost : 50, name : "Shamaner", type : "Utile" },
            { id : 'ap', levels : 7, cost : 50, name : "Attaque Précise", type : "Combat" },
            { id : 'charger', levels : 1, cost : 50, name : "Charger", type : "Combat" },
            { id : 'piege_feu', levels : 1, cost : 50, name : "Construire un piège à feu", type : "Artisanat" },
            { id : 'piege_glue', levels : 1, cost : 50, name : "Construire un piège à glue", type : "Artisanat" },
            { id : 'cdb', levels : 7, cost : 50, name : "Coup de Butoir", type : "Combat" },
            { id : 'rotobaffe', levels : 6, cost : 80, name : "Rotobaffe", type : "Combat" },
            { id : 'painthure', levels : 1, cost : 100, name : "Painthure de Guerre", type : "Utile" },
            { id : 'em', levels : 1, cost : 100, name : "Ecriture Magique", type : "Artisanat" },
            { id : 'frene', levels : 1, cost : 100, name : "Frénésie", type : "Combat" },
            { id : 'necro', levels : 1, cost : 100, name : "Nécromancie", type : "Artisanat" },
            { id : 'golem_cuir', levels : 1, cost : 150, name : "Golémologie de cuir", type : "Artisanat" },
            { id : 'golem_metal', levels : 1, cost : 150, name : "Golémologie de métal", type : "Artisanat" },
            { id : 'golem_mithril', levels : 1, cost : 150, name : "Golémologie de mithril", type : "Artisanat" },
            { id : 'golem_papier', levels : 1, cost : 150, name : "Golémologie de papier", type : "Artisanat" },

            { id : 'am', levels : 1, cost : 0, name : 'Accélération du Métabolisme', reservedFor : $scope.races[2], type : "Utile" },
            { id : 'bs', levels : 1, cost : 0, name : 'Botte Secrète', reservedFor : $scope.races[4], type : "Attaque" },
            { id : 'balayage', levels : 1, cost : 0, name : 'Balayage', reservedFor : $scope.races[0], type : "Combat" },
            { id : 'camou', levels : 1, cost : 0, name : 'Camouflage', reservedFor : $scope.races[5], type : "Utile" },
            { id : 'ra', levels : 1, cost : 0, name : 'Régénération Accrue', reservedFor : $scope.races[1], type : "Utile" }
        ];

        $scope.sorts = [
            { id : 'vampi', name : 'Vampirisme', reservedFor : $scope.races[2] },
            { id : 'rp', name : 'Rafale Psychique', reservedFor : $scope.races[1] },
            { id : 'projo', name : 'Projectile Magique', reservedFor : $scope.races[5] },
            { id : 'hypno', name : 'Hypnotisme', reservedFor : $scope.races[4] },
            { id : 'siphon', name : 'Siphon des âmes', reservedFor : $scope.races[0] }
        ];

        $scope.compsMap = {}; // { "cdb1" : { ... } }
        $scope.compsByType = {}; // { "Combat" : [{cdb1}, {cdb2}] }
        angular.forEach($scope.comps, function(comp) {
            for(var i = 1; i <= comp.levels; i++) {
                if(!comp.reservedFor) {
                    var newComp = {
                        id: comp.id + i,
                        cost: comp.cost * i,
                        name: comp.name,
                        type: comp.type,
                        level: i
                    };
                    if(comp.levels > 1) {
                        newComp.name += " - niveau " + i;
                    }
                    if(i > 1) {
                        newComp.requires = comp.id + (i - 1);
                    }
                    if(i < comp.levels) {
                        newComp.requiredFor = comp.id + (i + 1);
                    }
                    $scope.compsMap[newComp.id] = newComp;

                    if(angular.isUndefined($scope.compsByType[comp.type])) {
                        $scope.compsByType[comp.type] = [];
                    }
                    $scope.compsByType[comp.type].push(newComp);
                }
            }
        });

        $scope.compTypes = Object.keys($scope.compsByType);

        $scope.combatCompsSortsMap = {
            // comps
            ca    : true, ap : true, charger : true, cdb : true, rotobaffe : true, frene : true, bs : true, piege_feu : true,
            // sorts
            vampi : true, rp : true, projo : true, siphon : true
        };

        $scope.levels = {};
        var count = 0;
        for(var i = 2; i <= 60; i++) {
            count += i * 10;
            $scope.levels['n' + i] = count;
        }

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.import = { show : false };
        $scope.compare = { show : false, map : {} };
        $scope.profile;
        $scope.computed;

        /* ********************************************* */
        /* **                 Profiles                ** */
        /* ********************************************* */

        $scope.profiles = [];


        /* ********************************************* */
        /* **                 Methods                 ** */
        /* ********************************************* */

        $scope.checkBonus = function() {
            angular.forEach($scope.caracs, function(carac) {
                if(!$scope.profile.bp) {
                    $scope.profile.bp = {};
                }
                if(!$scope.profile.bm) {
                    $scope.profile.bm = {};
                }
                if(!$scope.profile.bp[carac.id]) {
                    $scope.profile.bp[carac.id] = 0;
                }
                if(!$scope.profile.bm[carac.id]) {
                    $scope.profile.bm[carac.id] = 0;
                }
            });
        };

        $scope.loadFromStorage = function() {
            var lsProfiles = localStorage.getItem("profiles");
            if(angular.isDefined(lsProfiles) && lsProfiles != null) {
                $scope.profiles = angular.fromJson(lsProfiles);
            }

            // Because some profiles was created before I add "id"
            angular.forEach($scope.profiles, function(profile) {
                if(angular.isUndefined(profile.id)) {
                    profile.id = $scope.randomId();
                }
            });
        };

        $scope.saveToStorage = function() {
            console.log("Saving profiles");
            localStorage.setItem("profiles", angular.toJson($scope.profiles));
        };

        $scope.checkMin = function(profile) {
            if(angular.isUndefined(profile.caracs)) {
                profile.caracs = {};
            }
            angular.forEach($scope.caracs, function(carac) {
                if(angular.isUndefined(profile.caracs[carac.id])) {
                    if(carac.id == 'TOUR') {
                        profile.caracs[carac.id] = carac.max;
                    } else {
                        profile.caracs[carac.id] = $scope.min(profile.race, carac);
                    }
                } else {
                    if(carac.id == 'TOUR') {
                        profile.caracs[carac.id] = Math.min(profile.caracs[carac.id], carac.max);
                    } else {
                        profile.caracs[carac.id] = Math.max(profile.caracs[carac.id], $scope.min(profile.race, carac));
                    }
                }
            });
        };

        $scope.newComputed = function() {
            return {
                amelioCount:{},
                invested:{},
                nextCosts:{},
                piCaracts:0,
                piComps:-10,
                totalPi:0,
                percentCaracts:0,
                percentComps:0,
                percentInvested:{},
                level: 1,
                combat: []
            };
        };

        $scope.getProjoMaxDistance = function(profile) {
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

        /**
         * Take a sort or comp and computes its combat values (ATT, DEG, ...)
         */
        $scope.computeCombat = function(compOrSort, compOrSortDeBase) {
            var result = { name: compOrSort.name };

            // Compute ATT
            switch (compOrSortDeBase.id) {
                case 'ca':
                    var d6AttCa = Math.floor($scope.profile.caracs['ATT'] / 2);
                    result.ATT = d6AttCa * 3.5 + Math.floor(($scope.profile.bp['ATT'] + $scope.profile.bm['ATT']) / 2);
                    break;
                case 'projo':
                    result.ATT = $scope.profile.caracs['VUE'] * 3.5 + $scope.profile.bm['ATT'];
                    break;
                case 'ap':
                    var d6AttAp = $scope.profile.caracs['ATT'];
                    var bonusD6AttAp = Math.min(compOrSort.level * 3, Math.floor($scope.profile.caracs['ATT'] / 2));
                    result.ATT = (d6AttAp + bonusD6AttAp) * 3.5 + $scope.profile.bp['ATT'] + $scope.profile.bm['ATT'];
                    break;
                case 'bs':
                    var d6AttBS = Math.floor($scope.profile.caracs['ATT'] / 3) * 2;
                    if ($scope.profile.caracs['ATT'] % 3 == 2) {
                        d6AttBS++;
                    }
                    result.ATT = d6AttBS * 3.5 + Math.floor(($scope.profile.bp['ATT'] + $scope.profile.bm['ATT']) / 2);
                    break;
                case 'rp':
                case 'piege_feu':
                    result.ATT = '-';
                    break;
                case 'vampi':
                    var d6AttVampi = Math.floor($scope.profile.caracs['DEG'] / 3) * 2;
                    if ($scope.profile.caracs['DEG'] % 3 == 2) {
                        d6AttVampi++;
                    }
                    result.ATT = d6AttVampi * 3.5 + $scope.profile.bm['ATT'];
                    break;

                default:
                    result.ATT = $scope.profile.caracs['ATT'] * 3.5 + $scope.profile.bp['ATT'] + $scope.profile.bm['ATT'];
            }

            // Compute DEG
            switch (compOrSortDeBase.id) {
                case 'piege_feu':
                    var d3DegPiege = Math.floor(($scope.profile.caracs['VUE'] + $scope.profile.caracs['ESQ']) / 2);
                    result.DEG = d3DegPiege * 2;
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    break;
                case 'projo':
                    var porteeMax = $scope.getProjoMaxDistance($scope.profile);
                    var d3DegProjo = Math.floor($scope.profile.caracs['VUE'] / 2);
                    result.DEG = d3DegProjo * 2 + $scope.profile.bm['DEG'] + porteeMax * 2;
                    result.DEG_CRITIQ = $scope.degCritiqueSort($scope.profile, d3DegProjo) + porteeMax * 2;
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;
                case 'cdb':
                    var d3DegCdb = $scope.profile.caracs['DEG'];
                    var bonusD3DegCdb = Math.min(compOrSort.level * 3, Math.floor($scope.profile.caracs['DEG'] / 2));
                    result.DEG = (d3DegCdb + bonusD3DegCdb) * 2 + $scope.profile.bp['DEG'] + $scope.profile.bm['DEG'];
                    result.DEG_CRITIQ = $scope.degCritiqueComp($scope.profile, d3DegCdb) + bonusD3DegCdb * 2;
                    break;
                case 'bs':
                    var d3DegBs = Math.floor($scope.profile.caracs['ATT'] / 2);
                    var bmDegBs = Math.floor(($scope.profile.bp['DEG'] + $scope.profile.bm['DEG']) / 2);
                    result.DEG = d3DegBs * 2 + bmDegBs;
                    result.DEG_CRITIQ = $scope.degCritique0($scope.profile, d3DegBs, false, false) + bmDegBs;
                    break;
                case 'rp':
                    result.DEG = $scope.profile.caracs['DEG'] * 2 + $scope.profile.bm['DEG'];
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    break;
                case 'vampi':
                    result.DEG = $scope.profile.caracs['DEG'] * 2 + $scope.profile.bm['DEG'];
                    result.DEG_CRITIQ = $scope.degCritiqueSort($scope.profile, $scope.profile.caracs['DEG']);
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;
                case 'frene':
                    result.DEG = ($scope.profile.caracs['DEG'] * 2 + $scope.profile.bp['DEG'] + $scope.profile.bm['DEG']) * 2;
                    result.DEG_CRITIQ = $scope.degCritiqueComp($scope.profile, $scope.profile.caracs['DEG']) * 2;
                    break;
                case 'siphon':
                    result.DEG = $scope.profile.caracs['REG'] * 2 + $scope.profile.bm['DEG'];
                    result.DEG_CRITIQ = $scope.degCritiqueSort($scope.profile, $scope.profile.caracs['REG']);
                    result.DEG_RESIST = Math.floor(result.DEG / 2);
                    result.DEG_RESIST_CRITIQ = Math.floor(result.DEG_CRITIQ / 2);
                    break;

                default:
                    result.DEG = $scope.profile.caracs['DEG'] * 2 + $scope.profile.bp['DEG'] + $scope.profile.bm['DEG'];
                    result.DEG_CRITIQ = $scope.degCritiqueComp($scope.profile, $scope.profile.caracs['DEG']);
            }

            return result;
        };

        $scope.refreshCombat = function(computed) {
            computed.combat = [];
            angular.forEach($scope.sorts, function(sort) {
                if ($scope.combatCompsSortsMap[sort.id]) {
                    if (sort.reservedFor) {
                        if (sort.reservedFor === $scope.profile.race) {
                            var sortComputed = $scope.computeCombat(sort, sort);
                            computed.combat.push(sortComputed);
                        }
                    } else {
// TODO AThimel 25/10/2014 Include users owned sorts
                    }
                }
            });
            angular.forEach($scope.comps, function(comp) {
                if ($scope.combatCompsSortsMap[comp.id]) {
                    if (comp.reservedFor) {
                        if (comp.reservedFor === $scope.profile.race) {
                            var reservedCompComputed = $scope.computeCombat(comp, comp);
                            computed.combat.push(reservedCompComputed);
                        }
                    } else {
                        for (var lvl = comp.levels; lvl >= 1; lvl--) {
                            var compId = comp.id + lvl;
                            if ($scope.profile.comps[compId] === true) {
                                var compComputed = $scope.computeCombat($scope.compsMap[compId], comp);
                                computed.combat.push(compComputed);
                                break;
                            }
                        }
                    }
                }
            });
        };

        $scope.refreshComputed = function() {
            var newComputed = $scope.newComputed();
            angular.forEach($scope.caracs, function(carac) {
                newComputed.amelioCount[carac.id] = $scope.amelioCount($scope.profile, carac);
                newComputed.invested[carac.id] = $scope.invested($scope.profile, carac);
                newComputed.piCaracts += newComputed.invested[carac.id];
                newComputed.nextCosts[carac.id] = $scope.nextCost($scope.profile, carac);
            });
            $scope.refreshCombat(newComputed);
            if ($scope.profile.comps) {
                angular.forEach(Object.keys($scope.profile.comps), function (compId) {
                    if ($scope.profile.comps[compId] === true) {
                        newComputed.piComps += $scope.compsMap[compId].cost;
                    }
                });
            }
            newComputed.totalPi = newComputed.piCaracts + newComputed.piComps;
            if (newComputed.totalPi >= $scope.config.maxPi) {
                newComputed.level = 60;
            } else if (newComputed.totalPi < 20) {
                newComputed.level = 1;
            } else {
                for (i = 2; i < 60; i++) {
                    if (newComputed.totalPi >= $scope.levels['n' + i]) {
                        newComputed.level = i;
                    } else {
                        break;
                    }
                }
            }
            angular.forEach($scope.caracs, function(carac) {
                newComputed.percentInvested[carac.id] = 100 * newComputed.invested[carac.id] / newComputed.piCaracts;
            });
            newComputed.percentCaracts = 100 * newComputed.piCaracts / newComputed.totalPi;
            newComputed.percentComps = 100 * newComputed.piComps / newComputed.totalPi;
            $scope.computed = newComputed;
        };

        $scope.raceChanged = function() {
            $scope.checkMin($scope.profile);
            $scope.refreshComputed();
        };

        $scope.caracChanged = function() {
            $scope.refreshComputed();
        };
        $scope.bonusChanged = function(caracId) {
            if (($scope.profile.race == $scope.races[5] && caracId == 'VUE')
                || caracId == 'ATT'
                || caracId == 'ESQ'
                || caracId == 'DEG'
                || ($scope.profile.race == $scope.races[0] && caracId == 'REG')) {
                $scope.refreshCombat($scope.computed);
            }
        };

        $scope.selectProfile = function (profile) {
            $scope.reset();
            $scope.checkMin(profile);
            $scope.profile = profile;
            $scope.originalProfile = angular.copy($scope.profile);
            $scope.checkBonus();
            $scope.refreshComputed();
        };

        $scope.randomId = function() {
            return "p-" + new Date().getTime() + "-" + Math.random();
        };

        $scope.addProfile = function() {
            $scope.reset();
            var newProfile = { comps : {cdm1 : true}, id : $scope.randomId() };
            $scope.profiles.push(newProfile);
            $scope.selectProfile(newProfile);
        };

        $scope.copyProfile = function(profile) {
            $scope.reset();
            var newProfile = angular.copy(profile);
            newProfile.profile = newProfile.profile + " (copie)";
            newProfile.id = $scope.randomId();
            $scope.profiles.push(newProfile);
        };

        $scope.saveProfile = function() {
            $scope.saveToStorage();
            $scope.originalProfile = angular.copy($scope.profile);
        };

        $scope.deleteProfile = function(profile) {
            $scope.reset();
            $scope.profiles.splice($scope.profiles.indexOf(profile), 1);
            $scope.saveToStorage();
        };

        $scope.min = function(race, carac) {
            if(angular.isDefined(carac['min' + race])) {
                return carac['min' + race];
            } else {
                return carac.min;
            }
        };

        $scope._cost = function(race, carac) {
            if(angular.isDefined(carac['cost' + race])) {
                return carac['cost' + race];
            } else {
                return carac.cost;
            }
        };

        $scope.amelioCount = function(profile, carac) {
            var current = profile.caracs[carac.id];
            var result = 0;
            if(carac.id == 'TOUR') {
                for(var i = carac.max; i > current;) {
                    result++;
                    i -= Math.max(30 - 3 * (result - 1), 2.5);
                }
            } else {
                var min = $scope.min(profile.race, carac);
                result = current - min;
                if(carac.id == 'PV') {
                    result = Math.floor(result / 10);
                }
            }
            return result;
        };

        $scope.invested = function(profile, carac) {
            var cost = $scope._cost(profile.race, carac);
            var amelioCount = $scope.amelioCount(profile, carac);
            var result = 0;
            for(var i = 0; i <= amelioCount; i++) {
                result += i * cost;
            }
            return result;
        };

        $scope.nextCost = function(profile, carac) {
            var cost = $scope._cost(profile.race, carac);
            var count = $scope.amelioCount(profile, carac) + 1;
            var result = count * cost;
            return result;
        };

        $scope.degCritique0 = function(profile, nbD3Deg, includeBP, includeBM) {
            var critique = (nbD3Deg + Math.floor(nbD3Deg / 2) ) * 2;
            if (angular.isDefined(includeBP) && includeBP === true) {
                critique += profile.bp['DEG']
            }
            if (angular.isDefined(includeBM) && includeBM === true) {
                critique += profile.bm['DEG'];
            }
            return critique;
        };

        $scope.degCritiqueComp = function(profile, nbD3Deg) {
            return $scope.degCritique0(profile, nbD3Deg, true, true);
        };

        $scope.degCritiqueSort = function(profile, nbD3Deg) {
            return $scope.degCritique0(profile, nbD3Deg, false, true);
        };

        $scope.checkCompLevel = function(comp) {
            if($scope.profile.comps[comp.id] === true) {
                var comp1 = $scope.compsMap[comp.id];
                while(comp1.requires) {
                    $scope.profile.comps[comp1.requires] = true;
                    comp1 = $scope.compsMap[comp1.requires];
                }
            } else if($scope.profile.comps[comp.id] === false) {
                delete $scope.profile.comps[comp.id];
                var comp2 = $scope.compsMap[comp.id];
                while(comp2.requiredFor) {
                    $scope.profile.comps[comp2.requiredFor] = false;
                    delete $scope.profile.comps[comp2.requiredFor];
                    comp2 = $scope.compsMap[comp2.requiredFor];
                }
            }
            $scope.refreshComputed();
        };

        $scope.startImport = function() {
            $scope.reset();
            $scope.import.show = true;
        };

        $scope.reset = function() {

            if (angular.isDefined($scope.profile) && $scope.hasModification()) {
                if ($window.confirm("Vous avez des modifications sur votre profil, voulez-vous les enregistrer ?")) {
                    $scope.saveProfile();
                } else {
                    $scope.cancelModifications();
                }
            }

            delete $scope.compare.profiles;
            delete $scope.profile;
            delete $scope.originalProfile;
            delete $scope.computed;
            delete $scope.import.json;

            $scope.import.show = false;
            $scope.compare.show = false;
        };

        $scope.getCompareIds = function() {
            var result = [];
            angular.forEach(Object.keys($scope.compare.map), function(id) {
                if($scope.compare.map[id] === true) {
                    result.push(id);
                }
            });
            return result;
        };

        $scope.compareProfiles = function() {
            $scope.reset();
            $scope.compare.profiles = [];
            $scope.compare.comps = [];
            var compsAdded = {};
            angular.forEach($scope.getCompareIds(), function(id) {
                angular.forEach($scope.profiles, function(profile) {
                    if(profile.id == id) {
                        $scope.compare.profiles.push(profile);
                        angular.forEach(Object.keys(profile.comps), function(compId) {
                            if(profile.comps[compId] === true && angular.isUndefined(compsAdded[compId])) {
                                $scope.compare.comps.push($scope.compsMap[compId]);
                                compsAdded[compId] = true;
                            }
                        });
                    }
                });
            });
            $scope.compare.show = true;
        };

        $scope.hasModification = function() {
            return !angular.equals($scope.profile, $scope.originalProfile);
        };

        $scope.cancelModifications = function() {
            angular.copy($scope.originalProfile, $scope.profile);
            $scope.refreshComputed();
        };

        /* ********************************************* */
        /* **                 Startup                 ** */
        /* ********************************************* */

        $scope.loadFromStorage();

        if($scope.profiles && $scope.profiles.length == 1) {
            $scope.selectProfile($scope.profiles[0]);
        }

    }]);