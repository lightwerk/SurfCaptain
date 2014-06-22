<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;

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
	 * @return void
	 */
	public function listAction() {
		$collections = $this->getCollections();
		GeneralUtility::array_unset_recursive($collections, 'password');

		$this->view->assign('value', array(
			'collections' => $collections,
		));
	}

	/**
	 * @param string $collectionKey
	 * @param string $serverKey
	 * @param string $configuration
	 * @return void
	 */
	public function createAction($collectionKey, $serverKey, $configuration) {
		$this->updateAction($collectionKey, $serverKey, $configuration);
	}

	/**
	 * @param string $collectionKey
	 * @param string $serverKey
	 * @param string $configuration
	 * @return void
	 */
	public function updateAction($collectionKey, $serverKey, $configuration) {
		$configuration = json_decode($configuration, TRUE);
		if (!empty($configuration)) {
			$collections = $this->getCollections();
			$collections[$collectionKey]['servers'][$serverKey] = $configuration;
			$this->setCollections($collections, 'ServerCollections.json: Adds Server "' . $serverKey . '" to Collection "' . $collectionKey . '"');
		}
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