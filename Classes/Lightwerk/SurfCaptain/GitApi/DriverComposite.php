<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Repository;
use TYPO3\Flow\Annotations as Flow;

/**
 * DriverComposite
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class DriverComposite implements DriverInterface {

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
		$this->setSettings($this->settings);
	}

	/**
	 * @param array $settings 
	 * @return void
	 * @throws Exception
	 */
	public function setSettings(array $settings) {
		if (!is_array($settings['sources'])) {
			throw new Exception('No existing sources', 1407702241);
		}
		foreach ($settings['sources'] as $key => $source) {
			$className = $this->resolveClassName($source, $key);
			$driver = new $className();
			if ($driver instanceof DriverInterface) {
				$driver->setSettings($source);
				$this->drivers[$key] = $driver;
			} else {
				throw new Exception(
					'Class "' . $className . '" does not implement Lightwerk\SurfCaptain\GitApi\DriverInterface!',
					1407739781
				);
			}
		}
	}

	/**
	 * @param array $source
	 * @param string $key
	 * @return string
	 * @throws Exception
	 */
	protected function resolveClassName(array $source, $key) {
		if (empty($source['className']) === FALSE) {
			$className = $source['className'];
		} elseif (empty($source['driver']) === FALSE) {
			$className = '\Lightwerk\SurfCaptain\GitApi\Driver\\' . ucfirst($source['driver']) .  'Driver';
		} else {
			throw new Exception('No className or driver defined for "' . $key . '"', 1407702622);
		}
		$this->assureClassExists($className);
		return $className;
	}

	/**
	 * @param $className
	 * @return void
	 * @throws Exception
	 */
	public function assureClassExists($className) {
		if (!class_exists($className)) {
			throw new Exception('Class "' . $className . '" does not exist!', 1407702669);
		}
	}

	/**
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
	 * @param string $repositoryUrl
	 * @return Repository
	 * @throws Exception
	 */
	public function getRepository($repositoryUrl) {
		foreach ($this->drivers as $driver) {
			if ($driver->hasRepository($repositoryUrl) === TRUE) {
				return $driver->getRepository($repositoryUrl);
			}
		}
		throw new Exception('no driver found for repository url ' . $repositoryUrl, 1409681003);
	}

	/**
	 * @param string $repositoryUrl
	 * @return boolean
	 */
	public function hasRepository($repositoryUrl) {
		foreach ($this->drivers as $driver) {
			if ($driver->hasRepository($repositoryUrl) === TRUE) {
				return TRUE;
			}
		}
		return FALSE;
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 * @throws Exception
	 */
	public function getFileContent($repositoryUrl, $filePath, $reference = 'master') {
		foreach ($this->drivers as $driver) {
			if ($driver->hasRepository($repositoryUrl) === TRUE) {
				return $driver->getFileContent($repositoryUrl, $filePath, $reference);
			}
		}
		throw new Exception('no driver found for repository url ' . $repositoryUrl, 1409681003);
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $content
	 * @param string $commitMessage
	 * @param string $branchName
	 * @return void
	 * @throws Exception
	 */
	public function setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName = 'master') {
		foreach ($this->drivers as $driver) {
			if ($driver->hasRepository($repositoryUrl) === TRUE) {
				$driver->setFileContent($repositoryUrl, $filePath, $content, $commitMessage, $branchName);
				return;
			}
		}
		throw new Exception('no driver found for repository url ' . $repositoryUrl, 1409681005);
	}

}
