/*global angular,describe,beforeEach,afterEach,module,it,xit,expect,inject,spyOn*/

describe('ServerController', function () {
    var ctrl, scope, nameSuggestions, q, projects, MarkerService, PresetRepository,
        PresetService, FlashMessageService, settings, server, ProjectRepository, $http,
        SettingsRepository, newPreset, success, ValidationService, returnString,
        simulateReceivementOfProjectData = function () {
            scope.$digest();
            scope.$apply(function () {
                scope.project = projects[0];
                scope.projects = projects;
            });
        };

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();

        ctrl = $controller('ServerController', {
            $scope: scope
        });
    }));

    //#################
    // setServerNames #
    //#################

    it('should have a method setServerNames.', function () {
        expect(ctrl.setServerNames).toBeDefined();
    });

    describe('->setServerNames()', function () {

        beforeEach(function () {
            scope.serverNames = ['foo', 'bar'];
        });

        it('should set $scope.serverNames to empty array if $scope.Servers is also empty.', function () {
            ctrl.setServerNames();
            expect(scope.serverNames).toEqual([]);
        });

        it('should set $scope.serverNames to empty array if $scope.Servers is an empty object.', function () {
            scope.servers = {};
            ctrl.setServerNames();
            expect(scope.serverNames).toEqual([]);
        });

        it('should set $scope.serverNames to names of presets in $scope.Servers.', function () {
            scope.servers = {
                presetA: {},
                presetB: {}
            };
            ctrl.setServerNames();
            expect(scope.serverNames).toEqual(['presetA', 'presetB']);
        });

        afterEach(function () {
            scope.serverNames = [];
        });
    });

    //##############################################
    // setTakenServerNamesAsUnavailableSuggestions #
    //##############################################

    it('should have a method setTakenServerNamesAsUnavailableSuggestions.', function () {
        expect(ctrl.setTakenServerNamesAsUnavailableSuggestions).toBeDefined();
    });

    describe('->setTakenServerNamesAsUnavailableSuggestions()', function () {

        beforeEach(function () {
            nameSuggestions = [
                {
                    suffix: 'foo',
                    available: true,
                    context: 'foo'
                },
                {
                    suffix: 'bar',
                    available: true,
                    context: 'bar'
                }
            ];
            scope.serverNames = ['foo-dev', 'bar-qa'];
            spyOn(scope, 'generateServerName').andCallFake(function (suffix) {
                if (suffix === 'bar') {
                    return 'generated-server-name';
                }
            });

        });

        it('should keep $scope.nameSuggestions unchanged if $scope.serverNames don\'t contain a suggestion.', function () {
            scope.nameSuggestions = angular.copy(nameSuggestions);
            ctrl.setTakenServerNamesAsUnavailableSuggestions();
            expect(scope.nameSuggestions).toEqual(nameSuggestions);
        });

        it('should set $scope.nameSuggestions item to unavailable if generated server name is in $scope.ServerNames.', function () {
            var expectedNameSuggestions = angular.copy(nameSuggestions);
            expectedNameSuggestions[1].available = false;
            scope.nameSuggestions = angular.copy(nameSuggestions);
            scope.serverNames.push('generated-server-name');
            ctrl.setTakenServerNamesAsUnavailableSuggestions();
            expect(scope.nameSuggestions).toEqual(expectedNameSuggestions);
        });

        afterEach(function () {
            scope.serverNames = [];
        });
    });

    //##########################
    // generateNameSuggestions #
    //##########################

    it('should have a method generateNameSuggestions.', function () {
        expect(ctrl.generateNameSuggestions).toBeDefined();
    });

    describe('->generateNameSuggestions()', function () {

        beforeEach(function () {
            nameSuggestions = {
                foo: 'bar',
                bar: 'foo'
            };
        });

        it('should set $scope.nameSuggestions to an empty array.', function () {
            ctrl.generateNameSuggestions();
            expect(scope.nameSuggestions).toEqual([]);
        });

        it('should set $scope.nameSuggestions to an empty containing objects build from passed nameSuggestions.', function () {
            ctrl.generateNameSuggestions(nameSuggestions);
            expect(scope.nameSuggestions).toEqual([
                {
                    suffix: 'foo',
                    available: true,
                    context: 'bar'
                },
                {
                    suffix: 'bar',
                    available: true,
                    context: 'foo'
                }
            ]);
        });
    });

    //#################
    // handleSettings #
    //#################

    it('should have a method handleSettings.', function () {
        expect(ctrl.handleSettings).toBeDefined();
    });

    describe('->handleSettings()', function () {
        beforeEach(inject(function ($controller, $rootScope, _MarkerService_, _ValidationService_) {
            scope = $rootScope.$new();
            MarkerService = _MarkerService_;
            ValidationService = _ValidationService_;
            returnString = '';

            ctrl = $controller('ServerController', {
                $scope: scope,
                MarkerService: MarkerService,
                ValidationService: ValidationService
            });

            scope.newPreset = {
                options: {}
            };

            scope.settings = {
                defaultDeploymentPath: '{{foo}}',
                nameSuggestions: ['a', 'b']
            };

            spyOn(ctrl, 'generateNameSuggestions');
            spyOn(ValidationService, 'doesStringContainSubstring').andCallThrough();
            spyOn(MarkerService, 'replaceMarkers').andCallFake(function () {
                return returnString;
            });
            spyOn(MarkerService, 'getStringBeforeFirstMarker').andReturn('foo/');
        }));

        it('should set $scope.contexts to empty string if no contexts are set in settings.', function () {
            ctrl.handleSettings();
            expect(scope.contexts).toEqual('');
        });

        it('should set $scope.contexts to array if settings.contexts contains a value.', function () {
            scope.settings.contexts = 'Production';
            ctrl.handleSettings();
            expect(scope.contexts).toEqual(['Production']);
        });

        it('should set $scope.contexts to array if settings.contexts contains comma separated values.', function () {
            scope.settings.contexts = 'Production,Development';
            ctrl.handleSettings();
            expect(scope.contexts).toEqual(['Production', 'Development']);
        });

        it('should not call generateNameSuggestions on controller if $scope.settings.nameSuggestions are undefined.', function () {
            scope.settings = {};
            ctrl.handleSettings();
            expect(ctrl.generateNameSuggestions).not.toHaveBeenCalled();
        });

        it('should call generateNameSuggestions on controller if $scope.settings.nameSuggestions are defined.', function () {
            ctrl.handleSettings();
            expect(ctrl.generateNameSuggestions).toHaveBeenCalled();
        });

        it('should not call anything on MarkerService nor ValidationService if $scope.settings.defaultDeploymentPath is undefined.', function () {
            scope.settings = {};
            ctrl.handleSettings();
            expect(MarkerService.getStringBeforeFirstMarker).not.toHaveBeenCalled();
            expect(MarkerService.replaceMarkers).not.toHaveBeenCalled();
            expect(ValidationService.doesStringContainSubstring).not.toHaveBeenCalled();
        });

        it('should call ValidationService.doesStringContainSubstring twice if $scope.settings.defaultDeploymentPath is defined.', function () {
            ctrl.handleSettings();
            expect(ValidationService.doesStringContainSubstring.callCount).toEqual(2);
        });

        it('should call MarkerService.replaceMarkers if $scope.settings.defaultDeploymentPath contains "{{".', function () {
            ctrl.handleSettings();
            expect(MarkerService.replaceMarkers).toHaveBeenCalled();
        });

        it('should store return value of MarkerService.replaceMarkers in $scope.newPreset.options.deploymentPath if it contains no "{{".', function () {
            returnString = 'foo';
            ctrl.handleSettings();
            expect(scope.newPreset.options.deploymentPath).toEqual('foo');
        });

        it('should not set $scope.newPreset.options.deploymentPathWithMarkers if return value of MarkerService.replaceMarkers contains no "{{".', function () {
            returnString = 'foo';
            ctrl.handleSettings();
            expect(scope.newPreset.options.deploymentPathWithMarker).not.toBeDefined();
        });

        it('should call MarkerService.getStringBeforeFirstMarker if return value of MarkerService.replaceMarkers contains further "{{".', function () {
            returnString = 'foo/{{suffix}}';
            ctrl.handleSettings();
            expect(MarkerService.getStringBeforeFirstMarker).toHaveBeenCalledWith('foo/{{suffix}}');
        });

        it('should store the return of MarkerService.getStringBeforeFirstMarker in $scope.newPreset.options.deploymentPath.', function () {
            returnString = 'foo/{{suffix}}';
            ctrl.handleSettings();
            expect(scope.newPreset.options.deploymentPath).toEqual('foo/');
        });

        it('should store the return of MarkerService.replaceMarkers in $scope.newPreset.options.deploymentPathWithMarkers if it contains any "{{".', function () {
            returnString = 'foo/{{suffix}}';
            ctrl.handleSettings();
            expect(scope.newPreset.options.deploymentPathWithMarkers).toEqual('foo/{{suffix}}');
        });

    });

    //#########
    // $scope #
    //#########

    describe('$scope', function () {

        describe('Initialization', function () {

            it('should initialize $scope.finished with false.', function () {
                expect(scope.finished).toBeFalsy();
            });

            it('should initialize $scope.currentPreset with empty object.', function () {
                expect(scope.currentPreset).toEqual({});
            });

            it('should initialize $scope.messages with empty array.', function () {
                expect(scope.messages).toEqual([]);
            });

            it('should initialize $scope.serverNames with empty array.', function () {
                expect(scope.serverNames).toEqual([]);
            });

            it('should initialize $scope.currentPreset with empty object.', function () {
                expect(scope.currentPreset).toEqual({});
            });
        });

        //#########################
        // $scope->getAllServers()#
        //#########################

        it('should have a method getAllServers.', function () {
            expect(scope.getAllServers).toBeDefined();
        });

        describe('->getAllServers()', function () {
            beforeEach(inject(function ($controller, $rootScope, _ProjectRepository_,_FlashMessageService_, $q, _$httpBackend_) {
                scope = $rootScope.$new();
                ProjectRepository = _ProjectRepository_;
                FlashMessageService = _FlashMessageService_;
                q = $q;
                $http = _$httpBackend_;
                success = true;

                ctrl = $controller('ServerController', {
                    $scope: scope,
                    ProjectRepository: ProjectRepository,
                    FlashMessageService: FlashMessageService
                });

                scope.newPreset = {
                    options: {}
                };

                scope.project = {
                    repositoryUrl: 'foo/bar'
                };

                scope.nameSuggestions = nameSuggestions;

                spyOn(ProjectRepository, 'getFullProjectByRepositoryUrl').andCallFake(function () {
                    if (success) {
                        return $q.when({repository: {
                            presets: ['a', 'b']
                        }});
                    }
                    return $q.reject();
                });
                spyOn(FlashMessageService, 'addFlashMessage');
                spyOn(ctrl, 'setServerNames');
                spyOn(ctrl, 'setTakenServerNamesAsUnavailableSuggestions');

                // The call of the extended controller cant be prevented by a spy ...
                $http.whenGET('/api/repository').respond({ hello: 'World' });
            }));

            it('should set the repositoryUrl of the newPreset to the scope.project.repositoryUrl.', function () {
                scope.getAllServers();
                expect(scope.newPreset.options.repositoryUrl).toEqual('foo/bar');
            });

            it('should call PresetRepository.getServers().', function () {
                scope.getAllServers();
                expect(ProjectRepository.getFullProjectByRepositoryUrl).toHaveBeenCalled();
            });

            describe('on success', function () {
                beforeEach(function () {
                    scope.getAllServers();
                    scope.$digest();
                });

                it('should set $scope.finished to true.', function () {
                    expect(scope.finished).toBeTruthy();
                });

                it('should set $scope.servers to response.repository.presets.', function () {
                    expect(scope.servers).toEqual(['a', 'b']);
                });

                it('should call setServerNames on controller', function () {
                    expect(ctrl.setServerNames).toHaveBeenCalled();
                });

                it('should call setTakenServerNamesAsUnavailableSuggestions on controller if $scope.nameSuggestions are defined', function () {
                    expect(ctrl.setTakenServerNamesAsUnavailableSuggestions).toHaveBeenCalled();
                    nameSuggestions = undefined;
                });

                it('should not call setTakenServerNamesAsUnavailableSuggestions on controller if $scope.nameSuggestions are undefined', function () {
                    expect(ctrl.setTakenServerNamesAsUnavailableSuggestions).not.toHaveBeenCalled();
                });

                it('should not call FlashMessageService.addFlashMessage if $scope.servers is not an empty array.', function () {
                    expect(FlashMessageService.addFlashMessage).not.toHaveBeenCalled();
                });
            });

            describe('on failure', function () {
                beforeEach(function () {
                    success = false;
                    scope.getAllServers();
                    scope.$digest();
                });

                it('should set $scope.finished to true.', function () {
                    expect(scope.finished).toBeTruthy();
                });

                it('should call FlashMessageService.addFlashMessage.', function () {
                    expect(FlashMessageService.addFlashMessage).toHaveBeenCalled();
                });
            });

        });

        //###########################
        // $scope->setDeploymentPath()#
        //###########################

        it('should have a method setDeploymentPath.', function () {
            expect(scope.setDeploymentPath).toBeDefined();
        });

        describe('->setDeploymentPath()', function () {
            beforeEach(inject(function ($controller, $rootScope, _MarkerService_) {
                scope = $rootScope.$new();
                MarkerService = _MarkerService_;

                ctrl = $controller('ServerController', {
                    $scope: scope,
                    MarkerService: MarkerService
                });
            }));

            beforeEach(function () {
                scope.newPreset = {
                    options: {
                        deploymentPathWithMarkers: 'bar/{{suffix}}/htdocs',
                        deploymentPath: 'foo'
                    }
                };

                spyOn(MarkerService, 'replaceMarkers').andReturn('markerServiceReturn');
            });

            it('should call MarkerService->replaceMarkers with deploymentPathWithMarkers and the passed suffix.', function () {
                scope.setDeploymentPath('live');
                expect(MarkerService.replaceMarkers).toHaveBeenCalledWith(scope.newPreset.options.deploymentPathWithMarkers, {suffix: 'live'});
            });

            it('should fill the deploymentPath of the newPreset with the return value of MarkerService->replaceMarkers().', function () {
                scope.setDeploymentPath('live');
                expect(scope.newPreset.options.deploymentPath).toEqual('markerServiceReturn');
            });

            it('should leave the deploymentPath in newPreset if deploymentPathWithMarkers is not defined.', function () {
                delete scope.newPreset.options.deploymentPathWithMarkers;
                scope.setDeploymentPath('live');
                expect(scope.newPreset.options.deploymentPath).toEqual('foo');
            });
        });

        //#####################
        // $scope->addServer()#
        //#####################

        it('should have a method addServer.', function () {
            expect(scope.addServer).toBeDefined();
        });

        describe('->addServer()', function () {
            beforeEach(inject(function ($controller, $rootScope, _PresetService_, _PresetRepository_,_FlashMessageService_, $q, _$httpBackend_) {
                scope = $rootScope.$new();
                PresetRepository = _PresetRepository_;
                PresetService = _PresetService_;
                FlashMessageService = _FlashMessageService_;
                q = $q;
                $http = _$httpBackend_;
                success = true;

                settings = {a: 'b'};
                scope.settings = settings;

                server = {
                    success: success,
                    options: {
                        deploymentPathWithMarkers: 'foo/{{marker}}/'
                    }
                };

                ctrl = $controller('ServerController', {
                    $scope: scope,
                    PresetRepository: PresetRepository,
                    PresetService: PresetService,
                    FlashMessageService: FlashMessageService
                });

                // The call of the extended controller cant be prevented by a spy ...
                $http.whenGET('/api/repository').respond({ hello: 'World' });

                spyOn(FlashMessageService, 'addFlashMessage');
                spyOn(PresetRepository, 'addServer').andCallFake(function (server) {
                    if (server.success) {
                        return $q.when();
                    }
                    return $q.reject();
                });
            }));

            it('should set $scope.finished to false.', function () {
                scope.addServer(server);
                expect(scope.finished).toBeFalsy();
            });

            it('should delete options.deploymentPathWithMarkers on passed server.', function () {
                scope.addServer(server);
                expect(server.options.deploymentPathWithMarkers).not.toBeDefined();
            });

            it('should call PresetRepository.addServer.', function () {
                scope.addServer(server);
                expect(PresetRepository.addServer).toHaveBeenCalled();
            });

            it('should call PresetRepository.addServer with the passed server object.', function () {
                scope.addServer(server);
                expect(PresetRepository.addServer).toHaveBeenCalledWith(server);
            });

            describe('on success', function () {

                beforeEach(function () {
                    server.nodes = [
                        {name: 'foo'}
                    ];
                    scope.newServerForm = {
                        $valid: false,
                        $setPristine: function () {
                            this.$valid = true;
                        }
                    };
                    newPreset = {foo: 'bar'};

                    spyOn(scope, 'getAllServers');
                    spyOn(ctrl, 'handleSettings');
                    spyOn(PresetService, 'getNewPreset').andReturn(newPreset);

                    scope.addServer(server);
                    scope.$digest();
                });

                it('should call getNewPreset on the PresetService.', function () {
                    expect(PresetService.getNewPreset).toHaveBeenCalled();
                });

                it('should call getNewPreset on PresetService with $scope.settings.', function () {
                    expect(PresetService.getNewPreset).toHaveBeenCalledWith(settings);
                });

                it('should set $scope.newPreset to the return of PresetService.getNewPreset() .', function () {
                    expect(scope.newPreset).toEqual(newPreset);
                });

                it('should call $setPristine on $scope.newServerForm.', function () {
                    expect(scope.newServerForm.$valid).toBeTruthy();
                });

                it('should call handleSettings on the controller.', function () {
                    expect(ctrl.handleSettings).toHaveBeenCalled();
                });

                it('should call getAllServers on the $scope.', function () {
                    expect(scope.getAllServers).toHaveBeenCalled();
                });

                it('should call addFlashMessage on the FlashMessageService.', function () {
                    expect(FlashMessageService.addFlashMessage).toHaveBeenCalled();
                });
            });

            describe('on failure', function () {

                beforeEach(function () {
                    server = {
                        success: false,
                        options: {}
                    };
                    server.nodes = [
                        {name: 'foo'}
                    ];

                    scope.addServer(server);
                    scope.$digest();
                });

                it('should call addFlashMessage on the FlashMessageService.', function () {
                    expect(FlashMessageService.addFlashMessage).toHaveBeenCalled();
                });
                it('should set $scope.finished to true.', function () {
                    expect(scope.finished).toBeTruthy();
                });
            });
        });

        //##############################
        // $scope->generateServerName()#
        //##############################

        it('should have a method generateServerName.', function () {
            expect(scope.generateServerName).toBeDefined();
        });

        describe('->generateServerName()', function () {

            it('should prepend the current $scope.projectName with a passed suffix', function () {
                scope.project = {
                    identifier: 'foo'
                };
                expect(scope.generateServerName('bar')).toEqual('foo-bar');
            });

            it('should throw an error if $scope.project is not set.', function () {
                function errorFunctionWrapper() {
                    scope.generateServerName('bar');
                }
                expect(errorFunctionWrapper).toThrow();
            });

            it('should throw an error if $scope.project.name is not set.', function () {
                scope.project = {};
                function errorFunctionWrapper() {
                    scope.generateServerName('bar');
                }
                expect(errorFunctionWrapper).toThrow();
            });
        });

        //##################
        // $scope->$watch()#
        //##################

        describe('$watch', function () {
            beforeEach(inject(function ($controller, $rootScope, _PresetService_,_SettingsRepository_, $q, _$httpBackend_) {
                scope = $rootScope.$new();
                SettingsRepository = _SettingsRepository_;
                PresetService = _PresetService_;
                q = $q;
                $http = _$httpBackend_;
                success = true;

                settings = {a: 'b'};
                scope.settings = settings;

                settings = {a: 'b'};

                ctrl = $controller('ServerController', {
                    $scope: scope,
                    SettingsRepository: SettingsRepository,
                    PresetService: PresetService
                });

                // The call of the extended controller cant be prevented by a spy ...
                $http.whenGET('/api/repository').respond({ project: {name: 'foo'} });

                spyOn(PresetService, 'getNewPreset').andReturn({foo: 'bar'});
                spyOn(ctrl, 'handleSettings');
                spyOn(scope, 'getAllServers');
                spyOn(SettingsRepository, 'getSettings').andCallFake(function () {
                    if (success) {
                        return $q.when(settings);
                    }
                    return $q.reject();
                });
                scope.project.name = 'foo';

            }));

            it('should call SettingsRepository.getSettings.', function () {
                scope.$digest();
                expect(SettingsRepository.getSettings).toHaveBeenCalled();
            });

            describe('on success', function () {
                beforeEach(function () {
                    scope.$digest();
                });

                it('should store response to $scope.settings.', function () {
                    expect(scope.settings).toEqual(settings);
                });

                it('should call PresetService.getNewPreset().', function () {
                    expect(PresetService.getNewPreset).toHaveBeenCalled();
                });

                it('should call PresetService.getNewPreset() wit $scope.settings.', function () {
                    expect(PresetService.getNewPreset).toHaveBeenCalledWith(settings);
                });

                it('should store return of PresetService.getNewPreset() to $scope.newPreset.', function () {
                    expect(scope.newPreset).toEqual({foo: 'bar'});
                });

                it('should call handleSettings() on controller.', function () {
                    expect(ctrl.handleSettings).toHaveBeenCalled();
                });

                it('should call $scope.getAllServers().', function () {
                    expect(scope.getAllServers).toHaveBeenCalled();
                });
            });

            describe('on failure', function () {

                beforeEach(function () {
                    success = false;
                    scope.settings = {};
                    scope.$digest();
                });

                it('should not call handleSettings() on controller.', function () {
                    expect(ctrl.handleSettings).not.toHaveBeenCalled();
                });

                it('should not fill $scope.settings.', function () {
                    expect(scope.settings).toEqual({});
                });

                it('should call PresetService.getNewPreset().', function () {
                    expect(PresetService.getNewPreset).toHaveBeenCalled();
                });

                it('should call $scope.getAllServers().', function () {
                    expect(scope.getAllServers).toHaveBeenCalled();
                });
            });
        });
    });
});
