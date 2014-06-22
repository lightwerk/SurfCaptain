/*jslint browser: true*/


surfCaptain.directive('appVersion', ['version', function (version) {
        return function (scope, element, attributes) {
            element.text(version);
        };
}]);