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
class GitRepositoryDeployment extends AbstractDeployment {

	/**
	 * @var string
	 */
	protected $deploymentType = 'TYPO3\\CMS\\Deploy';

	/**
	 * @var string
	 */
	protected $sha = '';

	/**
	 * @var string
	 */
	protected $branch = 'master';

	/**
	 * @var string
	 */
	protected $tag = '';

	/**
	 * @var string
	 */
	protected $deploymentPath = '';

	/**
	 * @var string
	 */
	protected $context = '';

	/**
	 * @return string
	 */
	public function getSha() {
		return $this->sha;
	}

	/**
	 * @param string $sha
	 * @return void
	 */
	public function setSha($sha) {
		$this->sha = $sha;
	}

	/**
	 * @return string
	 */
	public function getBranch() {
		return $this->branch;
	}

	/**
	 * @param string $branch
	 * @return void
	 */
	public function setBranch($branch) {
		$this->branch = $branch;
	}

	/**
	 * @return string
	 */
	public function getTag() {
		return $this->tag;
	}

	/**
	 * @param string $tag
	 * @return void
	 */
	public function setTag($tag) {
		$this->tag = $tag;
	}

	/**
	 * @return string
	 */
	public function getDeploymentPath() {
		return $this->deploymentPath;
	}

	/**
	 * @param string $deploymentPath
	 * @return void
	 */
	public function setDeploymentPath($deploymentPath) {
		$this->deploymentPath = $deploymentPath;
	}

	/**
	 * @return string
	 */
	public function getContext() {
		return $this->context;
	}

	/**
	 * @param string $context
	 * @return void
	 */
	public function setContext($context) {
		$this->context = $context;
	}
}
