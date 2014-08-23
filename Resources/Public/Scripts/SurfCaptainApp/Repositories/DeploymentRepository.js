/*global surfCaptain*/
/*jslint node: true */

'use strict';

surfCaptain.factory('DeploymentRepository', [ '$http', '$q', function ($http, $q) {

    var deploymentRepository = {},
        url = '/api/deployment';

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
        getSingleDeployment: function () {
            //TODO
        }
    };
}]);