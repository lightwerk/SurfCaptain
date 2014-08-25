/*jslint node: true */
/*global surfCaptain*/

'use strict';

surfCaptain.service('ValidationService', function () {

    /**
     * Validates if a given string has at least the length of the given
     * minLength. A third parameter is an optional string to be returned
     * on validation failure.
     *
     * @param {string} value
     * @param {integer} minLength
     * @param {string} message
     * @returns {string|boolean}
     */
    this.hasLength = function (value, minLength, message) {
        if (value.length >= minLength) {
            return true;
        }
        return message || false;
    };

    /**
     * Validates if a given string ends with a given character
     * A third parameter is an optional string to be returned
     * on validation failure.
     *
     * @param {string} value
     * @param {string} character
     * @param {string} message
     * @returns {string|boolean}
     */
    this.doesLastCharacterMatch = function (value, character, message) {
        if (value.charAt(value.length - 1) === character) {
            return true;
        }
        return message || false;
    };

    /**
     * Validates if a given Item is found within a given array.
     *
     * @param {array} array
     * @param {mixed} item
     * @param {string} message
     * @returns {string|boolean}
     */
    this.doesArrayContainItem = function (array, item, message) {
        if (array instanceof Array && array.indexOf(item) > -1) {
            return true;
        }
        return message || false;
    };

    /**
     * Validates if a given Substring is found within a given string.
     *
     * @param {string} string
     * @param {string} substring
     * @param {string} message
     * @returns {string|boolean}
     */
    this.doesStringContainSubstring = function (string, substring, message) {
        if (typeof string === 'string' && string.indexOf(substring) !== -1) {
            return true;
        }
        return message || false;
    };

    /**
     * Validates if a given Substring is found within a given string.
     *
     * @param {string} string
     * @param {string} substring
     * @param {string} message
     * @returns {string|boolean}
     */
    this.doesStringStartWithSubstring = function (string, substring, message) {
        if (typeof string === 'string' && string.indexOf(substring) === 0) {
            return true;
        }
        return message || false;
    };
});