<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\ShellService;
use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Service\Exception;

class CopySshKeyController extends AbstractRestController {

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'hostname';

	/**
	 * @Flow\Inject
	 * @var ShellService
	 */
	protected $shellService;

	/**
	 * @param string $hostname
	 * @param string $username
	 * @param string $password
	 * @param integer $port
	 * @return void
	 */
	public function createAction($hostname, $username, $password, $port = NULL) {
		try {
			$this->shellService->copyKey($hostname, $username, $password, $port);
			$this->view->assign('copied', TRUE);
		} catch (Exception $e) {
			$this->view->assign('copied', FALSE);
			$this->handleException($e);
		}
	}
}