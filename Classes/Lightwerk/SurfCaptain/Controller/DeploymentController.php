<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use TYPO3\Flow\Annotations as Flow;

class DeploymentController extends AbstractRestController {

	/**
	 * @FLow\Inject
	 * @var DeploymentRepository
	 */
	protected $deploymentRepository;

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'deployment';

	/**
	 * @return void
	 */
	public function listAction() {
		$this->view->assign('deployments', $this->deploymentRepository->findAll());
	}

	/**
	 * @param Deployment $deployment
	 * @return void
	 */
	public function showAction(Deployment $deployment) {
		$this->view->assign('deployment', $deployment);
	}

	/**
	 * @param Deployment $deployment
	 * @return void
	 */
	public function createAction(Deployment $deployment) {
		$deployment->setClientIp($this->request->getHttpRequest()->getClientIpAddress());
		$this->deploymentRepository->add($deployment);
		$this->addFlashMessage('Created a new deployment.');
		$this->redirect('index', NULL, NULL, array('deployment' => $deployment));
	}

	/**
	 * @param Deployment $deployment
	 * @return void
	 */
	public function deleteAction(Deployment $deployment) {
		if ($deployment->getStatus() === 'waiting') {
			$deployment->setStatus('canceled');
			$this->deploymentRepository->update($deployment);
			$this->addFlashMessage('Canceled deployment.');
		} else {
			$this->handleException(new Exception('Just waiting deployments can be canceled.', 1408041167));
		}
		$this->redirect('index', NULL, NULL, array('deployment' => $deployment));
	}
}