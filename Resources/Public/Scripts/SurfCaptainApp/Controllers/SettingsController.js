/* global angular */
(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController($scope, SettingsRepository, FlashMessageService) {

        activate();

        function activate() {
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.settings = response;
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