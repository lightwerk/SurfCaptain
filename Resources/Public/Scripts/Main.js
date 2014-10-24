/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain', ['ngRoute', 'xeditable', 'ngAnimate', 'ngMessages', 'ngBiscuit', 'toaster'])
        .config(routeConfiguration)
        .config(toasterConfiguration)
        .value('version', '1.0.10')
        .constant('CONFIG', {
            applicationTypes: {
                deploy: 'Deploy',
                deployTYPO3: 'TYPO3\\CMS\\Deploy',
                syncTYPO3: 'TYPO3\\CMS\\Shared'
            }
        })
        .run(xeditableConfig);

    /* @ngInject */
    function routeConfiguration($routeProvider) {
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
            when('/globalserver', {
                templateUrl: templatePath + 'GlobalServer.html',
                controller: 'GlobalServerController'
            }).
            when('/extensions', {
                templateUrl: templatePath + 'Extensions.html',
                controller: 'ExtensionsController'
            }).
            when('/deployments', {
                templateUrl: templatePath + 'Deployments.html',
                controller: 'DeploymentsController'
            }).
            when('/project/:projectName/deployment/:deploymentId', {
                templateUrl: templatePath + 'SingleDeployment.html',
                controller: 'SingleDeploymentController'
            }).
            when('/settings', {
                templateUrl: templatePath + 'Settings.html',
                controller: 'SettingsController'
            }).
            otherwise({
                redirectTo: '/'
            });
    }
    routeConfiguration.$inject = ['$routeProvider'];

    /* @ngInject */
    function toasterConfiguration(toasterConfig) {
        var customConfig = {
            'position-class': 'toast-bottom-right',
            'time-out': 5000,
            'close-button': true
        };
        angular.extend(toasterConfig, customConfig);
    }
    toasterConfiguration.$inject = ['toasterConfig'];

    /* @ngInject */
    function xeditableConfig(editableOptions) {
        editableOptions.theme = 'bs3';
    }
    xeditableConfig.$inject = ['editableOptions'];

}());
/* global angular */
(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('AboutController', AboutController);

    /* @ngInject */
    function AboutController($scope) {

        $scope.techs = [];
        $scope.subtechs = [];

        activate();

        function activate() {
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
        }
    }
    AboutController.$inject = ['$scope'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('AbstractApplicationController', AbstractApplicationController);

    /* @ngInject */
    function AbstractApplicationController($scope, PresetService) {

        // methods published to the view
        $scope.getRootContext = getRootContext;

        /**
         * @param {string} context
         * @returns {string}
         */
        function getRootContext(context) {
            return PresetService.getRootContext(context, $scope.contexts);
        }
    }
    AbstractApplicationController.$inject = ['$scope', 'PresetService'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('AbstractSingleProjectController', AbstractSingleProjectController);

    /* @ngInject */
    function AbstractSingleProjectController($scope, $routeParams, ProjectRepository, FavorService, toaster) {
        $scope.name = $routeParams.projectName;
        $scope.project = {};
        $scope.messages = {};
        $scope.error = false;

        this.init = function () {
            ProjectRepository.getProjects().then(
                function (projects) {
                    $scope.project = ProjectRepository.getProjectByName($scope.name, projects);
                    FavorService.addFavoriteProject($scope.project);
                },
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Error!',
                        'API call failed. Please try again later.'
                    );
                    $scope.error = true;
                }
            );
        };
        this.init();
    }
    AbstractSingleProjectController.$inject = ['$scope', '$routeParams', 'ProjectRepository', 'FavorService', 'toaster'];
}());
/* global angular,jQuery */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('DeployController', DeployController);

    /* @ngInject */
    function DeployController($scope, $controller, ProjectRepository, toaster, CONFIG, DeploymentRepository, $location, PresetRepository, SettingsRepository, UtilityService, MarkerService, PresetService) {

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        // Inherit from AbstractApplicationController
        angular.extend(this, $controller('AbstractApplicationController', {$scope: $scope}));

        var loadingString = 'loading ...',
            self = this;

        function DeployControllerException(message) {
            this.name = 'DeployControllerException';
            this.message = message;
        }
        DeployControllerException.prototype = new Error();
        DeployControllerException.prototype.constructor = DeployControllerException;

        $scope.deployableCommits = [];
        $scope.servers = [];
        $scope.error = false;
        $scope.finished = false;
        $scope.currentPreset = {};
        $scope.tags = [];
        $scope.globalPreset = false;
        $scope.showNewRepositoryOption = false;
        $scope.repositoryOptions = [];
        $scope.newRepositoryOption = {};

        // methods published to the view
        $scope.setCommitInCurrentPreset = setCommitInCurrentPreset;
        $scope.setCurrentPreset = setCurrentPreset;
        $scope.deploy = deploy;
        $scope.presetDisplay = presetDisplay;
        $scope.unsetLoadingKeyForGroup = unsetLoadingKeyForGroup;
        $scope.getDeployedTag = getDeployedTag;
        $scope.addRepositoryOption = addRepositoryOption;
        $scope.removeRepositoryOption = removeRepositoryOption;

        // internal methods
        this.addFailureFlashMessage = addFailureFlashMessage;
        this.getCurrentCommit = getCurrentCommit;
        this.setServersFromPresets = setServersFromPresets;
        this.setPreconfiguredServer = setPreconfiguredServer;
        this.setRepositoryOptions = setRepositoryOptions;
        this.normalizePresetAndUpdate = normalizePresetAndUpdate;
        this.deploymentPath = '';
        this.context = '';

        init();

        /**
         * @return {void}
         */
        function init() {
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
        }

        /**
         * @param {string} message
         * @return {void}
         */
        function addFailureFlashMessage(message) {
            $scope.finished = true;
            toaster.pop(
                'error',
                'Error!',
                message
            );
            $scope.error = true;
        }

        /**
         * @returns {object}
         * @throws DeployControllerException
         */
        function getCurrentCommit() {
            var commits = $scope.deployableCommits.filter(function (commit) {
                return commit.identifier === $scope.selectedCommit;
            });
            if (angular.isUndefined(commits[0]) || commits === null || commits.length > 1) {
                throw new DeployControllerException('Something went wrong with the chosen Commit');
            }
            return commits[0];
        }

        /**
         * Takes a set of presets, recieved from the API and fills the
         * $scope.servers with any preset that have no or one of the
         * allowed applicationTypes from CONFIG.
         *
         * @param {object} presets
         * @return {void}
         */
        function setServersFromPresets(presets) {
            var property;
            for (property in presets) {
                if (presets.hasOwnProperty(property)) {
                    if (angular.isUndefined(presets[property].applications[0].type) ||
                        presets[property].applications[0].type === CONFIG.applicationTypes.deployTYPO3 ||
                        presets[property].applications[0].type === CONFIG.applicationTypes.deploy) {
                        $scope.servers.push(presets[property]);
                    }
                }
            }
            self.setPreconfiguredServer();
        }

        /**
         * It is possible to assign a server as deploy target
         * as the GET parameter "server". This method checks if
         * that parameter exists and is a valid server. If
         * this is the case, setCurrentPreset() is called to
         * trigger step2.
         *
         * @return {void}
         */
        function setPreconfiguredServer() {
            var searchObject = $location.search(),
                preconfiguredPreset;
            if (angular.isDefined(searchObject.server)) {
                preconfiguredPreset = $scope.servers.filter(function (preset) {
                    return preset.applications[0].nodes[0].name.toLowerCase() === searchObject.server.toLowerCase();
                });
                if (preconfiguredPreset.length) {
                    $scope.setCurrentPreset(preconfiguredPreset[0]);
                }
            }
        }

        /**
         * @param {object} preset
         * @return {void}
         */
        function setCurrentPreset(preset) {
            $scope.currentPreset = preset;
            self.deploymentPath = $scope.currentPreset.applications[0].options.deploymentPath;
            self.context = $scope.currentPreset.applications[0].options.context;
            $scope.globalPreset = PresetService.isPresetGlobal(preset);
            self.setRepositoryOptions();
            if (angular.isDefined($scope.selectedCommit) && $scope.selectedCommit !== '') {
                $scope.setCommitInCurrentPreset();
            }
        }

        /**
         * Adds a repositoryOption to the project related section in the preset JSON
         * If the passed title is not used yet.
         *
         * @param {object} repositoryOption
         * @param {string} title
         */
        function addRepositoryOption (repositoryOption, title) {
            var titleAlreadyUsed,
                repoOption = {
                deploymentPath: repositoryOption.deploymentPath,
                context: repositoryOption.context,
                title: title
            };
            if (angular.isUndefined($scope.currentPreset.applications[0].repositoryOptions)) {
                $scope.currentPreset.applications[0].repositoryOptions = {};
            }
            if (angular.isUndefined($scope.currentPreset.applications[0].repositoryOptions[$scope.project.repositoryUrl])) {
                $scope.currentPreset.applications[0].repositoryOptions[$scope.project.repositoryUrl] = [];
            }
            titleAlreadyUsed = $scope.currentPreset.applications[0].repositoryOptions[$scope.project.repositoryUrl].filter(function (element) {
                return element.title === title;
            });
            if (titleAlreadyUsed.length) {
                toaster.pop(
                    'error',
                    'Error',
                    'Title already in use. Please choose another one.'
                );
            } else {
                $scope.currentPreset.applications[0].repositoryOptions[$scope.project.repositoryUrl].push(repoOption);
                self.normalizePresetAndUpdate();
            }
        }

        /**
         * This method normalizes the preset on behalf of the addition or removal
         * of a repository option. We only want to add or remove a item of the
         * corresponding array, so we clone the current preset and simulate every
         * other property to not have been changed. So we have a clean diff.
         *
         * @return {void}
         */
        function normalizePresetAndUpdate() {
            // we clone the current preset to normalize it before sending it to update the JSON.
            var preset = angular.copy($scope.currentPreset);
            $scope.finished = false;
            preset.applications[0].options.deploymentPath = self.deploymentPath;
            preset.applications[0].options.context = self.context;
            delete preset.applications[0].options.tag;
            delete preset.applications[0].options.branch;
            delete preset.applications[0].options.sha1;
            PresetRepository.updateServer(preset.applications[0]).then(
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'success',
                        'Success',
                        'Repository Options successfully updated.'
                    );
                    self.setRepositoryOptions();
                },
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Error',
                        'The API call failed. Repository Options could not be updated.'
                    );
                }
            );
        }

        /**
         * For better handling in the view we store the repository options
         * of the current preset in a property of the scope if any are found.
         * This method is called each time a server is selected for deployment.
         *
         * @see setCurrentPreset
         * @return {void}
         */
        function setRepositoryOptions() {
            var property,
                repositoryOptions;
            $scope.repositoryOptions = [];
            if ($scope.globalPreset) {
                if (angular.isDefined($scope.currentPreset.applications[0].repositoryOptions)) {
                    repositoryOptions = $scope.currentPreset.applications[0].repositoryOptions;
                    for (property in repositoryOptions) {
                        if (property === $scope.project.repositoryUrl) {
                            $scope.repositoryOptions = repositoryOptions[property];
                        }
                    }
                }
            }
        }

        /**
         * This method removes the passed repository option from the current preset
         * and triggers the normalization and update afterwards.
         *
         * @param {object} repositoryOption
         * @return {void}
         */
        function removeRepositoryOption(repositoryOption) {
            var remainingRepositoryOption,
                title = repositoryOption.title;
            remainingRepositoryOption = $scope.currentPreset.applications[0].repositoryOptions[$scope.project.repositoryUrl].filter(function (element) {
                return element.title !== title;
            });
            $scope.currentPreset.applications[0].repositoryOptions[$scope.project.repositoryUrl] = remainingRepositoryOption;
            self.normalizePresetAndUpdate();
        }

        /**
         * Takes the current preset, checks validity removes some properties
         * that are not needed by API and pass the object to the DeploymentRepository.
         *
         * @param {object} preset
         * @return {void}
         */
        function deploy(preset) {
            if (preset === $scope.currentPreset) {
                if (angular.isUndefined($scope.currentPreset.applications[0].type)) {
                    $scope.currentPreset.applications[0].type = CONFIG.applicationTypes.deployTYPO3;
                }
                if (angular.isDefined($scope.currentPreset.applications[0].options.deploymentPathWithMarkers)) {
                    delete $scope.currentPreset.applications[0].options.deploymentPathWithMarkers;
                }
                if (angular.isUndefined($scope.currentPreset.applications[0].options.repositoryUrl) || $scope.currentPreset.applications[0].options.repositoryUrl === '') {
                    $scope.currentPreset.applications[0].options.repositoryUrl = $scope.project.repositoryUrl;
                }
                if (MarkerService.containsMarker($scope.currentPreset.applications[0].options.deploymentPath)) {
                    $scope.currentPreset.applications[0].options.deploymentPath = MarkerService.replaceMarkers($scope.currentPreset.applications[0].options.deploymentPath, {name: $scope.name});
                }
                DeploymentRepository.addDeployment($scope.currentPreset).then(
                    function (response) {
                        ProjectRepository.updateFullProjectInCache($scope.project.repositoryUrl);
                        $location.path('project/' + $scope.name + '/deployment/' + response.deployment.__identity);
                    },
                    function () {
                        self.addFailureFlashMessage('Deployment configuration could not be submitted successfully. Try again later.');
                    }
                );
            } else {
                toaster.pop(
                    'error',
                    'Oooops',
                    'Something went terribly wrong.'
                );
            }
        }

        /**
         * @return {void}
         */
        function setCommitInCurrentPreset() {
            try {
                $scope.currentCommit = self.getCurrentCommit();
                switch ($scope.currentCommit.type) {
                    case 'Branch':
                        delete $scope.currentPreset.applications[0].options.tag;
                        $scope.currentPreset.applications[0].options.branch = $scope.currentCommit.name;
                        break;
                    case 'Tag':
                        delete $scope.currentPreset.applications[0].options.branch;
                        $scope.currentPreset.applications[0].options.tag = $scope.currentCommit.name;
                        break;
                    default:
                        self.addFailureFlashMessage(
                            'Something is wrong with the type of the chosen commit. This should never happen. ' +
                            'In fact, If you see this message, please go ahaed and punch any of the involved developers in the face.'
                        );
                        $scope.currentCommit = null;
                        return;
                }
                $scope.currentPreset.applications[0].options.sha1 = $scope.currentCommit.commit.id;
            } catch (e) {
                self.addFailureFlashMessage(e.message);
                $scope.currentCommit = null;
            }
        }

        /**
         * Method is used by View to determine if a server is
         * displayed as disabled (if not chosen).
         *
         * @param {object} preset
         * @returns {string}
         */
        function presetDisplay(preset) {
            if (angular.isUndefined($scope.currentPreset.applications)) {
                return '';
            }
            if ($scope.currentPreset === preset) {
                return '';
            }
            return 'disabled';
        }

        /**
         * @param {string} group
         * @return void
         */
        function unsetLoadingKeyForGroup(group) {
            var key;
            for (key in $scope.deployableCommits) {
                if ($scope.deployableCommits.hasOwnProperty(key)) {
                    if (angular.isDefined($scope.deployableCommits[key].name) &&
                        angular.isDefined($scope.deployableCommits[key].group) &&
                        $scope.deployableCommits[key].name === loadingString  &&
                        $scope.deployableCommits[key].group === group) {
                            $scope.deployableCommits.splice(key, 1);
                            break;
                    }
                }
            }
        }

        /**
         * @param {string} name
         * @return {string}
         */
        function getDeployedTag(name) {
            return UtilityService.getDeployedTag(name, $scope.tags);
        }

        /**
         * If the project data is received and stored in
         * $scope.project, we trigger further requests.
         *
         * @return {void}
         */
        $scope.$watch('project', function (project) {
            if (angular.isUndefined(project.repositoryUrl)) {
                return;
            }

            ProjectRepository.getFullProjectByRepositoryUrl(project.repositoryUrl).then(
                function (response) {
                    $scope.repositoryUrl = response.repository.webUrl;
                    response.repository.tags.sort(UtilityService.byCommitDate);
                    response.repository.branches.sort(UtilityService.byCommitDate);
                    $scope.tags = response.repository.tags;
                    $scope.deployableCommits = response.repository.tags;
                    jQuery.merge($scope.deployableCommits, response.repository.branches);

                    self.setServersFromPresets(response.repository.presets);

                    $scope.finished = true;
                    if ($scope.servers.length === 0) {
                        toaster.pop(
                            'note',
                            'No Servers yet!',
                            'FYI: There are no servers for project <span class="uppercase">' + $scope.name + '</span> yet. Why dont you create one, hmm?',
                            4000,
                            'trustedHtml'
                        );
                    }
                },
                function () {
                    self.addFailureFlashMessage('API call failed. Deployment not possible.');
                }
            );

            PresetRepository.getGlobalServers('').then(
                function (response) {
                    $scope.globalServers = response.presets;
                },
                function () {
                    self.addFailureFlashMessage('API call failed. Deployment not possible.');
                }
            );

            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = [];
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
                    }
                }
            );
        });
    }
    DeployController.$inject = ['$scope', '$controller', 'ProjectRepository', 'toaster', 'CONFIG', 'DeploymentRepository', '$location', 'PresetRepository', 'SettingsRepository', 'UtilityService', 'MarkerService', 'PresetService'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('DeploymentsController', DeploymentsController);

    /* @ngInject */
    function DeploymentsController($scope, DeploymentRepository, toaster) {

        var self = this;

        $scope.deployments = [];
        $scope.finished = false;

        this.init = init;
        this.setDeployments = setDeployments;
        init();

        /**
         * @return {void}
         */
        function init() {
            DeploymentRepository.getAllDeployments().then(
                function (response) {
                    $scope.finished = true;
                    self.setDeployments(response.deployments);
                },
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Error!',
                        'The API call failed. Please try again later.'
                    );
                }
            );
        }

        /**
         * @param deployments
         * @return {void}
         */
        function setDeployments(deployments) {
            $scope.deployments = deployments;
        }

    }
    DeploymentsController.$inject = ['$scope', 'DeploymentRepository', 'toaster'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ExtensionsController', ExtensionsController);

    /* @ngInject */
    function ExtensionsController() {}
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('GlobalServerController', GlobalServerController);

    /* @ngInject */
    function GlobalServerController($scope, PresetRepository, PresetService, toaster, SettingsRepository) {
        var self = this;

        // properties of vm
        $scope.newPreset = PresetService.getNewPreset();
        $scope.finished = false;
        $scope.messages = [];
        $scope.serverNames = [];

        // methods published to the view
        $scope.getAllServers = getAllServers;
        $scope.addServer = addServer;

        // internal methods
        this.setServerNames = setServerNames;
        this.getSettings = getSettings;

        init();

        /**
         * @return void
         */
        function setServerNames() {
            var property;
            $scope.serverNames = [];
            for (property in $scope.servers) {
                if ($scope.servers.hasOwnProperty(property)) {
                    $scope.serverNames.push(property);
                }
            }
        }

        /**
         * @return {void}
         */
         function getSettings() {
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = '';
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
                    }
                }
            );
        }

        /**
         * @return {void}
         */
        function getAllServers() {
            PresetRepository.getGlobalServers('').then(
                function (response) {
                    $scope.finished = true;
                    $scope.servers = response.presets;
                    self.setServerNames();
                    if ($scope.servers.length === 0) {
                        toaster.pop(
                            'note',
                            'FYI!',
                            'There are no servers yet. Why dont you create one, hmm?',
                            4000,
                            'trustedHtml'
                        );
                    }
                },
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Request failed!',
                        'The global servers could not be received. Please try again later..'
                    );
                }
            );
        }

        /**
         *
         * @param {object} server
         * @return {void}
         */
        function addServer(server) {
            $scope.finished = false;
            PresetRepository.addServer(server).then(
                function () {
                    $scope.newPreset = PresetService.getNewPreset();
                    $scope.newServerForm.$setPristine();
                    $scope.getAllServers();
                    toaster.pop(
                        'success',
                        'Server created!',
                        'The Server ' + server.nodes[0].name + ' was successfully created.'
                    );
                },
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.'
                    );
                }
            );
        }

        /**
         * Initializes the GlobalServerController
         *
         * @return {void}
         */
        function init() {
            self.getSettings();
            $scope.getAllServers();
        }
    }
    GlobalServerController.$inject = ['$scope', 'PresetRepository', 'PresetService', 'toaster', 'SettingsRepository'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ProjectController', ProjectController);

    /* @ngInject */
    function ProjectController($scope, $controller, ProjectRepository, PresetService, SettingsRepository, UtilityService, $location) {

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        // properties of the vm
        $scope.ordering = 'date';
        $scope.finished = false;
        $scope.tags = [];

        // methods published to the view
        $scope.getRootContext = getRootContext;
        $scope.getDeployedTag = getDeployedTag;
        $scope.triggerDeployment = triggerDeployment;
        $scope.triggerSync = triggerSync;

        /**
         * @param {string} context
         * @returns {string}
         */
        function getRootContext(context) {
            return PresetService.getRootContext(context, $scope.contexts);
        }

        /**
         *
         * @param {string} name
         * @return {string}
         */
        function getDeployedTag(name) {
            return UtilityService.getDeployedTag(name, $scope.tags);
        }

        /**
         * Sets the GET Parameter server and redirects to
         * the deploy view.
         *
         * @param {string} serverName
         * @return {void}
         */
         function triggerDeployment(serverName) {
            $location.search('server', serverName);
            $location.path('project/' + $scope.name + '/deploy');
        }

        /**
         * Sets the GET Parameter server and redirects to
         * the sync view.
         *
         * @param {string} serverName
         * @return {void}
         */
        function triggerSync(serverName) {
            $location.search('server', serverName);
            $location.path('project/' + $scope.name + '/sync');
        }

        $scope.$watch('project', function (project) {
            if (angular.isUndefined(project.repositoryUrl)) {
                return;
            }

            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = [];
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
                    }
                    ProjectRepository.getFullProjectByRepositoryUrl(project.repositoryUrl).then(
                        function (response) {
                            $scope.finished = true;
                            $scope.deployments = response.repository.deployments;
                            $scope.presets = response.repository.presets;
                            $scope.tags = response.repository.tags;
                        },
                        function () {
                            $scope.finished = true;
                        }
                    );
                }
            );
        });
    }
    ProjectController.$inject = ['$scope', '$controller', 'ProjectRepository', 'PresetService', 'SettingsRepository', 'UtilityService', '$location'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ProjectsController', ProjectsController);

    /* @ngInject */
    function ProjectsController($scope, ProjectRepository, SettingsRepository, toaster) {

        // properties of the vm
        $scope.settings = {};
        $scope.ordering = 'name';
        $scope.projects = [];
        $scope.finished = false;

        this.init = init;

        init();

        function init() {
            ProjectRepository.getProjects().then(
                function (response) {
                    $scope.finished = true;
                    $scope.projects = response;
                },
                function () {
                    //an error occurred
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Error!',
                        'API call failed. GitLab is currently not available.'
                    );
                }
            );
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.settings = response;
                }
            );
        }
    }
    ProjectsController.$inject = ['$scope', 'ProjectRepository', 'SettingsRepository', 'toaster'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('ServerController', ServerController);

    /* @ngInject */
    function ServerController($scope, $controller, PresetRepository, ValidationService, SettingsRepository, MarkerService, PresetService, toaster, ProjectRepository) {

        var self = this;

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        function ServerControllerException(message) {
            this.name = 'ServerControllerException';
            this.message = message;
        }
        ServerControllerException.prototype = new Error();
        ServerControllerException.prototype.constructor = ServerControllerException;

        // properties of the vm
        $scope.finished = false;
        $scope.currentPreset = {};
        $scope.messages = [];
        $scope.serverNames = [];

        // methods published to the view
        $scope.getAllServers = getAllServers;
        $scope.setDeploymentPath = setDeploymentPath;
        $scope.addServer = addServer;
        $scope.generateServerName = generateServerName;

        // internal methods
        this.setServerNames = setServerNames;
        this.setTakenServerNamesAsUnavailableSuggestions = setTakenServerNamesAsUnavailableSuggestions;
        this.generateNameSuggestions = generateNameSuggestions;
        this.handleSettings = handleSettings;
        this.successCallback = successCallback;
        this.failureCallback = failureCallback;


        /**
         * @return void
         */
        function setServerNames() {
            var property;
            $scope.serverNames = [];
            for (property in $scope.servers) {
                if ($scope.servers.hasOwnProperty(property)) {
                    $scope.serverNames.push(property);
                }
            }
        }

        /**
         * Sets all serverNames that are already in use as
         * unavailable in the nameSuggestions array in the $scope
         *
         * @return {void}
         */
        function setTakenServerNamesAsUnavailableSuggestions() {
            var i = 0, numberOfNameSuggestions, serverName;

            if ($scope.serverNames.length) {
                numberOfNameSuggestions = $scope.nameSuggestions.length;

                for (i; i < numberOfNameSuggestions; i++) {
                    serverName = $scope.generateServerName($scope.nameSuggestions[i].suffix);
                    $scope.nameSuggestions[i].available = !ValidationService.doesArrayContainItem($scope.serverNames, serverName);
                }
            }
        }

        /**
         * nameSuggestions are retrieved from the Settings.yaml
         *
         * Example configuration:
         *
         * Lightwerk:
         *   SurfCaptain:
         *     frontendSettings
         *       nameSuggestions:
         *         live: 'Production'
         *         qa: 'Production/Qa'
         *         staging: 'Production/Staging'
         *         test: 'Testing'
         *         dev: 'Development'
         *
         * It populates the $scope.nameSuggestions array with objects like
         *
         * {
         *   suffix: live,
         *   available: true,
         *   context: 'Production'
         * }
         *
         * @param {object} nameSuggestions
         * @return {void}
         */
        function generateNameSuggestions(nameSuggestions) {
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
        }

        /**
         * Here are FrontendSettings regarding Server Management
         * taken into account. The settings are retrieved from
         * Settings.yaml.
         *
         * The considered settings are
         *   * contexts - a comma separated list of allowed TYPO3_CONTEXTs
         *   * nameSuggestions - @see generateNameSuggestions
         *   * defaultDeploymentPath - the field deploymentPath of the new server
         *     server form will be prefilled with this string.
         *
         * @return {void}
         */
        function handleSettings() {
            var docRoot;
            if (angular.isUndefined($scope.settings)) {
                return;
            }
            $scope.contexts = '';
            if (angular.isDefined($scope.settings.contexts)) {
                $scope.contexts = $scope.settings.contexts.split(',');
            }
            if (angular.isDefined($scope.settings.nameSuggestions)) {
                self.generateNameSuggestions($scope.settings.nameSuggestions);
            }
            if (angular.isDefined($scope.settings.defaultDeploymentPath)) {
                docRoot = $scope.settings.defaultDeploymentPath;
                if (ValidationService.doesStringContainSubstring(docRoot, '{{')) {
                    docRoot = MarkerService.replaceMarkers(docRoot, $scope.project);
                }
                if (ValidationService.doesStringContainSubstring(docRoot, '{{')) {
                    $scope.newPreset.options.deploymentPath = MarkerService.getStringBeforeFirstMarker(docRoot);
                    $scope.newPreset.options.deploymentPathWithMarkers = docRoot;
                } else {
                    $scope.newPreset.options.deploymentPath = docRoot;
                }
            }
        }

        function successCallback(response) {
            $scope.finished = true;
            $scope.servers = response.repository.presets;
            self.setServerNames();
            if (angular.isDefined($scope.nameSuggestions)) {
                self.setTakenServerNamesAsUnavailableSuggestions();
            }
            if ($scope.servers.length === 0) {
                toaster.pop(
                    'note',
                    'No Servers yet!',
                    'FYI: There are no servers for project <span class="uppercase">' + $scope.name  + '</span> yet. Why dont you create one, hmm?',
                    4000,
                    'trustedHtml'
                );
            }
        }

        function failureCallback() {
            $scope.finished = true;
            toaster.pop(
                'error',
                'Request failed!',
                'The servers could not be received. Please try again later..'
            );
        }

        /**
         * @return {void}
         */
        function getAllServers(cache) {
            $scope.newPreset.options.repositoryUrl = $scope.project.repositoryUrl;
            if (cache === false) {
                ProjectRepository.getFullProjectByRepositoryUrlFromServer($scope.project.repositoryUrl).then(
                    self.successCallback,
                    self.failureCallback
                );
            } else {
                ProjectRepository.getFullProjectByRepositoryUrl($scope.project.repositoryUrl).then(
                    self.successCallback,
                    self.failureCallback
                );
            }
        }

        /**
         * Takes a suffix and tries to replace a {{suffix}} marker
         * within the document root. Stores the returning string
         * in the deploymentPath property of the newPreset.
         *
         * @param {string} suffix
         * @return {void}
         */
        function setDeploymentPath(suffix) {
            var docRoot;
            if (angular.isDefined($scope.newPreset.options.deploymentPathWithMarkers)) {
                docRoot = MarkerService.replaceMarkers(
                    $scope.newPreset.options.deploymentPathWithMarkers,
                    {suffix: suffix}
                );
                $scope.newPreset.options.deploymentPath = docRoot;
            }
        }

        /**
         * Adds a Server (preset) to the collection of presets.
         * Indicates the success or failure with a flashMessage.
         *
         * @param {object} server
         * @return {void}
         */
         function addServer(server) {
            $scope.finished = false;
            if (angular.isDefined(server.options.deploymentPathWithMarkers)) {
                delete server.options.deploymentPathWithMarkers;
            }
            PresetRepository.addServer(server).then(
                function () {
                    $scope.newPreset = PresetService.getNewPreset($scope.settings);
                    $scope.newServerForm.$setPristine();
                    self.handleSettings();
                    $scope.getAllServers(false);
                    toaster.pop(
                        'success',
                        'Server created!',
                        'The Server "' + server.nodes[0].name + '" was successfully created.'
                    );
                },
                function () {
                    $scope.finished = true;
                    toaster.pop(
                        'error',
                        'Creation failed!',
                        'The Server "' + server.nodes[0].name + '" could not be created.'
                    );
                }
            );
        }

        /**
         * Applies a server suffix to the current project name.
         *
         * @param {string} suffix
         * @returns {string}
         * @throws {ServerControllerException}
         */
        function generateServerName(suffix) {
            if (angular.isUndefined($scope.project)) {
                throw new ServerControllerException('No project given.');
            }
            if (angular.isUndefined($scope.project.identifier)) {
                throw new ServerControllerException('Project got no identifier.');
            }
            return $scope.project.identifier + '-' + suffix;
        }

        /**
         * Watches for the project property. If it gets filled,
         * further requests are triggered.
         *
         * @return {void}
         */
        $scope.$watch('project', function (newValue) {
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
    ServerController.$inject = ['$scope', '$controller', 'PresetRepository', 'ValidationService', 'SettingsRepository', 'MarkerService', 'PresetService', 'toaster', 'ProjectRepository'];
}());
/* global angular */
(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('SettingsController', SettingsController);

    /* @ngInject */
    function SettingsController($scope, SettingsRepository, toaster) {

        activate();

        function activate() {
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.settings = response;
                    console.log(response);
                },
                function () {
                    toaster.pop(
                        'error',
                        'Error!',
                        'Something went wrong'
                    );
                }
            );
        }
    }
    SettingsController.$inject = ['$scope', 'SettingsRepository', 'toaster'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('SingleDeploymentController', SingleDeploymentController);

    /* @ngInject */
    function SingleDeploymentController($scope, DeploymentRepository, $routeParams, $cacheFactory, $location, toaster, ProjectRepository, $controller) {

        var self = this,
            flashMessageShown = false,
            wasRunning = false;

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        // properties of the vm
        $scope.finished = false;
        $scope.noLog = false;

        // methods published to the view
        $scope.cancelDeployment = cancelDeployment;
        $scope.deployConfigurationAgain = deployConfigurationAgain;

        // internal methods
        this.initLiveLog = initLiveLog;
        this.storeDeploymentInCacheFactory = storeDeploymentInCacheFactory;
        this.getDeployment = getDeployment;
        this.init = init;

        init();

        /**
         * Triggers the request for the Deployment object
         * after 1 second again if status of deployment
         * is either "waiting" or "running".
         *
         * @return {void}
         */
        function initLiveLog() {
            if ($scope.noLog) {
                return;
            }
            switch ($scope.deployment.status) {
                case 'success':
                    if (wasRunning && !flashMessageShown) {
                        toaster.pop(
                            'success',
                            'Deployment Successfull!',
                            $scope.deployment.referenceName +
                            'was successfully deployed onto ' +
                            $scope.deployment.options.name + '!'
                        );
                        flashMessageShown = true;
                    }
                    self.storeDeploymentInCacheFactory();
                    break;
                case 'failed':
                    if (wasRunning && !flashMessageShown) {
                        toaster.pop(
                            'error',
                            'Deployment Failed!',
                            $scope.deployment.referenceName +
                            'could not be deployed onto ' +
                            $scope.deployment.options.name + '! Check the log for what went wrong.'
                        );
                        flashMessageShown = true;
                    }
                    self.storeDeploymentInCacheFactory();
                    break;
                case 'cancelled':
                    self.storeDeploymentInCacheFactory();
                    return;
                case 'waiting':
                    if (!flashMessageShown) {
                        toaster.pop(
                            'note',
                            'Deployment will start shortly!',
                            $scope.deployment.referenceName + ' will be shortly deployed onto ' +
                            $scope.deployment.options.name + '! You can cancel the deployment while it is still waiting.'
                        );
                        flashMessageShown = true;
                    }
                    setTimeout(self.getDeployment, 1000);
                    break;
                case 'running':
                    flashMessageShown = false;
                    wasRunning = true;
                    setTimeout(self.getDeployment, 1000);
                    break;
                default:
                    return;
            }
        }

        /**
         * @return {void}
         */
        function storeDeploymentInCacheFactory() {
            if (angular.isUndefined($cacheFactory.get('deploymentCache'))) {
                $cacheFactory('deploymentCache');
            }
            $cacheFactory.get('deploymentCache').put($scope.deployment.__identity, $scope.deployment);
            ProjectRepository.updateFullProjectInCache($scope.deployment.repositoryUrl);
        }

        /**
         * @return {void}
         */
        function getDeployment() {
            DeploymentRepository.getSingleDeployment($routeParams.deploymentId).then(
                function (response) {
                    $scope.finished = true;
                    $scope.deployment = response.deployment;
                    self.initLiveLog();
                },
                function () {
                    $scope.finished = true;
                    $scope.noLog = true;
                }
            );
        }

        /**
         * @return {void}
         */
         function init() {
            self.getDeployment();
        }

        /**
         * @return {void}
         */
        function cancelDeployment() {
            DeploymentRepository.cancelDeployment($routeParams.deploymentId).then(
                function () {
                    self.getDeployment();
                }
            );
        }

        /**
         * @return {void}
         */
        function deployConfigurationAgain() {
            DeploymentRepository.addDeployment($scope.deployment.configuration).then(
                function (response) {
                    $location.path('project/' + $scope.name + '/deployment/' + response.deployment.__identity);
                },
                function () {
                    toaster.pop(
                        'error',
                        'Error!',
                        'Deployment configuration could not be submitted successfully. Try again later.'
                    );
                }
            );
        }
    }
    SingleDeploymentController.$inject = ['$scope', 'DeploymentRepository', '$routeParams', '$cacheFactory', '$location', 'toaster', 'ProjectRepository', '$controller'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .controller('SyncController', SyncController);

    /* @ngInject */
    function SyncController($scope, $controller, PresetRepository, CONFIG, toaster, ProjectRepository, SettingsRepository, DeploymentRepository, $location) {

        // Inherit from AbstractSingleProjectController
        angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

        // Inherit from AbstractApplicationController
        angular.extend(this, $controller('AbstractApplicationController', {$scope: $scope}));

        var self = this;

        // properties of the vm
        $scope.servers = [];
        $scope.finished = false;
        $scope.currentSource = {};
        $scope.currentTarget = {};

        // methods published to the view
        $scope.sync = sync;
        $scope.setCurrentTarget = setCurrentTarget;
        $scope.setCurrentSource = setCurrentSource;
        $scope.targetDisplay = targetDisplay;
        $scope.sourceDisplay = sourceDisplay;

        // internal methods
        this.addFailureFlashMessage = addFailureFlashMessage;
        this.setContexts = setContexts;
        this.setGlobalServers = setGlobalServers;
        this.setServersFromPresets = setServersFromPresets;
        this.setPreconfiguredServer = setPreconfiguredServer;

        /**
         * @return {void}
         */
        function addFailureFlashMessage() {
            $scope.finished = true;
            toaster.pop(
                'error',
                'Request failed!',
                'API call failed. Sync not possible.'
            );
        }

        /**
         * Fills $scope.contexts with configured contexts if
         * some were configured in frontend settings.
         *
         * @return {void}
         */
        function setContexts() {
            SettingsRepository.getSettings().then(
                function (response) {
                    $scope.contexts = [];
                    if (angular.isDefined(response.contexts)) {
                        $scope.contexts = response.contexts.split(',');
                    }
                }
            );
        }

        /**
         * Requests all global Servers from the API and
         * stores publish them to the scope via $scope.globalServers
         *
         * @return {void}
         */
        function setGlobalServers() {
            PresetRepository.getGlobalServers('').then(
                function (response) {
                    $scope.globalServers = response.presets;
                },
                function () {
                    self.addFailureFlashMessage();
                }
            );
        }

        /**
         * Takes a set of presets, recieved from the API and fills the
         * $scope.servers with any preset that have no or one of the
         * allowed applicationTypes from CONFIG.
         *
         * @param {object} presets
         * @return {void}
         */
        function setServersFromPresets(presets) {
            var property;
            for (property in presets) {
                if (presets.hasOwnProperty(property)) {
                    if (angular.isUndefined(presets[property].applications[0].type) ||
                        presets[property].applications[0].type === CONFIG.applicationTypes.syncTYPO3) {
                        $scope.servers.push(presets[property]);
                    }
                }
            }
            self.setPreconfiguredServer();
        }

        /**
         * It is possible to assign a server as sync source
         * as the GET parameter server. This method checks if
         * that parameter exists and is a valid server. If
         * this is the case, setCurrentSource() is called to
         * trigger step2.
         *
         * @return {void}
         */
        function setPreconfiguredServer() {
            var searchObject = $location.search(),
                preconfiguredPreset;
            if (angular.isDefined(searchObject.server)) {
                preconfiguredPreset = $scope.servers.filter(function (preset) {
                    return preset.applications[0].nodes[0].name.toLowerCase() === searchObject.server.toLowerCase();
                });
                if (preconfiguredPreset.length) {
                    $scope.setCurrentSource(preconfiguredPreset[0]);
                }
            }
        }

        /**
         * Initialization of SyncController. This function is called
         * immediately after creation of the controller.
         *
         * @return {void}
         */
        this.init = function () {
            self.setContexts();
            self.setGlobalServers();
        };

        this.init();

        /**
         * @param {object} preset
         * @returns {string}
         */
         function sourceDisplay(preset) {
            if (angular.isUndefined($scope.currentSource.applications)) {
                return '';
            }
            if ($scope.currentSource === preset) {
                return '';
            }
            return 'disabled';
        }

        /**
         * @param {object} preset
         * @returns {string}
         */
        function targetDisplay(preset) {
            if (angular.isUndefined($scope.currentTarget.applications)) {
                return '';
            }
            if ($scope.currentTarget === preset) {
                return '';
            }
            return 'disabled';
        }

        /**
         * @param {object} preset
         * @return {void}
         */
        function setCurrentSource(preset) {
            $scope.currentSource = preset;
        }

        /**
         * @param {object} preset
         * @return {void}
         */
         function setCurrentTarget(preset) {
            $scope.currentTarget = preset;
        }

        /**
         * @param {object} source - source node
         * @param {object} target - target node
         * @return {void}
         */
        function sync(source, target) {
            target.applications[0].type = CONFIG.applicationTypes.syncTYPO3;
            target.applications[0].options.sourceNode = source.applications[0].nodes[0];
            target.applications[0].options.sourceNode.deploymentPath = source.applications[0].options.deploymentPath;
            target.applications[0].options.repositoryUrl = $scope.project.repositoryUrl;
            DeploymentRepository.addDeployment(target).then(
                function (response) {
                    toaster.pop(
                        'success',
                        'OK!',
                        target.applications[0].nodes[0].name + ' will be synchronized with ' +
                        source.applications[0].nodes[0].name + '.'
                    );
                    ProjectRepository.updateFullProjectInCache($scope.project.repositoryUrl);
                    $location.path('project/' + $scope.name + '/deployment/' + response.deployment.__identity);
                },
                self.addFailureFlashMessage
            );
        }

        /**
         * As soon as we receive the repositoryUrl, we
         * make further requests.
         */
        $scope.$watch('project', function (project) {
            if (angular.isUndefined(project.repositoryUrl)) {
                return;
            }

            ProjectRepository.getFullProjectByRepositoryUrl(project.repositoryUrl).then(
                function (response) {
                    self.setServersFromPresets(response.repository.presets);
                    $scope.finished = true;
                    if ($scope.servers.length === 0) {
                        toaster.pop(
                            'note',
                            'No Servers yet!',
                            'FYI: There are no servers for project <span class="uppercase">' + $scope.name  + '</span> yet. Why dont you create one, hmm?',
                            4000,
                            'trustedHtml'
                        );
                    }
                },
                function () {
                    self.addFailureFlashMessage();
                }
            );
        });
    }
    SyncController.$inject = ['$scope', '$controller', 'PresetRepository', 'CONFIG', 'toaster', 'ProjectRepository', 'SettingsRepository', 'DeploymentRepository', '$location'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('chosen', chosen);

    /* @ngInject */
    function chosen($timeout) {
        return {
            restrict: 'A',
            link: linker,
            scope: {
                chosen: '='
            }
        };

        function linker (scope, element) {
            scope.$watchCollection('chosen', function (value, old) {
                if (angular.isArray(value) && value !== old) {
                    $timeout(
                        function () {
                            element.trigger('liszt:updated');
                            element.trigger('chosen:updated');
                        },
                        1000
                    );
                }
            });

            element.chosen({
                search_contains: true
            });
        }
    }
    chosen.$inject = ['$timeout'];
}());
/* global angular */
(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('lastCharacterValidate', lastCharacterValidate);

    /* ngInject */
    function lastCharacterValidate(ValidationService) {
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
    }
    lastCharacterValidate.$inject = ['ValidationService'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('modal', modal);

    /* @nInject */
    function modal() {
        return {
            scope: {
                modal: '@modal'
            },
            link: function (scope, element) {
                element.bind('click', function () {
                    angular.element('.' + scope.modal).modal();
                });
            }
        };
    }
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('overlay', overlay);

    /* @nInject */
    function overlay() {
        return {
            restrict: 'E',
            template: '<div data-ng-class="{false:\'overlay\'}[finished]"></div>',
            scope: {
                finished: '='
            }
        };
    }
}());


/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('serverList', serverList);

    /* @ngInject */
    function serverList(PresetRepository, ValidationService, toaster, SettingsRepository, ProjectRepository) {
        var linker = function (scope) {
            scope.toggleSpinnerAndOverlay = function () {
                scope.finished = !scope.finished;
                scope.$parent.finished = !scope.$parent.finished;
            };

            SettingsRepository.getSettings().then(
                function (response) {
                    scope.contexts = '';
                    if (angular.isDefined(response.contexts)) {
                        scope.contexts = response.contexts.split(',');
                    }
                }
            );

            /**
             * @param {string} context
             * @returns {string}
             */
            scope.getRootContext = function (context) {
                var i = 0,
                    length = scope.contexts.length;
                for (i; i < length; i++) {
                    if (ValidationService.doesStringStartWithSubstring(context, scope.contexts[i])) {
                        return scope.contexts[i];
                    }
                }
                return '';
            };

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
             * Wrapper for PresetRepository.deleteServer(server)
             *
             * @param {object} server
             * @return void
             */
            scope.deleteServer = function (server) {
                scope.toggleSpinnerAndOverlay();
                PresetRepository.deleteServer(server).then(
                    function () {
                        scope.$parent.getAllServers(false);
                        toaster.pop(
                            'success',
                            'Server deleted!',
                            'The Server "' + server.applications[0].nodes[0].name + '" was successfully removed.'
                        );
                    },
                    function () {
                        scope.toggleSpinnerAndOverlay();
                        toaster.pop(
                            'error',
                            'Deletion failed!',
                            'The Server "' + server.applications[0].nodes[0].name + '" could not be removed.'
                        );
                    }
                );
            };

            /**
             * Wrapper for PresetRepository.updateServer(server)
             *
             * @param {object} server
             * @return void
             */
            scope.updateServer = function (server) {
                scope.toggleSpinnerAndOverlay();
                PresetRepository.updateServer(server.applications[0]).then(
                    function () {
                        server.changed = false;
                        scope.toggleSpinnerAndOverlay();
                        if (angular.isDefined(scope.$parent.project)) {
                            ProjectRepository.updateFullProjectInCache(scope.$parent.project.repositoryUrl);
                        }
                        toaster.pop(
                            'success',
                            'Update successful!',
                            'The Server "' + server.applications[0].nodes[0].name + '" was updated successfully.'
                        );
                    },
                    function () {
                        scope.toggleSpinnerAndOverlay();
                        toaster.pop(
                            'error',
                            'Update failed!',
                            'The Server "' + server.applications[0].nodes[0].name + '" could not be updated.'
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
             * Validates the updated DeploymentPath string before submitting to Server
             *
             * @param data
             * @return {string | boolean} ErrorMessage or True if valid
             */
            scope.updateDeploymentPath = function (data) {
                var res = ValidationService.hasLength(data, 1, 'DeploymentPath is required!');
                if (res === true) {
                    return ValidationService.doesLastCharacterMatch(data, '/', 'DeploymentPath must end with "/"!');
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
                var i = 0,
                    length = scope.contexts.length;
                for (i; i < length; i++) {
                    if (ValidationService.doesStringStartWithSubstring(data, scope.contexts[i])) {
                        return true;
                    }
                }
                return 'Context must start with either Development, Testing or Production!';
            };

        };

        return {
            restrict: 'E',
            templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/ServerList.html',
            scope: {
                servers: '=',
                getAllServers: '&',
                finished: '=',
                messages: '=',
                project: '='
            },
            link: linker
        };
    }
    serverList.$inject = ['PresetRepository', 'ValidationService', 'toaster', 'SettingsRepository', 'ProjectRepository'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('serverNameValidate', serverNameValidate);

    /* @ngInject */
    function serverNameValidate() {
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
                    ctrl.$setValidity('server-name-validate', valid);

                    // if it's valid, return the value to the model,
                    // otherwise return undefined.
                    return valid ? value : undefined;
                });

                // add a formatter
                ctrl.$formatters.unshift(function (value) {
                    var valid = scope.serverNames === undefined || scope.serverNames.indexOf(value) === -1;
                    ctrl.$setValidity('server-name-validate', valid);

                    // return the value or nothing will be written to the DOM.
                    return value;
                });

            }
        };
    }
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('spinner', spinner);

    /* @ngInject */
    function spinner() {
        return {
            restrict: 'E',
            template: '<i class="fa fa-spinner fa-spin fa-4x"></i>'
        };
    }
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('startWithValidate', startWithValidate);

    /* @ngInject */
    function startWithValidate(ValidationService) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                startWithValidate: '='
            },
            link: function (scope, elem, attr, ctrl) {
                // add a parser
                ctrl.$parsers.unshift(function (value) {
                    var i = 0,
                        length;

                    if (angular.isUndefined(scope.startWithValidate)) {
                        ctrl.$setValidity('start-with-validate', true);
                        return value;
                    }
                    length = scope.startWithValidate.length;

                    for (i; i < length; i++) {
                        if (ValidationService.doesStringStartWithSubstring(value, scope.startWithValidate[i])) {
                            ctrl.$setValidity('start-with-validate', true);
                            return value;
                        }
                    }

                    ctrl.$setValidity('start-with-validate', false);
                    return undefined;
                });

                // add a formatter
                ctrl.$formatters.unshift(function (value) {
                    var i = 0,
                        length;

                    if (angular.isUndefined(scope.startWithValidate)) {
                        ctrl.$setValidity('start-with-validate', true);
                        return value;
                    }
                    length = scope.startWithValidate.length;

                    for (i; i < length; i++) {
                        if (ValidationService.doesStringStartWithSubstring(value, scope.startWithValidate[i])) {
                            ctrl.$setValidity('start-with-validate', true);
                            return value;
                        }
                    }

                    ctrl.$setValidity('start-with-validate', false);
                    return value;
                });

            }
        };
    }
    startWithValidate.$inject = ['ValidationService'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('surfcaptainHeader', surfcaptainHeader);

    /* @ngInject */
    function surfcaptainHeader($routeParams, $location, FavorService) {

        return {
            restrict: 'E',
            templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/Header.html',
            scope: {
                icon: '@'
            },
            link: linker,
            replace: true
        };

        function linker(scope) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.itemName;
            scope.context = lastUrlPart === scope.project ? '' : lastUrlPart;
            scope.favorites = FavorService.getFavoriteProjects();
        }
    }
    surfcaptainHeader.$inject = ['$routeParams', '$location', 'FavorService'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('surfcaptainMenu', surfcaptainMenu);

    /* @ngInject */
    function surfcaptainMenu($routeParams, $location) {

        return {
            restrict: 'E',
            templateUrl: '/_Resources/Static/Packages/Lightwerk.SurfCaptain/Scripts/SurfCaptainApp/Partials/Menu.html',
            scope: {},
            link: linker,
            replace: true
        };

        function linker(scope) {
            var lastUrlPart = $location.path().split('/').pop();
            scope.project = $routeParams.projectName;
            scope.context = lastUrlPart === scope.project ? 'history' : lastUrlPart;
        }
    }
    surfcaptainMenu.$inject = ['$routeParams', '$location'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('tab', tab);

    /* @ngInject */
    function tab() {
        return function (scope, element) {
            element.bind('click', function (e) {
                e.preventDefault();
                angular.element(this).tab('show');
            });
        };
    }
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('tooltip', tooltip);

    /* @ngInject */
    function tooltip() {
        return function (scope, element) {
            element.tooltip();
        };
    }
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .directive('appVersion', appVersion);

    /* @ngInject */
    function appVersion(version) {
        return function (scope, element) {
            element.text(version);
        };
    }
    appVersion.$inject = ['version'];
}());
/* global angular */
/* jshint -W044:true */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .filter('DeploymentTypeFilter', DeploymentTypeFilter);

    /* @ngInject */
    function DeploymentTypeFilter() {
        return function (input) {
            switch (input) {
                case 'TYPO3\CMS\Deploy':
                case 'TYPO3\\CMS\\Deploy':
                    return 'Deployment';
                case 'TYPO3\CMS\Shared':
                case 'TYPO3\\CMS\\Shared':
                    return 'Sync';
                default:
                    return input;
            }
        };
    }
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .filter('logCodeFilter', logCodeFilter);

    /* @ngInject */
    function logCodeFilter() {
        return function (input) {
            switch (input) {
                case 3:
                case '3':
                    return 'error';
                case 4:
                case '4':
                    return 'warning';
                case 5:
                case '5':
                    return 'notice';
                case 6:
                case '6':
                    return 'info';
                case 7:
                case '7':
                    return 'debug';
                default:
                    return input;
            }
        };
    }
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('DeploymentRepository', DeploymentRepository);

    /* @ngInject */
    function DeploymentRepository($http, $q, $cacheFactory) {

        var deploymentRepository = {},
            url = '/api/deployment';

        $cacheFactory('deploymentCache');

        /**
         * @param {object} deployment
         * @return {Q.promise|promise}
         */
        deploymentRepository.addDeployment = function (deployment) {
            var deploymentContainer = {
                    'configuration': {}
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
         * @return {promise|Q.promise}
         */
        deploymentRepository.getDeployments = function () {
            var deferred = $q.defer();
            $http.get(url).success(deferred.resolve).error(deferred.reject);
            return deferred.promise;
        };

        /**
         * @param {string} identifier
         * @return {promise|Q.promise}
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

        /**
         * @param deploymentId
         * @return {promise|Q.promise}
         */
        deploymentRepository.cancelDeployment = function (deploymentId) {
            var deferred = $q.defer();
            $http({
                'method': 'PUT',
                'url': url,
                'data': {
                    'deployment': {
                        '__identity': deploymentId,
                        'status': 'cancelled'
                    }
                }
            }).success(deferred.resolve).error(deferred.reject);
            return deferred.promise;
        };

        // Public API
        return {
            addDeployment: function (deployment) {
                return deploymentRepository.addDeployment(deployment);
            },
            cancelDeployment: function (deploymentId) {
                return deploymentRepository.cancelDeployment(deploymentId);
            },
            getAllDeployments: function () {
                return deploymentRepository.getDeployments();
            },
            getSingleDeployment: function (identifier) {
                return deploymentRepository.getSingleDeployment(identifier);
            }
        };
    }
    DeploymentRepository.$inject = ['$http', '$q', '$cacheFactory'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('PresetRepository', PresetRepository);

    /* @ngInject */
    function PresetRepository($http, $q) {
        var presetRepository = {},
            url = '/api/preset';

        function PresetRepositoryException(message) {
            this.name = 'PresetRepositoryException';
            this.message = message;
        }
        PresetRepositoryException.prototype = new Error();
        PresetRepositoryException.prototype.constructor = PresetRepositoryException;

        /**
         * Gets all servers from the collection
         *
         * @param {object} server
         * @returns {string} – json string
         */
        presetRepository.getFullPresetAsString = function (server) {
            return angular.toJson(presetRepository.getFullPreset(server), false);
        };

        /**
         * Gets all servers from the collection
         *
         * @param {object} server
         * @returns {object}
         */
        presetRepository.getFullPreset = function (server) {
            var container = {'applications': []};
            container.applications[0] = server;
            return container;
        };

        /**
         *
         * @param {object} server
         * @returns {string}
         * @throws {PresetRepositoryException}
         */
        presetRepository.getKeyFromServerConfiguration = function (server) {
            if (angular.isUndefined(server.nodes[0].name)) {
                if (angular.isUndefined(server.applications[0].nodes[0].name)) {
                    throw new PresetRepositoryException('PresetRepository.getKeyFromServerConfiguration failed. Server configuration contains no key.');
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
        presetRepository.getApplicationContainer = function (server) {
            var applicationContainer = {'applications': []};
            applicationContainer.applications[0] = server;
            return applicationContainer;
        };

        /**
         * Gets all servers from the collection
         *
         * @returns {Q.promise|promise} – promise object
         */
        presetRepository.getGlobalServers = function () {
            var deferred = $q.defer();
            $http.get(url + '?globals=1').success(deferred.resolve).error(deferred.reject);
            return deferred.promise;
        };

        /**
         * Adds a single server to the server collection
         *
         * @param {object} preset
         * @returns {Q.promise|promise} – promise object
         */
        presetRepository.putServer = function (preset) {
            return this.sendSinglePresetToApi(preset, 'put');
        };

        /**
         * Adds a single server to the server collection
         *
         * @param preset {object}
         * @returns {Q.promise|promise} – promise object
         */
        presetRepository.postServer = function (preset) {
            return this.sendSinglePresetToApi(preset, 'post');
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
        presetRepository.sendSinglePresetToApi = function (preset, method) {
            var deferred = $q.defer();
            $http({
                method: method,
                url: url,
                data: {
                    'key': this.getKeyFromServerConfiguration(preset),
                    'configuration': presetRepository.getFullPreset(preset)
                },
                headers: {
                    'Accept': 'application/json'
                }
            }).success(deferred.resolve).error(deferred.reject);
            return deferred.promise;
        };

        /**
         * Removes a single server from the server collection
         *
         * @param server {object}
         * @returns {Q.promise|promise} – promise object
         */
        presetRepository.deleteServer = function (server) {
            var deferred = $q.defer();
            $http.delete(url + '?key=' + presetRepository
                .getKeyFromServerConfiguration(server.applications[0]))
                .success(deferred.resolve)
                .error(deferred.reject);
            return deferred.promise;
        };

        // Public API
        return {
            getGlobalServers: function () {
                return presetRepository.getGlobalServers();
            },
            updateServer: function (server) {
                return presetRepository.putServer(server);
            },
            addServer: function (server) {
                return presetRepository.postServer(server);
            },
            deleteServer: function (server) {
                return presetRepository.deleteServer(server);
            }
        };
    }
    PresetRepository.$inject = ['$http', '$q'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('ProjectRepository', ProjectRepository);

    /* @ngInject */
    function ProjectRepository($http, $q, $cacheFactory) {
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
    }
    ProjectRepository.$inject = ['$http', '$q', '$cacheFactory'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .factory('SettingsRepository', SettingsRepository);

    /* @ngInject */
    function SettingsRepository($http, $q, $cacheFactory) {
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
    }
    SettingsRepository.$inject = ['$http', '$q', '$cacheFactory'];
}());
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
    FavorService.$inject = ['cookieStore', 'ProjectRepository'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('MarkerService', MarkerService);

    /* @ngInject */
    function MarkerService() {
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

        /**
         * @param {string} string
         * @returns {boolean}
         */
        this.containsMarker = function (string) {
            return this.getFirstMarker(string) !== null;
        };
    }
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('PresetService', PresetService);

    /* @ngInject */
    function PresetService(SettingsRepository, ValidationService) {

        var newPreset = {
                'options': {
                    'repositoryUrl': '',
                    'deploymentPath': '',
                    'context': ''
                },
                'nodes': [
                    {
                        'name': '',
                        'hostname': '',
                        'username': ''
                    }
                ]
            },
            self = this;

        this.contexts = [];

        /**
         * @return {void}
         */
        this.setContexts = function () {
            if (self.contexts.length === 0) {
                SettingsRepository.getSettings().then(
                    function (response) {
                        self.contexts = [];
                        if (angular.isDefined(response.contexts)) {
                            self.contexts = response.contexts.split(',');
                        }
                    }
                );
            }
        };


        /**
         * A new preset skeleton is returned with options from an optional
         * passed configuration object (like frontendSettings). Used
         * properties in configuration are:
         *
         *  - defaultUser (Sets the Username in the first Node)
         *  - defaultDeploymentPath (Sets the deploymentPath in the options.
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
                if (angular.isDefined(configuration.defaultDeploymentPath)) {
                    preset.options.deploymentPath = configuration.defaultDeploymentPath;
                }
            }
            return preset;
        };

        /**
         * @param {string} context
         * @param {array} contexts
         * @returns {string}
         */
        this.getRootContext = function (context, contexts) {
            this.setContexts();
            var i = 0,
                length = contexts.length;
            for (i; i < length; i++) {
                if (ValidationService.doesStringStartWithSubstring(context, contexts[i])) {
                    return contexts[i];
                }
            }
            return 'unknown-context';
        };

        /**
         * @param {object} preset
         * @returns {boolean}
         */
        this.isPresetGlobal = function (preset) {
            if (angular.isUndefined(preset.applications) || !angular.isArray(preset.applications)) {
                return false;
            }
            if (preset.applications.length === 0) {
                return false;
            }
            if (angular.isUndefined(preset.applications[0].options)) {
                return false;
            }
            return angular.isUndefined(preset.applications[0].options.repositoryUrl) || preset.applications[0].options.repositoryUrl === '';
        };
    }
    PresetService.$inject = ['SettingsRepository', 'ValidationService'];
}());
/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('UtilityService', UtilityService);

    /* @ngInject */
    function UtilityService() {

        /**
         *
         * @param {string} name
         * @param {array} tags
         * @returns {string}
         */
        this.getDeployedTag = function (name, tags) {
            var length = tags.length,
                i = 0,
                commit;
            for (i; i < length; i++) {
                if (tags[i].name === 'server-' + name) {
                    commit = tags[i].commit;
                }
            }
            if (angular.isUndefined(commit)) {
                return 'No deployed tag found.';
            }
            i = 0;
            for (i; i < length; i++) {
                if (tags[i].commit.id === commit.id && tags[i].name !== 'server-' + name) {
                    return tags[i].type + ' ' + tags[i].name + ' - ' + commit.committerName + ': "' + commit.message + '"';
                }
            }
            return commit.id + ' - ' + commit.committerName + ': "' + commit.message + '"';
        };

        /**
         * Sort function to show most recent commits at the
         * start of the array. Use this as compareFunction
         * in an array.sort().
         *
         * @param {object} a
         * @param {object} b
         * @returns {number}
         */
        this.byCommitDate = function (a, b) {
            if (a.commit.date < b.commit.date) {
                return 1;
            }
            return -1;
        };
    }
}());

/* global angular */

(function () {
    'use strict';
    angular
        .module('surfCaptain')
        .service('ValidationService', ValidationService);

    /* @ngInject */
    function ValidationService() {
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

        /**
         * Validates if a given Substring is found within a given string.
         *
         * @param {string} string
         * @param {string} substring
         * @param {string} message
         * @returns {string|boolean}
         */
        this.doesStringStartWithSubstring = function (string, substring, message) {
            if (typeof string === 'string' && string.indexOf(substring) === 0) {
                return true;
            }
            return message || false;
        };
    }
}());