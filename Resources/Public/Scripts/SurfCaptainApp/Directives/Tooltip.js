/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('tooltip', tooltip);

    /* @ngInject */
    function tooltip() {
        return function (scope, element) {
            element.tooltip();
        };
    }
}());