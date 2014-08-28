/*global surfCaptain,angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('tab', function () {
    return function (scope, element, attributes) {
        element.bind('click', function (e) {
            e.preventDefault();
            angular.element(this).tab('show');
        });
    };
});