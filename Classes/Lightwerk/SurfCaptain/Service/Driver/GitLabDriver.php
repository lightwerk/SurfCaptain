<?php
namespace Lightwerk\SurfCaptain\Service\Driver;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

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
		$url = $this->settings['url'] . $command . '?' . http_build_query($parameters);
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
	 * @return array
	 * @throws Exception
	 */
	protected function getProjectFromRepositoryUrl($repositoryUrl) {
		return $this->getGitLabApiResponse('projects/' . $this->getId($repositoryUrl));
	}

	/**
	 * @param integer $groupId
	 * @return array
	 * @throws Exception
	 */
	protected function getProjectsOfGroup($groupId) {
		return $this->getGitLabApiResponse('groups/' . $groupId)['projects'];
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
	 * @return mixed
	 * @throws Exception
	 */
	protected function getAllProjects() {
		return $this->getGitLabApiResponse('projects');
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
	 * Return the content of a file
	 *
	 * @param string $repositoryUrl
	 * @param string $filePath
	 * @param string $reference branch name, tag name or hash
	 * @return string
	 */
	public function getFileContent($repositoryUrl, $filePath, $reference = 'master') {
		// ToDo lm: Case for decoding
		return base64_decode(
			$this->getGitLabApiResponse(
				'projects/' . $this->getId($repositoryUrl) . '/repository/files',
				'GET',
				array(
					'file_path' => $filePath,
					'ref' => $reference,
				)
			)['content']
		);
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
	 * @return array
	 */
	public function getBranches($repositoryUrl) {
		return $this->getGitLabApiResponse('/projects/' . $this->getId($repositoryUrl) . '/repository/branches');
	}

	/**
	 * Returns tags of a repository
	 *
	 * @param string $repositoryUrl
	 * @return array
	 */
	public function getTags($repositoryUrl) {
		return $this->getGitLabApiResponse('/projects/' . $this->getId($repositoryUrl) . '/repository/tags');
	}
}
