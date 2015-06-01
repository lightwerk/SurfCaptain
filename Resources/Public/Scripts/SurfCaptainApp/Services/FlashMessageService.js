/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('FlashMessageService', FlashMessageService);

    /* @ngInject */
    function FlashMessageService(toaster) {

        var self = this;

        /**
         * We check for an Exception message within data first.
         *
         * @param {Object} response
         * @param {string} title
         * @param {string} defaultMessage
         * @return {void}
         */
        this.addErrorFlashMessageFromResponse = function (response, title, defaultMessage) {
            var message = defaultMessage;
            if (angular.isDefined(response.flashMessages) && angular.isArray(response.flashMessages)) {
                message = '';
                angular.forEach(response.flashMessages, function (flashMessage) {
                    message += flashMessage.message + ' ';
                });
            }
            self.addErrorFlashMessage(title, message);
        };

        this.addErrorFlashMessage = function (title, message) {
            self.addFlashMessage('error', title, message);
        };

        /**
         * @param {string} title
         * @param {string} message
         * @return {void}
         */
        this.addSuccessFlashMessage = function (title, message) {
            self.addFlashMessage('success',title, message);
        };

        /**
         * @param {string} title
         * @param {string} message
         * @return {void}
         */
        this.addInfoFlashMessage = function (title, message) {
            self.addFlashMessage('note', title, message);
        };

        /**
         * @param {string} severity
         * @param {string} title
         * @param {string} message
         * @return {void}
         */
        this.addFlashMessage = function (severity, title, message) {
            toaster.pop(severity, title, message);
        };
    }
}());
