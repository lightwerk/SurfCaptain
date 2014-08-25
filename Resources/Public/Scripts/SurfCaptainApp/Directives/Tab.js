/*global surfCaptain,angular*/
/*jslint node: true */

'use strict';
surfCaptain.directive('tab', function () {
    return function (scope, element, attributes) {
        element.bind('click', function (e) {
            e.preventDefault();
            angular.element(this).tab('show');
        });
    };
});