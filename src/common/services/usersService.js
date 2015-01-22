angular.module('ZoumProfiler')
    .factory('users', ['$http', function ($http) {
        var users = {};

        users.whoAmI = function() {
            return $http.get('rest/auth/whoami.php');
        };

        return users;
    }]);
