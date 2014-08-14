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
	 * @var array
	 */
	protected $identifiers = array();

	/**
	 * @return void
	 */
	public function listAction() {
		try {
			$tempRepositories = $this->gitService->getRepositories();
			$repositories = array();
			$this->clearIdentifiers();
			foreach ($tempRepositories as $tempRepository) {
				$repositories[] = array(
					'repository_url' => $tempRepository['ssh_url_to_repo'],
					'name' => $tempRepository['name'],
					'web_url' => $tempRepository['web_url'],
					'identifier' => $this->getIdentifier($tempRepository['name']),
				);
			}
			$this->view->assign('repositories', $repositories);
		} catch (\Lightwerk\SurfCaptain\Service\Exception $e) {
			$this->handleException($e);
		} catch (\TYPO3\Flow\Http\Exception $e) {
			$this->handleException($e);
		}
	}

	/**
	 * @param string $identifier
	 * @return string
	 */
	protected function getIdentifier($identifier) {
		while (in_array($identifier, $this->identifiers)) {
			if (preg_match('/^(.*)([0-9]+)$/', $identifier, $matches)) {
				$identifier = $matches[1] . ((integer) $matches[2] + 1);
			} else {
				$identifier .= 1;
			}
		}
		return $identifier;
	}

	/**
	 * @return void
	 */
	protected function clearIdentifiers() {
		$this->identifiers = array();
	}
}