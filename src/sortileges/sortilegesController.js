angular.module('ZoumProfiler')
    .directive('sortileges', function() {
        return {
            restrict: 'E',
            templateUrl: 'sortileges/sortileges.html'
        };
    })
    .controller('SortilegesController', ['$scope', 'base', function ($scope, base) {

        $scope.sortsByType = {};  // { "Combat" : [{vampi}, {fp}] }

        angular.forEach(Object.keys(base.sortsMap), function (sortId) {
            var sort = base.sortsMap[sortId];
            if (!sort.reservedFor) {
                var sortType = sort.type;
                if (angular.isUndefined($scope.sortsByType[sortType])) {
                    $scope.sortsByType[sortType] = [];
                }
                $scope.sortsByType[sortType].push(sort);
            }
        });

        $scope.checkSortLevel = function(sort) {
            if($scope.profile.sorts[sort.id] === true) {
                var sort1 = base.sortsMap[sort.id];
                while(sort1.requires) {
                    $scope.profile.sorts[sort1.requires] = true;
                    sort1 = base.sortsMap[sort1.requires];
                }
            } else if($scope.profile.sorts[sort.id] === false) {
                delete $scope.profile.sorts[sort.id];
                var sort2 = base.sortsMap[sort.id];
                while(sort2.requiredFor) {
                    $scope.profile.sorts[sort2.requiredFor] = false;
                    delete $scope.profile.sorts[sort2.requiredFor];
                    sort2 = base.sortsMap[sort2.requiredFor];
                }
            }
            $scope._refreshComputed();
        };

    }]);


