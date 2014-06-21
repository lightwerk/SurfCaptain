<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Service\GitService;
use Lightwerk\SurfCaptain\Utility\GeneralUtility;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\RestController;

class ServersController extends RestController {

	protected $defaultViewObjectName = 'TYPO3\\Flow\\Mvc\\View\\JsonView';

	/**
	 * @Flow\Inject
	 * @var GitService
	 */
	protected $gitService;

	/**
	 * @return void
	 */
	public function listAction() {
		$serverCollections = json_decode($this->gitService->getFileContent(290, 'ServerCollections.json'), TRUE);
		GeneralUtility::array_unset_recursive($serverCollections, 'password');

		$this->view->assign('value', array(
			'serverCollections' => $serverCollections,
		));
	}
}