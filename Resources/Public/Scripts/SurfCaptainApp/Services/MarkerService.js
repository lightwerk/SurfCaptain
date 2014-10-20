/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('MarkerService', MarkerService);

    /* @ngInject */
    function MarkerService() {
        var localStorage = [],

            clearLocalStorage = function () {
                localStorage = [];
            },

            addToLocalStorage = function (ind, marker) {
                localStorage.push([ind, marker]);
            },

            applyLocalStorage = function (string) {
                var length = localStorage.length, index, marker, i = length - 1;
                if (length) {
                    for (i; i >= 0; i--) {
                        index = localStorage[i][0];
                        marker = localStorage[i][1];
                        string = string.slice(0, index) + marker + string.slice(index);
                    }
                }
                clearLocalStorage();
                return string;
            };

        /**
         *
         * @param {string} string
         * @returns {null|string}
         */
        this.getFirstMarker = function (string) {
            var marker;
            if (typeof string !== 'string') {
                return null;
            }
            marker = string.match(new RegExp('([{]{2,2})([A-Za-z0-9]*)([}]{2,2})'));
            if (marker === null) {
                return null;
            }
            return marker[0];
        };

        /**
         * Replaces markers in strings. Only substrings inside
         * double curly braces are replaced.
         *
         * @param {string} string
         * @param {object} configuration
         * @returns {string}
         */
        this.replaceMarkers = function (string, configuration) {
            var marker, replacement;

            if (angular.isUndefined(configuration)) {
                return string;
            }

            marker = this.getFirstMarker(string);

            switch (marker) {
                case null:
                    string = applyLocalStorage(string);
                    return string;

                // These cases expect a property name in the
                // configuration to be replaced with.
                case '{{project}}':
                case '{{projectName}}':
                case '{{projectname}}':
                    if (angular.isDefined(configuration.name)) {
                        replacement = configuration.name;
                    } else {
                        addToLocalStorage(string.indexOf(marker), marker);
                        replacement = '';
                    }
                    break;
                case '{{suffix}}':
                    if (angular.isDefined(configuration.suffix)) {
                        replacement = configuration.suffix;
                    } else {
                        addToLocalStorage(string.indexOf(marker), marker);
                        replacement = '';
                    }
                    break;
                // Found an unknown marker:
                // Remove it but store it to put it back there in the end.
                default:
                    addToLocalStorage(string.indexOf(marker), marker);
                    replacement = '';
                    break;
            }
            string = string.replace(marker, replacement);
            string = this.replaceMarkers(string, configuration);
            return string;
        };

        /**
         *
         * @param {string} string
         * @return {string}
         */
        this.getStringBeforeFirstMarker = function (string) {
            var index;
            if (typeof string !== 'string') {
                return '';
            }
            index = string.indexOf(this.getFirstMarker(string));
            if (index === -1) {
                return string;
            }
            return string.substring(0, index);
        };

        /**
         * @param {string} string
         * @returns {boolean}
         */
        this.containsMarker = function (string) {
            return this.getFirstMarker(string) !== null;
        };
    }
}());