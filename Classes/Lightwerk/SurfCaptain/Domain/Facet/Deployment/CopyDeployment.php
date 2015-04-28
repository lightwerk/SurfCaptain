<?php
namespace Lightwerk\SurfCaptain\Domain\Facet\Deployment;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("prototype")
 */
class CopyDeployment extends AbstractDeployment {

	/**
	 * @var string
	 */
	protected $deploymentType = 'TYPO3\\CMS\\Copy';

	/**
	 * @var \Lightwerk\SurfCaptain\Domain\Facet\InitSyncDeployment
	 */
	protected $initSyncDeployment;

	/**
	 * @var \Lightwerk\SurfCaptain\Domain\Facet\GitRepositoryDeployment
	 */
	protected $gitRepositoryDeployment;

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\InitSyncDeployment
	 * @return void
	 */
	public function setInitSyncDeployment(InitSyncDeployment $initSyncDeployment) {
		$this->initSyncDeployment = $initSyncDeployment;
	}

	/**
	 * @return \Lightwerk\SurfCaptain\Domain\Facet\InitSyncDeployment
	 */
	public function getInitSyncDeployment() {
		return $this->initSyncDeployment;
	}

	/**
	 * @param \Lightwerk\SurfCaptain\Domain\Facet\GitRepositoryDeployment
	 * @return void
	 */
	public function setGitRepositoryDeployment(GitRepositoryDeployment $gitRepositoryDeployment) {
		$this->gitRepositoryDeployment = $gitRepositoryDeployment;
	}

	/**
	 * @return \Lightwerk\SurfCaptain\Domain\Facet\GitRepositoryDeployment
	 */
	public function getGitRepositoryDeployment() {
		return $this->gitRepositoryDeployment;
	}

}
