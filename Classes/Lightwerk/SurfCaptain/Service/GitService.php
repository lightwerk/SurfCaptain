<?php
namespace Lightwerk\SurfCaptain\Service;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class GitService implements Driver\DriverInterface {

	/**
	 * @var Driver\DriverInterface[]
	 */
	protected $drivers = array();

	/**
	 * @var array
	 */
	protected $settings;

	/**
	 * @return void
	 * @throws Exception
	 */
	protected function initializeObject() {
		$this->initializeDrivers();
	}

	/**
	 * @return void
	 * @throws Exception
	 */
	protected function initializeDrivers() {
		if (!is_array($this->settings['sources'])) {
			throw new Exception('No existing sources', 1407702241);
		}
		foreach ($this->settings['sources'] as $host => $source) {
			if (empty($source['className'])) {
				throw new Exception('No className defined for "' . $host . '"', 1407702622);
			}
			if (!class_exists($source['className'])) {
				throw new Exception('Class "' . $source['className'] . '" does not exist!', 1407702669);
			}
			$driver = new $source['className']();
			if ($driver instanceof Driver\DriverInterface) {
				$driver->setSettings($source);
				$this->drivers[$host] = $driver;
			} else {
				throw new Exception(
					'Class "' . $source['className'] . '" does not implement Lightwerk\SurfCaptain\Service\Driver\DriverInterface!',
					1407739781
				);
			}
		}
	}

	/**
	 * Returns a driver for a defined host
	 *
	 * @return Driver\DriverInterface
	 * @throws Exception
	 */
	protected function getDriverFromHost($host) {
		if (!isset($this->drivers[$host])) {
			throw new Exception('No existing driver for host "' . $host . '"', 1407701580);
		}
		return $this->drivers[$host];
	}

	/**
	 * Returns a driver for a repositoryUrl
	 *
	 * @param string $repositoryUrl
	 * @return Driver\DriverInterface
	 * @throws Exception
	 */
	protected function getDriverFromRepositoryUrl($repositoryUrl) {
		return $this->getDriverFromHost(
			GeneralUtility::getUrlPartsFromRepositoryUrl($repositoryUrl)['host']
		);
	}

	/**
	 * Inject the settings
	 *
	 * @param array $settings
	 * @return void
	 */
	public function injectSettings(array $settings) {
		$this->settings = $settings;
	}

	/**
	 * Sets the settings
	 *
	 * @param array $settings
	 * @return void
	 */
	public function setSettings(array $settings) {
		$this->settings = $settings;
	}

	/**
	 * Returns repositories
	 *
	 * @return array
	 */
	public function getRepositories() {
		$repositories = array();
		foreach ($this->drivers as $driver) {
			$repositories = array_merge($repositories, $driver->getRepositories());
		}
		return $repositories;
	}

	/**
	 * Return the content of a file
	 *
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 */
	public function getFileContent($repositoryUrl, $filePath, $reference = 'master') {
		return $this->getDriverFromRepositoryUrl($repositoryUrl)
					->getFileContent($repositoryUrl, $filePath, $reference);
	}

	/**
	 * Sets the content of a file
	 *
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $content
	 * @param string $commitMessage
	 * @param string $branchName
	 * @return void
	 */
	public function setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName = 'master') {
		$this->getDriverFromRepositoryUrl($repositoryUrl)
			 ->setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName);
	}

	/**
	 * Returns branches of a repository
	 *
	 * @param string $repositoryUrl
	 * @return array
	 */
	public function getBranches($repositoryUrl) {
		return $this->getDriverFromRepositoryUrl($repositoryUrl)
					->getBranches($repositoryUrl);
	}

	/**
	 * Returns tags of a repository
	 *
	 * @param string $repositoryUrl
	 * @return array
	 */
	public function getTags($repositoryUrl) {
		return $this->getDriverFromRepositoryUrl($repositoryUrl)
					->getTags($repositoryUrl);
	}
}
