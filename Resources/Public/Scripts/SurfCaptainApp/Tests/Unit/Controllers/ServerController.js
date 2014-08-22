/*global angular,describe,beforeEach,afterEach,module,it,xit,expect,inject,spyOn*/

describe('ServerController', function () {
    var ctrl, scope, nameSuggestions, q, projects, MarkerService,
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
            // TODO
        });

        //###########################
        // $scope->setDocumentRoot()#
        //###########################

        it('should have a method setDocumentRoot.', function () {
            expect(scope.setDocumentRoot).toBeDefined();
        });

        describe('->setDocumentRoot()', function () {
            beforeEach(inject(function ($controller, $rootScope, _MarkerService_) {
                scope = $rootScope.$new(),
                    MarkerService = _MarkerService_;

                ctrl = $controller('ServerController', {
                    $scope: scope,
                    MarkerService: MarkerService
                });
            }));

            beforeEach(function () {
                scope.newPreset = {
                    options: {
                        documentRootWithMarkers: 'bar/{{suffix}}/htdocs',
                        documentRoot: 'foo'
                    }
                };
                spyOn(MarkerService, 'replaceMarkers').andReturn('markerServiceReturn');
            });

            it('should call MarkerService->replaceMarkers with documentRootWithMarkers and the passed suffix.', function () {
                scope.setDocumentRoot('live');
                expect(MarkerService.replaceMarkers).toHaveBeenCalledWith(scope.newPreset.options.documentRootWithMarkers, {suffix: 'live'});
            });

            it('should fill the documentRoot of the newPreset with the return value of MarkerService->replaceMarkers().', function () {
                scope.setDocumentRoot('live');
                expect(scope.newPreset.options.documentRoot).toEqual('markerServiceReturn');
            });

            it('should leave the documentRoot in newPreset if documentRootWithMarkers is not defined.', function () {
                delete scope.newPreset.options.documentRootWithMarkers;
                scope.setDocumentRoot('live');
                expect(scope.newPreset.options.documentRoot).toEqual('foo');
            });
        });

        //#####################
        // $scope->addServer()#
        //#####################

        it('should have a method addServer.', function () {
            expect(scope.addServer).toBeDefined();
        });

        describe('->addServer()', function () {
            // TODO
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
                    name: 'foo'
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
    });
});
