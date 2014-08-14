<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\PresetService;
use TYPO3\Flow\Annotations as Flow;

/**
 * Class ServersController
 *
 * @package Lightwerk\SurfCaptain\Controller
 */
class PresetsController extends AbstractRestController {

	/**
	 * @Flow\Inject
	 * @var PresetService
	 */
	protected $presetService;

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'key';

	/**
	 * @param string $key
	 * @return void
	 */
	public function showAction($key) {
		try {
			$this->view->assign('preset', $this->presetService->getPreset($key));
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $type
	 * @return void
	 */
	public function listAction($repositoryUrl, $type = NULL) {
		try {
			$presets = $this->presetService->getPresets();
			foreach ($presets as $key => $preset) {
				foreach ($preset['applications'] as $application) {
					if (
						(empty($repositoryUrl) && !empty($application['options']['repositoryUrl']))
						|| (!empty($repositoryUrl) && (empty($application['options']['repositoryUrl']) || $repositoryUrl !== $application['options']['repositoryUrl']))
						|| ($type === '' && !empty($application['type']))
						|| (!empty($type) && (empty($application['type']) || $type !== $application['type']))
					) {
						unset($presets[$key]);
					}
				}
			}
			$this->view->assign('presets', $presets);
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @param string $key
	 * @param string $configuration
	 * @return void
	 */
	public function createAction($key, $configuration) {
		try {
			$this->presetService->addPreset($key, json_decode($configuration, TRUE));
			$this->redirect('show', NULL, NULL, array('key' => $key));
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @param string $key
	 * @param string $configuration
	 * @return void
	 */
	public function updateAction($key, $configuration) {
		try {
			$this->presetService->updatePreset($key, json_decode($configuration, TRUE));
			$this->redirect('show', NULL, NULL, array('key' => $key));
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @param string $key
	 * @return void
	 */
	public function deleteAction($key) {
		try {
			$this->presetService->deletePreset($key);
			$this->redirect('list');
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}
}