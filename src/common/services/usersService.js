angular.module('ZoumProfiler')
    .factory('users', ['$http', function ($http) {
        var users = {};

        users.whoAmI = function() {
            return $http.get('rest/auth/whoami.php');
        };

        users.logout = function() {
            return $http.get('rest/auth/logout.php');
        };

        users.login = function(login, password) {
            var data = "login=" + login;
            data += "&password=" + password;
            return $http.post('rest/auth/login.php', data);
        };

        users.register = function(login, password) {
            var data = "login=" + login;
            data += "&password=" + password;
            return $http.post('rest/auth/register.php', data);
        };

        users.leaveGroup = function(group) {
            var data = "group=" + group;
            return $http.post('rest/groups/leave.php', data);
        };

        users.joinGroup = function(group) {
            var data = "group=" + group;
            return $http.post('rest/groups/join.php', data);
        };

        users.list = function() {
            return $http.get('rest/users/list.php');
        };

        return users;
    }]);
