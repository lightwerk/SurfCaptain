<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use Lightwerk\SurfCaptain\Domain\Model\Log;
use Lightwerk\SurfCaptain\Domain\Repository\LogRepository;
use TYPO3\Flow\Annotations as Flow;

class LogsController extends AbstractRestController {

	/**
	 * @FLow\Inject
	 * @var LogRepository
	 */
	protected $logRepository;

	/**
	 * @var string
	 * @see \TYPO3\Flow\Mvc\Controller\RestController
	 */
	protected $resourceArgumentName = 'log';

	/**
	 * @param Log $log
	 * @return void
	 */
	public function showAction(Log $log) {
		$this->view->assign('log', $log);
	}

	/**
	 * @param Deployment $deployment
	 * @param integer $offset
	 * @return void
	 */
	public function listAction(Deployment $deployment, $offset = 0) {
		if (empty($offset) || $offset < 1) {
			$logs = $this->logRepository->findByDeployment($deployment);
		} else {
			$logs = $this->logRepository->findByDeploymentWithOffset($deployment, $offset);
		}
		$this->view->assign('logs', $logs);
	}
}