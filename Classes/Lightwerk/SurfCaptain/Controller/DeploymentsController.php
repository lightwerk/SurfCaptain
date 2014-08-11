<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use Lightwerk\SurfCaptain\Service\PresetService;
use TYPO3\Flow\Annotations as Flow;

class DeploymentsController extends AbstractRestController {

	/**
	 * @Flow\Inject
	 * @var PresetService
	 */
	protected $presetService;

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
	 * @param Deployment $deployment
	 * @return void
	 */
	public function showAction(Deployment $deployment) {
		$this->view->assign('deployments', $deployment);
	}

	/**
	 * @param string $repositoryUrl
	 * @param integer $limit
	 * @return void
	 */
	public function listAction($repositoryUrl = NULL, $limit = 10) {
		if (empty($limit) || $limit < 0) {
			$limit = 999;
		}
		if (!empty($repositoryUrl)) {
			$deployments = $this->deploymentRepository->findByRepositoryUrlWithLimit($repositoryUrl, $limit);
		} else {
			$deployments = $this->deploymentRepository->findAllWithLimit($limit);
		}
		$this->view->assign('deployments', $deployments);
	}

	/**
	 * @param Deployment $deployment
	 * @param string $configuration
	 * @param string $key
	 * @return void
	 */
	public function createAction(Deployment $deployment = NULL, $configuration = NULL, $key = NULL) {
		try {
			if (empty($deployment)) {
				$deployment = new Deployment();
			}

			if (!empty($configuration)) {
				$configuration = json_decode($configuration, TRUE);
			} elseif (!empty($key)) {
				$configuration = $this->presetService->getPreset($key);
			} else {
				$configuration = $deployment->getConfiguration();
			}
			// ToDo: Add exception if configuration is empty

			$deployment
				->setConfiguration($configuration)
				->setClientIp($this->request->getHttpRequest()->getClientIpAddress())
				->setDate(new \DateTime())
				->setStatus('waiting');

			$options = $configuration['applications'][0]['options'];
			if (!empty($options['repositoryUrl'])) {
				$deployment->setRepositoryUrl($options['repositoryUrl']);
			}
			if (!empty($options['ref'])) {
				$deployment->setReferenceName($options['ref']);
			} elseif (!empty($options['tag'])) {
				$deployment->setReferenceName($options['tag']);
			} elseif (!empty($options['branch'])) {
				$deployment->setReferenceName($options['branch']);
			}

			$this->deploymentRepository->add($deployment);
			$this->redirect('show', NULL, NULL, array('deployment' => $deployment));
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @param Deployment $deployment
	 * @return void
	 */
	public function deleteAction(Deployment $deployment) {
		if ($deployment->getStatus() === 'waiting') {
			$deployment->setStatus('canceled');
			$this->deploymentRepository->update($deployment);
		}
		$this->redirect('show', NULL, NULL, array('deployment' => $deployment));
	}
}