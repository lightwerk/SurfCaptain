<?php
namespace Lightwerk\SurfCaptain\Service;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Preset Service
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class PresetService {

	/**
	 * @var array
	 */
	protected $settings;


	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @var array
	 */
	protected $presets;

	/**
	 * @param array $settings
	 * @return void
	 */
	public function injectSettings(array $settings) {
		$this->settings = $settings;
	}

	/**
	 * @return array
	 * @throws Exception
	 */
	public function getPresets() {
		if (!isset($this->presets)) {
			$settings = $this->settings['presets'];
			$this->presets = json_decode(
				$this->gitService->getFileContent($settings['repositoryUrl'], $settings['filePath']),
				TRUE
			);
			if (empty($this->presets)) {
				throw new Exception('Could not load presets', 1407782202);
			}
		}
		return $this->presets;
	}

	/**
	 * @param $repositoryUrl
	 * @return array
	 */
	public function getPresetsByRepositoryUrl($repositoryUrl) {
		$presets = $this->getPresets();
		$repositoryPresets = array();
		foreach ($presets as $key => $preset) {
			foreach ($preset['applications'] as $application) {
				if (!empty($application['options']['repositoryUrl']) && $repositoryUrl === $application['options']['repositoryUrl']) {
					$repositoryPresets[$key] = $preset;
				}
			}
		}
		return $repositoryPresets;
	}

	/**
	 * @return array
	 */
	public function getGlobalPresets() {
		$presets = $this->getPresets();
		$globalPresets = array();
		foreach ($presets as $key => $preset) {
			foreach ($preset['applications'] as $application) {
				if (empty($application['options']['repositoryUrl'])) {
					$globalPresets[$key] = $preset;
				}
			}
		}
		return $globalPresets;
	}

	/**
	 * @param string $key
	 * @return array
	 * @throws Exception
	 */
	public function getPreset($key) {
		$presets = $this->getPresets();
		if (empty($presets[$key])) {
			throw new Exception('Preset with key "' . $key . '" does not exist!', 1407781243);
		}
		return $presets[$key];
	}

	/**
	 * @param string $presets
	 * @param string $commitMessage
	 * @return void
	 */
	public function setPresets($presets, $commitMessage) {
		$settings = $this->settings['presets'];
		$this->gitService->setFileContent(
			$settings['repositoryUrl'],
			$settings['filePath'],
			json_encode($presets, JSON_PRETTY_PRINT),
			$commitMessage
		);
		$this->presets = NULL;
	}

	/**
	 * @param string $key
	 * @param array $configuration
	 * @return void
	 * @throws Exception
	 */
	public function addPreset($key, array $configuration) {
		$presets = $this->getPresets();
		if (empty($key) || !is_string($key)) {
			throw new Exception('Key has to have a string value!', 1407787964);
		}
		if (empty($configuration) || !is_array($configuration)) {
			throw new Exception('Configuration has to be a valid array!', 1407787968);
		}
		if (!array_key_exists($key, $presets)) {
			$presets[$key] = $configuration;
			$this->setPresets($presets, 'Presets.json: Adds preset "' . $key . '"');
		} else {
			throw new Exception('Preset with key "' . $key . '" exists already!', 1407787972);
		}
	}

	/**
	 * @param string $key
	 * @param array $configuration
	 * @return void
	 * @throws Exception
	 */
	public function updatePreset($key, array $configuration) {
		$presets = $this->getPresets();
		if (empty($key) || !is_string($key)) {
			throw new Exception('Key has to have a string value!', 1407787769);
		}
		if (empty($configuration) || !is_array($configuration)) {
			throw new Exception('Configuration has to be a valid array!', 1407787838);
		}
		if (array_key_exists($key, $presets)) {
			$presets[$key] = $configuration;
			$this->setPresets($presets, 'Presets.json: Updates preset "' . $key . '"');
		} else {
			throw new Exception('Preset with key "' . $key . '" does not exist!', 1407787745);
		}
	}

	/**
	 * @param string $key
	 * @return void
	 * @throws Exception
	 */
	public function deletePreset($key) {
		$presets = $this->getPresets();
		if (array_key_exists($key, $presets)) {
			unset($presets[$key]);
			$this->setPresets($presets, 'Presets.json: Removes preset "' . $key . '"');
		} else {
			throw new Exception('Preset with key "' . $key . '" does not exist!', 1407787632);
		}
	}
}
