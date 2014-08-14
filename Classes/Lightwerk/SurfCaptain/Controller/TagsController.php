<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;

class TagsController extends AbstractRestController {

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
			$tempTags = $this->gitService->getTags($repositoryUrl);
			$tags = array();
			foreach ($tempTags as $tempTag) {
				$tags[] = array(
					'name' => $tempTag['name'],
					'commit' => array(
						'id' => $tempTag['commit']['id'],
						'message' => $tempTag['commit']['message'],
						'committed_date' => $tempTag['commit']['committed_date'],
						'committer' => array(
							'name' => $tempTag['commit']['committer']['name'],
						)
					),
					'type' => 'Tag',
					'group' => 'Tags'
				);
			}
			$this->view->assign('tags', $tags);
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}
}