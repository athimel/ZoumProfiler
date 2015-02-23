angular.module('ZoumProfiler')
    .directive('share', function() {
        return {
            restrict: 'E',
            templateUrl: 'share/share.html'
        };
    })
    .controller('ShareController', ['$scope', 'sharing', function ($scope, sharing) {

        /* ********************************************* */
        /* **             Contextual data             ** */
        /* ********************************************* */

        $scope.shareContext = { show: false };

        /* ********************************************* */
        /* **          Controller's methods           ** */
        /* ********************************************* */

        $scope.startSharing = function () {
            $scope.shareContext.show = true;
            delete $scope.shareContext.user;
            delete $scope.shareContext.group;
        };

        $scope.submitShare = function () {
            sharing.share($scope.profile, $scope.shareContext.user, $scope.shareContext.group).then(function (result) {
                if (result.data.result == "SHARED") {
                    var share = {};
                    if ($scope.shareContext.user && $scope.shareContext.user.length > 0) {
                        share.user = {};
                        $scope.usersIndex[$scope.shareContext.user] = {login: $scope.shareContext.user}; // FIXME Vieux hack !
                        share.user['$id'] = $scope.shareContext.user;
                    }
                    if ($scope.shareContext.group && $scope.shareContext.group.length > 0) {
                        share.group = $scope.shareContext.group;
                    }
                    $scope.profile._internal.shares.push(share);
                    $scope.cancelShare();
                } else {
                    $scope._addErrorMessage("Échec : " + result.data.result);
                }
            });
        };

        $scope.cancelShare = function () {
            $scope.shareContext.show = false;
        };

        $scope.unshare = function (share) {
            sharing.unshare($scope.profile, share.user, share.group).then(function (result) {
                if (result.data.result == "UNSHARED") {
                    $scope.profile._internal.shares.splice($scope.profile._internal.shares.indexOf(share), 1);
                } else {
                    $scope._addErrorMessage("Échec : " + result.data.result);
                }
            });
        };

    }]);

