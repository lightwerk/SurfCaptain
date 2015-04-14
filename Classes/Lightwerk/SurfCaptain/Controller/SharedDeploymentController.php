<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\SharedDeployment;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 */
class SharedDeploymentController extends AbstractRestController {

	/**
	 * @var string
	 */
	protected $resourceArgumentName = 'sharedDeployment';

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\SharedDeployment $sharedDeployment
	 * @return void
	 */
	public function createAction(SharedDeployment $sharedDeployment) {
		$this->addFlashMessage('Created a new shared deployment.');
		$this->redirect('index', 'Deployment');
	}
}
