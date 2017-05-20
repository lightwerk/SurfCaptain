/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ExtensionsController', ExtensionsController);

    /* @ngInject */
    function ExtensionsController($scope, ExtensionRepository, FlashMessageService) {

        activate();

        function activate() {
            ExtensionRepository.getExtensions().then(
                function (response) {
                    $scope.extensions = response.extensions;
                },
                function (response) {
                    FlashMessageService.addErrorFlashMessageFromResponse(
                        response,
                        'Error!',
                        'Something went wrong.'
                    );
                }
            );
        }
    }
}());