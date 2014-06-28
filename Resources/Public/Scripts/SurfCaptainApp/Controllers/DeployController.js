/*jslint browser: true*/

'use strict';
surfCaptain.controller('DeployController', [
    '$scope',
    '$controller',
    'GitRepository',
    'ServerRepository',
    'HistoryRepository',
    function ($scope, $controller, GitRepository, ServerRepository, HistoryRepository) {

    var loadingString = 'loading ...';

    // Inherit from AbstractSingleProjectController
    angular.extend(this, $controller('AbstractSingleProjectController', {$scope: $scope}));

    $scope.deployableCommits = [
        {
            name: loadingString,
            group: 'Tags'
        },
        {
            name: loadingString,
            group: 'Branches'
        }
    ];
    $scope.tags = [];
    $scope.branches = [];

    $scope.unsetLoadingKeyForGroup = function (group) {
        var key;
        for (key in $scope.deployableCommits) {
            if ($scope.deployableCommits.hasOwnProperty(key)) {
                if ($scope.deployableCommits[key].name !== undefined
                    && $scope.deployableCommits[key].group !== undefined
                    && $scope.deployableCommits[key].name === loadingString
                    && $scope.deployableCommits[key].group === group) {
                    $scope.deployableCommits.splice(key, 1);
                    break;
                }
            }
        }
    };

    $scope.$watch('project', function (newValue, oldValue) {
        var id;
        if (newValue.id === undefined) {
            return;
        }
        id = newValue.id;
        GitRepository.getTagsByProjectId(id.toString()).then(
            function (response) {
                $scope.unsetLoadingKeyForGroup('Tags');
                $scope.tags = response.tags;
                $scope.deployableCommits = jQuery.merge($scope.tags, $scope.deployableCommits);
            },
            function (reason) {
                $scope.unsetLoadingKeyForGroup('Tags');
            }
        );
        GitRepository.getBranchesByProjectId(id.toString()).then(
            function (response) {
                $scope.unsetLoadingKeyForGroup('Branches');
                $scope.branches = response.branches;
                $scope.deployableCommits = jQuery.merge($scope.branches, $scope.deployableCommits);
            },
            function (reason) {
                $scope.unsetLoadingKeyForGroup('Branches');
            }
        );
        ServerRepository.getServers().then(function (response) {
            $scope.servers = response.filter(function (entry) {
                return entry.project === newValue.id;
            });
        });

        HistoryRepository.getHistoryByProject($scope.project).then(function (response) {
            $scope.history = response.filter(function(entry){
                return entry.application === 'Deploy';
            });
        });
    });

}]);