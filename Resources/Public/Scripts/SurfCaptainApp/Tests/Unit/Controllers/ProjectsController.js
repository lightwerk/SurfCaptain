/*global describe,beforeEach,module,it,xit,expect,inject,spyOn*/

describe('ProjectsController', function () {
    var ctrl, scope, historyRepository, q, projects;

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, $q, ProjectRepository) {
        scope = $rootScope.$new();
        projects = {projects: [
            {"name": "foo", "ssh_url_to_repo": "git@git.example.com:project/foo.git", "id": 1}
        ]};
        q = $q;

        var projectsDefer = q.defer();

        projectsDefer.resolve(projects);
        spyOn(ProjectRepository, 'getProjects').andReturn(projectsDefer.promise);

        // Create the controller
        ctrl = $controller('ProjectsController', {
            $scope: scope,
            ProjectRepository: ProjectRepository
        });
    }));

    it('should initialize scope.ordering with name', function () {
        expect(scope.ordering).toEqual('name');
    });

    it('should initialize scope.projects with empty array', function () {
        expect(scope.projects).toEqual([]);
    });

    it('should store recieved projects records in scope.projects', function () {
        scope.$digest();
        expect(scope.projects).toEqual(projects.projects);
    });

});