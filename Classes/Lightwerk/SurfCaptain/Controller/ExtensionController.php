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
     * @var \Lightwerk\SurfCaptain\Crawler\Crawler
     * @FLow\Inject
     */
    protected $crawler;

    /**
     * @return void
     */
    public function listAction()
    {
        $crawlingResult = $this->crawler->crawl();
        $this->view->assign('packageList', $crawlingResult->getPackageList());
        $this->view->assign('projectList', $crawlingResult->getProjectList());
    }
}
