/*global describe,beforeEach,module,it,xit,expect,inject,spyOn*/

describe('ProjectController', function () {
    var ctrl, scope, historyRepository, q, projects,
        history = [
            {"application": "Deploy", "date": "2012-12-07T10:35:17+00:00", "server": "foo-qa", "gitcheckout": "dev-master", "commit": "1234567890"},
            {"application": "Deploy", "date": "2013-09-07T14:33:17+00:00", "server": "foo-production", "gitcheckout": "dev-master", "commit": "1234567890"},
            {"application": "Sync", "date": "2013-09-07T14:33:17+00:00", "server": "foo-production", "gitcheckout": "dev-master", "commit": "1234567890"}
        ],
        simulateRecievementOfProjectData = function () {
            scope.$digest();
            scope.$apply(function () {
                scope.project = projects.projects[0];
            });
        };

    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, $q, HistoryRepository, ProjectRepository) {
        scope = $rootScope.$new();
        historyRepository = HistoryRepository;
        projects = {projects: [
            {"name": "foo", "ssh_url_to_repo": "git@git.example.com:project/foo.git", "id": 1}
        ]};
        q = $q;

        var historyDefer = q.defer(),
            projectsDefer = q.defer();

        // We have to mock this due to inheritance from AbstractSingleProjectController
        projectsDefer.resolve(projects);
        spyOn(ProjectRepository, 'getProjects').andReturn(projectsDefer.promise);
        spyOn(ProjectRepository, 'getProjectByName').andCallThrough();

        historyDefer.resolve(history);
        spyOn(historyRepository, 'getHistoryByProject').andReturn(historyDefer.promise);

        // Create the controller
        ctrl = $controller('ProjectController', {
            $scope: scope,
            HistoryRepository: historyRepository,
            ProjectRepository: ProjectRepository
        });
    }));

    it('should initialize scope.ordering with date', function () {
        expect(scope.ordering).toEqual('date');
    });

    it('should initialize scope.constraint with dummy string', function () {
        expect(scope.constraint).toEqual('dummy');
    });

    it('should store recieved history records in scope.history', function () {
        simulateRecievementOfProjectData();
        expect(scope.history).toContain(history[0], history[1], history[2]);
    });

});