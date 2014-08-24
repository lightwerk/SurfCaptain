<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfRunner\Service\ShellService;
use Lightwerk\SurfRunner\Service\ShellServiceException;
use TYPO3\Flow\Annotations as Flow;

class CheckSshLoginController extends AbstractRestController {

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
	 * @param integer $port
	 * @return void
	 */
	public function showAction($hostname, $username = NULL, $port = NULL) {
		try {
			$this->shellService->checkLogin($hostname, $username, $port);
			$this->view->assign('login', true);
		} catch (ShellServiceException $e) {
			$this->view->assign('login', false);
			$this->handleException($e);
		}
	}
}