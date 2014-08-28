/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
angular.module('surfCaptain').directive('modal', function () {
    return {
        scope: {
            modal: '@modal'
        },
        link: function (scope, element, attributes) {
            element.bind('click', function () {
                angular.element('.' + scope.modal).modal();
            });
        }
    };
});