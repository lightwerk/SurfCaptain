<?php
namespace Lightwerk\SurfCaptain\GitApi\GitLab;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\GitApi\DriverInterface;
use Lightwerk\SurfCaptain\Domain\Model\Branch;
use Lightwerk\SurfCaptain\Domain\Model\Repository;
use Lightwerk\SurfCaptain\Domain\Model\Tag;
use Lightwerk\SurfCaptain\Mapper\DataMapper;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

class Driver extends \Lightwerk\SurfCaptain\GitApi\AbstractDriver {

	/**
	 * Sets the settings
	 *
	 * @param array $settings
	 * @return void
	 */
	public function setSettings(array $settings) {
		$this->settings = $settings;
		$this->apiRequest = $this->objectManager->get('Lightwerk\SurfCaptain\GitApi\ApiRequestInterface');
		$this->apiRequest->setApiUrl($settings['apiUrl']);
		$this->apiRequest->setAuthorizationHeader(array('PRIVATE-TOKEN: ' . $this->settings['privateToken']));
	}

	/**
	 * @param string $repositoryUrl 
	 * @return string
	 */
	protected function getRepositoryName($repositoryUrl) {
		$parts = explode(':', $repositoryUrl);
		return str_replace('.git', '', $parts[1]);
		
	}

	/**
	 * @param string $repositoryUrl 
	 * @return string
	 */
	protected function getRepositoryAccount($repositoryUrl) {
		$parts = explode(':', $repositoryUrl);
		return $parts[0];
	}

	/**
	 * @param string $repositoryUrl
	 * @return boolean
	 */
	public function hasRepository($repositoryUrl) {
		if ($this->getRepositoryAccount($repositoryUrl) === $this->settings['accountName']) {
			return TRUE;
		}
		return FALSE;
	}

	/**
	 * Returns repositories
	 *
	 * @return array
	 */
	public function getRepositories() {
		$command = $this->settings['repositories'];
		$response = $this->apiRequest->call($command);
		if (isset($response['projects']) === FALSE) {
			$projects = array($response);
		} else {
			$projects = $response['projects'];
		}
		return $this->dataMapper->mapToObject(
			$projects,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository[]',
			$this->settings['mapping']
		);
	}

	/**
	 * Returns repository
	 *
	 * @param string $repositoryUrl
	 * @return Repository
	 */
	public function getRepository($repositoryUrl) {
		$name = $this->getRepositoryName($repositoryUrl);
		$name = urlencode($name);
		$command = 'projects/' . $name;
		$response = $this->apiRequest->call($command);
		$repository = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository',
			$this->settings['mapping']
		);
		// branches
		$response = $this->apiRequest->call($command . '/repository/branches');
		$branches = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Branch[]',
			$this->settings['mapping']
		);
		$repository->setBranches($branches);
		// tags
		$response = $this->apiRequest->call($command . '/repository/tags');
		$tags = $this->dataMapper->mapToObject(
			$response,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Tag[]',
			$this->settings['mapping']
		);
		$repository->setTags($tags);
		return $repository;
	}

}
