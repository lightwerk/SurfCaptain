<?php
namespace Lightwerk\SurfCaptain\Tests\Unit\GitApi\Request;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Tests\UnitTestCase;

/**
 * ApiRequestTest
 */
class HttpAuthRequestTest extends UnitTestCase
{
    /**
     * @test
     * @expectedException \TYPO3\Flow\Http\Exception
     */
    public function callThrowsExceptionForRequestFailed()
    {
        $apiRequest = $this->getAccessibleMock('Lightwerk\SurfCaptain\GitApi\Request\HttpAuthRequest', ['foo']);
        $browser = $this->getMock('TYPO3\Flow\Http\Client\Browser', ['request']);
        $e = new \TYPO3\Flow\Http\Exception();
        $browser->expects($this->once())->method('request')->will($this->throwException($e));
        $apiRequest->_set('browser', $browser);
        $apiRequest->_call('call', 'foo');
    }

    /**
     * @test
     * @expectedException \Lightwerk\SurfCaptain\GitApi\Exception
     */
    public function getGitLabApiResponseThrowsExceptionForJsonDecodingFailed()
    {
        $apiRequest = $this->getAccessibleMock('Lightwerk\SurfCaptain\GitApi\Request\HttpAuthRequest', ['foo']);
        $response = $this->getMock('TYPO3\Flow\Http\Response', ['getContent']);
        $response->expects($this->once())->method('getContent')->will($this->returnValue('no json string'));
        $browser = $this->getMock('TYPO3\Flow\Http\Client\Browser', ['request']);
        $browser->expects($this->once())->method('request')->will($this->returnValue($response));
        $apiRequest->_set('browser', $browser);
        $apiRequest->_call('call', 'foo');
    }

    /**
     * @test
     */
    public function callReturnsJson()
    {
        $apiRequest = $this->getAccessibleMock('Lightwerk\SurfCaptain\GitApi\Request\HttpAuthRequest', ['foo']);
        $response = $this->getMock('TYPO3\Flow\Http\Response', ['getContent']);
        $response->expects($this->once())->method('getContent')->will($this->returnValue('{"var": "val"}'));
        $browser = $this->getMock('TYPO3\Flow\Http\Client\Browser', ['request']);
        $browser->expects($this->once())->method('request')->will($this->returnValue($response));
        $apiRequest->_set('browser', $browser);
        $json = $apiRequest->_call('call', 'foo');
        $this->assertSame('val', $json['var']);
    }
}
