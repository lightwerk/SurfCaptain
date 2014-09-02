<?php
namespace Lightwerk\SurfCaptain\Tests\Unit\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Tests\UnitTestCase;
use TYPO3\Flow\Error\Message;

/**
 * AbstractRestControllerTest 
 */
class AbstractRestControllerTest extends UnitTestCase {

	/**
	 * @test
	 */
	public function initializeControllerCallsParent() {
		$controller = $this->getAccessibleMock('Lightwerk\SurfCaptain\Controller\AbstractRestController', array('parentInitializeController'));
		$request = $this->getMock('TYPO3\Flow\Mvc\ActionRequest', array('getHttpRequest'), array(), '', FALSE);
		$response = $this->getMock('TYPO3\Flow\Http\Response');
		$httpRequest = $this->getMock('TYPO3\Flow\Http\Request', array('getNegotiatedMediaType'), array(), '', FALSE);

		$request->expects($this->any())->method('getHttpRequest')->will($this->returnValue($httpRequest));
		$httpRequest->expects($this->once())->method('getNegotiatedMediaType')->will($this->returnValue('foo'));
		$controller->expects($this->once())->method('parentInitializeController')->with($request, $response);

		$controller->_set('response', $response);
		$controller->_set('request', $request);
		$controller->_set('supportedMediaTypes', array('foo'));
		$controller->_call('initializeController', $request, $response);
	}

	/**
	 * @test
	 */
	public function initializeControllerSetsResponseHeader() {
		$controller = $this->getAccessibleMock('Lightwerk\SurfCaptain\Controller\AbstractRestController', array('parentInitializeController'));
		$request = $this->getMock('TYPO3\Flow\Mvc\ActionRequest', array('getHttpRequest'), array(), '', FALSE);
		$response = $this->getMock('TYPO3\Flow\Http\Response', array('setHeader'));
		$httpRequest = $this->getMock('TYPO3\Flow\Http\Request', array('getNegotiatedMediaType'), array(), '', FALSE);

		$request->expects($this->any())->method('getHttpRequest')->will($this->returnValue($httpRequest));
		$httpRequest->expects($this->once())->method('getNegotiatedMediaType')->will($this->returnValue('foo'));
		$response->expects($this->once())->method('setHeader')->with('Content-Type', 'foo; charset=UTF-8', TRUE);

		$controller->_set('response', $response);
		$controller->_set('request', $request);
		$controller->_set('supportedMediaTypes', array('foo'));
		$controller->_call('initializeController', $request, $response);
	}

	/**
	 * @test
	 */
	public function initializeControllerThrowsStatusForInvalideMediaType() {
		$controller = $this->getAccessibleMock('Lightwerk\SurfCaptain\Controller\AbstractRestController', array('parentInitializeController', 'throwStatus'));
		$request = $this->getMock('TYPO3\Flow\Mvc\ActionRequest', array('getHttpRequest'), array(), '', FALSE);
		$response = $this->getMock('TYPO3\Flow\Http\Response');
		$httpRequest = $this->getMock('TYPO3\Flow\Http\Request', array('getNegotiatedMediaType'), array(), '', FALSE);

		$request->expects($this->any())->method('getHttpRequest')->will($this->returnValue($httpRequest));
		$httpRequest->expects($this->once())->method('getNegotiatedMediaType')->will($this->returnValue('foo'));
		$controller->expects($this->once())->method('throwStatus')->with(406);

		$controller->_set('response', $response);
		$controller->_set('request', $request);
		$controller->_set('supportedMediaTypes', array('bar'));
		$controller->_call('initializeController', $request, $response);
	}

	/**
	 * @test
	 */
	public function errorActionAddsErrorFlashMessageForJsonFormat() {
		$controller = $this->getAccessibleMock('Lightwerk\SurfCaptain\Controller\AbstractRestController', array('addErrorFlashMessage'));
		$response = $this->getMock('TYPO3\Flow\Http\Response');
		$controller->expects($this->once())->method('addErrorFlashMessage');

		$controller->_set('response', $response);
		$controller->_set('mediaType', 'application/json');
		$controller->_call('errorAction');
	}

	/**
	 * @test
	 */
	public function handleExceptionSetStatus() {
		$controller = $this->getAccessibleMock('Lightwerk\SurfCaptain\Controller\AbstractRestController', array('addFlashMessage'));
		$response = $this->getMock('TYPO3\Flow\Http\Response', array('setStatus'));
		$response->expects($this->once())->method('setStatus')->with(500);
		$exception = $this->getMock('Exception');

		$controller->_set('response', $response);
		$controller->_set('mediaType', 'application/json');
		$controller->_call('handleException', $exception);
	}

	/**
	 * @test
	 */
	public function handleExceptionAddsFlashMessage() {
		$controller = $this->getAccessibleMock('Lightwerk\SurfCaptain\Controller\AbstractRestController', array('addFlashMessage'));
		$response = $this->getMock('TYPO3\Flow\Http\Response');
		$exception = new \Exception('foo', 1);

		$controller->expects($this->once())->method('addFlashMessage')->with('foo', 'Exception', Message::SEVERITY_ERROR, array(), 1);

		$controller->_set('response', $response);
		$controller->_set('mediaType', 'application/json');
		$controller->_call('handleException', $exception);
	}

}
