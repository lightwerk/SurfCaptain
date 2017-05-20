<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Extension Controller
 *
 * @package Lightwerk\SurfCaptain
 */
class ExtensionController extends AbstractRestController
{
    /**
     * @return void
     */
    public function listAction()
    {
        $extensions = [];
        $projectsDirectory = new \DirectoryIterator($path = FLOW_PATH_ROOT . '');
        $this->view->assign('extensions', $extensions);
    }
}
