/*jslint browser: true*/
'use strict';
surfCaptain.directive('tooltip', function () {
        return function (scope, element, attributes) {
            element.tooltip();
        };
});