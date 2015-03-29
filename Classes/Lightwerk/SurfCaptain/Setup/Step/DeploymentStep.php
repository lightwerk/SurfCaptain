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
class DeploymentStep extends \TYPO3\Setup\Step\AbstractStep {

	/**
	 * @var \TYPO3\Flow\Configuration\Source\YamlSource
	 * @Flow\Inject
	 */
	protected $configurationSource;

	/**
	 * Returns the form definitions for the step
	 *
	 * @param \TYPO3\Form\Core\Model\FormDefinition $formDefinition
	 * @return void
	 */
	protected function buildForm(\TYPO3\Form\Core\Model\FormDefinition $formDefinition) {
		$page1 = $formDefinition->createPage('page1');
		$page1->setRenderingOption('header', 'Deployment Settings');

		$deploymentSection = $page1->createElement('deploymentSection', 'TYPO3.Form:Section');

		$user = $deploymentSection->createElement('defaultUser', 'TYPO3.Form:SingleLineText');
		$user->setLabel('Deployment User (Default SSH User for Deployment on Target System)');
		$user->setDefaultValue(Arrays::getValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.frontendSettings.defaultUser'));

		$path = $deploymentSection->createElement('defaultDeploymentPath', 'TYPO3.Form:SingleLineText');
		$path->setLabel('Deployment Path (Default Target Path for deployments (without ../htdocs), e.g. /var/www/{{project}}/{{suffix}}/)');
		$user->setDefaultValue(Arrays::getValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.frontendSettings.defaultDeploymentPath'));

		$formDefinition->setRenderingOption('skipStepNotice', 'If you skip this step make sure that you have configured your Git Repositories in Setup.yaml');

	}

	/**
	 * This method is called when the form of this step has been submitted
	 *
	 * @param array $formValues
	 * @return void
	 */
	public function postProcessFormValues(array $formValues) {
		if (empty($formValues['defaultDeploymentPath']) === FALSE) {
			$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.frontendSettings.defaultDeploymentPath', $formValues['defaultDeploymentPath']);
		}
		if (empty($formValues['defaultUser']) === FALSE) {
			$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.frontendSettings.defaultUser', $formValues['defaultUser']);
		}
		$this->configurationSource->save(FLOW_PATH_CONFIGURATION . ConfigurationManager::CONFIGURATION_TYPE_SETTINGS, $this->distributionSettings);
		$this->configurationManager->flushConfigurationCache();
	}


}
