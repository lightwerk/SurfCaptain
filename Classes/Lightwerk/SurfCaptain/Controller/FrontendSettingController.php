<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Frontend Setting Controller
 *
 * @package Lightwerk\SurfCaptain
 */
class FrontendSettingController extends AbstractRestController
{
    /**
     * @return void
     */
    public function listAction()
    {
        $this->view->assign('frontendSettings', $this->settings['frontendSettings']);
    }
}
