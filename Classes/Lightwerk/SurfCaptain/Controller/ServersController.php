<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

/**
 * Class ServersController
 *
 * @package Lightwerk\SurfCaptain\Controller
 */
class ServersController extends AbstractRestController {

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'serverKey';

	/**
	 * @param integer|NULL $projectId
	 * @return void
	 */
	public function listAction($projectId = NULL) {
		$allCollections = $this->getCollections();
		GeneralUtility::array_unset_recursive($allCollections, 'password');

		if (!empty($projectId) && $projectId > 0) {
			$collections = array();
			foreach ($allCollections as $collection) {
				if ($collection['project'] === $projectId) {
					$collections[] = $collection;
				}
			}
		} else {
			$collections = $allCollections;
		}

		$this->view->assign('value', array(
			'collections' => $collections,
		));
	}

	/**
	 * @param string $collectionKey
	 * @param string $serverKey
	 * @param integer $projectId
	 * @param string $configuration
	 * @return void
	 */
	public function createAction($collectionKey, $serverKey, $projectId, $configuration) {
	}

	/**
	 * @param string $collectionKey
	 * @param string $serverKey
	 * @param string $configuration
	 * @param string|NULL $project
	 * @return void
	 */
	public function updateAction($collectionKey, $serverKey, $configuration, $project = NULL) {
		$configuration = json_decode($configuration, TRUE);
		if (empty($configuration)) {
			throw new \Exception('Configuration is missing or it has not a valid json format.');
		}

		$collections = $this->getCollections();

		if ($project !== NULL && preg_match('/^[0-9]+$/', $project)) {
			$project = (int) $project;
		} elseif ($project !== '*') {
			$project = NULL;
		}
		if (!empty($project)) {
			$collections[$collectionKey]['project'] = $project;
		}

		$collections[$collectionKey]['servers'][$serverKey] = $configuration;
		$this->setCollections($collections, 'ServerCollections.json: Updates Server "' . $serverKey . '" in Collection "' . $collectionKey . '"');
		$this->redirectToResource();
	}

	/**
	 * @param string $collectionKey
	 * @param string $serverKey
	 * @param array $configuration
	 * @return void
	 */
	public function deleteAction($collectionKey, $serverKey) {
		$collections = $this->getCollections();
		if (isset($collections[$collectionKey]['servers'][$serverKey])) {
			unset($collections[$collectionKey]['servers'][$serverKey]);
			if (count($collections[$collectionKey]['servers']) === 0) {
				unset($collections[$collectionKey]);
			}
			$this->setCollections($collections, 'ServerCollections.json: Removes Server "' . $serverKey . '" from Collection "' . $collectionKey . '"');
		}
		$this->redirectToResource();
	}

	/**
	 * @return array
	 */
	protected function getCollections() {
		return json_decode($this->gitService->getFileContent(290, 'ServerCollections.json'), TRUE);
	}

	/**
	 * @param array $collections
	 * @param string $commitMessage
	 * @return void
	 */
	protected function setCollections(array $collections, $commitMessage) {
		$this->gitService->setFileContent(
			290,
			'ServerCollections.json',
			json_encode($collections, JSON_PRETTY_PRINT),
			$commitMessage
		);
	}
}