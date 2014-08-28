/*global describe,beforeEach,module,it,xit,expect,inject,spyOn*/

describe('ProjectsController', function () {
    var ctrl, scope, projectRepository, q, projects, succeedPromise, controller, settingsRepository, settings, FlashMessageService,
        createController = function () {
            ctrl = controller('ProjectsController', {
                $scope: scope,
                ProjectRepository: projectRepository,
                SettingsRepository: settingsRepository,
                FlashMessageSerive: FlashMessageService
            });
            scope.$digest();
        };

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, $q, ProjectRepository, SettingsRepository, _FlashMessageService_) {
        scope = $rootScope.$new();
        projects = [
            {"name": "foo", "ssh_url_to_repo": "git@git.example.com:project/foo.git", "id": 1}
        ];
        settings = {a: 'b'};
        controller = $controller;
        projectRepository = ProjectRepository;
        settingsRepository = SettingsRepository;
        FlashMessageService = _FlashMessageService_;

        // simulate success or failure of request based on succeedPromise
        spyOn(projectRepository, 'getProjects').andCallFake(function () {
            if (succeedPromise) {
                return $q.when(projects);
            }
            return $q.reject('Something went wrong');
        });

        // simulate success or failure of request based on succeedPromise
        spyOn(settingsRepository, 'getSettings').andCallFake(function () {
            return $q.when(settings);
        });

        spyOn(FlashMessageService, 'addFlashMessage');
    }));

    describe('Initialization', function () {

        beforeEach(function () {
            createController();
        });

        it('should initialize scope.ordering with "name".', function () {
            expect(scope.ordering).toEqual('name');
        });

        it('should initialize scope.projects with empty array.', function () {
            expect(scope.projects).toEqual([]);
        });
    });

    it('should have a method init().', function () {
        expect(ctrl.init).toBeDefined();
    });

    describe('->init()', function () {

        it('should call ProjectRepository.getProjects().', function () {
            createController();
            expect(projectRepository.getProjects).toHaveBeenCalled();
        });

        describe('on success', function () {
            beforeEach(function () {
                succeedPromise = true;
                createController();
            });

            it('should store recieved projects records in scope.projects.', function () {
                expect(scope.projects).toEqual(projects);
            });

            it('should set $scope.finished to true.', function () {
                expect(scope.finished).toBeTruthy();
            });
        });

        describe('on failure', function () {

            beforeEach(function () {
                succeedPromise = false;
                createController();
            });

            it('should set $scope.finished to true.', function () {
                expect(scope.finished).toBeTruthy();
            });

            it('should call FlashMessageService.addFlashMessage().', function () {
                expect(FlashMessageService.addFlashMessage).toHaveBeenCalled();
            });

        });

        it('should call SettingsRepository.getSettings().', function () {
            createController();
            expect(settingsRepository.getSettings).toHaveBeenCalled();
        });

        it('should store received settings in scope.settings.', function () {
            createController();
            expect(scope.settings).toEqual(settings);
        });
    });

});