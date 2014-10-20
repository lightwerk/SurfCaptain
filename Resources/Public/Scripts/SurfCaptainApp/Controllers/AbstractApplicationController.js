/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('AbstractApplicationController', AbstractApplicationController);

    /* @ngInject */
    function AbstractApplicationController($scope, PresetService) {

        // methods published to the view
        $scope.getRootContext = getRootContext;

        /**
         * @param {string} context
         * @returns {string}
         */
        function getRootContext(context) {
            return PresetService.getRootContext(context, $scope.contexts);
        }
    }
}());