angular.module('ZoumProfiler')
    .factory('profiling', ['base', function (base) {
        var profiling = {};

        profiling._min = function (race, carac) {
            if (angular.isDefined(carac['min' + race])) {
                return carac['min' + race];
            } else {
                return carac.min;
            }
        };

        profiling._checkCaracMin = function (profile) {
            if (angular.isUndefined(profile.caracs)) {
                profile.caracs = {};
            }
            angular.forEach(base.caracs, function (carac) {
                if (angular.isUndefined(profile.caracs[carac.id])) {
                    if (carac.id == 'TOUR') {
                        profile.caracs[carac.id] = carac.max;
                    } else {
                        profile.caracs[carac.id] = profiling._min(profile.race, carac);
                    }
                } else {
                    if (carac.id == 'TOUR') {
                        profile.caracs[carac.id] = Math.min(profile.caracs[carac.id], carac.max);
                    } else {
                        profile.caracs[carac.id] = Math.max(profile.caracs[carac.id], profiling._min(profile.race, carac));
                    }
                }
            });
        };

        profiling._checkBonus = function (profile) {
            angular.forEach(base.caracs, function (carac) {
                if (!profile.bp) {
                    profile.bp = {};
                }
                if (!profile.bm) {
                    profile.bm = {};
                }
                if (!profile.bp[carac.id]) {
                    profile.bp[carac.id] = 0;
                }
                if (!profile.bm[carac.id]) {
                    profile.bm[carac.id] = 0;
                }
            });
        };

        return profiling;
    }]);
