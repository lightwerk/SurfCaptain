<?php
namespace Lightwerk\SurfCaptain\Crawler\Crawler;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */
use Lightwerk\SurfCaptain\Crawler\CrawlingResult;

/**
 * CrawlerInterface
 *
 * @package Lightwerk\SurfCaptain
 */
interface CrawlerInterface
{

    public function addToCrawlingResult(CrawlingResult $crawlingResult);
}
