/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('FavorService', FavorService);

    /* @ngInject */
    function FavorService(cookieStore, ProjectRepository) {

        var self = this,
            init;

        /**
         * @param {string} project
         * @return {void}
         */
        this.addFavoriteProject = function (project) {
            var favoriteProjects = self.getFavoriteProjects(),
                length = favoriteProjects.length,
                i = 0;
            if (length) {
                for (i; i < length; i++) {
                    if (favoriteProjects[i].identifier === project.identifier) {
                        return;
                    }
                }
                if (length > 2) {
                    favoriteProjects = favoriteProjects.slice(1, 3);
                }
            }
            favoriteProjects.push(project);
            cookieStore.put('favoriteProjects', angular.toJson(favoriteProjects), {end: Infinity});
        };

        /**
         * @return {Array}
         */
        this.getFavoriteProjects = function () {
            var favoriteProjects = [];
            if (angular.isDefined(cookieStore.get('favoriteProjects')) && cookieStore.get('favoriteProjects') !== null ) {
                favoriteProjects = angular.fromJson(cookieStore.get('favoriteProjects'));
            }
            return favoriteProjects;
        };

        init = function () {
            var favorites = self.getFavoriteProjects(),
                length = favorites.length,
                i = 0;

            // Populate project cache
            ProjectRepository.getProjects();

            // Load full projects of favorites into cache
            for (i; i < length; i++) {
                if (angular.isDefined(favorites[i].repositoryUrl)) {
                    ProjectRepository.updateFullProjectInCache(favorites[i].repositoryUrl);
                }
            }
        };
        init();

    }
}());