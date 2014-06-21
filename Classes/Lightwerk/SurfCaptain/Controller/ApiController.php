<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\RestController;

class ApiController extends RestController {

	protected $defaultViewObjectName = 'TYPO3\\Flow\\Mvc\\View\\JsonView';

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @return void
	 */
	public function projectsAction() {
		$glResponse = $this->gitService->getProjectsOfGroup($this->settings['git']['projects']['groupId']);
		$projects = array();
		foreach ($glResponse['projects'] as $project) {
			$projects[] = array(
				'id' => $project['id'],
				'ssh_url_to_repo' => $project['ssh_url_to_repo'],
				'name' => $project['name'],
			);
		}

		$this->view->assign('value', array(
			'projects' => $projects,
		));
	}

	/**
	 * @return void
	 */
	public function serverCollectionsAction() {
		$serverCollections = json_decode($this->gitService->getFileContent(290, 'ServerCollections.json'), TRUE);
		GeneralUtility::array_unset_recursive($serverCollections, 'password');

		$this->view->assign('value', array(
			'serverCollections' => $serverCollections,
		));
	}

	/**
	 * @param integer $projectId
	 * @return void
	 */
	public function branchesAction($projectId) {
		$glBranches = $this->gitService->getBranches($projectId);
		$branches = array();
		foreach ($glBranches as $branch) {
			$branches[] = array(
				'name' => $branch['name'],
				'commit' => array(
					'id' => $branch['commit']['id'],
					'message' => $branch['commit']['message'],
					'committed_date' => $branch['commit']['committed_date'],
					'committer' => array(
						'name' => $branch['commit']['committer']['name'],
					)
				)
			);
		}

		$this->view->assign('value', array(
			'branches' => $branches,
		));
	}

	/**
	 * @param integer $projectId
	 * @return void
	 */
	public function tagsAction($projectId) {
		$glTags = $this->gitService->getTags($projectId);
		$tags = array();
		foreach ($glTags as $tag) {
			$tags[] = array(
				'name' => $tag['name'],
				'commit' => array(
					'id' => $tag['commit']['id'],
					'message' => $tag['commit']['message'],
					'committed_date' => $tag['commit']['committed_date'],
					'committer' => array(
						'name' => $tag['commit']['committer']['name'],
					)
				)
			);
		}

		$this->view->assign('value', array(
			'tags' => $tags,
		));
	}
}