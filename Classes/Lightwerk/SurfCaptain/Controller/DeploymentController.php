<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use TYPO3\Flow\Annotations as Flow;

/**
 * Deployment Controller
 *
 * @package Lightwerk\SurfCaptain
 */
class DeploymentController extends AbstractRestController {

	/**
	 * TODO should be \Lightwerk\SurfCaptain\GitApi\DriverComposite
	 * @var \Lightwerk\SurfCaptain\Service\GitServiceInterface
	 * @Flow\Inject
	 */
	protected $driverComposite;

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
	 * @param integer $limit
	 * @return void
	 */
	public function listAction($limit = 100) {
		$this->view->assign('deployments', $this->deploymentRepository->findAllWithLimit($limit));
	}

	/**
	 * @param Deployment $deployment
	 * @return void
	 */
	public function showAction(Deployment $deployment) {
		$repositoryUrl = $deployment->getRepositoryUrl();
		$repository = $this->driverComposite->getRepository($repositoryUrl);
		$deployment->setRepository($repository);
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
	public function updateAction(Deployment $deployment) {
		// ToDo: Just status can be changed to canceled if it was waiting before!
		$this->deploymentRepository->update($deployment);
		$this->addFlashMessage('Updated a deployment.');
		$this->redirect('index', NULL, NULL, array('deployment' => $deployment));
	}
}
