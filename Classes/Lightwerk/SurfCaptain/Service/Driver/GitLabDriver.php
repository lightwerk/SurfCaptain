<?php
namespace Lightwerk\SurfCaptain\Service\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Branch;
use Lightwerk\SurfCaptain\Domain\Model\Repository;
use Lightwerk\SurfCaptain\Domain\Model\Tag;
use Lightwerk\SurfCaptain\Mapper\DataMapper;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

class GitLabDriver implements DriverInterface {

	/**
	 * @var array
	 */
	protected $settings;

	/**
	 * @Flow\Inject
	 * @var \TYPO3\Flow\Http\Client\Browser
	 */
	protected $browser;

	/**
	 * @Flow\Inject
	 * @var \TYPO3\Flow\Http\Client\CurlEngine
	 */
	protected $browserRequestEngine;

	/**
	 * @FLow\Inject
	 * @var DataMapper
	 */
	protected $dataMapper;

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
	 * @return void
	 */
	public function initializeObject() {
		$this->browserRequestEngine->setOption(CURLOPT_SSL_VERIFYPEER, FALSE);
		$this->browserRequestEngine->setOption(CURLOPT_SSL_VERIFYHOST, FALSE);
		$this->browser->setRequestEngine($this->browserRequestEngine);
	}

	/**
	 * Return project id parameter from repository url
	 *
	 * @param string $repositoryUrl
	 * @return string
	 * @throws Exception
	 */
	protected function getId($repositoryUrl) {
		return urlencode(GeneralUtility::getUrlPartsFromRepositoryUrl($repositoryUrl)['path']);
	}

	/**
	 * @param string $command
	 * @param string $method
	 * @param array $parameters
	 * @return mixed $data
	 * @throws Exception
	 * @throws \TYPO3\Flow\Http\Exception
	 */
	protected function getGitLabApiResponse($command, $method = 'GET', array $parameters = array()) {
		$parameters['private_token'] = $this->settings['privateToken'];
		$url = $this->settings['apiUrl'] . $command . '?' . http_build_query($parameters);
		// maybe we will throw own exception to give less information (token is outputed)
		$response = $this->browser->request($url, $method);
		$content = json_decode($response->getContent(), TRUE);
		if ($content === NULL) {
			throw new Exception('Response is not a valid json', 1406818561);
		}
		return $content;
	}

	/**
	 * @param string $repositoryUrl
	 * @return Repository
	 * @throws Exception
	 */
	protected function getProjectFromRepositoryUrl($repositoryUrl) {
		$projectData = $this->getGitLabApiResponse('projects/' . $this->getId($repositoryUrl));
		return $this->dataMapper->mapToObject(
			$projectData,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository',
			$this->settings['mapping']
		);
	}

	/**
	 * @param integer $groupId
	 * @return Repository[]
	 * @throws Exception
	 */
	protected function getProjectsOfGroup($groupId) {
		$projectsData = $this->getGitLabApiResponse('groups/' . $groupId)['projects'];
		return $this->dataMapper->mapToObject(
			$projectsData,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository[]',
			$this->settings['mapping']
		);
	}

	/**
	 * @param array $groupIds
	 * @return array
	 */
	protected function getProjectsOfGroups(array $groupIds) {
		$repositories = array();
		foreach ($groupIds as $groupId) {
			$repositories = array_merge($repositories, $this->getProjectsOfGroup($groupId));
		}
		return $repositories;
	}

	/**
	 * @return Repository[]
	 * @throws Exception
	 */
	protected function getAllProjects() {
		$projectsData = $this->getGitLabApiResponse('projects');
		return $this->dataMapper->mapToObject(
			$projectsData,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository[]',
			$this->settings['mapping']
		);
	}

	/**
	 * Returns repositories
	 *
	 * @return array
	 */
	public function getRepositories() {
		$repositories = array();
		if (empty($this->settings['repositories']) || !is_array($this->settings['repositories'])) {
			return $repositories;
		}
		foreach ($this->settings['repositories'] as $filter) {
			$tempRepositories = array();

			if (!empty($filter['groupIds']) && is_array($filter['groupIds'])) {
				$tempRepositories = array_merge($tempRepositories, $this->getProjectsOfGroups($filter['groupIds']));
			} elseif (empty($filter['repositoryUrls'])) {
				$tempRepositories = array_merge($tempRepositories, $this->getAllProjects());
			}

			if (!empty($filter['namePattern'])) {
				foreach ($tempRepositories as $tempRepository) {
					if (preg_match('/' . $filter['namePattern'] . '/', $tempRepository['name'])) {
						$repositories[] = $tempRepository;
					}
				}
			} else {
				$repositories = array_merge($repositories, $tempRepositories);
			}

			if (empty($filter['groupIds']) && !empty($filter['repositoryUrls']) && is_array($filter['repositoryUrls'])) {
				foreach ($filter['repositoryUrls'] as $repositoryUrl) {
					$tempRepository = $this->getProjectFromRepositoryUrl($repositoryUrl);
					if (!empty($repositoryUrl)) {
						$repositories[] = $tempRepository;
					}
				}
			}
		}
		return $repositories;
	}

	/**
	 * Returns repository
	 *
	 * @param string $repositoryUrl
	 * @return Repository
	 */
	public function getRepository($repositoryUrl) {
		$projectData = $this->getGitLabApiResponse('projects/' . $this->getId($repositoryUrl));
		return $this->dataMapper->mapToObject(
			$projectData,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Repository',
			$this->settings['mapping']
		);
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
		$response = $this->getGitLabApiResponse(
			'projects/' . $this->getId($repositoryUrl) . '/repository/files',
			'GET',
			array(
				'file_path' => $filePath,
				'ref' => $reference,
			)
		);
		switch ($response['encoding']) {
			case 'base64':
				$content = base64_decode($response['content']);
				break;
			default:
				throw new Exception('Encoding "' . $response['encoding'] . '" is unknown!', 1407793800);
		}
		return $content;
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
		$this->getGitLabApiResponse(
			'projects/' . $this->getId($repositoryUrl) . '/repository/files',
			'PUT',
			array(
				'file_path' => $filePath,
				'branch_name' => $branchName,
				'commit_message' => $commitMessage,
				'content' => $content
			)
		);
	}

	/**
	 * Returns branches of a repository
	 *
	 * @param string $repositoryUrl
	 * @return Branch[]
	 */
	public function getBranches($repositoryUrl) {
		$branchesData = $this->getGitLabApiResponse('projects/' . $this->getId($repositoryUrl) . '/repository/branches');
		return $this->dataMapper->mapToObject(
			$branchesData,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Branch[]',
			$this->settings['mapping']
		);
	}

	/**
	 * Returns tags of a repository
	 *
	 * @param string $repositoryUrl
	 * @return Tag[]
	 */
	public function getTags($repositoryUrl) {
		$tagsData = $this->getGitLabApiResponse('projects/' . $this->getId($repositoryUrl) . '/repository/tags');
		return $this->dataMapper->mapToObject(
			$tagsData,
			'\\Lightwerk\\SurfCaptain\\Domain\\Model\\Tag[]',
			$this->settings['mapping']
		);
	}
}
