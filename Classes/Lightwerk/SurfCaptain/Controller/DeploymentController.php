<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use Lightwerk\SurfCaptain\Service\Exception;
use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSyncDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\CopyDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\SyncDeployment;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment;

/**
 * Deployment Controller
 *
 * @package Lightwerk\SurfCaptain
 */
class DeploymentController extends AbstractRestController {

	/**
	 * @var \Lightwerk\SurfCaptain\GitApi\DriverComposite
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
		$this->view->assign('initSyncDeployment', new InitSyncDeployment());
		$this->view->assign('syncDeployment', new SyncDeployment());
		$this->view->assign('gitRepositoryDeployment', new GitRepositoryDeployment());
		$copyDeployment = new CopyDeployment();
		$copyDeployment->setGitRepositoryDeployment(new GitRepositoryDeployment());
		$copyDeployment->setInitSyncDeployment(new InitSyncDeployment());
		$this->view->assign('copyDeployment', $copyDeployment);
		$this->view->assign('deployments', $this->deploymentRepository->findAllWithLimit($limit));
	}

	/**
	 * @param Deployment $deployment
	 * @return void
	 */
	public function showAction(Deployment $deployment) {
		try {
			$this->view->assign('deployment', $deployment);
		} catch (Exception $e) {
			$this->handleException($e);
		}
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
		$this->redirect('index');
	}
}
