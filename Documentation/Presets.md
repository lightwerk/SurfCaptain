# Presets

- if type is not given: Selectable in SurfCaptain for Deploy and Sync
- if repositoryUrl is not given: Selectable in all projects (developer machines)

## Minimum configuration

    {
        "sma": [
            {
                "applications": [
                    {
                        "options": {
                            "deploymentPath": "/var/www/projectName/context/"
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server",
                                "hostname": "www.sma.de"
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
        "sma": [
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
                                "hostname": "www.sma.de",
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
        "sma": [
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
                                "hostname": "www.sma.de",
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
        "sma": [
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
                                "hostname": "www.sma.de",
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
        "sma": [
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
                                "hostname": "dev.rcw.sma.de",
                                "username": "lw-lpeipmann"
                            }
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server",
                                "hostname": "www.sma.de",
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
        "sma": [
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
                                "hostname": "dev.rcw.sma.de",
                                "username": "lw-lpeipmann"
                            }
                        },
                        "nodes": [
                            {
                                "name": "Front-End Server 2",
                                "hostname": "www2.sma.de",
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