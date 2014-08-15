/*jslint node: true */
/*global surfCaptain*/

'use strict';

surfCaptain.service('MarkerService', function () {

    /**
     * Replaces markers in strings. Only substrings inside
     * double curly braces are replaced. 
     *
     * @param {string} string
     * @param {object} project
     * @returns {string}
     */
    var replaceMarkers = function (string, project) {
        var marker = string.match(new RegExp('([{]{2,2})([A-Za-z0-9]*)([}]{2,2})'));

        switch (marker[0]) {
        case '{{project}}':
        case '{{projectName}}':
        case '{{projectname}}':
            string = string.replace(marker[0], project.name);
            string = replaceMarkers(string, project);
            break;
        }
        return string;
    };

    this.replaceMarkers = replaceMarkers;
});