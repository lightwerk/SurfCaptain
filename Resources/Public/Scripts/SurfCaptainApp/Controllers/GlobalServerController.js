/*jslint node: true, plusplus:true */
/*global surfCaptain, angular*/

'use strict';
surfCaptain.controller('GlobalServerController', [
    '$scope',
    '$controller',
    'ServerRepository',
    'ValidationService',
    'SettingsRepository',
    'MarkerService',
    'PresetService',
    function ($scope, $controller, ServerRepository, ValidationService, SettingsRepository, MarkerService, PresetService) {

        $scope.contexts = [
            'Production', 'Development', 'Staging'
        ];
        $scope.newPreset = PresetService.getNewPreset();
        $scope.finished = false;

        /**
         * @return {void}
         */
        $scope.getAllServers = function () {
            ServerRepository.getServers('').then(
                function (response) {
                    $scope.finished = true;
                    $scope.servers = response.presets;
                }
            );
        };

        /**
         *
         * @param {object} server
         * @return {void}
         */
        $scope.addServer = function (server) {
            ServerRepository.addServer(server).then(
                function (response) {
                    // TODO Animation
                    $scope.newPreset = PresetService.getNewPreset();
                    $scope.newServerForm.$setPristine();
                    $scope.getAllServers();
                },
                function (response) {
                    // an error occurred
                }
            );
        };

        /**
         * Initializes the GlobalServerController
         *
         * @return {void}
         */
        this.init = function () {
            $scope.getAllServers();
        };
        this.init();
    }
]);