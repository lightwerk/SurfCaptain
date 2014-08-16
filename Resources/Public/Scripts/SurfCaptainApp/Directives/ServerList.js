/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('serverList', ['ServerRepository', 'ValidationService', function (ServerRepository, ValidationService) {
    var linker = function (scope, element, attrs) {

        /**
         * Stores a preset object in a scope variable
         *
         * @param {object} preset
         * @return void
         */
        scope.setCurrentPreset = function (preset) {
            scope.currentPreset = preset;
        };

        /**
         * Wrapper for ServerRepository.deleteServer(server)
         *
         * @param {object} server
         * @return void
         */
        scope.deleteServer = function (server) {
            // TODO Spinner
            ServerRepository.deleteServer(server).then(
                function (response) {
                    scope.$parent.getAllServers();
                },
                function (response) {
                    // an error occurred
                }
            );
        };

        /**
         * Wrapper for ServerRepository.updateServer(server)
         *
         * @param {object} server
         * @return void
         */
        scope.updateServer = function (server) {
            ServerRepository.updateServer(server);
        };

        /**
         * Validates the updated Host string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        scope.updateHost = function (data) {
            return ValidationService.hasLength(data, 1, 'Host must not be empty!');
        };

        /**
         * Validates the updated DocumentRoot string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        scope.updateDocumentRoot = function (data) {
            var res = ValidationService.hasLength(data, 1, 'DocumentRoot is required!');
            if (res === true) {
                return ValidationService.doesLastCharacterMatch(data, '/', 'DocumentRoot must end with "/"!');
            }
            return res;
        };

        /**
         * Validates the updated Username string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        scope.updateUsername = function (data) {
            return ValidationService.hasLength(data, 1, 'User must not be empty!');
        };

        /**
         * Validates the updated Context string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        scope.updateContext = function (data) {
            return ValidationService.doesArrayContainItem($scope.contexts, data, 'Context is not valid!');
        };

        scope.$watch('finished', function (finished) {
            console.log(finished);
        });

    };

    return {
        restrict: 'E',
        templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/ServerList.html',
        scope: {
            servers: '=',
            getAllServers: '&',
            finished: '='
        },
        link: linker
    };
}]);