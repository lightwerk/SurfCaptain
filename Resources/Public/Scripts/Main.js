/*global angular*/
/*jslint node: true */

'use strict';
var surfCaptain = angular.module('surfCaptain', ['ngRoute', 'xeditable', 'ngAnimate', 'ngMessages'])
    .config(['$routeProvider', function ($routeProvider) {
        var templatePath = '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Templates/';
        $routeProvider.
            when('/', {
                templateUrl: templatePath + 'Projects.html',
                controller: 'ProjectsController'
            }).
            when('/project/:projectName', {
                templateUrl: templatePath + 'Project.html',
                controller: 'ProjectController'
            }).
            when('/project/:projectName/deploy', {
                templateUrl: templatePath + 'Deploy.html',
                controller: 'DeployController'
            }).
            when('/project/:projectName/sync', {
                templateUrl: templatePath + 'Sync.html',
                controller: 'SyncController'
            }).
            when('/project/:projectName/server', {
                templateUrl: templatePath + 'Server.html',
                controller: 'ServerController'
            }).
            when('/about', {
                templateUrl: templatePath + 'About.html',
                controller: 'AboutController'
            }).
            when('/server', {
                templateUrl: templatePath + 'GlobalServer.html',
                controller: 'GlobalServerController'
            }).
            when('/extensions', {
                templateUrl: templatePath + 'Extensions.html',
                controller: 'ExtensionsController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
    .value('version', '0.8.4')
    .constant('SEVERITY', {
        ok: 0,
        info: 1,
        warning: 2,
        error: 3
    });

surfCaptain.run(['editableOptions', function (editableOptions) {
    editableOptions.theme = 'bs3';
}]);
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
        },
        {
            name: 'less',
            url: 'http://www.lesscss.de/',
            description: {
                headline: 'LESS'
            }
        }
    ];
}]);
/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('AbstractSingleProjectController', ['$scope', '$routeParams', 'ProjectRepository', function ($scope, $routeParams, ProjectRepository) {
    $scope.name = $routeParams.projectName;
    $scope.project = {};
    $scope.messages = {};

    this.init = function () {
        ProjectRepository.getProjects().then(function (projects) {
            $scope.project = ProjectRepository.getProjectByName($scope.name, projects);
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
                    if (angular.isDefined($scope.deployableCommits[key].name)
                            && angular.isDefined($scope.deployableCommits[key].group)
                            && $scope.deployableCommits[key].name === loadingString
                            && $scope.deployableCommits[key].group === group) {
                        $scope.deployableCommits.splice(key, 1);
                        break;
                    }
                }
            }
        };

        $scope.$watch('project', function (project) {
            var id;
            if (angular.isUndefined(project.ssh_url_to_repo)) {
                return;
            }
            id = project.id;
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
//            GitRepository.getRepository(project.ssh_url_to_repo).then(
//                function (data) {
//                    console.log(data);
//                }
//            );
            ServerRepository.getServers().then(function (response) {
                $scope.servers = response.filter(function (entry) {
                    return entry.project === project.id;
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
surfCaptain.controller('ExtensionsController', ['$scope', '$controller', function ($scope) {

}]);
/*jslint node: true, plusplus:true */
/*global surfCaptain, angular*/

'use strict';
surfCaptain.controller('GlobalServerController', [
    '$scope',
    'ServerRepository',
    'PresetService',
    'FlashMessageService',
    'SEVERITY',
    function ($scope, ServerRepository, PresetService, FlashMessageService, SEVERITY) {

        $scope.contexts = [
            'Production', 'Development', 'Staging'
        ];
        $scope.newPreset = PresetService.getNewPreset();
        $scope.finished = false;
        $scope.messages = [];

        /**
         * @return {void}
         */
        $scope.getAllServers = function () {
            ServerRepository.getServers('').then(
                function (response) {
                    $scope.finished = true;
                    $scope.servers = response.presets;
                    if ($scope.servers.length === 0) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'FYI!',
                            'There are no servers yet. Why dont you create one, hmm?',
                            SEVERITY.info,
                            'global-server-request-no-results'
                        );
                    }
                },
                function (response) {
                    $scope.finished = true;
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Request failed!',
                        'The global servers could not be received. Please try again later..',
                        SEVERITY.error,
                        'global-server-request-failed'
                    );
                }
            );
        };

        /**
         *
         * @param {object} server
         * @return {void}
         */
        $scope.addServer = function (server) {
            $scope.finished = false;
            ServerRepository.addServer(server).then(
                function (response) {
                    $scope.newPreset = PresetService.getNewPreset();
                    $scope.newServerForm.$setPristine();
                    $scope.getAllServers();
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Server created!',
                        'The Server ' + server.nodes[0].name + ' was successfully created.',
                        SEVERITY.ok
                    );
                },
                function (response) {
                    $scope.finished = true;
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.',
                        SEVERITY.error
                    );
                }
            );
        };

        /**
         * Initializes the GlobalServerController
         *
         * @return {void}
         */
        this.init = function () {
            $scope.getAllServers();
        };
        this.init();
    }
]);
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
/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.controller('ProjectsController', [
    '$scope',
    'ProjectRepository',
    'SettingsRepository',
    'SEVERITY',
    'FlashMessageService',
    function ($scope, ProjectRepository, SettingsRepository, SEVERITY, FlashMessageService) {
        $scope.settings = {};
        $scope.ordering = 'name';
        $scope.projects = [];
        $scope.finished = false;

        this.init = function () {
            // Retrieve Projects from Factory
            ProjectRepository.getProjects().then(
                function (response) {
                    $scope.finished = true;
                    $scope.projects = response;
                    $scope.messages = FlashMessageService.addFlashMessage('At your Service!', 'All Projects have been loaded successfully. Have fun!', SEVERITY.ok, 'projects-loaded-ok');
                },
                function () {
                    //an error occurred
                    $scope.finished = true;
                    $scope.messages = FlashMessageService.addFlashMessage('Error!', 'API call failed. GitLab is currently not available.', SEVERITY.error, 'projects-loaded-error');
                }
            );
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.settings = response;
                }
            );
        };
        this.init();
    }
]);
/*jslint node: true, plusplus:true */
/*global surfCaptain, angular*/

// TODO uinittests

'use strict';
surfCaptain.controller('ServerController', [
    '$scope',
    '$controller',
    'ServerRepository',
    'ValidationService',
    'SettingsRepository',
    'MarkerService',
    'PresetService',
    'FlashMessageService',
    'SEVERITY',
    function ($scope, $controller, ServerRepository, ValidationService, SettingsRepository, MarkerService, PresetService, FlashMessageService, SEVERITY) {

        var self = this, generateNameSuggestions, replaceMarkers;

        $scope.finished = false;
        $scope.currentPreset = {};
        $scope.messages = [];
        $scope.contexts = [
            'Production', 'Development', 'Staging'
        ];


        /**
         * Sets all serverNames that are already in use as
         * unavailable in the nameSuggestions array in the $scope
         *
         * @return {void}
         */
        this.setTakenServerNamesAsUnavailableSuggestions = function () {
            var i = 0, numberOfNameSuggestions, serverName, serverNames = [], property;

            for (property in $scope.servers) {
                if ($scope.servers.hasOwnProperty(property)) {
                    serverNames.push(property);
                }
            }

            if (serverNames.length) {
                numberOfNameSuggestions = $scope.nameSuggestions.length;

                for (i; i < numberOfNameSuggestions; i++) {
                    serverName = $scope.generateServerName($scope.nameSuggestions[i].suffix);
                    $scope.nameSuggestions[i].available = !ValidationService.doesArrayContainItem(serverNames, serverName);
                }
            }
        };

        /**
         * @return {void}
         */
        $scope.getAllServers = function () {
            $scope.newPreset.options.repositoryUrl = $scope.project.ssh_url_to_repo;
            ServerRepository.getServers($scope.project.ssh_url_to_repo).then(
                function (response) {
                    $scope.finished = true;
                    $scope.servers = response.presets;
                    if (angular.isDefined($scope.nameSuggestions)) {
                        self.setTakenServerNamesAsUnavailableSuggestions();
                    }
                    if ($scope.servers.length === 0) {
                        $scope.messages = FlashMessageService.addFlashMessage(
                            'No Servers yet!',
                            'FYI: There are no servers for project <span class="uppercase">' + $scope.name  + '</span> yet. Why dont you create one, hmm?',
                            SEVERITY.info
                        );
                    }
                },
                function (response) {
                    $scope.finished = true;
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Request failed!',
                        'The servers could not be received. Please try again later..',
                        SEVERITY.error,
                        'server-request-failed'
                    );
                }
            );
        };

        /**
         *
         * @return {void}
         */
        this.handleSettings = function () {
            var docRoot;
            if (angular.isUndefined($scope.settings)) {
                return;
            }
            if (angular.isDefined($scope.settings.nameSuggestions)) {
                generateNameSuggestions($scope.settings.nameSuggestions);
            }
            if (angular.isDefined($scope.settings.defaultDocumentRoot)) {
                docRoot = $scope.settings.defaultDocumentRoot;
                if (ValidationService.doesStringContainSubstring(docRoot, '{{')) {
                    docRoot = MarkerService.replaceMarkers(docRoot, $scope.project);
                }
                if (ValidationService.doesStringContainSubstring(docRoot, '{{')) {
                    $scope.newPreset.options.documentRoot = MarkerService.getStringBeforeFirstMarker(docRoot);
                    $scope.newPreset.options.documentRootWithMarkers = docRoot;
                } else {
                    $scope.newPreset.options.documentRoot = docRoot;
                }
            }
        };

        /**
         *
         * @param {object} nameSuggestions
         * @return {void}
         */
        generateNameSuggestions = function (nameSuggestions) {
            var nameSuggestion, item;
            $scope.nameSuggestions = [];
            for (nameSuggestion in nameSuggestions) {
                if (nameSuggestions.hasOwnProperty(nameSuggestion)) {
                    item = {
                        suffix: nameSuggestion,
                        available: true,
                        context: nameSuggestions[nameSuggestion]
                    };
                    $scope.nameSuggestions.push(item);
                }
            }
        };

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        $scope.setDocumentRoot = function (suffix) {
            var docRoot;
            if (angular.isDefined($scope.newPreset.options.documentRootWithMarkers)) {
                docRoot = MarkerService.replaceMarkers(
                    $scope.newPreset.options.documentRootWithMarkers,
                    {suffix: suffix}
                );
                $scope.newPreset.options.documentRoot = docRoot;
            }

        };

        $scope.addServer = function (server) {
            $scope.finished = false;
            ServerRepository.addServer(server).then(
                function (response) {
                    $scope.newPreset = PresetService.getNewPreset($scope.settings);
                    $scope.newServerForm.$setPristine();
                    self.handleSettings();
                    $scope.getAllServers();
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Server created!',
                        'The Server "' + server.nodes[0].name + '" was successfully created.',
                        SEVERITY.ok
                    );
                },
                function (response) {
                    $scope.messages = FlashMessageService.addFlashMessage(
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.',
                        SEVERITY.error
                    );
                }
            );
        };

        /**
         * Applies a server suffix to the current project name.
         *
         * @param {string} suffix
         * @returns {string}
         */
        $scope.generateServerName = function (suffix) {
            return $scope.project.name + '-' + suffix;
        };

        /**
         * Watches for the project property. If it gets filled,
         * further requests are triggered.
         *
         * @return {void}
         */
        $scope.$watch('project', function (newValue, oldValue) {
            if (angular.isDefined(newValue.name)) {
                SettingsRepository.getSettings().then(
                    function (response) {
                        $scope.settings = response;
                        $scope.newPreset = PresetService.getNewPreset($scope.settings);
                        self.handleSettings();
                        $scope.getAllServers();
                    },
                    function () {
                        $scope.newPreset = PresetService.getNewPreset();
                        $scope.getAllServers();
                    }
                );
            }
        });
    }
]);
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
/*global surfCaptain, angular*/
/*jslint node: true, plusplus: true */

'use strict';
surfCaptain.directive('flashMessages', ['SEVERITY', 'FlashMessageService', function (SEVERITY, FlashMessageService) {
    var linker = function (scope, element, attrs) {

        /**
         *
         * @param {string} severity
         * @returns {string}
         */
        var getSeverityClass = function (severity) {
            switch (severity) {
            case SEVERITY.ok:
                return 'ok';
            case SEVERITY.info:
                return 'info';
            case SEVERITY.warning:
                return 'warning';
            case SEVERITY.error:
                return 'error';
            default:
                return 'info';
            }
        },
            getTimeString = function (time) {
                if (time instanceof Date) {
                    return 'Time: ' + time.getHours() + ':' + time.getMinutes() + ':' + time.getSeconds();
                }
                return '';
            },

            /**
             *
             * @returns {string}
             */
            generateFlashMessage = function (message, id) {
                return '<div class="flash-message" id="'
                    + id
                    + '">'
                    + '<div class="flash-message-title '
                    + getSeverityClass(message.severity)
                    + '">'
                    + message.title
                    + '<span class="close" onclick="angular.element(this).parent().parent().remove()">&times;</span>'
                    + '</div>'
                    + '<div class="flash-message-message">'
                    + message.message
                    + '</div>'
                    + '<div class="flash-message-footer">'
                    + '<span class="time">'
                    + getTimeString(message.time)
                    + '</span>'
                    + '</div>';
            };

        scope.$watchCollection(attrs.messages, function (messages) {
            var length, i = 0, html = '', message, id;
            if (angular.isDefined(messages)) {
                length = messages.length;
            } else {
                return;
            }
            if (length) {
                for (i; i < length; i++) {
                    message = messages[i];
                    id = '';
                    if (angular.isDefined(message.id)) {
                        id = message.id;
                        if (angular.element('#' + id).length) {
                            html += '';
                        } else {
                            html += generateFlashMessage(message, id);
                        }
                    } else {
                        html += generateFlashMessage(message, id);
                    }
                }
                angular.element('.flash-messages-container').append(html);
                FlashMessageService.flush();
            }
        });
    };

    return {
        restrict: 'E',
        scope: {
            messages: '='
        },
        link: linker
    };
}]);
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('lastCharacterValidate', ['ValidationService', function (ValidationService) {
    return {
        restrict: 'A',
        require: 'ngModel',
        scope: {
            character: '@character'
        },
        link: function (scope, elem, attr, ctrl) {
            var character = scope.character || '';
            // add a parser
            ctrl.$parsers.unshift(function (value) {
                var valid = value ? ValidationService.doesLastCharacterMatch(value.slice(-1), character) : false;
                ctrl.$setValidity('last-character-validate', valid);

                // if it's valid, return the value to the model,
                // otherwise return undefined.
                return valid ? value : undefined;
            });

            // add a formatter
            ctrl.$formatters.unshift(function (value) {
                var valid = value ? ValidationService.doesLastCharacterMatch(value.slice(-1), character) : false;
                ctrl.$setValidity('last-character-validate', valid);

                // return the value or nothing will be written to the DOM.
                return value;
            });

        }
    };
}]);
/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';
surfCaptain.directive('modal', function () {
    return {
        scope: {
            modal: '@modal'
        },
        link: function (scope, element, attributes) {
            element.bind('click', function () {
                angular.element('.' + scope.modal).modal();
            });
        }
    };
});
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('overlay', function () {
    var linker = function (scope, element, attrs) {
    };

    return {
        restrict: 'E',
        template: '<div data-ng-class="{false:\'overlay\'}[finished]"></div>',
        scope: {
            finished: '='
        },
        link: linker
    };
});
/*global surfCaptain*/
/*jslint node: true */

'use strict';
surfCaptain.directive('serverList', ['ServerRepository', 'ValidationService', 'FlashMessageService', 'SEVERITY', function (ServerRepository, ValidationService, FlashMessageService, SEVERITY) {
    var linker = function (scope, element, attrs) {
        scope.toggleSpinnerAndOverlay = function () {
            scope.finished = !scope.finished;
            scope.$parent.finished = !scope.$parent.finished;
        };

        scope.contexts = [
            'Production', 'Development', 'Staging'
        ];

        /**
         * Stores a preset object in a scope variable
         *
         * @param {object} preset
         * @return void
         */
        scope.setCurrentPreset = function (preset) {
            scope.currentPreset = preset;
        };

        /**
         * Wrapper for ServerRepository.deleteServer(server)
         *
         * @param {object} server
         * @return void
         */
        scope.deleteServer = function (server) {
            scope.toggleSpinnerAndOverlay();
            ServerRepository.deleteServer(server).then(
                function (response) {
                    scope.$parent.getAllServers();
                    scope.messages = FlashMessageService.addFlashMessage(
                        'Server deleted!',
                        'The Server "' + server.applications[0].nodes[0].name + '" was successfully removed.',
                        SEVERITY.ok
                    );
                },
                function (response) {
                    scope.toggleSpinnerAndOverlay();
                    scope.messages = FlashMessageService.addFlashMessage(
                        'Deletion failed!',
                        'The Server "' + server.applications[0].nodes[0].name + '" could not be removed.',
                        SEVERITY.error
                    );
                }
            );
        };

        /**
         * Wrapper for ServerRepository.updateServer(server)
         *
         * @param {object} server
         * @return void
         */
        scope.updateServer = function (server) {
            scope.toggleSpinnerAndOverlay();
            ServerRepository.updateServer(server.applications[0]).then(
                function () {
                    server.changed = false;
                    scope.toggleSpinnerAndOverlay();
                    scope.messages = FlashMessageService.addFlashMessage(
                        'Update successful!',
                        'The Server "' + server.applications[0].nodes[0].name + '" was updated successfully.',
                        SEVERITY.ok
                    );
                },
                function () {
                    scope.toggleSpinnerAndOverlay();
                    scope.messages = FlashMessageService.addFlashMessage(
                        'Update failed!',
                        'The Server "' + server.applications[0].nodes[0].name + '" could not be updated.',
                        SEVERITY.error
                    );
                }
            );
        };

        /**
         * Validates the updated Host string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        scope.updateHost = function (data) {
            return ValidationService.hasLength(data, 1, 'Host must not be empty!');
        };

        /**
         * Validates the updated DocumentRoot string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        scope.updateDocumentRoot = function (data) {
            var res = ValidationService.hasLength(data, 1, 'DocumentRoot is required!');
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
        scope.updateUsername = function (data) {
            return ValidationService.hasLength(data, 1, 'User must not be empty!');
        };

        /**
         * Validates the updated Context string before submitting to Server
         *
         * @param data
         * @return {string | boolean} ErrorMessage or True if valid
         */
        scope.updateContext = function (data) {
            return ValidationService.doesArrayContainItem(scope.contexts, data, 'Context is not valid!');
        };

    };

    return {
        restrict: 'E',
        templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/ServerList.html',
        scope: {
            servers: '=',
            getAllServers: '&',
            finished: '=',
            messages: '='
        },
        link: linker
    };
}]);
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
surfCaptain.directive('spinner', function () {
    var linker = function (scope, element, attrs) {
    };

    return {
        restrict: 'E',
        template: '<img src="/_Resources/Static/Packages/Lightwerk.SurfCaptain/Images/spinner.gif" />',
        link: linker
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
/*global surfCaptain, angular*/

'use strict';

surfCaptain.factory('ProjectRepository', [ '$http', '$q', '$cacheFactory', function ($http, $q, $cacheFactory) {
    var projectRepository = {},
        url = '/api/repository';

    $cacheFactory('projectCache');
    $cacheFactory('projectsCache');

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
        var projectCache = $cacheFactory.get('projectCache'),
            length = angular.isDefined(projects) ? projects.length : 0,
            i = 0;
        if (length) {
            for (i; i < length; i++) {
                projectCache.put(
                    projects[i].name,
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
        var deferred = $q.defer(),
            projectsCache = $cacheFactory.get('projectsCache');
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
        var projectCache = $cacheFactory.get('projectCache');
        if (angular.isDefined(projectCache.get(name))) {
            projectRepository.populateSingleProjectCache(projects);
        }
        projectCache = $cacheFactory.get('projectCache');
        if (angular.isUndefined(projectCache.get(name))) {
            throw new ProjectRepositoryException('Could not find project');
        }
        return projectCache.get(name);
    };

    // Public API
    return {
        getProjects: function () {
            return projectRepository.getProjects();
        },
        getProjectByName: function (name, projects) {
            return projectRepository.getProjectByName(name, projects);
        }
    };
}]);
/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';

surfCaptain.factory('ServerRepository', ['$http', '$q', function ($http, $q) {
    var serverRepository = {},
        url = '/api/presets';

    function ServerRepositoryException(message) {
        this.name = 'ServerRepositoryException';
        this.message = message;
    }
    ServerRepositoryException.prototype = new Error();
    ServerRepositoryException.prototype.constructor = ServerRepositoryException;

    /**
     * Gets all servers from the collection
     *
     * @param {object} server
     * @returns {string} – json string
     */
    serverRepository.getFullPresetAsString = function (server) {
        var container = {"applications": []};
        container.applications[0] = server;
        return JSON.stringify(container);
    };

    /**
     *
     * @param {object} server
     * @returns {string}
     * @throws {ServerRepositoryException}
     */
    serverRepository.getKeyFromServerConfiguration = function (server) {
        if (angular.isUndefined(server.nodes[0].name)) {
            if (angular.isUndefined(server.apllications[0].nodes[0].name)) {
                throw new ServerRepositoryException('ServerRepository.getKeyFromServerConfiguratio failed. Server configuration contains no key.');
            }
            return server.apllications[0].nodes[0].name;
        }
        return server.nodes[0].name;
    };

    /**
     *
     * @param {object} server
     * @return {object}
     */
    serverRepository.getApplicationContainer = function (server) {
        var applicationContainer = {"applications": []};
        applicationContainer.applications[0] = server;
        return applicationContainer;
    };

    /**
     * Gets all servers from the collection
     *
     * @param {string} repositoryUrl
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.getServers = function (repositoryUrl) {
        var deferred = $q.defer();
        $http.get(url + '?repositoryUrl=' + repositoryUrl).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Adds a single server to the server collection
     *
     * @param {object} preset
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.putServer = function (preset) {
        return this.sendSinglePresetToApi(preset, 'PUT');
    };

    /**
     * Adds a single server to the server collection
     *
     * @param preset {object}
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.postServer = function (preset) {
        return this.sendSinglePresetToApi(preset, 'POST');
    };


    /**
     * Performs a request to the api with a single preset.
     * This request can either be POST or PUT which can
     * be determined with the method argument. Any other
     * method will result in a failed API call.
     *
     * @param {object} preset
     * @param {string} method
     * @returns {promise|Q.promise}
     */
    serverRepository.sendSinglePresetToApi = function (preset, method) {
        var deferred = $q.defer(),
            configuration = this.getFullPresetAsString(preset);
        $http({
            method: method,
            url: url + '?key=' + this.getKeyFromServerConfiguration(preset) + '&configuration=' + configuration,
            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
        }).success(deferred.resolve).error(deferred.reject);
        return deferred.promise;
    };

    /**
     * Removes a single server from the server collection
     *
     * @param server {object}
     * @returns {Q.promise|promise} – promise object
     */
    serverRepository.deleteServer = function (server) {
        var deferred = $q.defer();
        $http.delete(url + '?key=' + serverRepository.getKeyFromServerConfiguration(server.applications[0]))
            .success(deferred.resolve)
            .error(deferred.reject);
        return deferred.promise;
    };

    // Public API
    return {
        getServers: function (repositoryUrl) {
            return serverRepository.getServers(repositoryUrl);
        },
        updateServer: function (server) {
            return serverRepository.putServer(server);
        },
        addServer: function (server) {
            return serverRepository.postServer(server);
        },
        deleteServer: function (server) {
            return serverRepository.deleteServer(server);
        }
    };
}]);
/*global surfCaptain, angular*/
/*jslint node: true */

'use strict';

surfCaptain.factory('SettingsRepository', ['$http', '$q', '$cacheFactory', function ($http, $q, $cacheFactory) {
    var settingsRepository = {},
        url = '/api/frontendSetting';

    $cacheFactory('settingsCache');

    /**
     *
     * @returns {Q.promise|promise} – promise object
     */
    settingsRepository.getFrontendSettings = function () {
        var deferred = $q.defer(),
            settingsCache = $cacheFactory.get('settingsCache');
        if (angular.isDefined(settingsCache.get('configuration'))) {
            deferred.resolve(settingsCache.get('configuration'));
            return deferred.promise;
        }
        $http.get(url, {cache: true}).success(
            function (data) {
                settingsCache.put('configuration', data.frontendSettings);
                deferred.resolve(data.frontendSettings);
            }
        ).error(deferred.reject);
        return deferred.promise;
    };

    // Public API
    return {
        getSettings: function () {
            return settingsRepository.getFrontendSettings();
        }
    };
}]);
/*jslint node: true, plusplus: true */
/*global surfCaptain, angular*/

'use strict';

surfCaptain.service('FlashMessageService', function () {

    var messages = [];

    /**
     *
     * @param {string} title
     * @param {string} message
     * @param {integer} severity
     * @param {string} id
     * @return {Array}
     */
    this.addFlashMessage = function (title, message, severity, id) {
        messages.push({
            title: title || '',
            message: message || '',
            severity: severity,
            time: new Date(),
            id: id
        });
        return messages;
    };

    /**
     * @return {Array}
     */
    this.getFlashMessages = function () {
        return messages;
    };

    /**
     * Resets the messages to an empty Array
     *
     * @return {void}
     */
    this.flush = function () {
        messages = [];
    };

});
/*jslint node: true, plusplus: true */
/*global surfCaptain, angular*/

'use strict';

surfCaptain.service('MarkerService', function () {

    var localStorage = [],

        clearLocalStorage = function () {
            localStorage = [];
        },

        addToLocalStorage = function (ind, marker) {
            localStorage.push([ind, marker]);
        },

        applyLocalStorage = function (string) {
            var length = localStorage.length, index, marker, i = length - 1;
            if (length) {
                for (i; i >= 0; i--) {
                    index = localStorage[i][0];
                    marker = localStorage[i][1];
                    string = string.slice(0, index) + marker + string.slice(index);
                }
            }
            clearLocalStorage();
            return string;
        };

    /**
     *
     * @param {string} string
     * @returns {null|string}
     */
    this.getFirstMarker = function (string) {
        var marker;
        if (typeof string !== 'string') {
            return null;
        }
        marker = string.match(new RegExp('([{]{2,2})([A-Za-z0-9]*)([}]{2,2})'));
        if (marker === null) {
            return null;
        }
        return marker[0];
    };

    /**
     * Replaces markers in strings. Only substrings inside
     * double curly braces are replaced.
     *
     * @param {string} string
     * @param {object} configuration
     * @returns {string}
     */
    this.replaceMarkers = function (string, configuration) {
        var marker, replacement;

        if (angular.isUndefined(configuration)) {
            return string;
        }

        marker = this.getFirstMarker(string);

        switch (marker) {
        case null:
            string = applyLocalStorage(string);
            return string;

        // These cases expect a property name in the
        // configuration to be replaced with.
        case '{{project}}':
        case '{{projectName}}':
        case '{{projectname}}':
            if (angular.isDefined(configuration.name)) {
                replacement = configuration.name;
            } else {
                addToLocalStorage(string.indexOf(marker), marker);
                replacement = '';
            }
            break;
        case '{{suffix}}':
            if (angular.isDefined(configuration.suffix)) {
                replacement = configuration.suffix;
            } else {
                addToLocalStorage(string.indexOf(marker), marker);
                replacement = '';
            }
            break;
        // Found an unknown marker:
        // Remove it but store it to put it back there in the end.
        default:
            addToLocalStorage(string.indexOf(marker), marker);
            replacement = '';
            break;
        }
        string = string.replace(marker, replacement);
        string = this.replaceMarkers(string, configuration);
        return string;
    };

    /**
     *
     * @param {string} string
     * @return {string}
     */
    this.getStringBeforeFirstMarker = function (string) {
        var index;
        if (typeof string !== 'string') {
            return '';
        }
        index = string.indexOf(this.getFirstMarker(string));
        if (index === -1) {
            return string;
        }
        return string.substring(0, index);
    };
});
/*jslint node: true */
/*global surfCaptain, angular*/

'use strict';

surfCaptain.service('PresetService', [function () {

    var newPreset = {
        "options": {
            "repositoryUrl": '',
            "documentRoot": '',
            "context": ''
        },
        "nodes": [
            {
                "name": '',
                "hostname": '',
                "username": ''
            }
        ]
    };

    /**
     * A new preset skeleton is returned with options from an optional
     * passed configuration object (like frontendSettings). Used
     * properties in configuration are:
     *
     *  - defaultUser (Sets the Username in the first Node)
     *  - defaultDocumentRoot (Sets the documentRoot in the options.
     *    Markers have to be replaced later on!)
     *
     * @param {object} configuration - optional
     * @returns {object}}
     */
    this.getNewPreset = function (configuration) {
        var preset = angular.copy(newPreset);
        if (angular.isDefined(configuration)) {
            if (angular.isDefined(configuration.defaultUser)) {
                preset.nodes[0].username = configuration.defaultUser;
            }
            if (angular.isDefined(configuration.defaultDocumentRoot)) {
                preset.options.documentRoot = configuration.defaultDocumentRoot;
            }
        }
        return preset;
    };
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

    /**
     * Validates if a given Item is found within a given array.
     *
     * @param {array} array
     * @param {mixed} item
     * @param {string} message
     * @returns {string|boolean}
     */
    this.doesArrayContainItem = function (array, item, message) {
        if (array instanceof Array && array.indexOf(item) > -1) {
            return true;
        }
        return message || false;
    };

    /**
     * Validates if a given Substring is found within a given string.
     *
     * @param {string} string
     * @param {string} substring
     * @param {string} message
     * @returns {string|boolean}
     */
    this.doesStringContainSubstring = function (string, substring, message) {
        if (typeof string === 'string' && string.indexOf(substring) !== -1) {
            return true;
        }
        return message || false;
    };
});