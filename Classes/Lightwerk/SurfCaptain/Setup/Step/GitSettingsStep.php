<?php
namespace Lightwerk\SurfCaptain\Setup\Step;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Validation\Validator\NotEmptyValidator;
use TYPO3\Flow\Configuration\ConfigurationManager;
use TYPO3\Flow\Utility\Arrays;
use TYPO3\Setup\Exception as SetupException;

/**
 * @Flow\Scope("singleton")
 */
class GitSettingsStep extends \TYPO3\Setup\Step\AbstractStep
{
    /**
     * @var \TYPO3\Flow\Configuration\Source\YamlSource
     * @Flow\Inject
     */
    protected $configurationSource;

    /**
     * @var array
     */
    protected $exampleData = [
        'GitLab' => [
            'repositories' => 'groups/10, projects/209'
        ],
        'BitBucket' => [
            'repositories' => 'repositories/myaccount'
        ],
        'GitHub' => [
            'repositories' => 'users/lars85/repos, orgs/lightwerk/repos, repos/achimfritz/typo3cms'
        ]
    ];

    /**
     * This method is called when the form of this step has been submitted
     *
     * @param array $formValues
     * @return void
     */
    public function postProcessFormValues(array $formValues)
    {
        $settings = $this->configurationManager->getConfiguration(ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
            'Lightwerk.SurfCaptain');
        $driver = $settings['sources']['default']['driver'];
        $repositories = Arrays::trimExplode(',', $formValues['repositories']);
        // reset
        $this->distributionSettings['Lightwerk']['SurfCaptain']['sources']['default']['repositories'] = [];
        for ($i = 0; $i < count($repositories); $i++) {
            $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                'Lightwerk.SurfCaptain.sources.default.repositories.' . $i, $repositories[$i]);
        }
        $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
            'Lightwerk.SurfCaptain.sources.default.privateToken', $formValues['privateToken']);
        switch ($driver) {
            case 'GitHub':
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accountName', 'git@github.com');
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.apiUrl', 'https://api.github.com/');
                break;
            case 'GitLab':
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accountName', $formValues['accountName']);
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.apiUrl', $formValues['apiUrl']);
                break;
            case 'BitBucket':
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accountName', $formValues['accountName']);
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.apiUrl', 'https://api.bitbucket.org/2.0/');
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.fallbackApiUrl', 'https://api.bitbucket.org/1.0/');
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.privateSecret', $formValues['privateSecret']);
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accessToken', $formValues['accessToken']);
                $this->distributionSettings = Arrays::setValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accessSecret', $formValues['accessSecret']);
                break;
            default:
                throw new SetupException('Unknown driver ' . $driver, 1427623122);
        }
        $this->configurationSource->save(FLOW_PATH_CONFIGURATION . ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
            $this->distributionSettings);
    }

    /**
     * Returns the form definitions for the step
     *
     * @param \TYPO3\Form\Core\Model\FormDefinition $formDefinition
     * @return void
     */
    protected function buildForm(\TYPO3\Form\Core\Model\FormDefinition $formDefinition)
    {
        $settings = $this->configurationManager->getConfiguration(ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
            'Lightwerk.SurfCaptain');
        $driver = $settings['sources']['default']['driver'];

        $page1 = $formDefinition->createPage('page1');
        $page1->setRenderingOption('header', 'Configure your Git Repository for ' . $driver . ' Driver');

        $generalSection = $page1->createElement('generalSection', 'TYPO3.Form:Section');
        $generalSection->setLabel('General Settings');

        $repositories = $generalSection->createElement('repositories', 'TYPO3.Form:SingleLineText');
        $repositories->setLabel('Repositories (csv) (e.g. ' . $this->exampleData[$driver]['repositories'] . ')');
        $repositories->addValidator(new NotEmptyValidator());
        $existingRepositories = Arrays::getValueByPath($this->distributionSettings,
            'Lightwerk.SurfCaptain.sources.default.repositories');
        if (is_array($existingRepositories)) {
            $repositories->setDefaultValue(implode(',', $existingRepositories));
        }

        $driverSection = $page1->createElement('driverSection', 'TYPO3.Form:Section');
        $driverSection->setLabel('Driver Specific Settings');
        switch ($driver) {
            case 'GitHub':
                $privateToken = $driverSection->createElement('privateToken', 'TYPO3.Form:SingleLineText');
                $privateToken->setLabel('Private Token');
                $privateToken->addValidator(new NotEmptyValidator());
                $privateToken->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.privateToken'));
                break;
            case 'GitLab':
                $privateToken = $driverSection->createElement('privateToken', 'TYPO3.Form:SingleLineText');
                $privateToken->setLabel('Private Token');
                $privateToken->addValidator(new NotEmptyValidator());
                $privateToken->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.privateToken'));

                $apiUrl = $driverSection->createElement('apiUrl', 'TYPO3.Form:SingleLineText');
                $apiUrl->setLabel('Api Url (e.g. https://git.lightwerk.com/api/v3/)');
                $apiUrl->addValidator(new NotEmptyValidator());
                $apiUrl->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.apiUrl'));

                $accountName = $driverSection->createElement('accountName', 'TYPO3.Form:SingleLineText');
                $accountName->setLabel('Account Name (e.g. git@git.lightwerk.com)');
                $accountName->addValidator(new NotEmptyValidator());
                $accountName->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accountName'));
                break;
            case 'BitBucket':
                $link = $driverSection->createElement('link', 'TYPO3.Setup:LinkElement');
                $link->setLabel('Read about OAuth on Bitbucket');
                $link->setProperty('href', 'https://confluence.atlassian.com/display/BITBUCKET/OAuth+on+Bitbucket');
                $link->setProperty('target', '_blank');
                $link->setProperty('elementClassAttribute', 'alert alert-info');

                $accountName = $driverSection->createElement('accountName', 'TYPO3.Form:SingleLineText');
                $accountName->setLabel('Account Name');
                $accountName->addValidator(new NotEmptyValidator());
                $accountName->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accountName'));

                $privateToken = $driverSection->createElement('privateToken', 'TYPO3.Form:SingleLineText');
                $privateToken->setLabel('Private Token');
                $privateToken->addValidator(new NotEmptyValidator());
                $privateToken->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.privateToken'));

                $privateSecret = $driverSection->createElement('privateSecret', 'TYPO3.Form:SingleLineText');
                $privateSecret->setLabel('Private Secret');
                $privateSecret->addValidator(new NotEmptyValidator());
                $privateSecret->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.privateSecret'));

                $accessToken = $driverSection->createElement('accessToken', 'TYPO3.Form:SingleLineText');
                $accessToken->setLabel('Access Token');
                $accessToken->addValidator(new NotEmptyValidator());
                $accessToken->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accessToken'));

                $accessSecret = $driverSection->createElement('accessSecret', 'TYPO3.Form:SingleLineText');
                $accessSecret->setLabel('Access Secret');
                $accessSecret->addValidator(new NotEmptyValidator());
                $accessSecret->setDefaultValue(Arrays::getValueByPath($this->distributionSettings,
                    'Lightwerk.SurfCaptain.sources.default.accessSecret'));
                break;
            default:
                throw new SetupException('Unknown driver ' . $driver, 1427623122);
        }

        $formDefinition->setRenderingOption('skipStepNotice',
            'If you skip this step make sure that you have configured your Git Repositories in Settings.yaml');
    }
}
