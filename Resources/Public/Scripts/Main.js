/*global angular*/
/*jslint node: true */

'use strict';
var surfCaptain = angular.module('surfCaptain', ['ngRoute', 'xeditable', 'ngAnimate', 'ngMessages'])
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Projects.html',
                controller: 'ProjectsController'
            }).
            when('/project/:projectName', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Project.html',
                controller: 'ProjectController'
            }).
            when('/project/:projectName/deploy', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Deploy.html',
                controller: 'DeployController'
            }).
            when('/project/:projectName/sync', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Sync.html',
                controller: 'SyncController'
            }).
            when('/project/:projectName/server', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/Server.html',
                controller: 'ServerController'
            }).
            when('/about', {
                templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/About.html',
                controller: 'AboutController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
    .value('version', '0.5.7')
    .value('domain', 'http://api.surfcaptain.local.loc/');

surfCaptain.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.controller('AboutController', ['$scope', function ($scope) {
    $scope.techs = [
        {
            name: 'angular',
            url: 'https://angularjs.org/',
            description: {
                headline: 'AngularJS',
                span1: 'JavaScript',
                span2: 'Framework'
            }
        },
        {
            name: 'flow',
            url: 'http://flow.typo3.org/',
            description: {
                headline: 'TYPO3 FLOW',
                span1: 'PHP-Application',
                span2: 'Framework'
            }
        },
        {
            name: 'bootstrap',
            url: 'http://getbootstrap.com/',
            description: {
                headline: 'Bootstrap',
                span1: 'CSS',
                span2: 'Framework'
            }
        }
    ];
    $scope.subtechs = [
        {
            name: 'grunt',
            url: 'http://gruntjs.com/',
            description: {
                headline: 'Grunt'
            }
        },
        {
            name: 'bower',
            url: 'http://bower.io/',
            description: {
                headline: 'Bower'
            }
        },
        {
            name: 'composer',
            url: 'https://getcomposer.org/',
            description: {
                headline: 'Composer'
            }
        },
        {
            name: 'karma',
            url: 'http://karma-runner.github.io',
            description: {
                headline: 'Karma'
            }
        },
        {
            name: 'jasmine',
            url: 'http://jasmine.github.io/',
            description: {
                headline: 'Jasmine'
            }
        },
        {
            name: 'jquery',
            url: 'http://jquery.com/',
            description: {
                headline: 'jQuery'
            }
        },
        {
            name: 'css3',
            url: 'http://en.wikipedia.org/wiki/Cascading_Style_Sheets#CSS_3',
            description: {
                headline: 'CSS 3'
            }
        },
        {
            name: 'git',
            url: 'http://git-scm.com/',
            description: {
                headline: 'git'
            }
        },
        {
            name: 'html5',
            url: 'http://en.wikipedia.org/wiki/HTML5',
            description: {
                headline: 'HTML 5'
            }
        },
        {
            name: 'mysql',
            url: 'http://www.mysql.com/',
            description: {
                headline: 'MySQL'
            }
        }
    ];
}]);
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.controller('AbstractSingleProjectController', ['$scope', '$routeParams', 'ProjectRepository', function ($scope, $routeParams, ProjectRepository) {
    $scope.name = $routeParams.projectName;
    $scope.project = {};

    this.init = function () {
        ProjectRepository.getProjects().then(function (projects) {
            $scope.project = ProjectRepository.getProjectByName(projects.projects, $scope.name);
        });
    };
    this.init();
}]);
/*global surfCaptain, angular, jQuery*/
/*jslint node: true */

'use strict';
surfCaptain.controller('DeployController', [
    '$scope',
    '$controller',
    'GitRepository',
    'ServerRepository',
    'HistoryRepository',
    function ($scope, $controller, GitRepository, ServerRepository, HistoryRepository) {

        var loadingString = 'loading ...';

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        $scope.deployableCommits = [
            {
                name: loadingString,
                group: 'Tags'
            },
            {
                name: loadingString,
                group: 'Branches'
            }
        ];
        $scope.tags = [];
        $scope.branches = [];

        $scope.unsetLoadingKeyForGroup = function (group) {
            var key;
            for (key in $scope.deployableCommits) {
                if ($scope.deployableCommits.hasOwnProperty(key)) {
                    if ($scope.deployableCommits[key].name !== undefined
                            && $scope.deployableCommits[key].group !== undefined
                            && $scope.deployableCommits[key].name === loadingString
                            && $scope.deployableCommits[key].group === group) {
                        $scope.deployableCommits.splice(key, 1);
                        break;
                    }
                }
            }
        };

        $scope.$watch('project', function (newValue, oldValue) {
            var id;
            if (newValue === undefined || newValue.id === undefined) {
                return;
            }
            id = newValue.id;
            GitRepository.getTagsByProjectId(id.toString()).then(
                function (response) {
                    $scope.unsetLoadingKeyForGroup('Tags');
                    $scope.tags = response.tags;
                    $scope.deployableCommits = jQuery.merge($scope.tags, $scope.deployableCommits);
                },
                function (reason) {
                    $scope.unsetLoadingKeyForGroup('Tags');
                }
            );
            GitRepository.getBranchesByProjectId(id.toString()).then(
                function (response) {
                    $scope.unsetLoadingKeyForGroup('Branches');
                    $scope.branches = response.branches;
                    $scope.deployableCommits = jQuery.merge($scope.branches, $scope.deployableCommits);
                },
                function (reason) {
                    $scope.unsetLoadingKeyForGroup('Branches');
                }
            );
            ServerRepository.getServers().then(function (response) {
                $scope.servers = response.filter(function (entry) {
                    return entry.project === newValue.id;
                });
            });

            HistoryRepository.getHistoryByProject($scope.project).then(function (response) {
                $scope.history = response.filter(function (entry) {
                    return entry.application === 'Deploy';
                });
            });
        });
    }]);
/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ProjectController', ['$scope', '$controller', 'HistoryRepository', function ($scope, $controller, HistoryRepository) {

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

    $scope.ordering = 'date';
    $scope.constraint = 'dummy';

    $scope.$watch('project', function (newValue, oldValue) {
        if (newValue === undefined || newValue.name === undefined) {
            return;
        }

        HistoryRepository.getHistoryByProject($scope.project).then(function (response) {
            $scope.history = response;
        });
    });
}]);
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ProjectsController', ['$scope', 'ProjectRepository', function ($scope, ProjectRepository) {
    $scope.ordering = 'name';
    $scope.projects = [];

    this.init = function () {
        // Retrieve Projects from Factory
        ProjectRepository.getProjects().then(
            function (response) {
                $scope.projects = response.projects;
            },
            function () {
                //an error occurred
                $scope.message = 'API call failed. GitLab is currently not available.';
            }
        );
    };
    this.init();
}]);
/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ServerController', ['$scope', '$controller', 'ServerRepository', 'ValidationService', function ($scope, $controller, ServerRepository, ValidationService) {

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

    $scope.contexts = [
        'Production', 'Development', 'Staging'
    ];

    $scope.deleteServer = function (server) {
        ServerRepository.deleteServer(server);
    };

    $scope.updateServer = function (server) {
        ServerRepository.putServer(server);
    };

    /**
     * Validates the updated Host string before submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateHost = function (data) {
        return ValidationService.hasLength(data, 1, 'Host must not be empty!');
    };

    /**
     * Validates the updated DocumentRoot string before submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateDocumentRoot = function (data) {
        var res = ValidationService.hasLength(data, 1, 'DocRoot must not be empty!');
        if (res === true) {
            return ValidationService.doesLastCharacterMatch(data, '/', 'DocumentRoot must end with "/"!');
        }
        return res;
    };

    /**
     * Validates the updated Username string before submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateUsername = function (data) {
        return ValidationService.hasLength(data, 1, 'User must not be empty!');
    };

    /**
     * Validates the updated Context string before submitting to Server
     *
     * @param data
     * @return {string | boolean} ErrorMessage or True if valid
     */
    $scope.updateContext = function (data) {
        if ($scope.contexts.indexOf(data) > -1) {
            return true;
        }
        return 'Context is not valid!';
    };

    $scope.$watch('project', function (newValue, oldValue) {
        if (newValue.name === undefined) {
            return;
        }
        ServerRepository.getServers().then(function (response) {
            $scope.servers = response.filter(function (entry) {
                return entry.project === newValue.id;
            });
            $scope.serverNames = ['bma-live', 'bma-qa'];
        });
    });

}]);
/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('SyncController', ['$scope', '$controller', function ($scope, $controller) {

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));
}]);
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('chosen', function () {
    var linker = function (scope, element, attrs) {
        var list = attrs.chosen;

        scope.$watch(list, function () {
            element.trigger('liszt:updated');
            element.trigger('chosen:updated');
        });

        element.chosen({
            search_contains: true
        });
    };

    return {
        restrict: 'A',
        link: linker
    };
});
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('serverNameValidate', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            serverNames: '='
        },
        link: function (scope, elem, attr, ctrl) {

            // add a parser
            ctrl.$parsers.unshift(function (value) {
                var valid = scope.serverNames === undefined || scope.serverNames.indexOf(value) === -1;
                ctrl.$setValidity('serverNameValidate', valid);

                // if it's valid, return the value to the model,
                // otherwise return undefined.
                return valid ? value : undefined;
            });

            // add a formatter
            ctrl.$formatters.unshift(function (value) {
                var valid = scope.serverNames === undefined || scope.serverNames.indexOf(value) === -1;
                ctrl.$setValidity('serverNameValidate', valid);

                // return the value or nothing will be written to the DOM.
                return value;
            });

        }
    };
});
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('surfcaptainHeader', ['$routeParams', '$location', function ($routeParams, $location) {
    return {
        restrict: 'E',
        templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/Header.html',
        scope: {
            icon: '@icon'
        },
        link: function (scope, element, attributes) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.itemName;
            scope.context = lastUrlPart === scope.project ? '' : lastUrlPart;
        }
    };
}]);
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('surfcaptainMenu', ['$routeParams', '$location', function ($routeParams, $location) {
    return {
        restrict: 'E',
        templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/Menu.html',
        scope: {},
        link: function (scope, element, attributes) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.projectName;
            scope.context = lastUrlPart === scope.project ? 'history' : lastUrlPart;
        }
    };
}]);
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('tooltip', function () {
    return function (scope, element, attributes) {
        element.tooltip();
    };
});
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('appVersion', ['version', function (version) {
    return function (scope, element, attributes) {
        element.text(version);
    };
}]);
/*jslint node: true */
/*global surfCaptain*/

'use strict';

surfCaptain.factory('GitRepository', [ '$http', '$q', function ($http, $q) {
    var gitRepository = {},
        tagUrl = '/api/tags?projectId=',
        branchUrl = '/api/branches?projectId=';

    /**
     *
     * @param project {string}
     * @returns {Promise} – promise object
     */
    gitRepository.getTagsByProjectId = function (projectId) {
        var deferred = $q.defer();
        $http.get(tagUrl + projectId).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     *
     * @param project {string}
     * @returns {Promise} – promise object
     */
    gitRepository.getBranchesByProjectId = function (projectId) {
        var deferred = $q.defer();
        $http.get(branchUrl + projectId).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    return gitRepository;
}]);
/*global surfCaptain*/
/*jslint node: true */

'use strict';

surfCaptain.factory('HistoryRepository', [ '$http', '$q', function ($http, $q) {
    var historyRepository = {},
        url = '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/ExampleData/history.json';

    /**
     *
     * @param project {string}
     * @returns {Promise} – promise object
     */
    historyRepository.getHistoryByProject = function (project) {
        var deferred = $q.defer();
        $http.get(url).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    return historyRepository;
}]);
/*jslint plusplus: true */
/*jslint node: true */
/*global surfCaptain*/

'use strict';

surfCaptain.factory('ProjectRepository', [ '$http', '$q', function ($http, $q) {
    var projectRepository = {},
        projects = {},
        url = '/api/projects';

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
     * @returns {object} a single project
     */
    projectRepository.getProjectByName = function (projects, name) {
        var length = projects.length,
            i = 0;
        if (length) {
            for (i; i < length; i++) {
                if (projects[i].name === name) {
                    return projects[i];
                }
            }
        }
    };

    return projectRepository;
}]);
/*global surfCaptain*/
/*jslint node: true */

'use strict';

surfCaptain.factory('ServerRepository', ['$http', '$q', function ($http, $q) {
    var serverRepository = {},
        url = '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/ExampleData/servers.json';

    /**
     * Gets all servers from the collection
     *
     * @returns {Promise} – promise object
     */
    serverRepository.getServers = function () {
        var deferred = $q.defer();
        $http.get(url).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Adds a single server to the server collection
     *
     * @param server {object}
     * @returns {Promise} – promise object
     */
    serverRepository.putServer = function (server) {
        console.log(server);
    };

    /**
     * Removes a single server from the server collection
     *
     * @param server {object}
     * @returns {Promise} – promise object
     */
    serverRepository.deleteServer = function (server) {
        console.log(server);
    };

    return serverRepository;
}]);
/*jslint node: true */
/*global surfCaptain*/

'use strict';

surfCaptain.service('ValidationService', function () {

    /**
     * Validates if a given string has at least the length of the given
     * minLength. A third parameter is an optional string to be returned
     * on validation failure.
     *
     * @param {string} value
     * @param {integer} minLength
     * @param {string} message
     * @returns {string|boolean}
     */
    this.hasLength = function (value, minLength, message) {
        if (value.length >= minLength) {
            return true;
        }
        return message || false;
    };

    /**
     * Validates if a given string ends with a given character
     * A third parameter is an optional string to be returned
     * on validation failure.
     *
     * @param {string} value
     * @param {string} character
     * @param {string} message
     * @returns {string|boolean}
     */
    this.doesLastCharacterMatch = function (value, character, message) {
        if (value.charAt(value.length - 1) === character) {
            return true;
        }
        return message || false;
    };
});