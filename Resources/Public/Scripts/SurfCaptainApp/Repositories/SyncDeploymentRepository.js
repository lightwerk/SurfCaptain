/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('SyncDeploymentRepository', SyncDeploymentRepository);

    /* @ngInject */
    function SyncDeploymentRepository(RequestService) {

        var deploymentRepository = {
                'create': addSync
            },
            url = '/api/syncDeployment';

        /**
         * @param {object} sync
         * @return {Q.promise|promise}
         */
        function addSync(sync) {
            return RequestService.postRequest(sync, url);
        }

        // Public API
        return {
            create: function (sync) {
                return deploymentRepository.create(sync);
            }
        };
    }
}());