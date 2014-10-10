/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('UtilityService', UtilityService);

    /* @ngInject */
    function UtilityService() {

        /**
         *
         * @param {string} name
         * @param {array} tags
         * @returns {string}
         */
        this.getDeployedTag = function (name, tags) {
            var length = tags.length,
                i = 0,
                commit;
            for (i; i < length; i++) {
                if (tags[i].name === 'server-' + name) {
                    commit = tags[i].commit;
                }
            }
            if (angular.isUndefined(commit)) {
                return 'No deployed tag found.';
            }
            i = 0;
            for (i; i < length; i++) {
                if (tags[i].commit.id === commit.id && tags[i].name !== 'server-' + name) {
                    return tags[i].type + ' ' + tags[i].name + ' - ' + commit.committerName + ': "' + commit.message + '"';
                }
            }
            return commit.id + ' - ' + commit.committerName + ': "' + commit.message + '"';
        };

        /**
         * Sort function to show most recent commits at the
         * start of the array. Use this as compareFunction
         * in an array.sort().
         *
         * @param {object} a
         * @param {object} b
         * @returns {number}
         */
        this.byCommitDate = function (a, b) {
            if (a.commit.date < b.commit.date) {
                return 1;
            }
            return -1;
        };
    }
}());
