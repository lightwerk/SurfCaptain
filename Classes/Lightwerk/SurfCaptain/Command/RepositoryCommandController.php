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
class RepositoryCommandController extends \TYPO3\Flow\Cli\CommandController {

	/**
	 * @var \Lightwerk\SurfCaptain\GitApi\DriverComposite
	 * @Flow\Inject
	 */
	protected $driverComposite;

	/**
	 * List Command
	 *
	 * @return void
	 */
	public function listCommand() {
		$repositories = $this->driverComposite->getRepositories();
		foreach ($repositories as $repository) {
			$this->outputLine($repository->getRepositoryUrl());
		}
	}

	/**
	 * Show Command
	 *
	 * @param string $url
	 * @return void
	 */
	public function showCommand($url = 'git@github.com:achimfritz/championship-distribution.git') {
		$repository = $this->driverComposite->getRepository($url);
		$this->outputLine('repositoryUrl: ' . $repository->getRepositoryUrl());
		$this->outputLine('name: ' . $repository->getName());
		$this->outputLine('webUrl: ' . $repository->getWebUrl());
		$this->outputLine('branches');
		$branches = $repository->getBranches();
		if (count($branches) === 0) {
			$this->outputLine('no branches found');
		} else {
			foreach ($branches as $branch) {
				$commit = $branch->getCommit();
				$this->outputLine($branch->getName() . ' ' . $commit->getId() . ' ' . $commit->getMessage() . ' ' . $commit->getCommitterName() . ' ' . $commit->getDate());
			}
		}
		$this->outputLine('tags');
		$tags = $repository->getTags();
		if (count($tags) === 0) {
			$this->outputLine('no tags found');
		} else {
			foreach ($tags as $tag) {
				$commit = $tag->getCommit();
				$this->outputLine($tag->getName() . ' ' . $commit->getId() . ' ' . $commit->getMessage() . ' ' . $commit->getCommitterName() . ' ' . $commit->getDate());
			}
		}
	}
}
