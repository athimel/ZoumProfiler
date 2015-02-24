'use strict';

angular.module('ZoumProfiler', ['ui.bootstrap', 'ngSanitize'])
    .controller('BaseProfileController', ['$scope', '$window', '$location', '$timeout', '$filter', '$http', '$interval', 'base', 'users', 'sharing',
        function ($scope, $window, $location, $timeout, $filter, $http, $interval, base, users, sharing) {

            $http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";

            /* ********************************************* */
            /* **             Contextual data             ** */
            /* ********************************************* */

            $scope.display = { panel: "none" };
            $scope.importContext = { };
            $scope.compareContext = { map: {} };
            $scope.authenticationContext = { show: false };
            $scope.messages = {success: [], warnings: [], errors: []};
            $scope.user;

            /* ********************************************* */
            /* **                 Profiles                ** */
            /* ********************************************* */

            $scope.profiles = [];
            $scope.selectedProfile = undefined;
            $scope.profileTypes = ["local", "remote"];
            $scope.usersIndex = {};

            /* ********************************************* */
            /* **                 Messages                ** */
            /* ********************************************* */

            $scope.removeMessage = function (message) {
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

            $scope._addMessage = function (list, message) {
                list.push(message);
                $timeout(function () {
                    $scope.removeMessage(message);
                }, 10000);
            };

            $scope._addSuccessMessage = function (message) {
                $scope._addMessage($scope.messages.success, message);
            };

            $scope._addWarningMessage = function (message) {
                $scope._addMessage($scope.messages.warnings, message);
            };

            $scope._addErrorMessage = function (message) {
                $scope._addMessage($scope.messages.errors, message);
            };

            /* ********************************************* */
            /* **               Load & save               ** */
            /* ********************************************* */

            $scope._checkProfilesIntegrity = function (profiles) {
                var profilesArray;
                if (Array.isArray(profiles)) {
                    profilesArray = profiles;
                } else {
                    profilesArray = [profiles];
                }

                // Because some profiles was created before I add "id"
                angular.forEach(profilesArray, function (profile) {
                    if (angular.isUndefined(profile.id)) {
                        profile.id = $scope._randomId();
                    }
                });

                // Because some profiles was created before I add "mouches"
                angular.forEach(profilesArray, function (profile) {
                    if (angular.isUndefined(profile.mouches)) {
                        profile.mouches = {};
                    }
                });

                // Because some profiles was created when "de" was "de1"
                angular.forEach(base.comps, function (comp) {
                    if (comp.levels == 1) {
                        angular.forEach(profilesArray, function (profile) {
                            if (profile.comps[comp.id + "1"] === true) {
                                delete profile.comps[comp.id + "1"];
                                profile.comps[comp.id] = true;
                            }
                        });
                    }
                });

                // Check for '_internal' on remote profiles
                angular.forEach(profilesArray, function (profile) {
                    if (angular.isUndefined(profile._internal)) {
                        profile._internal = {};
                    }
                    if (angular.isUndefined(profile._internal.shares)) {
                        profile._internal.shares = [];
                    }
                });

                // Check for 'p.sorts' on profiles
                angular.forEach(profilesArray, function (profile) {
                    if (angular.isUndefined(profile.sorts)) {
                        profile.sorts = {idt: true};
                    }
                });

            };

            $scope._loadAllFromLocalStorage = function () {
                var lsProfiles = localStorage.getItem("profiles");
                if (angular.isDefined(lsProfiles) && lsProfiles != null) {
                    $scope.profiles = angular.fromJson(lsProfiles);
                }

                $scope._checkProfilesIntegrity($scope.profiles);

                // Mark each local profile as ... local !
                angular.forEach($scope.profiles, function (profile) {
                    profile.type = "local";
                });

            };

            $scope._loadAllFromServer = function (callback) {
                $http.get('rest/profiles/list.php')
                    .success(function (data) {
                        if (!callback) {
                            if (!$scope.profiles) {
                                $scope.profiles = [];
                            }
                            var remoteProfiles = data.profiles;

                            $scope._checkProfilesIntegrity(remoteProfiles);

                            angular.forEach(remoteProfiles, function (profile) {
                                profile.type = "remote";
                                $scope.profiles.push(profile);
                            });
                        } else {
                            callback(data.profiles);
                        }
                    })
                    .error(function () {
                        console.log("ERROR");
                    });
            };

            $scope._loadAllFromStorage = function () {
                $scope.profiles = []; // reset list
                $scope._loadAllFromLocalStorage();
                $scope._loadAllFromServer();
            };

            $scope.refreshRemote = function () {
                $scope._loadAllFromServer(function (remoteProfiles) {
                    if (remoteProfiles) {
                        var newProfiles = [];
                        // Copy only local profiles
                        angular.forEach($scope.profiles, function (profile) {
                            if (profile.type == "local") {
                                newProfiles.push(profile);
                            }
                        });
                        angular.forEach(remoteProfiles, function (remoteProfile) {
                            var found = false;
                            $scope._checkProfilesIntegrity(remoteProfile);
                            angular.forEach($scope.profiles, function (profile) {
                                if (profile.type == "remote") {
                                    if (remoteProfile['_id']['$id'] == profile['_id']['$id']) {
                                        found = true;
                                        if (profile != $scope.selectedProfile) { // Do not update currently selected profile
                                            angular.copy(remoteProfile, profile);
                                        }
                                        newProfiles.push(profile);
                                    }
                                }
                            });
                            if (!found) {
                                newProfiles.push(remoteProfile);
                            }
                        });
                        $scope.profiles = newProfiles;
                    }
                });
            };

            $scope._saveAllToLocalStorage = function () {
                var localProfiles = [];
                angular.forEach($scope.profiles, function (profile) {
                    if (profile.type == "local") {
                        localProfiles.push(profile);
                    }
                });
                localStorage.setItem("profiles", angular.toJson(localProfiles));
            };

            $scope._saveToServer = function (profile) {
                profile.type = "remote";
                var data = "profile=" + JSON.stringify(profile);
                if (profile['_id'] && profile['_id']['$id']) {
                    data += "&profileId=" + profile['_id']['$id'];
                }
                $http.post('rest/profiles/save.php', data)
                    .success(function (data) {
                        if (data.result == "CREATED" || data.result == "UPDATED") {
                            profile['_id'] = data.profile['_id'];
                            profile['_internal'] = data.profile['_internal'];

                            $scope._checkProfilesIntegrity(profile);

                            $scope.$broadcast("onProfileSaved", profile);
                        } else {
                            $scope._addErrorMessage("Impossible d'enregistrer le profil : " + data.result);
                        }
                    })
                    .error(function (error) {
                        $scope._addErrorMessage("Impossible d'enregistrer le profil : " + error);
                    });
            };

            $scope._saveAllToServer = function () {
                angular.forEach($scope.profiles, function (profile) {
                    if (profile.type == "remote") {
                        $scope._saveToServer(profile);
                    }
                });
            };

            $scope._deleteProfileOnServer = function (profile) {

                var data = "profileId=" + profile['_id']['$id'];
                $http.post('rest/profiles/delete.php', data)
                    .success(function (data) {
                        if (data.result != "DELETED") {
                            $scope._addErrorMessage("Impossible de supprimer le profil : " + data.result);
                        }
                    })
                    .error(function (error) {
                        $scope._addErrorMessage("Impossible de supprimer le profil : " + error);
                    });
            };

            $scope._save = function (profile) {
                if (profile.type == "local") {
                    $scope._saveAllToLocalStorage();
                } else {
                    $scope._saveToServer(profile);
                }
            };

            $scope._saveAll = function () {
                $scope._saveAllToLocalStorage();
                $scope._saveAllToServer();
            };

            $scope._loadRemoteUsers = function () {
                users.list().then(function (result) {
                    angular.forEach(result.data.users, function (user) {
                        $scope.usersIndex[user['_id']['$id']] = user;
                    });
                });
            };

            /* ********************************************* */
            /* **                Use cases                ** */
            /* ********************************************* */

            $scope._startRefreshFightCapabilities = function () {
                $scope.$broadcast('_startRefreshFightCapabilities');
            };

            $scope.startCompareUseCase = function () {
                $scope._selectPanel("compare");
                $scope.$broadcast('startCompareUseCase');
            };

            /* ********************************************* */
            /* **                 Methods                 ** */
            /* ********************************************* */

            $scope.getCaracAverage = function (profile, carac) {
                var caracId = carac.id;
                var result = profile.caracs[caracId] * carac.coef + profile.bp[caracId] + profile.bm[caracId];
                return result;
            };

            /* ********************************************* */
            /* **           Profiles management           ** */
            /* ********************************************* */

            $scope.selectProfile = function (profile) {
                $scope._selectPanel("profiling");
                $scope.selectedProfile = profile;
                $scope.$broadcast('onProfileSelected', profile);
            };

            $scope._randomId = function () {
                return "p-" + new Date().getTime() + "-" + Math.random();
            };

            $scope.addProfile = function () {
                var newProfile = {
                    comps: { cdm1: true },
                    sorts: { idt: true },
                    id: $scope._randomId(),
                    type: "local"
                };
                $scope.profiles.push(newProfile);
                $scope.selectProfile(newProfile);
            };

            $scope.copyProfile = function (profile) {
                $scope._reset();
                var newProfile = angular.copy(profile);
                newProfile.profile = newProfile.profile + "-2";
                newProfile.id = $scope._randomId();
                delete newProfile['_id']; // in case profile is already persisted remotely
                $scope.profiles.push(newProfile);
                $scope._save(newProfile);
            };

            $scope.deleteProfile = function (profile) {
                $scope._reset();
                var message = "Souhaitez-vous supprimer le profil " + $filter('prettyName')(profile) + " de manière définitive ?";
                if ($window.confirm(message)) {
                    $scope.profiles.splice($scope.profiles.indexOf(profile), 1);
                    delete $scope.compareContext.map[profile.id];
                    if (profile.type == "local") {
                        $scope._saveAllToLocalStorage();
                    } else {
                        $scope._deleteProfileOnServer(profile);
                    }
                }
            };

            $scope._reset = function () {

                if ($scope.display.panel == "profiling") {
                    $scope.$broadcast("onLeaveProfiling");
                    delete $scope.selectedProfile;
                }

            };

            $scope._selectPanel = function(panel) {
                $scope._reset();
                $scope.display.panel = panel;
            };

            $scope.startImport = function () {
                $scope._selectPanel("import");
            };

            $scope.startScheduler = function () {
                $scope._selectPanel("scheduler");
            };

            $scope.startLevels = function () {
                $scope._selectPanel("levels");
            };

            $scope.getCompareIds = function () {
                var result = [];
                angular.forEach(Object.keys($scope.compareContext.map), function (id) {
                    if ($scope.compareContext.map[id] === true) {
                        result.push(id);
                    }
                });
                return result;
            };

            /* ********************************************* */
            /* **              Authentication             ** */
            /* ********************************************* */

            $scope._whoAmI = function (callback) {
                users.whoAmI().then(function (result) {
                    $scope.user = {};
                    if (result.data.connected) {
                        $scope.user.remoteId = result.data.user['_id']['$id'];
                        $scope.user.login = result.data.user.login;
                        $scope.user.groups = result.data.user.groups;
                    }
                    if (callback) {
                        callback();
                    }
                });
            };

            $scope.logout = function () {
                users.logout().then(function () {
                    delete $scope.user.remoteId;
                    delete $scope.user.login;
                    delete $scope.user.groups;
                    $scope._authenticatedUserHasChanged();
                });
            };

            $scope._loadLastUsedLoginFromLocalStorage = function () {
                var login = localStorage.getItem("lastUsedLogin");
                if (angular.isDefined(login) && login != null) {
                    $scope.authenticationContext.login = login;
                }
            };

            $scope._saveLastUsedLoginToLocalStorage = function (login) {
                localStorage.setItem("lastUsedLogin", login);
            };

            $scope._authenticatedUserHasChanged = function () {
                $scope.refreshRemote();
                $scope.$broadcast('authenticatedUserHasChanged');
            };

            $scope._login = function (login, password) {
                users.login(login, password).then(function (result) {
                    if (result.data.authenticated) {
                        $scope._addSuccessMessage("Vous êtes connecté !");
                        $scope.cancelAuthentication();
                    } else {
                        $scope._addErrorMessage("Login / mot de passe incorrect")
                    }
                    $scope._saveLastUsedLoginToLocalStorage(login);
                    $scope._whoAmI();
                    $scope._authenticatedUserHasChanged();
                });
            };

            $scope._checkForRemoteSession = function () {
                var remoteIdBeforeWhoAmI = $scope.user ? $scope.user.remoteId : "none";
                var callback = function () {
                    var remoteIdAfterWhoAmI = $scope.user ? $scope.user.remoteId : "none";
                    if (!angular.equals(remoteIdBeforeWhoAmI, remoteIdAfterWhoAmI)) {
                        $scope._authenticatedUserHasChanged();
                    }
                };
                $scope._whoAmI(callback)
            };

            $scope.startRegistration = function () {
                $scope.authenticationContext.type = "register";
                $scope.authenticationContext.show = true;
            };

            $scope.startLogin = function () {
                $scope.authenticationContext.type = "login";
                $scope.authenticationContext.show = true;
            };

            $scope.cancelAuthentication = function () {
                $scope.authenticationContext.show = false;
                delete $scope.authenticationContext.password;
            };

            $scope.submitAuthentication = function () {
                if (angular.isUndefined($scope.authenticationContext.login) || $scope.authenticationContext.login.length == 0) {
                    $scope._addErrorMessage("Login obligatoire");
                } else if (angular.isUndefined($scope.authenticationContext.password) || $scope.authenticationContext.password.length == 0) {
                    $scope._addErrorMessage("Mot de passe obligatoire");
                } else {
                    if ($scope.authenticationContext.type == "login") {
                        $scope._login($scope.authenticationContext.login, $scope.authenticationContext.password);
                    } else {
                        users.register($scope.authenticationContext.login, $scope.authenticationContext.password).then(function (result) {
                            if (result.data.registered == false) {
                                $scope._addErrorMessage(result.data.reason);
                            } else {
                                $scope._login($scope.authenticationContext.login, $scope.authenticationContext.password);
                            }
                        });
                    }
                }
            };

            $scope.isAuthenticated = function () {
                return angular.isDefined($scope.user)
                    && angular.isDefined($scope.user.remoteId)
                    && angular.isDefined($scope.user.login);
            };

            $scope.isOwner = function (sharable) {
                return sharing.isOwner(sharable, $scope.user ? $scope.user.remoteId : undefined);
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

            if ($scope.profiles && $scope.profiles.length == 1) {
                $scope.selectProfile($scope.profiles[0]);
            }

            $scope._whoAmI();

            $scope._loadRemoteUsers();

            $scope._loadLastUsedLoginFromLocalStorage();

            $interval($scope._checkForRemoteSession, 840000); // 840000 ms = 14 min

        }]);
