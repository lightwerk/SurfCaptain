<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\RestController;
use TYPO3\Flow\Error\Message;

abstract class AbstractRestController extends RestController {

	/**
	 * Supported content types. Needed for HTTP content negotiation.
	 * @var array
	 */
	protected $supportedMediaTypes = array('text/html', 'application/json', 'application/xml');

	/**
	 * @var string
	 */
	protected $mediaType;

	/**
	 * json view (do not use defaultViewObjectName, because we can also html (and xml) with TemplateView)
	 * use own view to
	 * - render all variables given
	 * - render flashMessages
	 * 
	 * @var array
	 */
	protected $viewFormatToObjectNameMap = array('json' => 'Lightwerk\\SurfCaptain\\Mvc\\View\\JsonView');

	/**
	 * Initializes the controller
	 *
	 * This method should be called by the concrete processRequest() method.
	 *
	 * @param \TYPO3\Flow\Mvc\RequestInterface $request
	 * @param \TYPO3\Flow\Mvc\ResponseInterface $response
	 * @throws \TYPO3\Flow\Mvc\Exception\UnsupportedRequestTypeException
	 */
	protected function initializeController(\TYPO3\Flow\Mvc\RequestInterface $request, \TYPO3\Flow\Mvc\ResponseInterface $response) {
		parent::initializeController($request, $response);
		// override request.format with NegotiatedMediaType aka HTTP-Request Content-Type and set Content-Type to response
		$this->mediaType = $this->request->getHttpRequest()->getNegotiatedMediaType($this->supportedMediaTypes);
		if (in_array($this->mediaType, $this->supportedMediaTypes) === FALSE) {
			$this->throwStatus(406);
		} else {
			// convert negotiatedMediaType to Flow format
			$request->setFormat(preg_replace('/.*\/(.*)/', '$1', $this->mediaType));
			// sets the Content-Type to the response
			$this->response->setHeader('Content-Type', $this->mediaType, TRUE);
		}
	}

	/**
	 * errorAction 
	 * 
	 * @return void
	 */
	protected function errorAction() {
		// we like to have a 400 status
		$this->response->setStatus(400);
		return parent::errorAction();
	}

	/**
	 * handleException
	 * 
	 * @param \Exception $e
	 * @return void
	 */
	protected function handleException(\Exception $e) {
		$this->response->setStatus(500);
		// may be we want also an exceptionHandler e.g. to notify somebody, ...
		$this->addFlashMessage($e->getMessage(), get_class($e), Message::SEVERITY_ERROR, array(), $e->getCode());
	}


	/**
	 * A custom redirect, that does not set action, controller, package and format arguments
	 *
	 * @param array $parameter
	 * @param string $controllerName
	 * @param integer $statusCode
	 * @return void
	 * @throws \TYPO3\Flow\Mvc\Exception\StopActionException
	 */
	protected function redirectToResource($parameter = array(), $controllerName = NULL, $statusCode = 303) {
		$httpRequest = $this->request->getHttpRequest();
		$uri = $httpRequest->getBaseUri() . 'api/';
		$uri .= !empty($controllerName) ? $controllerName : strtolower($this->request->getControllerName());
		if (count($parameter)) {
			$uri .= '?' . http_build_query($parameter);
		}
		$this->response->setHeader('Location', $uri);
		$this->response->setStatus($statusCode);
		$this->response->setHeader('Accept', $this->request->getHttpRequest()->getHeaders()->get('HTTP_ACCEPT'));
		$this->response->setContent('');
		throw new \TYPO3\Flow\Mvc\Exception\StopActionException();
	}
}
