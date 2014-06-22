<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

class ProjectServersController extends AbstractRestController {

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'projectId';

	/**
	 * @param integer $projectId
	 * @return void
	 */
	public function showAction($projectId) {
		$collections = $this->getProjectCollections($projectId);
		GeneralUtility::array_unset_recursive($collections, 'password');

		$this->view->assign('value', array(
			'collections' => $collections,
		));
	}

	/**
	 * @param integer $projectId
	 * @param string $collectionKey
	 * @return void
	 * @throws \TYPO3\Flow\Mvc\Exception\StopActionException
	 */
	public function createAction($projectId, $collectionKey) {
		$collections = $this->getCollections();
		if (
			isset($collections[$collectionKey])
			&& (
				!isset($collections[$collectionKey]['projects'])
				|| !in_array($projectId, $collections[$collectionKey]['projects'])
			)
		) {
			$collections[$collectionKey]['projects'][] = $projectId;
			$this->setCollections($collections, 'ServerCollections.json: Adds Project "' . $projectId . '" to Collection "' . $collectionKey . '"');
		}
		$this->redirectToResource(array('projectId' => $projectId));
	}

	/**
	 * @param integer $projectId
	 * @param string $collectionKey
	 * @return void
	 * @throws \TYPO3\Flow\Mvc\Exception\StopActionException
	 */
	public function deleteAction($projectId, $collectionKey) {
		$collections = $this->getCollections();
		if (isset($collections[$collectionKey]['projects']) && ($key = array_search($projectId, $collections[$collectionKey]['projects'])) !== FALSE) {
			unset($collections[$collectionKey]['projects'][$key]);
			if (count($collections[$collectionKey]['projects']) === 0) {
				unset($collections[$collectionKey]['projects']);
			}
			$this->setCollections($collections, 'ServerCollections.json: Removes Project "' . $projectId . '" from Collection "' . $collectionKey . '"');
		}
		$this->redirectToResource(array('projectId' => $projectId));
	}

	/**
	 * @return array
	 */
	protected function getCollections() {
		return json_decode($this->gitService->getFileContent(290, 'ServerCollections.json'), TRUE);
	}

	/**
	 * @return array
	 */
	protected function getProjectCollections($projectId) {
		$collections = $this->getCollections();
		$projectCollections = array();
		foreach ($collections as $collectionKey => $collection) {
			if (in_array($projectId, $collection['projects']) || in_array('*', $collection['projects'])) {
				$projectCollections[$collectionKey] = $collection;
			}
		}
		return $projectCollections;
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