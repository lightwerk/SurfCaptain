/* global describe,beforeEach,module,it,expect,inject,spyOn */

describe('AbstractSingleProjectController', function () {
    'use strict';
    var ctrl, scope, routeParams, ProjectRepository, projects, q;

    // Load the module
    beforeEach(module('surfCaptain'));

    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function ($controller, $rootScope, $q, _ProjectRepository_) {
        scope = $rootScope.$new();
        routeParams = {
            projectName: 'foo'
        };
        ProjectRepository = _ProjectRepository_;
        projects = [{
            'identifier': 'foo',
            'ssh_url_to_repo': 'git@git.example.com:project/foo.git',
            'id': 1
        }];
        q = $q;

        var projectsDefer = q.defer();
        projectsDefer.resolve(projects);

        spyOn(ProjectRepository, 'getProjects').andReturn(projectsDefer.promise);
        spyOn(ProjectRepository, 'getProjectByName').andReturn(projects[0]);

        // Create the controller
        ctrl = $controller('AbstractSingleProjectController', {
            $scope: scope,
            $routeParams: routeParams,
            ProjectRepository: ProjectRepository
        });
    }));

    describe('Initialization', function () {
        it('should get the name from the $routeParams.', function () {
            expect(scope.name).toEqual('foo');
        });
        it('should initialize $scope.project with an empty object.', function () {
            expect(scope.project).toEqual({});
        });
        it('should initialize $scope.messages with an empty object.', function () {
            expect(scope.messages).toEqual({});
        });
        it('should initialize $scope.error with false.', function () {
            expect(scope.error).toBeFalsy();
        });
    });

    describe('->init()', function () {
        it('should call getProjects on ProjectRepository.', function () {
            ctrl.init();
            expect(ProjectRepository.getProjects).toHaveBeenCalled();
        });

        it('should call getProjectByName on ProjectRepository.', function () {
            ctrl.init();
            scope.$digest();
            expect(ProjectRepository.getProjectByName).toHaveBeenCalled();
        });

        it('should call getProjectByName on ProjectRepository with response of getProjects and projectName.', function () {
            ctrl.init();
            scope.$digest();
            expect(ProjectRepository.getProjectByName).toHaveBeenCalledWith('foo', projects);
        });

        it('should set project to the response of ProjectRepository call.', function () {
            ctrl.init();
            scope.$digest();
            expect(scope.project).toEqual(projects[0]);
        });
    });
});