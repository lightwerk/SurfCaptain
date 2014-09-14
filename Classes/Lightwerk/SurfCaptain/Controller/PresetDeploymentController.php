<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use Lightwerk\SurfCaptain\Domain\Repository\Preset\RepositoryInterface as PresetRepositoryInterface;
use TYPO3\Flow\Annotations as Flow;

/**
 * Deployment Controller
 *
 * @package Lightwerk\SurfCaptain
 */
class PresetDeploymentController extends AbstractRestController {

	/**
	 * @FLow\Inject
	 * @var DeploymentRepository
	 */
	protected $deploymentRepository;

	/**
	 * @Flow\Inject
	 * @var PresetRepositoryInterface
	 */
	protected $presetRepository;

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'key';

	/**
	 * @param string $key
	 * @throws \TYPO3\Flow\Persistence\Exception\IllegalObjectTypeException
	 * @return void
	 */
	public function createAction($key) {
		$configuration = $this->presetRepository->findByIdentifier($key);
		$deployment = new Deployment();
		$deployment->setConfiguration($configuration);
		$deployment->setClientIp($this->request->getHttpRequest()->getClientIpAddress());
		$this->deploymentRepository->add($deployment);
		$this->addFlashMessage('Created a new deployment.');
		$this->redirect('index', NULL, NULL, array('deployment' => $deployment));
	}
}