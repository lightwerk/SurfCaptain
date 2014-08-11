<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;

class RepositoriesController extends AbstractRestController {

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @return void
	 */
	public function listAction() {
		try {
			$tempRepositories = $this->gitService->getRepositories();
			$repositories = array();
			foreach ($tempRepositories as $tempRepository) {
				$repositories[] = array(
					'id' => $tempRepository['id'],
					'ssh_url_to_repo' => $tempRepository['ssh_url_to_repo'],
					'name' => $tempRepository['name'],
					'web_url' => $tempRepository['web_url'],
				);
			}
			$this->view->assign('repositories', $repositories);
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}
}