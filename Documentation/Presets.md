# Presets

- if type is not given: Selectable in SurfCaptain for Deploy and Sync
- if repositoryUrl is not given: Selectable in all projects (developer machines)

## Minimum configuration

    {
        "example": [
            {
                "applications": [
                    {
                        "options": {
                            "deploymentPath": "/var/www/projectName/context/"
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server",
                                "hostname": "www.example.com"
                            }
                        ]
                    }
                ]
            }
        ]
    }

### Default Configuration for developer instances

(without "repositoryUrl")

    {
        "example": [
            {
                "applications": [
                    {
                        "options": {
                            "deploymentPath": "/var/www/projectName/context/",
                            "context": "Development"
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server",
                                "hostname": "www.example.com",
                                "username": "user"
                            }
                        ]
                    }
                ]
            }
        ]
    }


## Default configuration for surf captian

(for Deploy and Sync)

    {
        "example": [
            {
                "applications": [
                    {
                        "options": {
                            "repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
                            "deploymentPath": "/var/www/projectName/context/",
                            "context": "Development"
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server",
                                "hostname": "www.example.com",
                                "username": "user"
                            }
                        ]
                    }
                ]
            }
        ]
    }

## Default configuration just for Deploy

    {
        "example": [
            {
                "applications": [
                    {
                        "type": "TYPO3\\CMS\\Deploy",
                        "options": {
                            "repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
                            "deploymentPath": "/var/www/projectName/context/",
                            "context": "Development"
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server",
                                "hostname": "www.example.com",
                                "username": "user"
                            }
                        ]
                    }
                ]
            }
        ]
    }

## Default configuration just for Shared

    {
        "example": [
            {
                "applications": [
                    {
                        "type": "TYPO3\\CMS\\Shared",
                        "options": {
                            "repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
                            "deploymentPath": "/var/www/projectName/context/",
                            "context": "Development",
                            "sourceNode": {
                                "name": "Front-End Server 2",
                                "hostname": "dev.example.com",
                                "username": "lw-example"
                            }
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server",
                                "hostname": "www.example.com",
                                "username": "user"
                            }
                        ]
                    }
                ]
            }
        ]
    }

## Full configuration with all possible fields

(has to be continued!)

    {
        "example": [
            {
                "applications": [
                    {
                        "type": "TYPO3\\CMS\\Deploy", // or "TYPO3\\CMS\\Shared". If no type is given, it can be used for Deploy & Shared (but it has to be set in the deployment configuration!)
                        "options": {
                            // All options are here and in the nodes section possible (one level with the node "name")
                            "repositoryUrl": "git@git.lightwerk.com:boilerplate/typo3_cms.git",
                            "deploymentPath": "/var/www/projectName/context/",
                            "context": "Development",
                            "tag": "1.2.3",
                            "branch": "master",
                            "sha1": "c0db78a19f62a18fe888ee58490c88fea1219213",
                            "frontendUrl": "http://www.domain.de",
                            "sourceNode": {
                                "name": "Front-End Server 2",
                                "hostname": "dev.example.com",
                                "username": "lw-example"
                            }
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server 2",
                                "hostname": "www2.example.com",
                                "username": "user2",
                                "password": "123456" // Do not use it! Use the Surf-Public-Key instead!
                            }
                        ],
                        "tasks": {
                            // "initialize": [],
                            "package": [
                                "typo3.surf:package:git",
                                "lightwerk.surftasks:package:composerinstall"
                            ]
                            // "transfer": [],
                            // "update": [],
                            // "migrate": [],
                            // "finalize": [],
                            // "test": [],
                            // "switch": [],
                            // "cleanup": []
                        },
                        "taskOptions": {
                            "typo3.surf:package:git": {
                                "options": {
                                    "fetchAllTags": true
                                }
                            },
                            "lightwerk.surftasks:package:git": {
                                "baseTask": "typo3.surf:package:git",
                                "options": {
                                    "fetchAllTags": false
                                }
                            }
                        }
                    }
                ]
            }
        ]
    }
