/* global angular */
(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController($scope, SettingsRepository, toaster) {

        activate();

        function activate() {
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.settings = response;
                    console.log(response);
                },
                function () {
                    toaster.pop(
                        'error',
                        'Error!',
                        'Something went wrong'
                    );
                }
            );
        }
    }
}());