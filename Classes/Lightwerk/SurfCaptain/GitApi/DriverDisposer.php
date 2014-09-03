<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

/**
 * DriverDisposer
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class DriverDisposer {

	/**
	 * @var DriverInterface[]
	 */
	protected $drivers = array();

	/**
	 * @var array
	 */
	protected $settings;

	/**
	 * @param array $settings
	 * @return void
	 */
	public function injectSettings(array $settings) {
		$this->settings = $settings;
	}

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
			throw new Exception('No existing sources', 1407702341);
		}
		foreach ($this->settings['sources'] as $host => $source) {
			if (empty($source['driver'])) {
				throw new Exception('No driver defined for "' . $host . '"', 1407702922);
			}
			if (!class_exists($source['driver'])) {
				throw new Exception('Class "' . $source['driver'] . '" does not exist!', 1407702969);
			}
			$driver = new $source['driver']();
			if ($driver instanceof DriverInterface) {
				$driver->setSettings($source);
				$this->drivers[$host] = $driver;
			} else {
				throw new Exception(
					'Class "' . $source['driver'] . '" does not implement Lightwerk\SurfCaptain\Service\Driver\DriverInterface!',
					1407739781
				);
			}
		}
	}

	/**
	 * Returns a driver for a defined host
	 *
	 * @param string $host
	 * @return Driver\DriverInterface
	 * @throws Exception
	 */
	protected function getDriverFromHost($host) {
		if (!isset($this->drivers[$host])) {
			throw new Exception('No existing driver for host "' . $host . '"', 1407701880);
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
	 * Returns repositories
	 *
	 * @return Repository[]
	 */
	public function getRepositories() {
		$repositories = array();
		foreach ($this->drivers as $driver) {
			$repositories = array_merge($repositories, $driver->getRepositories());
		}
		return $repositories;
	}

	/**
	 * Returns repository
	 *
	 * @param string $repositoryUrl
	 * @return Repository
	 * @throws Exception
	 */
	public function getRepository($repositoryUrl) {
		$repository = NULL;
		foreach ($this->drivers as $driver) {
			if ($driver->hasRepository($repositoryUrl) === TRUE) {
				$repository = $driver->getRepository($repositoryUrl);
			}
		}
		if ($repository === NULL) {
			throw new Exception('no driver found for repository url ' . $repositoryUrl, 1409681003);
		}
		return $repository;
	}
}
