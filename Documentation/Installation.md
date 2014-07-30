# How To Install

1. composer create-project --dev --keep-vcs typo3/flow-base-distribution flow-base dev-master
1. git clone git@bitbucket.org:lars85/lightwerk.surfcaptain.git Packages/Application/Lightwerk.SurfCaptain/
1. git clone git@bitbucket.org:lars85/lightwerk.surfclasses.git Packages/Application/Lightwerk.SurfClasses/
1. git clone git@bitbucket.org:lars85/lightwerk.surfrunner.git Packages/Application/Lightwerk.SurfRunner/
1. git clone git://git.typo3.org/Packages/TYPO3.Surf.git Packages/Application/TYPO3.Surf
1. Define database settings in Configuration/Settings.yaml
1. Copy route from Packages/Application/Lightwerk.SurfCaptain/Configuration/Routes.yaml to Configuration/Routes.yaml
1. Set Lightwerk/SurfCaptain/git/privateToken in Configuration/Settings.yaml (see Packages/Application/Lightwerk.SurfCaptain/Configuration/Settings.yaml and https://git.lightwerk.com/profile/account)
1. ./flow doctrine:migrate