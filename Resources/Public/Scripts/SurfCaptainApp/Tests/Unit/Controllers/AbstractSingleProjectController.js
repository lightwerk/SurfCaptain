/*global describe,beforeEach,module,it,xit,expect,inject,spyOn*/

describe('AbstractSingleProjectController', function () {
    var ctrl, scope, routeParams, projectRepository, projects, q;

    // Load the module
    beforeEach(module('surfCaptain'));

    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function ($controller, $rootScope, $q, ProjectRepository) {
        scope = $rootScope.$new();
        routeParams = {
            projectName: 'foo'
        };
        projectRepository = ProjectRepository;
        projects = [{
            "name": "foo",
            "ssh_url_to_repo": "git@git.example.com:project/foo.git",
            "id": 1
        }];
        q = $q;

        var projectsDefer = q.defer();
        projectsDefer.resolve(projects);

        spyOn(ProjectRepository, 'getProjects').andReturn(projectsDefer.promise);
        spyOn(ProjectRepository, 'getProjectByName').andReturn(projects[0]);;

        // Create the controller
        ctrl = $controller('AbstractSingleProjectController', {
            $scope: scope,
            $routeParams: routeParams,
            ProjectRepository: projectRepository
        });
    }));

    it('should initialize scope.project with an empty object', function () {
        expect(scope.project).toEqual({});
    });

    it('should get the name from the $routeParams', function () {
        expect(scope.name).toEqual('foo');
    });

    it('should call getProjects on ProjectRepository', function () {
        ctrl.init();
        expect(projectRepository.getProjects).toHaveBeenCalled();
    });

    it('should call getProjectByName on ProjectRepository', function () {
        ctrl.init();
        scope.$digest();
        expect(projectRepository.getProjectByName).toHaveBeenCalled();
    });

    it('should call getProjectByName on ProjectRepository with response of getProjects and projectName', function () {
        ctrl.init();
        scope.$digest();
        expect(projectRepository.getProjectByName).toHaveBeenCalledWith('foo', projects);
    });

    it('should set project to the response of ProjectRepository call', function () {
        ctrl.init();
        scope.$digest();
        expect(scope.project).toEqual(projects[0]);
    });
});