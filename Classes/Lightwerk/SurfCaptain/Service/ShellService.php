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
	 * @Flow\Inject
	 * @var \TYPO3\Flow\Package\PackageManagerInterface
	 */
	protected $packageManager;

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
	 * @param string $hostname
	 * @param string $username
	 * @param string $password
	 * @param integer|null $port
	 * @return boolean
	 * @throws Exception
	 */
	public function copyKey($hostname, $username, $password, $port = NULL) {
		$host = '';
		if (!empty($username)) {
			$host .= $username . '@';
		}
		$host .= $hostname;
		if (!empty($port)) {
			$host .= ' -p' . escapeshellarg($port);
		}

		$command = 'ssh-copy-id -i ' . escapeshellarg($host);

		$surfPackage = $this->packageManager->getPackage('TYPO3.Surf');
		$passwordSshLoginScriptPathAndFilename = \TYPO3\Flow\Utility\Files::concatenatePaths(array($surfPackage->getResourcesPath(), 'Private/Scripts/PasswordSshLogin.expect'));
		$command = sprintf('expect %s %s %s', escapeshellarg($passwordSshLoginScriptPathAndFilename), escapeshellarg($password), $command);

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