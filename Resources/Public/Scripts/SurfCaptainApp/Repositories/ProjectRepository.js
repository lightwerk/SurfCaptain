/*jslint plusplus: true */
/*jslint node: true */
/*global surfCaptain*/

'use strict';

surfCaptain.factory('ProjectRepository', [ '$http', '$q', function ($http, $q) {
    var projectRepository = {},
        projects = {},
        url = 'Scripts/SurfCaptainApp/ExampleData/projects.json';

    function getProjects() {
        var deferred = $q.defer();
        $http.get(url, {cache: true}).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    }

    /**
     *
     * @returns {Promise} – promise object
     */
    projectRepository.getProjects = getProjects;

    /**
     * Returns a single project from a collection ob projects
     *
     * @param projects {object}
     * @param name {string}
     * @returns {object} a single project
     */
    projectRepository.getProjectByName = function (name, callback) {
        var length,
            i = 0,
            projects;
        getProjects().then(function (response) {
            projects = response.projects;
            length = projects.length;
            if (length) {
                for (i; i < length; i++) {
                    if (projects[i].name === name) {
                        callback(projects[i]);
                    }
                }
            }
        });
    };

    return projectRepository;
}]);