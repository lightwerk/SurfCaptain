/*jslint plusplus: true */
/*jslint node: true */
/*global surfCaptain, angular*/

'use strict';

angular.module('surfCaptain').factory('ProjectRepository', [ '$http', '$q', '$cacheFactory', function ($http, $q, $cacheFactory) {
    var projectRepository = {},
        url = '/api/repository',
        projectCache = $cacheFactory('projectCache'),
        projectsCache = $cacheFactory('projectsCache'),
        repositoryCache = $cacheFactory('repositoryCache');

    function ProjectRepositoryException(message) {
        this.name = 'ProjectRepositoryException';
        this.message = message;
    }
    ProjectRepositoryException.prototype = new Error();
    ProjectRepositoryException.prototype.constructor = ProjectRepositoryException;

    /**
     * Loops trough a collection of projects and
     * stores each one in angulars cache.
     *
     * @param {array} projects
     * @returns {void}
     */
    projectRepository.populateSingleProjectCache = function (projects) {
        var length = angular.isDefined(projects) ? projects.length : 0,
            i = 0;
        if (length) {
            for (i; i < length; i++) {
                projectCache.put(
                    projects[i].identifier,
                    projects[i]
                );
            }
        }
    };

    /**
     *
     * @returns {Q.promise|promise} – promise object
     */
    projectRepository.getProjects = function () {
        var deferred = $q.defer();
        if (angular.isDefined(projectsCache.get('allProjects'))) {
            deferred.resolve(projectsCache.get('allProjects'));
            return deferred.promise;
        }
        $http.get(url, {
            cache: true,
            headers: {'Accept': 'application/json'}
        }).success(
            function (data) {
                deferred.resolve(data.repositories);
                projectsCache.put('allProjects', data.repositories);
                projectRepository.populateSingleProjectCache(data.repositories);
            }
        ).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Returns a single project from a collection ob projects
     *
     * @param {string} name
     * @param {array} projects
     * @returns {object} a single project
     * @throws {ProjectRepositoryException}
     */
    projectRepository.getProjectByName = function (name, projects) {
        if (angular.isUndefined(projectCache.get(name))) {
            projectRepository.populateSingleProjectCache(projects);
        }
        projectCache = $cacheFactory.get('projectCache');
        if (angular.isUndefined(projectCache.get(name))) {
            throw new ProjectRepositoryException('Could not find project');
        }
        return projectCache.get(name);
    };

    /**
     * @param {string} repositoryUrl
     * @returns {promise|Q.promise}
     */
    projectRepository.getFullProjectByRepositoryUrl = function (repositoryUrl) {
        var deferred = $q.defer();
        if (angular.isDefined(repositoryCache.get(repositoryUrl))) {
            deferred.resolve(repositoryCache.get(repositoryUrl));
            projectRepository.updateFullProjectInCache(repositoryUrl);
        } else {
            $http.get(url + '?repositoryUrl=' + repositoryUrl)
                .success(
                    function (response) {
                        repositoryCache.put(repositoryUrl, response);
                        deferred.resolve(response);
                    }
                )
                .error(deferred.reject);
        }
        return deferred.promise;
    };

    /**
     * @param {string} repositoryUrl
     * @returns {promise|Q.promise}
     */
    projectRepository.getFullProjectByRepositoryUrlFromServer = function (repositoryUrl) {
        var deferred = $q.defer();
        $http.get(url + '?repositoryUrl=' + repositoryUrl)
            .success(
                function (response) {
                    repositoryCache.put(repositoryUrl, response);
                    deferred.resolve(response);
                }
            )
            .error(deferred.reject);
        return deferred.promise;
    };

    /**
     *
     * @param {string} repositoryUrl
     * @return {void}
     */
    projectRepository.updateFullProjectInCache = function (repositoryUrl) {
        $http.get(url + '?repositoryUrl=' + repositoryUrl).success(
            function (response) {
                repositoryCache.put(repositoryUrl, response);
            }
        );
    };

    // Public API
    return {
        getProjects: function () {
            return projectRepository.getProjects();
        },
        getProjectByName: function (name, projects) {
            return projectRepository.getProjectByName(name, projects);
        },
        getFullProjectByRepositoryUrl: function (repositoryUrl) {
            return projectRepository.getFullProjectByRepositoryUrl(repositoryUrl);
        },
        updateFullProjectInCache: function (repositoryUrl) {
            projectRepository.updateFullProjectInCache(repositoryUrl);
        },
        getFullProjectByRepositoryUrlFromServer: function (repositoryUrl) {
            return projectRepository.getFullProjectByRepositoryUrlFromServer(repositoryUrl);
        }
    };
}]);