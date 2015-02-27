<?php
namespace Lightwerk\SurfCaptain\Service;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfRunner".  *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * Shell Service
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class ShellService {

	/**
	 * @param string $hostname
	 * @param string $username
	 * @param integer $port
	 * @return boolean
	 * @throws Exception
	 */
	public function checkLogin($hostname, $username = NULL, $port = NULL) {
		$command = 'ssh -t -t -o LogLevel=ERROR ';
		if (!empty($port)) {
			$command .= '-p ' . escapeshellarg($port) . ' ';
		}
		if (!empty($username)) {
			$command .= $username . '@';
		}
		$command .= $hostname . ' 2>&1';

		list($exitCode, $output) = $this->executeCommand($command);
		if (!empty($exitCode)) {
			throw new Exception('Exit code: ' . $exitCode . '. Output: ' . $output, 1408904566);
		}
		return TRUE;
	}

	/**
	 * @param $command
	 * @return array
	 */
	protected function executeCommand($command) {
		$returnedOutput = '';
		$resource = popen($command, 'r');
		while (($line = fgets($resource)) !== FALSE) {
			$returnedOutput .= $line;
		}
		$exitCode = pclose($resource);
		return array($exitCode, trim($returnedOutput));
	}
}