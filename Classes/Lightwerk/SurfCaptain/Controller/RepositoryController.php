<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use Lightwerk\SurfCaptain\Service\PresetService;
use TYPO3\Flow\Annotations as Flow;

/**
 * Repository Controller
 *
 * @package Lightwerk\SurfCaptain
 */
class RepositoryController extends AbstractRestController {

	/**
	 * TODO should be \Lightwerk\SurfCaptain\GitApi\DriverComposite
	 * @var \Lightwerk\SurfCaptain\Service\GitServiceInterface
	 * @Flow\Inject
	 */
	protected $driverComposite;

	/**
	 * @Flow\Inject
	 * @var DeploymentRepository
	 */
	protected $deploymentRepository;

	/**
	 * @Flow\Inject
	 * @var PresetService
	 */
	protected $presetService;

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'repositoryUrl';

	/**
	 * @param string $repositoryUrl
	 * @return void
	 */
	public function showAction($repositoryUrl) {
		// TODO lw_af missing branches/tags
		try {
			$repository = $this->driverComposite->getRepository($repositoryUrl)
				->setDeployments($this->deploymentRepository->findByRepositoryUrl($repositoryUrl))
				->setPresets($this->presetService->getPresetsByRepositoryUrl($repositoryUrl));
			$this->view->assign('repository', $repository);
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @return void
	 */
	public function listAction() {
		try {
			$this->view->assign('repositories', $this->driverComposite->getRepositories());
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}
}
