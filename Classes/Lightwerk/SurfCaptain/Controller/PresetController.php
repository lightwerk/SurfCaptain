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
class PresetController extends AbstractRestController {

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
			$this->view->assign('key', $key)
					   ->assign('configuration', $this->presetService->getPreset($key));
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @param boolean $globals
	 * @return void
	 */
	public function listAction($globals = NULL) {
		try {
			if (empty($globals)) {
				$presets = $this->presetService->getPresets();
			} else {
				$presets = $this->presetService->getGlobalPresets();
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
			$this->addFlashMessage('Created a new preset.');
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
			$this->addFlashMessage('Updated a a preset.');
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
			$this->addFlashMessage('Deleted a preset.');
			$this->redirect('list');
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}
}