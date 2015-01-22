'use strict';

angular.module('ZoumProfiler', ['ui.bootstrap', 'ngSanitize'])
    .controller('BaseProfileController', ['$scope', '$window', '$location', '$timeout', '$filter', '$http', 'base',
        function($scope, $window, $location, $timeout, $filter, $http, base) {

        $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

        /* ********************************************* */
        /* **           Base stuff exposed            ** */
        /* ********************************************* */

        $scope.races = base.races;
        $scope.config = base.config;

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.importContext = { show : false };
        $scope.compareContext = { show : false, map : {} };
        $scope.schedulerContext = { show: false, target: {} };
        $scope.profile;
        $scope.computed;
        $scope.messages = { success:[], warnings:[], errors:[] };

        /* ********************************************* */
        /* **                 Profiles                ** */
        /* ********************************************* */

        $scope.profiles = [];
        $scope.profileTypes = ["local", "remote"];

        /* ********************************************* */
        /* **                 Messages                ** */
        /* ********************************************* */

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

        $scope._addMessage = function(list, message) {
            list.push(message);
            $timeout(function() {
                $scope.removeMessage(message);
            }, 10000);
        };

        $scope._addSuccessMessage = function(message) {
            $scope._addMessage($scope.messages.success, message);
        };

        $scope._addWarningMessage = function(message) {
            $scope._addMessage($scope.messages.warnings, message);
        };

        $scope._addErrorMessage = function(message) {
            $scope._addMessage($scope.messages.errors, message);
        };

        /* ********************************************* */
        /* **               Load & save               ** */
        /* ********************************************* */

        $scope._loadAllFromLocalStorage = function() {
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

            // Because some profiles was created before I add "mouches"
            angular.forEach($scope.profiles, function(profile) {
                if(angular.isUndefined(profile.mouches)) {
                    profile.mouches = {};
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

            // Mark each local profile as ... local !
            angular.forEach($scope.profiles, function(profile) {
                profile.type = "local";
            });

        };

        $scope._loadAllFromServer = function() {
            $http.get('rest/profiles/list.php')
                .success(function(data) {
                    if (!$scope.profiles) {
                        $scope.profiles = [];
                    }
                    var remoteProfiles = data.profiles;
                    angular.forEach(remoteProfiles, function(profile) {
                        profile.type = "remote";
                        $scope.profiles.push(profile);
                    });
                })
                .error(function() {
                    console.log("ERROR");
                });
        };

        $scope._loadAllFromStorage = function() {
            $scope.profiles = []; // reset list
            $scope._loadAllFromLocalStorage();
            $scope._loadAllFromServer();
        };

        $scope.refreshRemote = function() {
            // TODO AThimel fetch only remote profiles and update local instances instead of replacing them
            $scope._loadAllFromStorage();
        };

        $scope._saveAllToLocalStorage = function() {
            var localProfiles = [];
            angular.forEach($scope.profiles, function(profile) {
                if (profile.type == "local") {
                    localProfiles.push(profile);
                }
            });
            localStorage.setItem("profiles", angular.toJson(localProfiles));
        };

        $scope._saveToServer = function(profile) {
            profile.type = "remote";
            var data = "profile=" + JSON.stringify(profile);
            if (profile['_id'] && profile['_id']['$id']) {
                data += "&profileId=" + profile['_id']['$id'];
            }
            $http.post('rest/profiles/save.php', data)
                .success(function(data) {
                    if (data.result == "CREATED" || data.result == "UPDATED") {
                        profile['_id'] = data.profile['_id'];
                    } else {
                        $scope._addErrorMessage("Impossible d'enregistrer le profil : " + data.result);
                    }
                })
                .error(function(error) {
                    $scope._addErrorMessage("Impossible d'enregistrer le profil : " + error);
                });
        };

        $scope._saveAllToServer = function() {
            angular.forEach($scope.profiles, function(profile) {
                if (profile.type == "remote") {
                    $scope._saveToServer(profile);
                }
            });
        };

        $scope._save = function(profile) {
            if (profile.type == "local") {
                $scope._saveAllToLocalStorage();
            } else {
                $scope._saveToServer(profile);
            }
        };

        $scope._saveAll = function() {
            $scope._saveAllToLocalStorage();
            $scope._saveAllToServer();
        };

        $scope.moveFromLocalToRemote = function() {
            $scope.saveProfile(); // save to local storage
            $scope.profile.type = "remote"; // set remote
            $scope.saveProfile();
            $scope._saveAllToLocalStorage(); // write to local storage
        };

        /* ********************************************* */
        /* **                Use cases                ** */
        /* ********************************************* */

        $scope._startRefreshFightCapabilities = function() {
            $scope.$broadcast('_startRefreshFightCapabilities');
        };

        $scope.startCompareUseCase = function() {
            $scope.$broadcast('startCompareUseCase');
        };

        /* ********************************************* */
        /* **                 Methods                 ** */
        /* ********************************************* */

        $scope.getCaracAverage = function(profile, carac) {
            var caracId = carac.id;
            var result = profile.caracs[caracId] * carac.coef + profile.bp[caracId] + profile.bm[caracId];
            return result;
        };

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

        $scope._checkCaracMin = function(profile) {
            if(angular.isUndefined(profile.caracs)) {
                profile.caracs = {};
            }
            angular.forEach(base.caracs, function(carac) {
                if(angular.isUndefined(profile.caracs[carac.id])) {
                    if(carac.id == 'TOUR') {
                        profile.caracs[carac.id] = carac.max;
                    } else {
                        profile.caracs[carac.id] = $scope._min(profile.race, carac);
                    }
                } else {
                    if(carac.id == 'TOUR') {
                        profile.caracs[carac.id] = Math.min(profile.caracs[carac.id], carac.max);
                    } else {
                        profile.caracs[carac.id] = Math.max(profile.caracs[carac.id], $scope._min(profile.race, carac));
                    }
                }
            });
        };

        $scope._checkMouches = function(profile) {
            if (angular.isUndefined(profile.mouches)) {
                profile.mouches = {};
            }
            angular.forEach(base.mouches, function(mouche) {
                if (angular.isUndefined(profile.mouches[mouche.type])) {
                    profile.mouches[mouche.type] = 0;
                }
            });
        };

        $scope._newComputed = function() {
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
                level: 1
            };
        };

        $scope._min = function(race, carac) {
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

        $scope._computeAmelioCount = function(profile, carac) {
            var current = profile.caracs[carac.id];
            var result = 0;
            if(carac.id == 'TOUR') {
                for(var i = carac.max; i > current;) {
                    result++;
                    i -= Math.max(30 - 3 * (result - 1), 2.5);
                }
            } else {
                var min = $scope._min(profile.race, carac);
                result = current - min;
                if(carac.id == 'PV') {
                    result = Math.floor(result / 10);
                }
            }
            return result;
        };

        $scope._computeInvested = function(profile, carac) {
            var cost = $scope._cost(profile.race, carac);
            var amelioCount = $scope._computeAmelioCount(profile, carac);
            var result = 0;
            for(var i = 0; i <= amelioCount; i++) {
                result += i * cost;
            }
            return result;
        };

        $scope._computeNextCost = function(profile, carac) {
            var cost = $scope._cost(profile.race, carac);
            var count = $scope._computeAmelioCount(profile, carac) + 1;
            var result = count * cost;
            return result;
        };

        $scope._refreshComputed = function() {
            var newComputed = $scope._newComputed();
            angular.forEach(base.caracs, function(carac) {
                newComputed.amelioCount[carac.id] = $scope._computeAmelioCount($scope.profile, carac);
                newComputed.invested[carac.id] = $scope._computeInvested($scope.profile, carac);
                newComputed.piCaracts += newComputed.invested[carac.id];
                newComputed.nextCosts[carac.id] = $scope._computeNextCost($scope.profile, carac);
            });
            newComputed.currentTour = $scope.profile.caracs['TOUR'];
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

            $scope._startRefreshFightCapabilities();
        };


        /* ********************************************* */
        /* **           Profiles management           ** */
        /* ********************************************* */

        $scope.selectProfile = function (profile) {
            $scope._reset();
            $scope._checkCaracMin(profile);
            $scope._checkMouches(profile);
            $scope.profile = profile;
            $scope.originalProfile = angular.copy($scope.profile);
            $scope.checkBonus();
            $scope._refreshComputed();
        };

        $scope._randomId = function() {
            return "p-" + new Date().getTime() + "-" + Math.random();
        };

        $scope.addProfile = function() {
            $scope._reset();
            var newProfile = { comps : {cdm1 : true}, id : $scope._randomId(), type : "local" };
            $scope.profiles.push(newProfile);
            $scope.selectProfile(newProfile);
        };

        $scope.copyProfile = function(profile) {
            $scope._reset();
            var newProfile = angular.copy(profile);
            newProfile.profile = newProfile.profile + "-2";
            newProfile.id = $scope._randomId();
            delete newProfile['_id']; // in case profile is already persisted remotely
            $scope.profiles.push(newProfile);
            $scope._save(newProfile);
        };

        $scope.saveProfile = function() {
            $scope._save($scope.profile);
            $scope.originalProfile = angular.copy($scope.profile);
        };

        $scope.deleteProfile = function(profile) {
            $scope._reset();
            var message = "Souhaitez-vous supprimer le profil " + $filter('prettyName')(profile) + " de manière définitive ?";
            if ($window.confirm(message)) {
                $scope.profiles.splice($scope.profiles.indexOf(profile), 1);
                $scope._saveAll();
                delete $scope.compareContext.map[profile.id];
                // TODO AThimel 22/01/2015 Implement proper delete (remote compatible)
            }
        };

        $scope.startImport = function() {
            $scope._reset();
            $scope.importContext.show = true;
        };

        $scope.startScheduler = function() {
            $scope._reset();
            $scope.schedulerContext.show = true;
        };

        $scope._reset = function() {

            if (angular.isDefined($scope.profile) && $scope.hasModification()) {
                var message = "Vous avez des modifications sur le profil " + $filter('prettyName')($scope.profile) + ", voulez-vous les enregistrer ?";
                if ($window.confirm(message)) {
                    $scope.saveProfile();
                } else {
                    $scope.cancelModifications();
                }
            }

            delete $scope.profile;
            delete $scope.originalProfile;
            delete $scope.computed;

            $scope.importContext.show = false;
            $scope.compareContext.show = false;
            $scope.schedulerContext.show = false;
        };

        $scope.getCompareIds = function() {
            var result = [];
            angular.forEach(Object.keys($scope.compareContext.map), function(id) {
                if($scope.compareContext.map[id] === true) {
                    result.push(id);
                }
            });
            return result;
        };

        $scope.hasModification = function() {
            return !angular.equals($scope.profile, $scope.originalProfile);
        };

        $scope.cancelModifications = function() {
            angular.copy($scope.originalProfile, $scope.profile);
            $scope._refreshComputed();
        };

        /* ********************************************* */
        /* **                 Startup                 ** */
        /* ********************************************* */

        $scope._loadAllFromStorage();

        if ($location) {
            var value = $location.search();
            if (value && value.import) {
                try {
                    $scope.importContext.startupImportJson = value.import;
                    $location.search('import', '');
                } catch (eee) {
                    console.error("Error during profile import: ", eee);
                    $scope._addErrorMessage("Impossible d'importer le profile");
                }
            }
        }

        if($scope.profiles && $scope.profiles.length == 1) {
            $scope.selectProfile($scope.profiles[0]);
        }

    }]);
