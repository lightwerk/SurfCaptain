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
class GitRepositoryDeployment {

	/**
	 * @var string
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $presetKey;

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
	 * @return string
	 */
	public function getDeploymentType() {
		return $this->deploymentType;
	}

	/**
	 * @param string $deploymentType
	 * @return void
	 */
	public function setDeploymentType($deploymentType) {
		$this->deploymentType = $deploymentType;
	}

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
	public function getPresetKey() {
		return $this->presetKey;
	}

	/**
	 * @param string $presetKey
	 * @return void
	 */
	public function setPresetKey($presetKey) {
		$this->presetKey = $presetKey;
	}

}
