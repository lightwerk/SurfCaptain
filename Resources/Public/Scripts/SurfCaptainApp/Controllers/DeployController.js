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
        this.selectBranchByName = selectBranchByName;
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
         * @param {string} name
         * @param {Array} branches
         * @return void
         */
        function selectBranchByName(name, branches) {
            for (var i = 0; i < branches.length; i++) {
                if (angular.isDefined(branches[i].name) && branches[i].name === name) {
                    $scope.selectedCommit = branches[i].identifier;
                    return;
                }
            }
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

                    self.selectBranchByName('master', response.repository.branches);

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
}());