<?php
namespace Lightwerk\SurfCaptain\Crawler\Detector;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

/**
 * TYPO3Detector
 * Responsible for identifying a project directory containing a TYPO3 project structure
 *
 * @package Lightwerk\SurfCaptain
 */
class TYPO3Detector extends AbstractDetector
{

    protected function detect()
    {
        foreach ($this->directory as $file) {
            if ($file->isDot()) {
                continue;
            }
            if ($file->getBasename() === 'composer.json' && $file->isReadable()) {
                $this->detectTypo3InComposerJson($file);
            }
            if ($file->getBasename() === 'typo3') {
                $this->success = true;
            }
            if ($file->getBasename() === 'typo3conf') {
                $this->success = true;
            }

            if ($this->success) {
                break;
            }
        }
    }

    /**
     * Looks for "typo3/cms" in the require section of the composer.json
     *
     * @param \DirectoryIterator $composerJson
     */
    private function detectTypo3InComposerJson(\DirectoryIterator $composerJson)
    {
        if (file_exists($composerJson->getPathname()) === false) {
            return;
        }
        $json = json_decode(file_get_contents($composerJson->getPathname()), true);
        $this->success = ($json !== null && empty($json['require']['typo3/cms']) === false);
    }
}
