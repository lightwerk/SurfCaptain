<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\RestController;

class BranchesController extends RestController {

	protected $defaultViewObjectName = 'TYPO3\\Flow\\Mvc\\View\\JsonView';

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @param integer $projectId
	 * @return void
	 */
	public function listAction($projectId) {
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
}