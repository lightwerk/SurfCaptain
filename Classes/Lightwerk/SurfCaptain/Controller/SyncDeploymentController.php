<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\SyncDeployment;
use TYPO3\Flow\Error\Message;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 */
class SyncDeploymentController extends AbstractRestController {

	/**
	 * @FLow\Inject
	 * @var \Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository
	 */
	protected $deploymentRepository;

	/**
	 * @Flow\Inject
	 * @var \Lightwerk\SurfCaptain\Domain\Factory\DeploymentFactory
	 */
	protected $deploymentFactory;

	/**
	 * @var string
	 */
	protected $resourceArgumentName = 'syncDeployment';

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\SyncDeployment $syncDeployment
	 * @return void
	 */
	public function createAction(SyncDeployment $syncDeployment) {
		try {
			$deployment = $this->deploymentFactory->createFromSyncDeployment($syncDeployment);
			$this->deploymentRepository->add($deployment);
			$this->addFlashMessage('Created a new sync deployment.', 'OK', Message::SEVERITY_OK);
			$this->redirect('index', NULL, NULL, array('deployment' => $deployment));
		} catch (\Lightwerk\SurfCaptain\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
		$this->redirect('index');
	}
}
