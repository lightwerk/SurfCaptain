<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitServiceException;
use Lightwerk\SurfCaptain\Service\GitService;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Error\Message;

class ProjectsController extends AbstractRestController {

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
			$this->view->assign('value', array('projects' => $projects));
			$this->addFlashMessage('we have a flashMessage', 'Oops', Message::SEVERITY_NOTICE);
		} catch (GitServiceException $e) {
			// adds a flashMessage
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}
}
