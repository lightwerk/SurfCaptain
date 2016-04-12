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
class SyncDeployment extends AbstractDeployment {

	/**
	 * @var string
	 */
	protected $deploymentType = 'TYPO3\\CMS\\Sync';

	/**
	 * @var string
	 * @Flow\Validate(type="NotEmpty")
	 */
	protected $sourcePresetKey;

	/**
	 * @var bool
	 */
	protected $useSourceTaskOptions = FALSE;

	/**
	 * @var string
	 */
	protected $overrideSourceSharedPath = '';

	/**
	 * @var string
	 */
	protected $overrideSourceDeploymentPath = '';

	/**
	 * @var string
	 */
	protected $overrideTargetSharedPath = '';

	/**
	 * @var string
	 */
	protected $overrideTargetDeploymentPath = '';


	/**
	 * @return string
	 */
	public function getSourcePresetKey() {
		return $this->sourcePresetKey;
	}

	/**
	 * @param string $sourcePresetKey
	 * @return void
	 */
	public function setSourcePresetKey($sourcePresetKey) {
		$this->sourcePresetKey = $sourcePresetKey;
	}

	/**
	 * @return boolean
	 */
	public function getUseSourceTaskOptions() {
		return $this->useSourceTaskOptions;
	}

	/**
	 * @param boolean $useSourceTaskOptions
	 */
	public function setUseSourceTaskOptions($useSourceTaskOptions) {
		$this->useSourceTaskOptions = $useSourceTaskOptions;
	}

	/*
	 * @return string
	 */
	public function getOverrideSourceSharedPath() {
		return $this->overrideSourceSharedPath;
	}

	/**
	 * @param string $overrideSourceSharedPath
	 */
	public function setOverrideSourceSharedPath($overrideSourceSharedPath) {
		$this->overrideSourceSharedPath = $overrideSourceSharedPath;
	}

	/**
	 * @return string
	 */
	public function getOverrideSourceDeploymentPath() {
		return $this->overrideSourceDeploymentPath;
	}

	/**
	 * @param string $overrideSourceDeploymentPath
	 */
	public function setOverrideSourceDeploymentPath($overrideSourceDeploymentPath) {
		$this->overrideSourceDeploymentPath = $overrideSourceDeploymentPath;
	}

	/**
	 * @return string
	 */
	public function getOverrideTargetSharedPath() {
		return $this->overrideTargetSharedPath;
	}

	/**
	 * @param string $overrideTargetSharedPath
	 */
	public function setOverrideTargetSharedPath($overrideTargetSharedPath) {
		$this->overrideTargetSharedPath = $overrideTargetSharedPath;
	}

	/**
	 * @return string
	 */
	public function getOverrideTargetDeploymentPath() {
		return $this->overrideTargetDeploymentPath;
	}

	/**
	 * @param string $overrideTargetDeploymentPath
	 */
	public function setOverrideTargetDeploymentPath($overrideTargetDeploymentPath) {
		$this->overrideTargetDeploymentPath = $overrideTargetDeploymentPath;
	}




}
