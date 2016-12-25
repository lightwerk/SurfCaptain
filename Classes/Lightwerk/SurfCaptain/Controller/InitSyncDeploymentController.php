<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSyncDeployment;
use TYPO3\Flow\Error\Message;

/**
 * @package Lightwerk\SurfCaptain
 * @author Achim Fritz <af@achimfritz.de>
 */
class InitSyncDeploymentController extends AbstractRestController
{
    /**
     * @FLow\Inject
     * @var \Lightwerk\SurfCaptain\Domain\Repository\DeploymentRepository
     */
    protected $deploymentRepository;

    /**
     * @Flow\Inject
     * @var \Lightwerk\SurfCaptain\Domain\Factory\DeploymentFactory
     */
    protected $deploymentFactory;

    /**
     * @var string
     */
    protected $resourceArgumentName = 'initSyncDeployment';

    /**
     * @param \Lightwerk\SurfCaptain\Domain\Facet\Deployment\InitSyncDeployment $initSyncDeployment
     * @return void
     */
    public function createAction(InitSyncDeployment $initSyncDeployment)
    {
        try {
            $deployment = $this->deploymentFactory->createFromInitSyncDeployment($initSyncDeployment);
            $this->deploymentRepository->add($deployment);
            $this->addFlashMessage('Created a new init shared deployment.', 'OK', Message::SEVERITY_OK);
        } catch (\Lightwerk\SurfCaptain\Exception $e) {
            $this->handleException($e);
        } catch (\TYPO3\Flow\Http\Exception $e) {
            $this->handleException($e);
        }
        $this->redirect('index', 'Deployment');
    }
}
