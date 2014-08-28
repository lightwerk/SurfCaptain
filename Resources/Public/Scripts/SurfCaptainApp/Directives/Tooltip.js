/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('tooltip', function () {
    return function (scope, element, attributes) {
        element.tooltip();
    };
});