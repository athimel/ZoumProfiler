angular.module('zoumProfilerApp')
    .directive('competences', function() {
        return {
            restrict: 'E',
            templateUrl: 'competences/competences.html'
        };
    })
    .controller('CompetencesController', ['$scope', 'base', function ($scope, base) {

        $scope.compsByType = {};  // { "Combat" : [{cdb1}, {cdb2}] }

        angular.forEach(Object.keys(base.compsMap), function (compId) {
            var comp = base.compsMap[compId];
            if (!comp.reservedFor) {
                var compType = comp.type;
                if (angular.isUndefined($scope.compsByType[compType])) {
                    $scope.compsByType[compType] = [];
                }
                $scope.compsByType[compType].push(comp);
            }
        });

        $scope.checkCompLevel = function(comp) {
            if($scope.profile.comps[comp.id] === true) {
                var comp1 = base.compsMap[comp.id];
                while(comp1.requires) {
                    $scope.profile.comps[comp1.requires] = true;
                    comp1 = base.compsMap[comp1.requires];
                }
            } else if($scope.profile.comps[comp.id] === false) {
                delete $scope.profile.comps[comp.id];
                var comp2 = base.compsMap[comp.id];
                while(comp2.requiredFor) {
                    $scope.profile.comps[comp2.requiredFor] = false;
                    delete $scope.profile.comps[comp2.requiredFor];
                    comp2 = base.compsMap[comp2.requiredFor];
                }
            }
            $scope.refreshComputed();
        };

    }]);


