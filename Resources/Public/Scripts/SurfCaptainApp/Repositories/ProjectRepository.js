/*jslint browser: true*/
'use strict'

surfCaptain.factory('ProjectRepository', [ '$http', '$q', function ($http, $q) {
    var projectRepository = {},
        projects = {},
        url = 'Scripts/SurfCaptainApp/ExampleData/projects.json';

    /**
     *
     * @returns {Promise} – promise object
     */
    projectRepository.getProjects = function () {
        var deferred = $q.defer();
        $http.get(url, {cache: true}).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Returns a single project from a collection ob projects
     *
     * @param projects {object}
     * @param name {string}
     * @returns {object}
     */
    projectRepository.getProjectByName = function (projects, name) {
        var length,
            i = 0;
        length = projects.length;
        if (length) {
            for (i; i < length; i++) {
                if (projects[i]['name'] === name) {
                    return projects[i];
                }
            }
        }
    };

    return projectRepository;
}]);