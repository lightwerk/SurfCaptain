<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\RestController;

class TagsController extends RestController {

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