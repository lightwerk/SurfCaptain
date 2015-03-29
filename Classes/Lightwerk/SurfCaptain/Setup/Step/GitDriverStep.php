<?php
namespace Lightwerk\SurfCaptain\Setup\Step;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Utility\Arrays;
use TYPO3\Flow\Configuration\ConfigurationManager;
use TYPO3\Flow\Validation\Validator\NotEmptyValidator;
use TYPO3\Setup\Exception as SetupException;

/**
 * @Flow\Scope("singleton")
 */
class GitDriverStep extends \TYPO3\Setup\Step\AbstractStep {

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
		$page1->setRenderingOption('header', 'Select your Git Driver');

		$driverSection = $page1->createElement('driverSection', 'TYPO3.Form:Section');

		$gitDriver = $driverSection->createElement('gitDriver', 'TYPO3.Form:SingleSelectDropdown');
		$gitDriver->setLabel('Git Driver');
		$gitDriver->setProperty('options', array('GitHub' => 'Git Hub', 'GitLab' => 'Git Lab', 'BitBucket' => 'Bit Bucket'));
		$gitDriver->addValidator(new NotEmptyValidator());

		$formDefinition->setRenderingOption('skipStepNotice', 'If you skip this step make sure that you have configured your Git Repositories in Setup.yaml');
	}

	/**
	 * This method is called when the form of this step has been submitted
	 *
	 * @param array $formValues
	 * @return void
	 */
	public function postProcessFormValues(array $formValues) {
		$driver = $formValues['gitDriver'];
		$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.driver', $driver);
		switch ($driver) {
			case 'GitHub':
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Repository.repositoryUrl', '{{ssh_url}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Repository.webUrl', '{{url}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Commit.id', '{{sha}}');
				break;
			case 'GitLab':
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Repository.repositoryUrl', '{{ssh_url_to_repo}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Commit.date', '{{committed_date}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Commit.committerName', '{{committer.name}}');
				break;
			case 'BitBucket':
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Repository.webUrl', '{{links.clone.0.href}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Repository.repositoryUrl', '{{links.clone.1.href}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Branch.name', '{{branch}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Branch.commit.id', '{{raw_node}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Branch.commit.committerName', '{{author}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Branch.commit.date', '{{timestamp}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Branch.commit.message', '{{message}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Tag.name', '{{_KEY_}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Tag.commit.id', '{{raw_node}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Tag.commit.committerName', '{{author}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Tag.commit.date', '{{timestamp}}');
				$this->distributionSettings = Arrays::setValueByPath($this->distributionSettings, 'Lightwerk.SurfCaptain.sources.default.mapping.Tag.commit.message', '{{message}}');
				break;
			default:
				throw new SetupException('unknown driver ' . $driver, 1427623122);
		}
		$this->configurationSource->save(FLOW_PATH_CONFIGURATION . ConfigurationManager::CONFIGURATION_TYPE_SETTINGS, $this->distributionSettings);
		$this->configurationManager->flushConfigurationCache();
	}



}
