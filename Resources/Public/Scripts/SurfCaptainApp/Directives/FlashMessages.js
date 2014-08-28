/*global surfCaptain, angular*/
/*jslint node: true, plusplus: true */

'use strict';
angular.module('surfCaptain').directive('flashMessages', ['SEVERITY', 'FlashMessageService', function (SEVERITY, FlashMessageService) {
    var linker = function (scope, element, attrs) {

        /**
         *
         * @param {string} severity
         * @returns {string}
         */
        var getSeverityClass = function (severity) {
            switch (severity) {
            case SEVERITY.ok:
                return 'ok';
            case SEVERITY.info:
                return 'info';
            case SEVERITY.warning:
                return 'warning';
            case SEVERITY.error:
                return 'error';
            default:
                return 'info';
            }
        },
            getTimeString = function (time) {
                if (time instanceof Date) {
                    return 'Time: ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
                }
                return '';
            },

            /**
             *
             * @returns {string}
             */
            generateFlashMessage = function (message, id) {
                return '<div class="flash-message" id="'
                    + id
                    + '">'
                    + '<div class="flash-message-title '
                    + getSeverityClass(message.severity)
                    + '">'
                    + message.title
                    + '<span class="close" onclick="angular.element(this).parent().parent().remove()">&times;</span>'
                    + '</div>'
                    + '<div class="flash-message-message">'
                    + message.message
                    + '</div>'
                    + '<div class="flash-message-footer">'
                    + '<span class="time">'
                    + getTimeString(message.time)
                    + '</span>'
                    + '</div>';
            };

        scope.$watchCollection(attrs.messages, function (messages) {
            var length, i = 0, html = '', message, id;
            if (angular.isDefined(messages)) {
                length = messages.length;
            } else {
                return;
            }
            if (length) {
                for (i; i < length; i++) {
                    message = messages[i];
                    id = '';
                    if (angular.isDefined(message.id)) {
                        id = message.id;
                        if (angular.element('#' + id).length) {
                            html += '';
                        } else {
                            html += generateFlashMessage(message, id);
                        }
                    } else {
                        html += generateFlashMessage(message, id);
                    }
                }
                angular.element('.flash-messages-container').append(html);
                FlashMessageService.flush();
            }
        });
    };

    return {
        restrict: 'E',
        scope: {
            messages: '='
        },
        link: linker
    };
}]);