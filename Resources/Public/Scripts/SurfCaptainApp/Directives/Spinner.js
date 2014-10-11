/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('spinner', spinner);

    /* @ngInject */
    function spinner() {
        // scope, element, attrs are passed to the linker function but not needed here
        function linker() {}

        return {
            restrict: 'E',
            template: '<i class="fa fa-spinner fa-spin fa-4x"></i>',
            link: linker
        };
    }
}());