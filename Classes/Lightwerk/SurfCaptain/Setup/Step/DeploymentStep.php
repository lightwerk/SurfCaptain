<?php
namespace Lightwerk\SurfCaptain\Setup\Step;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Configuration\ConfigurationManager;
use TYPO3\Flow\Utility\Arrays;

/**
 * @Flow\Scope("singleton")
 */
class DeploymentStep extends \TYPO3\Setup\Step\AbstractStep
{
    /**
     * @var \TYPO3\Flow\Configuration\Source\YamlSource
     * @Flow\Inject
     */
    protected $configurationSource;

    /**
     * This method is called when the form of this step has been submitted
     *
     * @param array $formValues
     * @return void
     */
    public function postProcessFormValues(array $formValues)
    {
        if (empty($formValues['defaultDeploymentPath']) === false) {
            $this->distributionSettings = Arrays::setValueByPath(
                $this->distributionSettings,
                'Lightwerk.SurfCaptain.frontendSettings.defaultDeploymentPath',
                $formValues['defaultDeploymentPath']
            );
        }
        if (empty($formValues['defaultUser']) === false) {
            $this->distributionSettings = Arrays::setValueByPath(
                $this->distributionSettings,
                'Lightwerk.SurfCaptain.frontendSettings.defaultUser',
                $formValues['defaultUser']
            );
        }
        $this->configurationSource->save(
            FLOW_PATH_CONFIGURATION . ConfigurationManager::CONFIGURATION_TYPE_SETTINGS,
            $this->distributionSettings
        );
    }

    /**
     * Returns the form definitions for the step
     *
     * @param \TYPO3\Form\Core\Model\FormDefinition $formDefinition
     * @return void
     */
    protected function buildForm(\TYPO3\Form\Core\Model\FormDefinition $formDefinition)
    {
        $page1 = $formDefinition->createPage('page1');
        $page1->setRenderingOption('header', 'Deployment Settings');

        $deploymentSection = $page1->createElement('deploymentSection', 'TYPO3.Form:Section');

        $user = $deploymentSection->createElement('defaultUser', 'TYPO3.Form:SingleLineText');
        $user->setLabel('Deployment user. Default SSH user for deployment on target systems (optional, will be configurable per target system later on).');
        $user->setDefaultValue(
            Arrays::getValueByPath(
                $this->distributionSettings,
                'Lightwerk.SurfCaptain.frontendSettings.defaultUser'
            )
        );

        $path = $deploymentSection->createElement('defaultDeploymentPath', 'TYPO3.Form:SingleLineText');
        $path->setLabel('Deployment Path. Default target path for deployments, e.g. "/var/www/{{project}}/{{suffix}}/htdocs/" (optional, will be configurable per target system later on	).');
        $path->setDefaultValue(
            Arrays::getValueByPath(
                $this->distributionSettings,
                'Lightwerk.SurfCaptain.frontendSettings.defaultDeploymentPath'
            )
        );

        $formDefinition->setRenderingOption(
            'skipStepNotice',
            'You can always configure your frontend settings later in Settings.yaml'
        );
    }
}
