/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('spinner', spinner);

    /* @ngInject */
    function spinner() {
        return {
            restrict: 'E',
            template: '<i class="fa fa-spinner fa-spin fa-4x"></i>'
        };
    }
}());