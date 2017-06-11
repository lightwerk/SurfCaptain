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
        $this->view->assign('crawlingResult', $this->crawler->crawl());
    }
}
