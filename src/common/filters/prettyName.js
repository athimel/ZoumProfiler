angular.module('zoumProfilerApp')
    .filter('prettyName', function() {
        return function(profile) {
            var result = profile.name;
            if (angular.isDefined(profile.profile)) {
                result += " (" + profile.profile + ")";
            }
            return result;
        };
    });
