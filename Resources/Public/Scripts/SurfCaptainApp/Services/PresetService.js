/*jslint node: true */
/*global surfCaptain, angular*/

'use strict';

angular.module('surfCaptain').service('PresetService', [function () {

    var newPreset = {
        "options": {
            "repositoryUrl": '',
            "deploymentPath": '',
            "context": ''
        },
        "nodes": [
            {
                "name": '',
                "hostname": '',
                "username": ''
            }
        ]
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
}]);