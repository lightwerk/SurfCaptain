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
class VerificationStep extends \TYPO3\Setup\Step\AbstractStep {

	/**
	 * @var \Lightwerk\SurfCaptain\GitApi\DriverComposite
	 * @Flow\Inject
	 */
	protected $driverComposite;

	/**
	 * Returns the form definitions for the step
	 *
	 * @param \TYPO3\Form\Core\Model\FormDefinition $formDefinition
	 * @return void
	 */
	protected function buildForm(\TYPO3\Form\Core\Model\FormDefinition $formDefinition) {
		$page1 = $formDefinition->createPage('page1');
		$page1->setRenderingOption('header', 'Verification Git Configuration');

		$verificationSection = $page1->createElement('verificationSection', 'TYPO3.Form:Section');
		$verificationSection->setLabel('Try to fetch your git repositories');

		$result = $verificationSection->createElement('result', 'TYPO3.Form:StaticText');

		try {
			$repositories = $this->driverComposite->getRepositories();
			$result->setProperty('text', 'Success: found ' . count($repositories) . ' repositories');
			$result->setProperty('elementClassAttribute', 'alert alert-success');

		} catch (\Lightwerk\SurfCaptain\Exception $e) {
			$result->setProperty('text', 'Failed with error ' . $e->getMessage() . ' - ' . $e->getCode());
			$result->setProperty('elementClassAttribute', 'alert alert-error');
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$result->setProperty('text', 'Failed with error ' . $e->getMessage() . ' - ' . $e->getCode());
			$result->setProperty('elementClassAttribute', 'alert alert-error');
		}

	}

}
