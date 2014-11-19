'use strict';

angular.module('zoumProfilerApp', ['ui.bootstrap', 'ngSanitize'])
    .controller('BaseProfileController', ['$scope', '$window', '$location', '$timeout', '$filter', 'base', function($scope, $window, $location, $timeout, $filter, base) {

        $scope.races = base.races;

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.import = { show : false };
        $scope.compare = { show : false, map : {} };
        $scope.profile;
        $scope.computed;
        $scope.messages = { success:[], warnings:[], errors:[] };

        /* ********************************************* */
        /* **                 Profiles                ** */
        /* ********************************************* */

        $scope.profiles = [];


        /* ********************************************* */
        /* **                 Methods                 ** */
        /* ********************************************* */

        $scope._checkBonus = function(profile) {
            angular.forEach(base.caracs, function(carac) {
                if(!profile.bp) {
                    profile.bp = {};
                }
                if(!profile.bm) {
                    profile.bm = {};
                }
                if(!profile.bp[carac.id]) {
                    profile.bp[carac.id] = 0;
                }
                if(!profile.bm[carac.id]) {
                    profile.bm[carac.id] = 0;
                }
            });
        };

        $scope.checkBonus = function() {
            $scope._checkBonus($scope.profile);
        };

        $scope.loadFromStorage = function() {
            var lsProfiles = localStorage.getItem("profiles");
            if(angular.isDefined(lsProfiles) && lsProfiles != null) {
                $scope.profiles = angular.fromJson(lsProfiles);
            }

            // Because some profiles was created before I add "id"
            angular.forEach($scope.profiles, function(profile) {
                if(angular.isUndefined(profile.id)) {
                    profile.id = $scope._randomId();
                }
            });

            // Because some profiles was created when "de" was "de1"
            angular.forEach(base.comps, function(comp) {
                if (comp.levels == 1) {
                    angular.forEach($scope.profiles, function(profile) {
                        if (profile.comps[comp.id + "1"] === true) {
                            delete profile.comps[comp.id + "1"];
                            profile.comps[comp.id] = true;
                        }
                    });
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
            angular.forEach(base.caracs, function(carac) {
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

        $scope.getCompId = function(comp, lvl) {
            var result = comp.id;
            if (comp.levels > 1) {
                result += lvl;
            }
            return result;
        };

        $scope.getCompOrSort = function(compOrSortId) {
            var result = base.compsMap[compOrSortId];
            if (!result) {
                result = base.sortsMap[compOrSortId];
            }
            if (!result) {
                console.error("Unknown comp/sort: " + compOrSortId)
            }
            return result;
        };

        $scope.getCompOrSortShortName = function(compOrSortId) {
            var result = compOrSortId;
            var compOrSort = $scope.getCompOrSort(compOrSortId);
            if (compOrSort) {
                if (compOrSort.short) {
                    result = compOrSort.short; // HE or CdM4
                } else {
                    if (compOrSort.levels > 1) {
                        result = compOrSortId; // cdm4
                    } else {
                        result = compOrSort.id; // he
                    }
                }
            }
            return result;
        };
        $scope.getAttForAp = function(compApWithLevel) {
            var d6AttAp = $scope.profile.caracs['ATT'];
            var bonusD6AttAp = Math.min(compApWithLevel.level * 3, Math.floor($scope.profile.caracs['ATT'] / 2));
            return (d6AttAp + bonusD6AttAp) * 3.5 + $scope.profile.bp['ATT'] + $scope.profile.bm['ATT'];
        };

        $scope.getDegForCdB = function(compCdbWithLevel) {
            var result = {};
            var d3DegCdb = $scope.profile.caracs['DEG'];
            var bonusD3DegCdb = Math.min(compCdbWithLevel.level * 3, Math.floor($scope.profile.caracs['DEG'] / 2));
            result.DEG = (d3DegCdb + bonusD3DegCdb) * 2 + $scope.profile.bp['DEG'] + $scope.profile.bm['DEG'];
            result.DEG_CRITIQ = $scope.degCritiqueComp($scope.profile, d3DegCdb) + bonusD3DegCdb * 2;
            return result;
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
                    result.ATT = $scope.getAttForAp(compOrSort);
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
                    var degForCdb = $scope.getDegForCdB(compOrSort);
                    result.DEG = degForCdb.DEG;
                    result.DEG_CRITIQ = degForCdb.DEG_CRITIQ;
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
            angular.forEach(base.sorts, function(sort) {
                if (base.combatCompsSortsMap[sort.id]) {
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
            angular.forEach(base.comps, function(comp) {
                if (base.combatCompsSortsMap[comp.id]) {
                    if (comp.reservedFor) {
                        if (comp.reservedFor === $scope.profile.race) {
                            var reservedCompComputed = $scope.computeCombat(comp, comp);
                            computed.combat.push(reservedCompComputed);
                        }
                    } else {
                        for (var lvl = comp.levels; lvl >= 1; lvl--) {
                            var compId = $scope.getCompId(comp, lvl);
                            if ($scope.profile.comps[compId] === true) {
                                var compComputed = $scope.computeCombat(base.compsMap[compId], comp);
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
            angular.forEach(base.caracs, function(carac) {
                newComputed.amelioCount[carac.id] = $scope.amelioCount($scope.profile, carac);
                newComputed.invested[carac.id] = $scope.invested($scope.profile, carac);
                newComputed.piCaracts += newComputed.invested[carac.id];
                newComputed.nextCosts[carac.id] = $scope.nextCost($scope.profile, carac);
            });
            newComputed.currentTour = $scope.profile.caracs['TOUR'];
            $scope.refreshCombat(newComputed);
            if ($scope.profile.comps) {
                angular.forEach(Object.keys($scope.profile.comps), function (compId) {
                    if ($scope.profile.comps[compId] === true) {
                        newComputed.piComps += base.compsMap[compId].cost;
                    }
                });
            }
            newComputed.totalPi = newComputed.piCaracts + newComputed.piComps;
            if (newComputed.totalPi >= base.config.maxPi) {
                newComputed.level = 60;
            } else if (newComputed.totalPi < 20) {
                newComputed.level = 1;
            } else {
                for (var i = 2; i < 60; i++) {
                    if (newComputed.totalPi >= base.levels['n' + i]) {
                        newComputed.level = i;
                    } else {
                        break;
                    }
                }
            }
            angular.forEach(base.caracs, function(carac) {
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

        $scope.selectProfile = function (profile) {
            $scope.reset();
            $scope.checkMin(profile);
            $scope.profile = profile;
            $scope.originalProfile = angular.copy($scope.profile);
            $scope.checkBonus();
            $scope.refreshComputed();
        };

        $scope._randomId = function() {
            return "p-" + new Date().getTime() + "-" + Math.random();
        };

        $scope.addProfile = function() {
            $scope.reset();
            var newProfile = { comps : {cdm1 : true}, id : $scope._randomId() };
            $scope.profiles.push(newProfile);
            $scope.selectProfile(newProfile);
        };

        $scope.copyProfile = function(profile) {
            $scope.reset();
            var newProfile = angular.copy(profile);
            newProfile.profile = newProfile.profile + "-2";
            newProfile.id = $scope._randomId();
            $scope.profiles.push(newProfile);
            $scope.saveToStorage();
        };

        $scope.saveProfile = function() {
            $scope.saveToStorage();
            $scope.originalProfile = angular.copy($scope.profile);
        };

        $scope.deleteProfile = function(profile) {
            $scope.reset();
            var message = "Souhaitez-vous supprimer le profil " + $filter('prettyName')(profile) + " de manière définitive ?";
            if ($window.confirm(message)) {
                $scope.profiles.splice($scope.profiles.indexOf(profile), 1);
                $scope.saveToStorage();
                delete $scope.compare.map[profile.id];
            }
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

        $scope.startImport = function() {
            $scope.reset();
            $scope.import.show = true;
        };

        $scope.reset = function() {

            if (angular.isDefined($scope.profile) && $scope.hasModification()) {
                var message = "Vous avez des modifications sur le profil " + $filter('prettyName')($scope.profile) + ", voulez-vous les enregistrer ?";
                if ($window.confirm(message)) {
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

        $scope.getCaracAverage = function(profile, carac) {
            var caracId = carac.id;
            var result = profile.caracs[caracId] * carac.coef + profile.bp[caracId] + profile.bm[caracId];
            return result;
        };

        $scope.startCompareUseCase = function() {
            $scope.$broadcast('startCompareUseCase');
        };

        $scope.hasModification = function() {
            return !angular.equals($scope.profile, $scope.originalProfile);
        };

        $scope.cancelModifications = function() {
            angular.copy($scope.originalProfile, $scope.profile);
            $scope.refreshComputed();
        };

        $scope._importProfile = function(newProfile) {
            if (newProfile.comps) {
                angular.forEach(base.comps, function (comp) {
                    if (comp.levels > 1) {
                        for (var lvl = comp.levels; lvl >= 1; lvl--) {
                            var compIdHigherLvl = $scope.getCompId(comp, lvl + 1);
                            if (newProfile.comps[compIdHigherLvl] === true) {
                                var compId = $scope.getCompId(comp, lvl);
                                newProfile.comps[compId] = true;
                            }
                        }
                    }
                });
            }

            var profileAlreadyExists = false;
            angular.forEach($scope.profiles, function(profile) {
                var areEquals = angular.equals(profile, newProfile);
                if (!areEquals && profile.id == newProfile.id) {
                    newProfile.id = $scope._randomId();
                }
                profileAlreadyExists |= areEquals;
            });
            if (profileAlreadyExists) {
                $scope.addWarningMessage("Un profil identique existe déjà dans votre liste de profils");
            } else {
                $scope.profiles.push(newProfile);
                $scope.saveToStorage();
                $scope.addSuccessMessage("Le profil <b>" + $filter('prettyName')(newProfile) + "</b> a bien été ajouté à votre liste de profils");
            }
            $scope.reset();
        };

        $scope._addMessage = function(list, message) {
            list.push(message);
            $timeout(function() {
                $scope.removeMessage(message);
            }, 10000);
        };

        $scope.addSuccessMessage = function(message) {
            $scope._addMessage($scope.messages.success, message);
        };

        $scope.addWarningMessage = function(message) {
            $scope._addMessage($scope.messages.warnings, message);
        };

        $scope.addErrorMessage = function(message) {
            $scope._addMessage($scope.messages.errors, message);
        };

        $scope.removeMessage = function(message) {
            var successIndex = $scope.messages.success.indexOf(message);
            if (successIndex != -1) {
                $scope.messages.success.splice(successIndex, 1);
            } else {
                var errorIndex = $scope.messages.errors.indexOf(message);
                if (errorIndex != -1) {
                    $scope.messages.errors.splice(errorIndex, 1);
                } else {
                    var warningIndex = $scope.messages.warnings.indexOf(message);
                    if (warningIndex != -1) {
                        $scope.messages.warnings.splice(warningIndex, 1);
                    }
                }
            }
        };

        /* ********************************************* */
        /* **                 Startup                 ** */
        /* ********************************************* */

        $scope.loadFromStorage();

        if ($location) {
            var value = $location.search();
            if (value && value.import) {
                try {
                    var newProfile = angular.fromJson(value.import);
                    $scope._importProfile(newProfile);
                    $location.search('import', '');
                } catch (eee) {
                    console.error("Error during profile import: ", eee);
                    $scope.addErrorMessage("Impossible d'importer le profile");
                }
            }
        }

        if($scope.profiles && $scope.profiles.length == 1) {
            $scope.selectProfile($scope.profiles[0]);
        }

    }]);
