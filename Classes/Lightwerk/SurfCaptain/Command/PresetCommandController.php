<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @package Lightwerk.SurfCaptain
 * @author Achim Fritz <af@lightwerk.com> 
 */
class PresetCommandController extends \TYPO3\Flow\Cli\CommandController {

	/**
	 * @Flow\Inject
	 * @var \Lightwerk\SurfCaptain\Domain\Repository\Preset\RepositoryInterface
	 */
	protected $presetRepository;

	/**
	 * @param integer $limit
	 * @return void
	 */
	public function listCommand() {
		try {
			$presets = $this->presetRepository->findAll();
			foreach ($presets as $key => $preset) {
				$this->outputLine($key);
			}
		} catch (\Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage() . ' - ' . $e->getCode());
		}
	}

	/**
	 * @param string $identifier 
	 * @return void
	 */
	public function showCommand($key) {
		try {
			$preset = $this->presetRepository->findByIdentifier($key);
			$this->outputLine(print_r($preset, TRUE));
		} catch (\Lightwerk\SurfCaptain\Domain\Repository\Preset\Exception $e) {
			$this->outputLine('ERROR: ' . $e->getMessage . ' - ' . $e->getCode());
		}
	}

}
