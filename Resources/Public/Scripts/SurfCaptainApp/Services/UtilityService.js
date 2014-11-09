/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('UtilityService', UtilityService);

    /* @ngInject */
    function UtilityService($filter) {

        /**
         * Searches within an Array of commits for a commit with a certain name
         * to return information about the commit, containing
         *   * Whether it was a Tag, a Branch or a standalone commit (sha1)
         *   * Name of the committer
         *   * Commit message
         *
         * @param {string} name
         * @param {Array} commits
         * @returns {string}
         */
        this.getDeployedTag = function (name, commits) {
            var length = commits.length,
                i = 0,
                commit;
            // Search for a commit named after the server
            for (i; i < length; i++) {
                if (commits[i].name === 'server-' + name) {
                    commit = commits[i].commit;
                    break;
                }
            }
            // If non was found we cant tell whats currently deployed
            if (angular.isUndefined(commit)) {
                return 'No deployed commit found.';
            }
            // If there was a commit found, we look if it matches a specific tag or branch and return the information
            for (i = 0; i < length; i++) {
                if (commits[i].commit.id === commit.id && commits[i].name !== 'server-' + name) {
                    return commits[i].type + ' ' + commits[i].name + ' - ' + commit.committerName + ': "' + commit.message + '"';
                }
            }
            // If no tag or branch matched the commit, we can at least
            // return the sha1 of the commit along with the information
            return 'sha1: ' + $filter('limitTo')(commit.id, 8) + ' - ' + commit.committerName + ': "' + commit.message + '"';
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
            if (angular.isUndefined(a.commit) ||
                angular.isUndefined(b.commit) ||
                angular.isUndefined(a.commit.date) ||
                angular.isUndefined(b.commit.date)
            ) {
                return -1;
            }
            if (a.commit.date < b.commit.date) {
                return 1;
            }
            return -1;
        };
    }
}());
