/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('AbstractApplicationController', AbstractApplicationController);

    /* @ngInject */
    function AbstractApplicationController($scope, PresetService) {

        /**
         * @param {string} context
         * @returns {string}
         */
        $scope.getRootContext = function (context) {
            return PresetService.getRootContext(context, $scope.contexts);
        };
    }
}());