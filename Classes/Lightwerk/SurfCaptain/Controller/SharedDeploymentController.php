<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\SharedDeployment;
use TYPO3\Flow\Error\Message;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 */
class SharedDeploymentController extends AbstractRestController {

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
	protected $resourceArgumentName = 'sharedDeployment';

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\SharedDeployment $sharedDeployment
	 * @return void
	 */
	public function createAction(SharedDeployment $sharedDeployment) {
		try {
			$deployment = $this->deploymentFactory->createFromSharedDeployment($sharedDeployment);
			$this->deploymentRepository->add($deployment);
			$this->addFlashMessage('Created a new shared deployment.', 'OK', Message::SEVERITY_OK);
		} catch (\Lightwerk\SurfCaptain\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
		$this->redirect('index', 'Deployment');
	}
}
