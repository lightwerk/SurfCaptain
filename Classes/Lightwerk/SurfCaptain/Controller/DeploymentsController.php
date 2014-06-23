<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;

class DeploymentsController extends AbstractRestController {

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @FLow\Inject
	 * @var DeploymentRepository
	 */
	protected $deploymentRepository;

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'projectId';

	/**
	 * @param integer $projectId
	 * @return void
	 */
	public function showAction($projectId) {
		$deployments = $this->deploymentRepository->findByProjectId($projectId);
		$this->view->assign('value', array(
			'deployments' => $deployments,
		));
	}

	/**
	 * @param integer $projectId
	 * @param string $reference
	 * @param string $referenceName
	 * @param string $application
	 * @param string $configuration
	 * @return void
	 */
	public function createAction($projectId, $reference, $referenceName, $application, $configuration) {
		$configuration = json_decode($configuration, TRUE);
		if (empty($configuration)) {
			$this->redirectToResource(
				array(
					'projectId' => $projectId
				),
				NULL,
				400
			);
		}

		$newDeployment = new Deployment();
		$newDeployment
			->setProject($projectId)
			->setReference($reference)
			->setReferenceName($referenceName)
			->setClientIp($this->request->getHttpRequest()->getClientIpAddress())
			->setApplication($application)
			->setConfiguration($configuration)
			->setDate(new \DateTime())
			->setStatus('waiting');
		$this->deploymentRepository->add($newDeployment);

		$this->redirectToResource(
			array(
				'deploymentId' => $this->persistenceManager->getIdentifierByObject($newDeployment),
				'projectId' => $projectId
			),
			NULL,
			201
		);
	}
}