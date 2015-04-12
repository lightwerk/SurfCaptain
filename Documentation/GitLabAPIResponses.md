# GitLab API Responses

  curl --insecure --header "PRIVATE-TOKEN: ..." https://git.lightwerk.com/api/v3/projects | jq '.'
  [
    {
      "namespace": {
        "avatar": null,
        "description": "",
        "updated_at": "2014-04-14T10:26:03.380Z",
        "created_at": "2014-04-14T10:26:03.380Z",
        "owner_id": 7,
        "path": "bb",
        "name": "bb",
        "id": 14
      },
      "last_activity_at": "2014-05-12T18:58:56.118Z",
      "created_at": "2014-05-07T12:44:52.201Z",
      "snippets_enabled": false,
      "wiki_enabled": true,
      "web_url": "https://git.lightwerk.com/jd/projectA",
      "http_url_to_repo": "https://git.lightwerk.com/jd/projectA.git",
      "ssh_url_to_repo": "git@git.lightwerk.com:jd/projectA.git",
      "visibility_level": 0,
      "public": false,
      "default_branch": "master",
      "description": "",
      "id": 264,
      "owner": {
        "created_at": "2014-04-14T10:26:03.368Z",
        "state": "blocked",
        "name": "John Doe",
        "email": "jd@example.com",
        "username": "jd",
        "id": 7
      },
      "name": "projectA",
      "name_with_namespace": "John Doe / projectA",
      "path": "projectA",
      "path_with_namespace": "jd/projectA",
      "issues_enabled": true,
      "merge_requests_enabled": true,
      "wall_enabled": false
    }
  ]

    curl --insecure --header "PRIVATE-TOKEN: ..." https://git.lightwerk.com/api/v3/projects/projectC/repository/branches | jq '.'
    [
      {
        "protected": false,
        "commit": {
          "committed_date": "2013-10-29T15:21:14+01:00",
          "authored_date": "2013-10-29T15:21:14+01:00",
          "committer": {
            "email": "jd@xexample.com",
            "name": "jd"
          },
          "author": {
            "email": "jd@xexample.com",
            "name": "jd"
          },
          "message": "[TASK] something that needed to be done",
          "tree": "8a85f8162f2e98f26fba2b705078a7fcecc9ce92",
          "parents": [
            {
              "id": "27b4c4a5f139d61a9a870a1a983a7afbec90ee8f"
            }
          ],
          "id": "14b8eec6d0393003dd1cb8b7a39b514b4d21e0e6"
        },
        "name": "TICKET-01"
      },
      ..
    ]

    curl --insecure --header "PRIVATE-TOKEN: ..." https://git.lightwerk.com/api/v3/groups/10 | jq '.'
    {
      "projects": [
        {
          "namespace": {
            "avatar": {
              "url": null
            },
            "description": "",
            "updated_at": "2014-04-14T09:31:52.771Z",
            "created_at": "2014-04-14T09:31:52.771Z",
            "owner_id": null,
            "path": "project",
            "name": "project",
            "id": 10
          },
          "last_activity_at": "2014-06-18T12:33:38.548Z",
          "created_at": "2014-04-14T11:51:40.133Z",
          "snippets_enabled": false,
          "web_url": "https://git.lightwerk.com/project/projectC",
          "http_url_to_repo": "https://git.lightwerk.com/project/projectC.git",
          "ssh_url_to_repo": "git@git.lightwerk.com:project/projectC.git",
          "visibility_level": 0,
          "public": false,
          "default_branch": "master",
          "description": "",
          "id": 21,
          "name": "projectC",
          "name_with_namespace": "project / projectC",
          "path": "projectC",
          "path_with_namespace": "project/projectC",
          "issues_enabled": true,
          "merge_requests_enabled": true,
          "wall_enabled": false,
          "wiki_enabled": true
        },
        ...
      ],
      "owner_id": null,
      "path": "project",
      "name": "project",
      "id": 10
    }

    curl --insecure --header "PRIVATE-TOKEN: ..." https://git.lightwerk.com/api/v3/projects/17/repository/tags | jq '.'
    [
      {
        "protected": false,
        "commit": {
          "committed_date": "2013-03-26T18:16:28+01:00",
          "authored_date": "2013-03-26T18:16:28+01:00",
          "committer": {
            "email": "jd@example.com",
            "name": "jd"
          },
          "author": {
            "email": "jd@example.com",
            "name": "jd"
          },
          "message": "[TASK] something that needed to be done",
          "tree": "7db5d677c97006d3cec977c8be3bdd6fedf046fe",
          "parents": [
            {
              "id": "38a00d2880d3657d67625f2251c071ef53841851"
            }
          ],
          "id": "d428944a85a9a1cb2c1ff3b91f69f4ced559f296"
        },
        "name": "1.0.0"
      },
      ...
    ]

    curl --insecure --header "PRIVATE-TOKEN: ..." http://git.sma.de/api/v3/projects/projectD/repository/tags | jq '.'
    [
      {
        "protected": null,
        "commit": {
          "committed_date": "2013-05-21T15:28:29+02:00",
          "authored_date": "2013-05-21T15:28:29+02:00",
          "committer": {
            "email": "jd@example.com",
            "name": "John Doe"
          },
          "author": {
            "email": "jd@example.com",
            "name": "John Doe"
          },
          "message": "[TASK] something that needed to be done",
          "tree": "b127352641a6968a43fbe6227029e60decfdb686",
          "parents": [
            {
              "id": "9bfcf4532451c6b6955ec89c614036b80f029420"
            },
            {
              "id": "8c9494356d0ab986a1b4c9b572f86f6bccf5d80e"
            }
          ],
          "id": "850cecb0e21d078a5eaccd0ed2bca8c2953ab8a9"
        },
        "name": "surftest"
      },
      ...
    ]
    
    curl --insecure --header "PRIVATE-TOKEN: ..." https://git.lightwerk.com/api/v3/projects/17/repository/branches | jq '.'
    [
      {
        "protected": false,
        "commit": {
          "committed_date": "2014-06-08T22:39:15+02:00",
          "authored_date": "2014-06-08T22:39:15+02:00",
          "committer": {
            "email": "jd@example.com",
            "name": "John Doe"
          },
          "author": {
            "email": "jd@example.com",
            "name": "John Doe"
          },
          "message": "[CONFIGURATION] something that needed to be done",
          "tree": "7365c56977b99ad41fa87ac0410caf259e413c93",
          "parents": [
            {
              "id": "0beef1b75a2d33b402288aa0ee3a48d912aa75b4"
            }
          ],
          "id": "119bd7f125356c38207d2e4c6f518d868b005a35"
        },
        "name": "upgrade"
      },
      ...
    ]
