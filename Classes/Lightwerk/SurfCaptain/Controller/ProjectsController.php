<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\RestController;

class ProjectsController extends RestController {

	protected $defaultViewObjectName = 'TYPO3\\Flow\\Mvc\\View\\JsonView';

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @return void
	 */
	public function listAction() {
		$glResponse = $this->gitService->getProjectsOfGroup($this->settings['git']['projects']['groupId']);
		$projects = array();
		foreach ($glResponse['projects'] as $project) {
			$projects[] = array(
				'id' => $project['id'],
				'ssh_url_to_repo' => $project['ssh_url_to_repo'],
				'name' => $project['name'],
				'web_url' => $project['web_url'],
			);
		}

		$this->view->assign('value', array(
			'projects' => $projects,
		));
	}
}