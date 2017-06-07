<?php
namespace Lightwerk\SurfCaptain\Crawler;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Crawler\Crawler\CrawlerInterface;
use Lightwerk\SurfCaptain\Crawler\Crawler\TYPO3Crawler;
use Lightwerk\SurfCaptain\Crawler\Detector\TYPO3Detector;
use TYPO3\Flow\Annotations as Flow;

/**
 * Crawler
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class Crawler
{
    /**
     * @param string $path
     * @return CrawlingResult
     */
    public function crawl($path = ''): CrawlingResult
    {
        $crawlingResult = new CrawlingResult();

        $path = $path ?: FLOW_PATH_DATA . 'Surf/';
        $projectsDirectory = new \DirectoryIterator($path);
        foreach ($projectsDirectory as $directory) {
            if ($this->shouldDirectoryBeCrawled($directory) === false) {
                continue;
            }
            try {
                $concreteCrawler = $this->findCrawlerForDirectory($directory);
            } catch (CrawlerException $crawlerException) {
                continue;
            }
            $concreteCrawler->addToCrawlingResult($crawlingResult);
        }

        return $crawlingResult;
    }

    /**
     * @param \DirectoryIterator $directory
     * @return bool
     */
    private function shouldDirectoryBeCrawled(\DirectoryIterator $directory): bool
    {
        return $directory->isDir() && !$directory->isDot();
    }

    /**
     * This Method asks several Detectors if the $directory can be identified as a
     * specific project (e.g. TYPO3). If a Detector successfully detects its project
     * the matching Analyser is returned.
     *
     * @param \DirectoryIterator $directory
     * @return CrawlerInterface
     * @throws CrawlerException
     */
    private function findCrawlerForDirectory(\DirectoryIterator $directory): CrawlerInterface
    {
        $projectDirectory = new \DirectoryIterator($directory->getPathname());

        // Check for TYPO3 project structure
        $typo3Detector = new TYPO3Detector($projectDirectory);
        if ($typo3Detector->success()) {
            return new TYPO3Crawler($projectDirectory);
        }
        throw new CrawlerException('No Analyser found', 1496822334);
    }
}
