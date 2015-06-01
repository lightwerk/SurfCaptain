/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('GlobalServerController', GlobalServerController);

    /* @ngInject */
    function GlobalServerController($scope, PresetRepository, PresetService, FlashMessageService, SettingsRepository) {
        var self = this;

        // properties of vm
        $scope.newPreset = PresetService.getNewPreset();
        $scope.finished = false;
        $scope.messages = [];
        $scope.serverNames = [];

        // methods published to the view
        $scope.getAllServers = getAllServers;
        $scope.addServer = addServer;

        // internal methods
        this.setServerNames = setServerNames;
        this.getSettings = getSettings;

        init();

        /**
         * @return void
         */
        function setServerNames() {
            var property;
            $scope.serverNames = [];
            for (property in $scope.servers) {
                if ($scope.servers.hasOwnProperty(property)) {
                    $scope.serverNames.push(property);
                }
            }
        }

        /**
         * @return {void}
         */
         function getSettings() {
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = '';
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
                    }
                }
            );
        }

        /**
         * @return {void}
         */
        function getAllServers() {
            PresetRepository.getGlobalServers('').then(
                function (response) {
                    $scope.finished = true;
                    $scope.servers = response.presets;
                    self.setServerNames();
                    if ($scope.servers.length === 0) {
                        FlashMessageService.addInfoFlashMessage(
                            'FYI!',
                            'There are no servers yet. Why dont you create one, hmm?'
                        );
                    }
                },
                function (response) {
                    $scope.finished = true;
                    FlashMessageService.addErrorFlashMessageFromResponse(
                        response,
                        'Request failed!',
                        'The global servers could not be received. Please try again later.'
                    );
                }
            );
        }

        /**
         *
         * @param {object} server
         * @return {void}
         */
        function addServer(server) {
            $scope.finished = false;
            PresetRepository.addServer(server).then(
                function () {
                    $scope.newPreset = PresetService.getNewPreset();
                    $scope.newServerForm.$setPristine();
                    $scope.getAllServers();
                    FlashMessageService.addSuccessFlashMessage(
                        'Server created!',
                        'The Server ' + server.nodes[0].name + ' was successfully created.'
                    );
                },
                function (response) {
                    $scope.finished = true;
                    FlashMessageService.addErrorFlashMessageFromResponse(
                        response,
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.'
                    );
                }
            );
        }

        /**
         * Initializes the GlobalServerController
         *
         * @return {void}
         */
        function init() {
            self.getSettings();
            $scope.getAllServers();
        }
    }
}());