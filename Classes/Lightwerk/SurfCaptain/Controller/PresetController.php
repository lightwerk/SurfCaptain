<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Repository\Preset\RepositoryInterface as PresetRepositoryInterface;
use TYPO3\Flow\Annotations as Flow;

/**
 * Servers Controller
 *
 * @package Lightwerk\SurfCaptain
 */
class PresetController extends AbstractRestController
{
    /**
     * @Flow\Inject
     * @var PresetRepositoryInterface
     */
    protected $presetRepository;

    /**
     * @var string
     * @see \TYPO3\Flow\Mvc\Controller\RestController
     */
    protected $resourceArgumentName = 'key';

    /**
     * @param string $key
     * @return void
     */
    public function showAction($key)
    {
        try {
            $this->view
                ->assign('key', $key)
                ->assign('configuration', $this->presetRepository->findByIdentifier($key));
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
    public function listAction($globals = null)
    {
        try {
            if (empty($globals)) {
                $presets = $this->presetRepository->findAll();
            } else {
                $presets = $this->presetRepository->findGlobals();
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
     * @param array $configuration
     * @return void
     */
    public function createAction($key, array $configuration)
    {
        try {
            $this->presetRepository->add($key, $configuration);
            $this->addFlashMessage('Created a new preset.');
            $this->redirect('show', null, null, ['key' => $key]);
        } catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
            $this->handleException($e);
        } catch (\TYPO3\Flow\Http\Exception $e) {
            $this->handleException($e);
        }
    }

    /**
     * @param string $key
     * @param array $configuration
     * @return void
     */
    public function updateAction($key, array $configuration)
    {
        try {
            $this->presetRepository->update($key, $configuration);
            $this->addFlashMessage('Updated a a preset.');
            $this->redirect('show', null, null, ['key' => $key]);
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
    public function deleteAction($key)
    {
        try {
            $this->presetRepository->remove($key);
            $this->addFlashMessage('Deleted a preset.');
            $this->redirect('list');
        } catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
            $this->handleException($e);
        } catch (\TYPO3\Flow\Http\Exception $e) {
            $this->handleException($e);
        }
    }
}
