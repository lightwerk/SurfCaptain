<?php
namespace Lightwerk\SurfCaptain\GitApi\GitHub;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\GitApi\RepositoryDriverInterface;
use Lightwerk\SurfCaptain\Domain\Model\Branch;
use Lightwerk\SurfCaptain\Domain\Model\Repository;
use Lightwerk\SurfCaptain\Domain\Model\Tag;
use Lightwerk\SurfCaptain\Mapper\DataMapper;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

class RepositoryDriver implements RepositoryDriverInterface {

	/**
	 * @var array
	 */
	protected $settings;

	/**
	 * @FLow\Inject
	 * @var DataMapper
	 */
	protected $dataMapper;

	/**
	 * @var \Lightwerk\SurfCaptain\GitApi\ApiRequestInterface
	 */
	protected $apiRequest;

	/**
	 * @var \TYPO3\Flow\Object\ObjectManagerInterface
	 * @Flow\Inject
	 */
	protected $objectManager;

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
		$this->apiRequest->setAuthorization(array('Authorization: token ' . $settings['privateToken']));
	}

	/**
	 * @param string $command
	 * @param string $method
	 * @param array $parameters
	 * @return mixed $data
	 * @throws Exception
	 * @throws \TYPO3\Flow\Http\Exception
	 */
	protected function getGitHubApiResponse($command, $method = 'GET', array $parameters = array(), array $content = array()) {
		return $this->apiRequest->call($command, $method, $parameters, $content);
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
	 * Returns repositories
	 *
	 * @return array
	 */
	public function getRepositories() {
		$repositories = $this->getGitHubApiResponse($this->settings['repositories']);
		return $repositories;
	}

	/**
	 * Returns repository
	 *
	 * @param string $repositoryUrl
	 * @return Repository
	 */
	public function getRepository($repositoryUrl) {
		throw new \Lightwerk\SurfCaptain\Exception('not implemented', 1408989277);
	}

	/**
	 * Returns branches of a repository
	 *
	 * @param string $repositoryUrl
	 * @return Branch[]
	 */
	public function getBranches($repositoryUrl) {
		throw new \Lightwerk\SurfCaptain\Exception('not implemented', 1408989282);
	}

	/**
	 * Returns tags of a repository
	 *
	 * @param string $repositoryUrl
	 * @return Tag[]
	 */
	public function getTags($repositoryUrl) {
		throw new \Lightwerk\SurfCaptain\Exception('not implemented', 1408989283);
	}
}
