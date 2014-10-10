/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('appVersion', appVersion);

    /* @ngInject */
    function appVersion(version) {
        return function (scope, element) {
            element.text(version);
        };
    }
}());