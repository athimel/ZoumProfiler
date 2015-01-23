angular.module('ZoumProfiler')
    .factory('sharing', ['$http', function ($http) {
        var sharing = {};

        sharing.share = function(profile, login, group) {
            var data = "profileId=" + profile['_id']['$id'];
            if (login && login.length > 0) {
                data += "&login=" + login;
            }
            if (group && group.length > 0) {
                data += "&group=" + group;
            }
            return $http.post('rest/profiles/share.php', data);
        };

        sharing.unshare = function(profile, userId, group) {
            var data = "profileId=" + profile['_id']['$id'];
            if (userId) {
                data += "&userId=" + userId['$id'];
            }
            if (group && group.length > 0) {
                data += "&group=" + group;
            }
            return $http.post('rest/profiles/unshare.php', data);
        };

        return sharing;
    }]);
