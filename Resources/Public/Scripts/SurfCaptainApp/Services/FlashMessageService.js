/*jslint node: true, plusplus: true */
/*global surfCaptain, angular*/

'use strict';

surfCaptain.service('FlashMessageService', function () {

    var messages = [];

    /**
     *
     * @param {string} title
     * @param {string} message
     * @param {integer} severity
     * @param {string} id
     * @return {Array}
     */
    this.addFlashMessage = function (title, message, severity, id) {
        messages.push({
            title: title || '',
            message: message || '',
            severity: severity,
            time: new Date(),
            id: id
        });
        return messages;
    };

    /**
     * @return {Array}
     */
    this.getFlashMessages = function () {
        return messages;
    };

    /**
     * Resets the messages to an empty Array
     *
     * @return {void}
     */
    this.flush = function () {
        messages = [];
    };

});