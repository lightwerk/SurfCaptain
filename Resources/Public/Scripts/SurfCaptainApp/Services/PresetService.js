/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('PresetService', PresetService);

    /* @ngInject */
    function PresetService(SettingsRepository, ValidationService) {

        var newPreset = {
                'options': {
                    'repositoryUrl': '',
                    'deploymentPath': '',
                    'context': ''
                },
                'nodes': [
                    {
                        'name': '',
                        'hostname': '',
                        'username': ''
                    }
                ]
            },
            self = this;

        this.contexts = [];

        /**
         * @return {void}
         */
        this.setContexts = function () {
            if (self.contexts.length === 0) {
                SettingsRepository.getSettings().then(
                    function (response) {
                        self.contexts = [];
                        if (angular.isDefined(response.contexts)) {
                            self.contexts = response.contexts.split(',');
                        }
                    }
                );
            }
        };


        /**
         * A new preset skeleton is returned with options from an optional
         * passed configuration object (like frontendSettings). Used
         * properties in configuration are:
         *
         *  - defaultUser (Sets the Username in the first Node)
         *  - defaultDeploymentPath (Sets the deploymentPath in the options.
         *    Markers have to be replaced later on!)
         *
         * @param {object} configuration - optional
         * @returns {object}}
         */
        this.getNewPreset = function (configuration) {
            var preset = angular.copy(newPreset);
            if (angular.isDefined(configuration)) {
                if (angular.isDefined(configuration.defaultUser)) {
                    preset.nodes[0].username = configuration.defaultUser;
                }
                if (angular.isDefined(configuration.defaultDeploymentPath)) {
                    preset.options.deploymentPath = configuration.defaultDeploymentPath;
                }
            }
            return preset;
        };

        /**
         * @param {string} context
         * @param {array} contexts
         * @returns {string}
         */
        this.getRootContext = function (context, contexts) {
            this.setContexts();
            var i = 0,
                length = contexts.length;
            for (i; i < length; i++) {
                if (ValidationService.doesStringStartWithSubstring(context, contexts[i])) {
                    return contexts[i];
                }
            }
            return 'unknown-context';
        };

        /**
         * @param {object} preset
         * @returns {boolean}
         */
        this.isPresetGlobal = function (preset) {
            if (angular.isUndefined(preset.applications) || !angular.isArray(preset.applications)) {
                return false;
            }
            if (preset.applications.length === 0) {
                return false;
            }
            if (angular.isUndefined(preset.applications[0].options)) {
                return false;
            }
            return angular.isUndefined(preset.applications[0].options.repositoryUrl) || preset.applications[0].options.repositoryUrl === '';
        };
    }
}());