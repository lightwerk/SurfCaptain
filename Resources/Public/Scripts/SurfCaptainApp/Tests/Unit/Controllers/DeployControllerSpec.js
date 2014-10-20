/*global describe,beforeEach,module,it,expect,inject,angular,spyOn*/

describe('Deployontroller', function () {
    'use strict';
    var ctrl, scope, toaster, preset, commit, DeploymentRepository, ProjectRepository, $location, CONFIG, q, presets, UtilityService;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, _toaster_, _DeploymentRepository_, _ProjectRepository_, _CONFIG_, _UtilityService_, $q) {
        scope = $rootScope.$new();
        toaster = _toaster_;
        DeploymentRepository = _DeploymentRepository_;
        ProjectRepository = _ProjectRepository_;
        $location = {
            path: function (path) {
                return path;
            },
            search: function () {
                return {server: 'foobaar'};
            }
        };
        CONFIG = _CONFIG_;
        q = $q;
        UtilityService = _UtilityService_;
        ctrl = $controller('DeployController', {
            $scope: scope,
            toaster: toaster,
            DeploymentRepository: DeploymentRepository,
            ProjectRepository: ProjectRepository,
            $location: $location,
            CONFIG: CONFIG,
            UtilityService: UtilityService
        });
    }));

    // providing a dummy preset and dummy commit
    beforeEach(function () {
        preset = {
            'applications': [
                {
                    'options': {
                        'repositoryUrl': 'git@git.example.com:project/foo.git',
                        'deploymentPath': '/var/www/foo/staging/',
                        'context': 'Testing',
                        'branch': 'foo',
                        'tag': '1.0.0',
                        'sha1': '11111111111111111111111111111'
                    },
                    'nodes': [
                        {
                            'name': 'foo-staging',
                            'hostname': '127.0.0.1',
                            'username': 'foobar'
                        }
                    ],
                    'type': 'TYPO3\\CMS\\Deploy'
                }
            ]
        };
        commit = {
            type: 'Branch',
            name: 'fooBar',
            commit: {
                id: '123'
            },
            identifier: 'abcdefg'
        };
    });

    describe('Initialization', function () {
        it('should initialize $scope.deployableCommits.', function () {
            expect(scope.deployableCommits).toBeDefined();
        });
        it('should initialize $scope.deployableCommits as Array.', function () {
            expect(angular.isArray(scope.deployableCommits)).toBeTruthy();
        });
        it('should initialize $scope.deployableCommits with two items.', function () {
            expect(scope.deployableCommits.length).toEqual(2);
        });
        it('should initialize $scope.servers.', function () {
            expect(scope.servers).toBeDefined();
        });
        it('should initialize $scope.servers as Array.', function () {
            expect(angular.isArray(scope.servers)).toBeTruthy();
        });
        it('should initialize $scope.servers as empty.', function () {
            expect(scope.servers.length).toEqual(0);
        });
        it('should initialize $scope.error.', function () {
            expect(scope.error).toBeDefined();
        });
        it('should initialize $scope.error as false.', function () {
            expect(scope.error).toBeFalsy();
        });
        it('should initialize $scope.finished.', function () {
            expect(scope.finished).toBeDefined();
        });
        it('should initialize $scope.finished as false.', function () {
            expect(scope.finished).toBeFalsy();
        });
        it('should initialize $scope.currentPreset.', function () {
            expect(scope.currentPreset).toBeDefined();
        });
        it('should initialize $scope.currentPreset as empty Object.', function () {
            expect(scope.currentPreset).toEqual({});
        });
        it('should initialize $scope.tags as Array.', function () {
            expect(angular.isArray(scope.tags)).toBeTruthy();
        });
        it('should initialize $scope.tags as empty.', function () {
            expect(scope.tags.length).toEqual(0);
        });
    });

    describe('->addFailureFlashMessage()', function () {
        beforeEach(function () {
            spyOn(toaster, 'pop');
        });

        it('should be defined.', function () {
            expect(ctrl.addFailureFlashMessage).toBeDefined();
        });
        it('should set $scope.finished to true.', function () {
            ctrl.addFailureFlashMessage();
            expect(scope.finished).toBeTruthy();
        });
        it('should call toaster.pop().', function () {
            ctrl.addFailureFlashMessage();
            expect(toaster.pop).toHaveBeenCalled();
        });
        it('should set $scope.error to true.', function () {
            ctrl.addFailureFlashMessage();
            expect(scope.error).toBeTruthy();
        });
    });

    describe('->getCurrentCommit()', function () {
        beforeEach(function () {
            scope.selectedCommit = commit.identifier;
        });

        it('should throw an error if $scope.selectedCommit is not found within $scope.deployableCommits.', function () {
            function errorFunctionWrapper() {
                ctrl.getCurrentCommit();
            }
            expect(errorFunctionWrapper).toThrow();
        });
        it('should throw an error if $scope.selectedCommit is found more than once within $scope.deployableCommits.', function () {
            scope.deployableCommits.push(commit);
            scope.deployableCommits.push(commit);
            function errorFunctionWrapper() {
                ctrl.getCurrentCommit();
            }
            expect(errorFunctionWrapper).toThrow();
        });
        it('should return the commit object with matching identifier if it is found once in $scope.deployableCommits.', function () {
            scope.deployableCommits.push(commit);
            expect(ctrl.getCurrentCommit()).toEqual(commit);
        });
    });

    describe('->setServersFromPresets()', function () {
        beforeEach(function () {
            presets = [];
            spyOn(ctrl, 'setPreconfiguredServer');
        });

        it('should be defined.', function () {
            expect(ctrl.setServersFromPresets).toBeDefined();
        });

        it('should add a server to $scope.servers if the applicationType is TYPO3Deploy.', function () {
            preset.applications[0].type = CONFIG.applicationTypes.deployTYPO3;
            presets.push(preset);
            scope.servers = [];
            ctrl.setServersFromPresets(presets);
            expect(scope.servers).toContain(preset);
        });

        it('should add a server to $scope.servers if the applicationType is "deploy".', function () {
            preset.applications[0].type = CONFIG.applicationTypes.deploy;
            presets.push(preset);
            scope.servers = [];
            ctrl.setServersFromPresets(presets);
            expect(scope.servers).toContain(preset);
        });

        it('should add a server to $scope.servers if the applicationType is undefined.', function () {
            delete preset.applications[0].type;
            presets.push(preset);
            scope.servers = [];
            ctrl.setServersFromPresets(presets);
            expect(scope.servers).toContain(preset);
        });

        it('should not add a server to $scope.servers if the applicationType is something else.', function () {
            preset.applications[0].type = 'foo';
            presets.push(preset);
            scope.servers = [];
            ctrl.setServersFromPresets(presets);
            expect(scope.servers).not.toContain(preset);
        });

        it('should call ctrl.setPreconfiguredServer()', function () {
            ctrl.setServersFromPresets();
            expect(ctrl.setPreconfiguredServer).toHaveBeenCalled();
        });
    });

    describe('->setPreconfiguredServer()', function () {
        beforeEach(function () {
            spyOn(scope, 'setCurrentPreset');
            scope.servers.push(preset);
        });
        it('should be defined', function () {
            expect(ctrl.setPreconfiguredServer).toBeDefined();
        });
        it('should not call setCurrentPreset on controller if no server parameter is set.', function () {
            $location.search = function () {return{};};
            ctrl.setPreconfiguredServer();
            expect(scope.setCurrentPreset).not.toHaveBeenCalled();
        });
        it('should not call setCurrentPreset on controller if server parameter is set but not found in $scope.servers.', function () {
            $location.search = function () {return{'server': 'baz'};};
            ctrl.setPreconfiguredServer();
            expect(scope.setCurrentPreset).not.toHaveBeenCalled();
        });
        it('should call setCurrentPreset on controller if server parameter is set and found in $scope.servers.', function () {
            $location.search = function () {return{'server': 'foo-staging'};};
            ctrl.setPreconfiguredServer();
            expect(scope.setCurrentPreset).toHaveBeenCalled();
        });
        it('should call setCurrentPreset on controller with whole preset if server parameter is set and found in $scope.servers.', function () {
            $location.search = function () {return{'server': 'foo-staging'};};
            ctrl.setPreconfiguredServer();
            expect(scope.setCurrentPreset).toHaveBeenCalledWith(preset);
        });
    });

    describe('$scope.setCurrentPreset()', function () {
        beforeEach(function () {
            spyOn(scope, 'setCommitInCurrentPreset');
        });
        it('should be defined.', function () {
            expect(scope.setCurrentPreset).toBeDefined();
        });
        it('should set $scope.currentPreset to the passed object.', function () {
            scope.setCurrentPreset(preset);
            expect(scope.currentPreset).toEqual(preset);
        });
        it('should not call scope.setCommitInCurrentPreset() if $scope.selectedCommit is undefined.', function () {
            scope.selectedCommit = undefined;
            scope.setCurrentPreset(preset);
            expect(scope.setCommitInCurrentPreset).not.toHaveBeenCalled();
        });
        it('should not call scope.setCommitInCurrentPreset() if $scope.selectedCommit is empty string.', function () {
            scope.selectedCommit = '';
            scope.setCurrentPreset(preset);
            expect(scope.setCommitInCurrentPreset).not.toHaveBeenCalled();
        });
        it('should not call scope.setCommitInCurrentPreset() if $scope.selectedCommit is neither empty string nor undefined.', function () {
            scope.selectedCommit = 'foo';
            scope.setCurrentPreset(preset);
            expect(scope.setCommitInCurrentPreset).toHaveBeenCalled();
        });
    });

    describe('$scope.setCommitInCurrentPreset()', function () {
        it('should be defined.', function () {
            expect(scope.setCommitInCurrentPreset).toBeDefined();
        });

        describe('calling of getCurrentCommit() on controller', function () {
            beforeEach(function () {
                spyOn(ctrl, 'addFailureFlashMessage');
                scope.currentPreset = preset;
            });

            it('should happen.', function () {
                spyOn(ctrl, 'getCurrentCommit');
                scope.setCommitInCurrentPreset();
                expect(ctrl.getCurrentCommit).toHaveBeenCalled();
            });

            describe('successfully for type "Branch"', function () {
                beforeEach(function () {
                    commit.type = 'Branch';
                    expect(preset.applications[0].options.tag).toBeDefined();
                    spyOn(ctrl, 'getCurrentCommit').andReturn(commit);
                    scope.setCommitInCurrentPreset();
                });

                it('should set $scope.currentCommit to return value of getCurrentCommit', function () {
                    expect(scope.currentCommit).toEqual(commit);
                });
                it('should unset tag in $scope.currentPreset if type of currentCommit is "Branch".', function () {
                    expect(preset.applications[0].options.tag).not.toBeDefined();
                });
                it('should set branch of  $scope.currentPreset to name of currentCommit if type is "Branch".', function () {
                    expect(preset.applications[0].options.branch).toEqual(commit.name);
                });
            });

            describe('successfully for type "Tag"', function () {
                beforeEach(function () {
                    commit.type = 'Tag';
                    expect(preset.applications[0].options.branch).toBeDefined();
                    spyOn(ctrl, 'getCurrentCommit').andReturn(commit);
                    scope.setCommitInCurrentPreset();
                });

                it('should unset branch in $scope.currentPreset if type of currentCommit is "Tag".', function () {
                    expect(preset.applications[0].options.branch).not.toBeDefined();
                });
                it('should set tag of  $scope.currentPreset to name of currentCommit if type is "Tag".', function () {
                    expect(preset.applications[0].options.tag).toEqual(commit.name);
                });
            });

            describe('successfully for neither type "Tag" nor "Branch"', function () {
                beforeEach(function () {
                    commit.type = 'foo';
                    spyOn(ctrl, 'getCurrentCommit').andReturn(commit);
                    scope.setCommitInCurrentPreset();
                });

                it('should call addFailureFlashMessage on controller.', function () {
                    expect(ctrl.addFailureFlashMessage).toHaveBeenCalled();
                });
                it('should set $scope.currentCommit to null.', function () {
                    expect(scope.currentCommit).toBeNull();
                });
            });

            describe('unsuccessfully', function () {
                beforeEach(function () {
                    spyOn(ctrl, 'getCurrentCommit').andThrow(new Error('Error!s'));
                    scope.setCommitInCurrentPreset();
                });

                it('should call addFailureFlashMessage on controller.', function () {
                    expect(ctrl.addFailureFlashMessage).toHaveBeenCalled();
                });
                it('should set $scope.currentCommit to null.', function () {
                    expect(scope.currentCommit).toBeNull();
                });
            });

        });
    });

    describe('$scope.presetDisplay', function () {
        beforeEach(function () {
            scope.currentPreset = preset;
        });

        it('should return empty string if no application is defined in $scope.currentPreset.', function () {
            delete scope.currentPreset.applications;
            expect(scope.presetDisplay(preset)).toEqual('');
        });
        it('should return empty string if $scope.currentPreset equals the passed preset.', function () {
            expect(scope.presetDisplay(preset)).toEqual('');
        });
        it('should return "disabled" if $scope.currentPreset has Applications but does not equal the passed preset.', function () {
            scope.currentPreset = angular.copy(preset);
            expect(scope.presetDisplay(preset)).toEqual('disabled');
        });
    });

    describe('$scope.deploy', function () {

        beforeEach(function () {
            spyOn(DeploymentRepository, 'addDeployment').andCallFake(
                function () {
                    var defer = q.defer();
                    return defer.promise;
                }
            );
        });

        it('should be defined.', function () {
            expect(scope.deploy).toBeDefined();
        });

        describe('with matching presets', function () {
            beforeEach(function () {
                scope.currentPreset = preset;
                scope.project = {
                    repositoryUrl: 'foo/bar'
                };
            });

            it('should set the TYPO3Deploy type if no type is set in currentPreset.', function () {
                delete scope.currentPreset.applications[0].type;
                scope.deploy(preset);
                expect(scope.currentPreset.applications[0].type).toEqual(CONFIG.applicationTypes.deployTYPO3);
            });

            it('should delete property deploymentPathWithMarkers if it is present in currentPreset.', function () {
                scope.currentPreset.applications[0].options.deploymentPathWithMarkers = true;
                scope.deploy(preset);
                expect(scope.currentPreset.applications[0].options.deploymentPathWithMarkers).not.toBeDefined();
            });

            it('should set the repositoryUrl if it is not set in currentPreset.', function () {
                delete scope.currentPreset.applications[0].options.repositoryUrl;
                scope.deploy(preset);
                expect(scope.currentPreset.applications[0].options.repositoryUrl).toEqual(scope.project.repositoryUrl);
            });

            it('should set the repositoryUrl if it is an empty string in currentPreset.', function () {
                scope.currentPreset.applications[0].options.repositoryUrl = '';
                scope.deploy(preset);
                expect(scope.currentPreset.applications[0].options.repositoryUrl).toEqual(scope.project.repositoryUrl);
            });

            it('should call DeploymentRepository.addDeployment().', function () {
                scope.deploy(preset);
                expect(DeploymentRepository.addDeployment).toHaveBeenCalled();
            });
        });

        describe('with unmatching presets', function () {

            beforeEach(function () {
                spyOn(toaster, 'pop');
                scope.deploy();
            });

            it('should not call DeploymentRepository.addDeployment().', function () {
                expect(DeploymentRepository.addDeployment).not.toHaveBeenCalled();
            });
            it('should not call toaster.pop().', function () {
                expect(toaster.pop).toHaveBeenCalled();
            });
        });
    });

    describe('$scope.getDeployedTag', function () {

        beforeEach(function () {
            spyOn(UtilityService, 'getDeployedTag');
        });
        it('should be defined', function () {
            scope.tags = [];
            expect(scope.getDeployedTag).toBeDefined();
        });
        it('should call UtilityService.getDeployedTag.', function () {
            scope.getDeployedTag();
            expect(UtilityService.getDeployedTag).toHaveBeenCalled();
        });
        it('should pass argument and $scope.tags to UtilityService.getDeployedTag.', function () {
            scope.getDeployedTag('foo');
            expect(UtilityService.getDeployedTag).toHaveBeenCalledWith('foo', scope.tags);
        });
    });
});