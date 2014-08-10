<?php
namespace Lightwerk\SurfCaptain\Tests\Unit\Service;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Tests\UnitTestCase;

/**
 * GitServiceTest
 */
class GitServiceTest extends UnitTestCase {

	/**
	 * @test
	 * @expectedException \TYPO3\Flow\Http\Exception
	 */
	public function getGitLabApiResponseThrowsExceptionForRequestFailed() {
		$gitService = $this->getAccessibleMock('Lightwerk\SurfCaptain\Service\GitService', array('foo'));
		$browser = $this->getMock('TYPO3\Flow\Http\Client\Browser', array('request'));
		$e = new \TYPO3\Flow\Http\Exception();
		$browser->expects($this->once())->method('request')->will($this->throwException($e));
		$gitService->_set('browser', $browser);
		$gitService->_call('getGitLabApiResponse', 'foo');
	}

	/**
	 * @test
	 * @expectedException \Lightwerk\SurfCaptain\Service\GitServiceException
	 */
	public function getGitLabApiResponseThrowsExceptionForJsonDecodingFailed() {
		$gitService = $this->getAccessibleMock('Lightwerk\SurfCaptain\Service\GitService', array('foo'));
		$response = $this->getMock('TYPO3\Flow\Http\Response', array('getContent'));
		$response->expects($this->once())->method('getContent')->will($this->returnValue('no json string'));
		$browser = $this->getMock('TYPO3\Flow\Http\Client\Browser', array('request'));
		$browser->expects($this->once())->method('request')->will($this->returnValue($response));
		$gitService->_set('browser', $browser);
		$gitService->_call('getGitLabApiResponse', 'foo');
	}

	/**
	 * @test
	 */
	public function getGitLabApiResponseReturnsJson() {
		$gitService = $this->getAccessibleMock('Lightwerk\SurfCaptain\Service\GitService', array('foo'));
		$response = $this->getMock('TYPO3\Flow\Http\Response', array('getContent'));
		$response->expects($this->once())->method('getContent')->will($this->returnValue('{"var": "val"}'));
		$browser = $this->getMock('TYPO3\Flow\Http\Client\Browser', array('request'));
		$browser->expects($this->once())->method('request')->will($this->returnValue($response));
		$gitService->_set('browser', $browser);
		$json = $gitService->_call('getGitLabApiResponse', 'foo');
		$this->assertSame('val', $json['var']);
	}


}
