<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 */
class GitRepositoryDeploymentController extends AbstractRestController {

	/**
	 * @var string
	 */
	protected $resourceArgumentName = 'gitRepositoryDeployment';

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\GitRepositoryDeployment $gitRepositoryDeployment
	 * @return void
	 */
	public function createAction(GitRepositoryDeployment $gitRepositoryDeployment) {
		$this->addFlashMessage('Created a new git repository deployment.');
		$this->redirect('index', 'Deployment');
	}

}
