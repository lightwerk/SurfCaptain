/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';

surfCaptain.factory('DeploymentRepository', [ '$http', '$q', '$cacheFactory', function ($http, $q, $cacheFactory) {

    var deploymentRepository = {},
        url = '/api/deployment';

    $cacheFactory('deploymentCache');

    /**
     * @param {object} deployment
     * @return {Q.promise|promise}
     */
    deploymentRepository.addDeployment = function (deployment) {
        var deploymentContainer = {
            "configuration": {}
        },
            deferred = $q.defer();
        deploymentContainer.configuration = deployment;

        $http({
            method: 'POST',
            url: url,
            data: {
                deployment: deploymentContainer
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * @returns {promise|Q.promise}
     */
    deploymentRepository.getDeployments = function () {
        var deferred = $q.defer();
        $http.get(url).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * @param {string} identifier
     */
    deploymentRepository.getSingleDeployment = function (identifier) {
        var deferred = $q.defer();
        if (angular.isDefined($cacheFactory.get('deploymentCache').get(identifier))) {
            deferred.resolve({deployment: $cacheFactory.get('deploymentCache').get(identifier)});
            return deferred.promise;
        }
        $http.get(url + '?deployment=' + identifier).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    // Public API
    return {
        addDeployment: function (deployment) {
            return deploymentRepository.addDeployment(deployment);
        },
        cancelDeployment: function () {
            //TODO
        },
        getAllDeployments: function () {
            return deploymentRepository.getDeployments();
        },
        getSingleDeployment: function (identifier) {
            return deploymentRepository.getSingleDeployment(identifier);
        }
    };
}]);