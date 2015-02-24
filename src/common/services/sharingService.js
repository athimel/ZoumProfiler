angular.module('ZoumProfiler')
    .factory('sharing', ['$http', function ($http) {
        var sharing = {};

        sharing.share = function(sharable, type, login, group) {
            var data = "sharableType=" + type + "&sharableId=" + sharable['_id']['$id'];
            if (login && login.length > 0) {
                data += "&login=" + login;
            }
            if (group && group.length > 0) {
                data += "&group=" + group;
            }
            return $http.post('rest/sharing/share.php', data);
        };

        sharing.unshare = function(sharable, type, userId, group) {
            var data = "sharableType=" + type + "&sharableId=" + sharable['_id']['$id'];
            if (userId) {
                data += "&userId=" + userId['$id'];
            }
            if (group && group.length > 0) {
                data += "&group=" + group;
            }
            return $http.post('rest/sharing/unshare.php', data);
        };

        sharing.isOwner = function(sharable, remoteUserId) {
            if (sharable.type != "remote" || angular.isUndefined(sharable._internal.owner)) {
                return false;
            }
            return angular.isDefined(remoteUserId) && (remoteUserId == sharable._internal.owner['$id']);
        };

        return sharing;
    }]);
