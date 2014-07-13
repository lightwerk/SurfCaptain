/*global describe,beforeEach,module,it,xit,expect,inject,spyOn*/

describe('ProjectsController', function () {
    var ctrl, scope, projectRepository, q, projects, succeedPromise, controller;

    function createController() {
        ctrl = controller('ProjectsController', {
            $scope: scope,
            ProjectRepository: projectRepository
        });
    }

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, $q, ProjectRepository) {
        scope = $rootScope.$new();
        projects = {projects: [
            {"name": "foo", "ssh_url_to_repo": "git@git.example.com:project/foo.git", "id": 1}
        ]};
        controller = $controller;
        projectRepository = ProjectRepository;

        // simulate success or failure of request based on succeedPromise
        spyOn(ProjectRepository, 'getProjects').andCallFake(function () {
            if (succeedPromise) {
                return $q.when(projects);
            }
            return $q.reject('Something went wrong');
        });

    }));

    it('should initialize scope.ordering with name', function () {
        createController();
        expect(scope.ordering).toEqual('name');
    });

    it('should initialize scope.projects with empty array', function () {
        createController();
        expect(scope.projects).toEqual([]);
    });

    it('should store recieved projects records in scope.projects', function () {
        succeedPromise = true;
        createController();
        scope.$digest();
        expect(scope.projects).toEqual(projects.projects);
    });

    it('should store message in scope.message if request fails', function () {
        succeedPromise = false;
        createController();
        scope.$digest();
        expect(scope.message).toEqual('API call failed. GitLab is currently not available.');
    });

});