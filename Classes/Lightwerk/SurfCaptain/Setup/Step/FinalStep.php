<?php
namespace Lightwerk\SurfCaptain\Setup\Step;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class FinalStep extends \TYPO3\Setup\Step\AbstractStep {

	/**
	 * Returns the form definitions for the step
	 *
	 * @param \TYPO3\Form\Core\Model\FormDefinition $formDefinition
	 * @return void
	 */
	protected function buildForm(\TYPO3\Form\Core\Model\FormDefinition $formDefinition) {
		$page1 = $formDefinition->createPage('page1');
		$page1->setRenderingOption('header', 'Setup complete');

		$congratulations = $page1->createElement('congratulationsSection', 'TYPO3.Form:Section');
		$congratulations->setLabel('Congratulations');

		$success = $congratulations->createElement('success', 'TYPO3.Form:StaticText');
		$success->setProperty('text', 'You have successfully installed Lightwerk SurfCaptain!');
		$success->setProperty('elementClassAttribute', 'alert alert-success');

		$frontend = $page1->createElement('frontendSection', 'TYPO3.Form:Section');
		$frontend->setLabel('View the site');

		$link = $frontend->createElement('link', 'TYPO3.Setup:LinkElement');
		$link->setLabel('Go to the frontend');
		$link->setProperty('href', '/');
		$link->setProperty('elementClassAttribute', 'btn btn-large btn-primary');

		$loggedOut = $page1->createElement('loggedOut', 'TYPO3.Form:StaticText');
		$loggedOut->setProperty('text', 'You have automatically been logged out for security reasons since this is the final step. Refresh the page to log in again if you missed something.');
		$loggedOut->setProperty('elementClassAttribute', 'alert alert-info');
	}

}
