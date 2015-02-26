<?php
namespace Lightwerk\SurfCaptain\Domain\Repository\Preset;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Preset repository with file backend
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class FileRepository extends AbstractRepository implements RepositoryInterface {

	/**
	 * Inject settings
	 *
	 * @param array $settings
	 * @return void
	 */
	public function injectSettings(array $settings) {
		$this->settings = $settings['repository']['preset']['fileRepository'];
	}

	/**
	 * Saves the presets.
	 *
	 * @param array $presets
	 * @param string $logMessage
	 * @return void
	 * @SuppressWarnings(PHPMD.UnusedFormalParameter)
	 */
	protected function savePresets(array $presets, $logMessage) {
		$this->setDecodedFileContent($presets);
	}

	/**
	 * Load the presets.
	 *
	 * @return array $presets
	 */
	protected function loadPresets() {
		return $this->getDecodedFileContent();
	}

	/**
	 * @param $content
	 * @return void
	 * @throws Exception
	 */
	protected function setDecodedFileContent($content) {
		$content = json_encode($content, JSON_PRETTY_PRINT);
		if ($content === FALSE) {
			throw new Exception('Could not encode content', 1410549745);
		}
		$this->setFileContent($content);
	}

	/**
	 * @param string $content
	 * @return void
	 */
	protected function setFileContent($content) {
		$bytes = file_put_contents($this->getFilePath(), $content);
		if ($bytes === FALSE) {
			throw new Exception('Could not write content to ' . $this->getFilePath(), 1410549549);
		}
	}

	/**
	 * @return mixed
	 * @throws Exception
	 */
	protected function getDecodedFileContent() {
		$content = json_decode($this->getFileContent(), TRUE);
		if ($content === NULL) {
			throw new Exception('File ' . $this->getFilePath() . ' is not a valid json', 1410549447);
		}
		return $content;
	}

	/**
	 * @return string
	 */
	protected function getFileContent() {
		if (file_exists($this->getFilePath()) === FALSE) {
			return '{}';
		}
		return file_get_contents($this->getFilePath());
	}

	/**
	 * @return string
	 * @throws Exception
	 */
	protected function getFilePath() {
		if (empty($this->settings['filePath'])) {
			throw new Exception('filePath is not given in settings', 1410549265);
		}
		$filePath = $this->settings['filePath'];
		if ($filePath{0} !== '/') {
			$filePath = FLOW_PATH_ROOT . '/' . $filePath;
		}
		return $filePath;
	}
}
