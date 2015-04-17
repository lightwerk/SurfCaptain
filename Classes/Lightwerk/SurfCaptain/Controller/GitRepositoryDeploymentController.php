<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment;
use TYPO3\Flow\Error\Message;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 */
class GitRepositoryDeploymentController extends AbstractRestController {

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
	protected $resourceArgumentName = 'gitRepositoryDeployment';

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment $gitRepositoryDeployment
	 * @return void
	 */
	public function createAction(GitRepositoryDeployment $gitRepositoryDeployment) {
		try {
			$deployment = $this->deploymentFactory->createFromGitRepositoryDeployment($gitRepositoryDeployment);
			$this->deploymentRepository->add($deployment);
			$this->addFlashMessage('Created a new git repository deployment.', 'OK', Message::SEVERITY_OK);
		} catch (\Lightwerk\SurfCaptain\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
		$this->redirect('index', 'Deployment');
	}

}
