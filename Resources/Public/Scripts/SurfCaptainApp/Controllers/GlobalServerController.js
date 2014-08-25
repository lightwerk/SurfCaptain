/*jslint node: true, plusplus:true */
/*global surfCaptain, angular*/

'use strict';
surfCaptain.controller('GlobalServerController', [
    '$scope',
    'PresetRepository',
    'PresetService',
    'FlashMessageService',
    'SEVERITY',
    'SettingsRepository',
    function ($scope, PresetRepository, PresetService, FlashMessageService, SEVERITY, SettingsRepository) {
        var self = this;

        $scope.newPreset = PresetService.getNewPreset();
        $scope.finished = false;
        $scope.messages = [];
        $scope.serverNames = [];

        /**
         * @return void
         */
        this.setServerNames = function () {
            var property;
            for (property in $scope.servers) {
                if ($scope.servers.hasOwnProperty(property)) {
                    $scope.serverNames.push(property);
                }
            }
        };

        /**
         * @return {void}
         */
        this.getSettings = function () {
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = '';
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
                    }
                }
            );
        };

        /**
         * @return {void}
         */
        $scope.getAllServers = function () {
            PresetRepository.getGlobalServers('').then(
                function (response) {
                    $scope.finished = true;
                    $scope.servers = response.presets;
                    self.setServerNames();
                    if ($scope.servers.length === 0) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'FYI!',
                            'There are no servers yet. Why dont you create one, hmm?',
                            SEVERITY.info,
                            'global-server-request-no-results'
                        );
                    }
                },
                function (response) {
                    $scope.finished = true;
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Request failed!',
                        'The global servers could not be received. Please try again later..',
                        SEVERITY.error,
                        'global-server-request-failed'
                    );
                }
            );
        };

        /**
         *
         * @param {object} server
         * @return {void}
         */
        $scope.addServer = function (server) {
            $scope.finished = false;
            PresetRepository.addServer(server).then(
                function (response) {
                    $scope.newPreset = PresetService.getNewPreset();
                    $scope.newServerForm.$setPristine();
                    $scope.getAllServers();
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Server created!',
                        'The Server ' + server.nodes[0].name + ' was successfully created.',
                        SEVERITY.ok
                    );
                },
                function (response) {
                    $scope.finished = true;
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.',
                        SEVERITY.error
                    );
                }
            );
        };

        /**
         * Initializes the GlobalServerController
         *
         * @return {void}
         */
        this.init = function () {
            self.getSettings();
            $scope.getAllServers();
        };
        this.init();
    }
]);