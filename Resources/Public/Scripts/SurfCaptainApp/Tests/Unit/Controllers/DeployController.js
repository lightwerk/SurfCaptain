/*global describe,beforeEach,module,it,xit,expect,inject,spyOn,jasmine*/

describe('DeployController', function () {
    var ctrl, scope, serverRepository, gitRepository, historyRepository, projectRepository, q, deployableCommits, projects,
        tags = {"tags": [
            {"name": "1.0.1", "commit": {"id": "123", "message": "[TASK] my Task", "committed_date": "2013-10-25T14:02:04+02:00", "committer": {"name": "John Doe"}}, "type": "Tag", "group": "Tags"},
            {"name": "1.0.2", "commit": {"id": "124", "message": "[BUGFIX] my Bugfix", "committed_date": "2013-09-30T11:43:00+02:00", "committer": {"name": "John Doe"}}, "type": "Tag", "group": "Tags"}
        ]},
        branches = {"branches": [
            {"name": "master", "commit": {"id": "1", "message": "[TASK] my Task", "committed_date": "2013-04-04T12:30:16+02:00", "committer": {"name": "John Doe"}}, "type": "Branch", "group": "Branches"},
            {"name": "development", "commit": {"id": "2", "message": "[BUGFIX] my Bugfix", "committed_date": "2013-04-15T11:47:33+02:00", "committer": {"name": "John Doe"}}, "type": "Branch", "group": "Branches"}
        ]},
        server = [
            {"key": "foo-production", "project": 1, "servers": [{"key": "foo-production", "host": "127.0.0.1", "username": "blub2", "password": "abcde", "documentRoot": "/var/www/foo/production/htdocs/", "context": "Production", "system": "FOO_PRODUCTIVE"}]},
            {"key": "foo-qa", "project": 2, "servers": [{"key": "foo-qa", "host": "127.0.0.2", "username": "user1", "password": "abcde", "documentRoot": "/var/www/foo/qa/htdocs/",  "context": "Development", "system": "FOO_QA"}]},
            {"key": "foo-qa", "project": 1, "servers": [{"key": "bar-qa", "host": "127.0.0.2", "username": "user1", "password": "abcde", "documentRoot": "/var/www/bar/qa/htdocs/",  "context": "Development", "system": "BAR_QA"}]}
        ],
        history = [
            {"application": "Deploy", "date": "2012-12-07T10:35:17+00:00", "server": "foo-qa", "gitcheckout": "dev-master", "commit": "1234567890"},
            {"application": "Deploy", "date": "2013-09-07T14:33:17+00:00", "server": "foo-production", "gitcheckout": "dev-master", "commit": "1234567890"},
            {"application": "Sync", "date": "2013-09-07T14:33:17+00:00", "server": "foo-production", "gitcheckout": "dev-master", "commit": "1234567890"}
        ],
        simulateReceivementOfProjectData = function () {
            scope.$digest();
            scope.$apply(function () {
                scope.project = projects.projects[0];
            });
        };

    // Load the module
    beforeEach(module('surfCaptain'));

    beforeEach(inject(function ($controller, $rootScope, $q, ServerRepository, GitRepository, HistoryRepository, ProjectRepository) {
        var projectsDefer;
        scope = $rootScope.$new();
        deployableCommits = [
            {name: 'loading ...', group: 'Tags'},
            {name: 'loading ...', group: 'Branches'}
        ];
        projects = {projects: [
            {"name": "foo", "ssh_url_to_repo": "git@git.example.com:project/foo.git", "id": 1}
        ]};
        serverRepository = ServerRepository;
        gitRepository = GitRepository;
        historyRepository = HistoryRepository;

        q = $q;

        projectsDefer = q.defer();

        projectsDefer.resolve(projects);
        spyOn(ProjectRepository, 'getProjects').andReturn(projectsDefer.promise);
        spyOn(ProjectRepository, 'getProjectByName').andCallThrough();

        // Create the controller
        ctrl = $controller('DeployController', {
            $scope: scope,
            ServerRepository: serverRepository,
            GitRepository: gitRepository,
            HistoryRepository: historyRepository,
            ProjectRepository: ProjectRepository
        });
    }));

    // Test initialization
    describe('initialization', function () {

        it('should initialize scope.tags with an empty Array', function () {
            expect(scope.tags).toEqual([]);
        });

        it('should initialize scope.branches with an empty Array', function () {
            expect(scope.branches).toEqual([]);
        });

        it('should initialize scope.deployableCommits with an preconfigured array', function () {
            expect(scope.deployableCommits).toEqual(deployableCommits);
        });
    });

    // Test unsetLoadingKeyForGroup method
    describe('unsetLoadingKeyForGroup', function () {
        it('should remove preconfigured array item when unsetLoadingKeyForGroup is called with Tags', function () {
            scope.unsetLoadingKeyForGroup('Tags');
            expect(scope.deployableCommits).toEqual([
                {name: 'loading ...', group: 'Branches'}
            ]);
        });

        it('should remove preconfigured array item when unsetLoadingKeyForGroup is called with Branches', function () {
            scope.unsetLoadingKeyForGroup('Branches');
            expect(scope.deployableCommits).toEqual([
                {name: 'loading ...', group: 'Tags'}
            ]);
        });
    });

    // Test code that is triggerd by $watch
    describe('$watch', function () {
        var unsetLoadingKeySpy, gitTagSpy, gitBranchSpy, serverSpy, historySpy;

        beforeEach(function () {
            var tagsDefer = q.defer(),
                branchesDefer = q.defer(),
                historyDefer = q.defer(),
                serverDefer = q.defer();

            tagsDefer.resolve(tags);
            gitTagSpy = spyOn(gitRepository, 'getTagsByProjectId').andReturn(tagsDefer.promise);

            branchesDefer.resolve(branches);
            gitBranchSpy = spyOn(gitRepository, 'getBranchesByProjectId').andReturn(branchesDefer.promise);

            serverDefer.resolve(server);
            serverSpy = spyOn(serverRepository, 'getServers').andReturn(serverDefer.promise);

            historyDefer.resolve(history);
            historySpy = spyOn(historyRepository, 'getHistoryByProject').andReturn(historyDefer.promise);

            unsetLoadingKeySpy = spyOn(scope, 'unsetLoadingKeyForGroup').andCallThrough();

            simulateReceivementOfProjectData();
        });

        it('should call getTagsByProjectId with projectId on GitRepository on change of project', function () {
            expect(gitTagSpy).toHaveBeenCalledWith('1');
        });

        it('should merge recieved tags into deployableCommits', function () {
            expect(scope.deployableCommits).toContain(tags.tags[0], tags.tags[1]);
        });

        it('should store recieved tags into scope.tags', function () {
            expect(scope.tags).toEqual(tags.tags);
        });

        it('should call unsetLoadingKeyForGroup with "Tags" after receiving tags', function () {
            expect(unsetLoadingKeySpy).toHaveBeenCalledWith('Tags');
        });

        it('should store recieved branches into scope.branches', function () {
            expect(scope.branches).toEqual(branches.branches);
        });

        it('should call getBranchesByProjectId with projectId on GitRepository on change of project', function () {
            expect(gitBranchSpy).toHaveBeenCalledWith('1');
        });

        it('should merge recieved branches into deployableCommits', function () {
            expect(scope.deployableCommits).toContain(branches.branches[0], branches.branches[1]);
        });

        it('should call unsetLoadingKeyForGroup with Branches after receiving branches', function () {
            expect(unsetLoadingKeySpy).toHaveBeenCalledWith('Branches');
        });

        it('should call getServers on ServerRepository', function () {
            expect(serverSpy).toHaveBeenCalled();
        });

        it('should store only servers of matching project in scope.servers', function () {
            expect(scope.servers).toContain(server[0], server[2]);
            expect(scope.servers).toNotContain(server[1]);
        });

        it('should call getHistory on HistoryRepository with project', function () {
            expect(historySpy).toHaveBeenCalledWith(scope.project);
        });

        it('should only store history records of type deploy in scope.history', function () {
            expect(scope.history).toContain(history[0], history[1]);
            expect(scope.history).toNotContain(history[2]);
        });
    });

});