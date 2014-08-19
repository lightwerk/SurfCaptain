/*jslint node: true */
/*global surfCaptain*/

'use strict';

surfCaptain.factory('GitRepository', [ '$http', '$q', function ($http, $q) {
    var gitRepository = {},
        tagUrl = '/api/tags?projectId=',
        branchUrl = '/api/branches?projectId=';

    /**
     *
     * @param {string} projectId
     * @returns {Q.promise|promise} – promise object
     */
    gitRepository.getTagsByProjectId = function (projectId) {
        var deferred = $q.defer();
        $http.get(tagUrl + projectId).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     *
     * @param {string} projectId
     * @returns {Q.promise|promise} – promise object
     */
    gitRepository.getBranchesByProjectId = function (projectId) {
        var deferred = $q.defer();
        $http.get(branchUrl + projectId).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    return gitRepository;
}]);