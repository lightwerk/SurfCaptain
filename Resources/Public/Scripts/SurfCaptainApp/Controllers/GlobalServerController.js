/*jslint node: true, plusplus:true */
/*global surfCaptain, angular*/

'use strict';
surfCaptain.controller('GlobalServerController', [
    '$scope',
    'ServerRepository',
    'PresetService',
    'FlashMessageService',
    'SEVERITY',
    function ($scope, ServerRepository, PresetService, FlashMessageService, SEVERITY) {

        $scope.contexts = [
            'Production', 'Development', 'Staging'
        ];
        $scope.newPreset = PresetService.getNewPreset();
        $scope.finished = false;
        $scope.messages = [];

        /**
         * @return {void}
         */
        $scope.getAllServers = function () {
            ServerRepository.getServers('').then(
                function (response) {
                    $scope.finished = true;
                    $scope.servers = response.presets;
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
            ServerRepository.addServer(server).then(
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
            $scope.getAllServers();
        };
        this.init();
    }
]);