<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;

class BranchesController extends AbstractRestController {

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @param string $repositoryUrl
	 * @return void
	 */
	public function listAction($repositoryUrl) {
		try {
			$tempBranches = $this->gitService->getBranches($repositoryUrl);
			$branches = array();
			foreach ($tempBranches as $tempBranch) {
				$branches[] = array(
					'name' => $tempBranch['name'],
					'commit' => array(
						'id' => $tempBranch['commit']['id'],
						'message' => $tempBranch['commit']['message'],
						'committed_date' => $tempBranch['commit']['committed_date'],
						'committer' => array(
							'name' => $tempBranch['commit']['committer']['name'],
						)
					),
					'type' => 'Branch',
					'group' => 'Branches'
				);
			}
			$this->view->assign('branches', $branches);
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}
}