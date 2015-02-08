# Configuration

## Basic Configuration (Configuration/Settings.yaml)

### Gitlab

Surfcaptain was first developed to work with the API of Gitlab. So the basic configuration for a Gitlab setup is pretty straight forward:

	Lightwerk:
      SurfCaptain:
        sources:
          source1:
            apiUrl: 'https://myGitlab.de/api/v3/'
            className: '\Lightwerk\SurfCaptain\GitApi\Driver\GitLabDriver'
            accountName: 'me@myGitlab.de'
            privateToken: '1234567890abcdefghij'
            repositories:
              projects: groups/10
              single: projects/209

In the above configuration, we tell the Surfcaptain to include all git-repositories from myGitlab.de that are in the namespace with the ID 10 (`groups/10`) as well 
as the additional repository with the ID 209 (`projects/209`). Additionally the user me@myGitlab.de must have the rights to see these repositories, as we use his 
`privateToken`. This token can be found in the profile area of Gitlab. Additionally we have to tell the Surfcaptain that this API actually is a Gitlab by defining
the Driver via `className`.

### Github

	Lightwerk:
      SurfCaptain:
        sources:
          source1:
            apiUrl: https://api.github.com/
            className: '\Lightwerk\SurfCaptain\GitApi\Driver\GitHubDriver'
            accountName: 'git@github.com'
            privateToken: '1234567890abcdefghij'
            mapping:
              Repository:
                repositoryUrl: '{{ssh_url}}'
                webUrl: '{{url}}'
              Commit:
                id: '{{sha}}'

If you connect Github repositories to Surfcaptain, you'll get all the repositories of the account specified under `accountName`. The Driver changes to the GitHubDriver
and you have to apply a mapping. The mapping part of the configuration is necessary because every API returns different sets of data but we want to map them on the same 
objects in every case. E.g. the Repository has a property repositoryUrl and webUrl but. The Github API provides the values but not the property names. With the above
mapping being applied before the object is created we can ensure consistent objects from different APIs.

### Bitbucket

	Lightwerk:
      SurfCaptain:
        sources:
          source1:
            apiUrl: 'https://api.bitbucket.org/2.0/'
            fallbackApiUrl: 'https://api.bitbucket.org/1.0/'
            className: \Lightwerk\SurfCaptain\GitApi\Driver\BitBucketDriver
            accountName: myAccount
            privateToken: myConsumerKey
            privateSecret: myConsumerSecret
            accessToken: myAccessToken
            accessSecret: myAccessSecret
            repositories:
              myRepositories: repositories/myaccount
            mapping:
              Repository:
                repositoryUrl: '{{links.clone.1.href}}'
                webUrl: '{{links.clone.0.href}}'
              Branch:
                name: '{{branch}}'
                commit:
                  id: '{{raw_node}}'
                  committerName: '{{author}}'
                  date: '{{timestamp}}'
                  message: '{{message}}'
              Tag:
                name: '{{_KEY_}}'
                commit:
                  id: '{{raw_node}}'
                  committerName: '{{author}}'
                  date: '{{timestamp}}'
                  message: '{{message}}'

As long as you want to access your private Bitbucket repositories you have to create an oAuth access token for your application and confirm it in your bitbucket profile.
You can find more information [here](https://confluence.atlassian.com/display/BITBUCKET/OAuth+on+Bitbucket). If you got your access token you provide it alongside the 
secret and the consumer credentials in the Settings.yaml as shown above. It takes a little bit more mapping to make everything fit. There is another thing that is special
for Bitbucket. We unfortunately need two differen APIs because none of them provides all the information we need all by itself. As the 2.0 version of the API is still under
development it is possible that one day it wont be necessary to speak to both. Thats what the `fallbackApiUrl` is for.

We also have to enable the oAuth APIRequester for Bitbucket. It is explained later how to do this (Objects.yaml).

Further information about the settings can be found in Configuration/Settings.yaml.example in the SurfCaptain Application.

### Frontend Settings

Regardless of what git repositories you connect to Surfcaptain you can configure the Frontend App as well.

    Lightwerk:
      SurfCaptain:
        frontendSettings:
          defaultUser: 'lw-deployment'
          publicDeploymentKey: ssh-rsa [...]
          defaultDeploymentPath: '/var/www/{{project}}/{{suffix}}/'
          contexts: 'Production,Testing,Development'
          nameSuggestions:
            live: 'Production'
            qa: 'Production/Qa'
            staging: 'Production/Staging'
            test: 'Testing'
            dev: 'Development'

The settings are mainly for the creation of a new server in a project. The `defaultUser` and the `defaultDeploymentPath` as well as the `contexts` are shown in the respective fields.
When you create a new server there are some buttons with predefined values bound to them. This is configured in the `nameSuggestions` section. All settings are shown
on the settings page in the Frontend App including the `publicDeploymentKey`.

### Repository

The servers that are created in the Frontend are stored in a JSON file called Presets.json. This File needs to be stored. In the Repository section of Settings.yaml you
can configure where.

    Lightwerk:
      SurfCaptain:
        repository:
          preset:
            gitRepository:
              repositoryUrl: 'git@myGitlab.de:projects/surfcaptain-presets'
            fileRepository:
              filePath: 'Configuration/Presets.json'
              
The two options are `gitRepository` where you specify a Git Repository the Presets.json is versioned in. This does not work with Bitbucket as of now, because the Bitbucket API
lacks the option to change files in a repo. If a `fileRepository` is specified the Presets.json is stored locally at the configured path (relatively to surfcaptain root).

## Object Configuration (Configuration/Objects.yaml)

Since we developed against interfaces you can (and in some cases you have to) specify the concrete implementation. This is done in Configuration/Objects.yaml

    Lightwerk\SurfCaptain\GitApi\ApiRequestInterface:
      className: 'Lightwerk\SurfCaptain\GitApi\ApiRequest'
    #  className: 'Lightwerk\SurfCaptain\GitApi\OfflineRequest'
    #  className: 'Lightwerk\SurfCaptain\GitApi\OauthApiRequest'
    
    Lightwerk\SurfCaptain\Domain\Repository\Preset\RepositoryInterface:
      className: 'Lightwerk\SurfCaptain\Domain\Repository\Preset\FileRepository'
    #  className: 'Lightwerk\SurfCaptain\Domain\Repository\Preset\GitRepository'
    
There are several implementations for the `ApiRequestInterface`. If you want to connect your Bitbucket repositories you have to switch to the OauthApiRequest. The `OfflineRequest` is
mainly for development and testing as the `ApiRequest` implementation is the default. To make your Repository configuration in your Settings.yaml work you have to
set the corresponding implementation of the `RepositoryInterface`. 