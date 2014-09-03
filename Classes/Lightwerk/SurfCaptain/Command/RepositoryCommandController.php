<?php
namespace Lightwerk\SurfCaptain\Command;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository;
use Lightwerk\SurfCaptain\Service\PresetService;

class RepositoryCommandController extends \TYPO3\Flow\Cli\CommandController {

	/**
	 * @var \Lightwerk\SurfCaptain\GitApi\DriverDisposer
	 * @Flow\Inject
	 */
	protected $driverDisposer;

	/**
	 * listCommand 
	 *
	 * @return void
	 */
	public function listCommand() {
		$repositories = $this->driverDisposer->getRepositories();
		foreach ($repositories as $repository) {
			$this->outputLine($repository->getRepositoryUrl());
		}
	}

	/**
	 * @param string $url
	 * @return void
	 */
	public function showCommand($url = 'git@github.com:achimfritz/championship-distribution.git') {
		$repository = $this->driverDisposer->getRepository($url);
		$this->outputLine($repository->getRepositoryUrl());
#		var_dump($repository);
	}
}
