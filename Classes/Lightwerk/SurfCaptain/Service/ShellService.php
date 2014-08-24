<?php
namespace Lightwerk\SurfCaptain\Service;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfRunner".  *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;

/**
 * @Flow\Scope("singleton")
 */
class ShellService {

	/**
	 * @param string $hostname
	 * @param string $username
	 * @param integer $port
	 * @return boolean
	 */
	public function checkLogin($hostname, $username = NULL, $port = NULL) {
		$command = 'ssh -t -t -o LogLevel=ERROR -o ConnectTimeout=3 -o BatchMode=yes -o NumberOfPasswordPrompts=1 -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no ';
		if (!empty($port)) {
			$command .= ' -p ' . escapeshellarg($port);
		}
		if (!empty($username)) {
			$command .= $username . '@';
		}
		$command .= $hostname . ' 2>&1';

		list($exitCode, $output) = $this->executeCommand($command);
		if (!empty($exitCode)) {
			throw new Exception('Exit code: ' . $exitCode . '. Output: ' . $output, 1408904566);
		}
		return true;
	}

	/**
	 * @param $command
	 * @return array
	 */
	protected function executeCommand($command) {
		$returnedOutput = '';
		$fp = popen($command, 'r');
		while (($line = fgets($fp)) !== FALSE) {
			$returnedOutput .= $line;
		}
		$exitCode = pclose($fp);
		return array($exitCode, trim($returnedOutput));
	}
}