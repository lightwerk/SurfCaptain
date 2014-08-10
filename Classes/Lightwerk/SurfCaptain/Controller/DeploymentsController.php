<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use TYPO3\Flow\Annotations as Flow;

class DeploymentsController extends AbstractRestController {

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

	/**
	 * @param integer $projectId
	 * @param Deployment $deployment
	 * @return void
	 * @throws \TYPO3\Flow\Mvc\Exception\StopActionException
	 * @throws \TYPO3\Flow\Persistence\Exception\IllegalObjectTypeException
	 */
	public function deleteAction($projectId, Deployment $deployment) {
		if ($deployment->getStatus() === 'waiting') {
			$deployment->setStatus('canceled');
			$this->deploymentRepository->update($deployment);
		}
		$this->redirectToResource(
			array(
				'deploymentId' => $this->persistenceManager->getIdentifierByObject($deployment),
				'projectId' => $projectId
			)
		);
	}
}