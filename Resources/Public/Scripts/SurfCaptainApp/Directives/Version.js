/*global surfCaptain*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('appVersion', ['version', function (version) {
    return function (scope, element, attributes) {
        element.text(version);
    };
}]);