/*global describe,beforeEach,module,it,xit,expect,inject,spyOn*/

describe('ProjectsController', function () {
    var ctrl, scope, projectRepository, q, projects, succeedPromise, controller,
        createController = function () {
            ctrl = controller('ProjectsController', {
                $scope: scope,
                ProjectRepository: projectRepository
            });
            scope.$digest();
        };

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

    describe('Initialization', function () {

        beforeEach(function () {
            createController();
        });

        it('should initialize scope.ordering with "name"', function () {
            expect(scope.ordering).toEqual('name');
        });

        it('should initialize scope.projects with empty array', function () {
            expect(scope.projects).toEqual([]);
        });
    });

    it('should store recieved projects records in scope.projects', function () {
        succeedPromise = true;
        createController();
        expect(scope.projects).toEqual(projects.projects);
    });

    it('should store message in scope.message if request fails', function () {
        succeedPromise = false;
        createController();
        expect(scope.message).toEqual('API call failed. GitLab is currently not available.');
    });

});