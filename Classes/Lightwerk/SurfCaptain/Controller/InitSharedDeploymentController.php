<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSharedDeployment;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 */
class InitSharedDeploymentController extends AbstractRestController {

	/**
	 * @var string
	 */
	protected $resourceArgumentName = 'initSharedDeployment';

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSharedDeployment $initSharedDeployment
	 * @return void
	 */
	public function createAction(InitSharedDeployment $initSharedDeployment) {
		$this->addFlashMessage('Created a new init shared deployment.');
		$this->redirect('index', 'Deployment');
	}
}
