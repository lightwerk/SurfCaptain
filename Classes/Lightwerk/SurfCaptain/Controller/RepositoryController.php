<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;

class RepositoryController extends AbstractRestController {

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

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
		try {
			$repository = $this->gitService->getRepository($repositoryUrl);
			$repository->setTags($this->gitService->getTags($repositoryUrl))
					   ->setBranches($this->gitService->getBranches($repositoryUrl));
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
			$this->view->assign('repositories', $this->gitService->getRepositories());
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}
}