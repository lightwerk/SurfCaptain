<?php
namespace Lightwerk\SurfCaptain\Controller;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Mvc\Controller\RestController;
use TYPO3\Flow\Error\Message;

/**
 * Abstract Rest Controller
 *
 * @package Lightwerk\SurfCaptain
 */
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
	 * json view (do not use defaultViewObjectName, because we can also html
	 * (and xml) with TemplateView).
	 *
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
	 * @return void
	 */
	protected function initializeController(\TYPO3\Flow\Mvc\RequestInterface $request, \TYPO3\Flow\Mvc\ResponseInterface $response) {
		parent::initializeController($request, $response);
		// override request.format with NegotiatedMediaType aka HTTP-Request
		// Content-Type and set Content-Type to response
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
	 * Error Action
	 * 
	 * @return void
	 */
	protected function errorAction() {
		// we like to have a 400 status
		$this->response->setStatus(400);
		if ($this->mediaType === 'application/json') {
			$this->addErrorFlashMessage();
		} else {
			parent::errorAction();
		}
	}

	/**
	 * Handle Exception
	 * 
	 * @param \Exception $exception
	 * @return void
	 */
	protected function handleException(\Exception $exception) {
		$this->response->setStatus(500);
		// may be we want also an exceptionHandler e.g. to notify somebody, ...
		$this->addFlashMessage(
			$exception->getMessage(),
			get_class($exception),
			Message::SEVERITY_ERROR,
			array(),
			$exception->getCode()
		);
	}

	/**
	 * Redirects the request to another action and / or controller.
	 *
	 * @param string $actionName Name of the action to forward to
	 * @param string $controllerName Unqualified object name of the controller to forward to. If not specified, the current controller is used.
	 * @param string $packageKey Key of the package containing the controller to forward to. If not specified, the current package is assumed.
	 * @param array $arguments Array of arguments for the target action
	 * @param integer $delay (optional) The delay in seconds. Default is no delay.
	 * @param integer $statusCode (optional) The HTTP status code for the redirect. Default is "303 See Other"
	 * @param string $format The format to use for the redirect URI
	 * @return void
	 * @throws \TYPO3\Flow\Mvc\Exception\StopActionException
	 * @see forward()
	 * @api
	 */
	protected function redirect($actionName, $controllerName = NULL, $packageKey = NULL, array $arguments = NULL, $delay = 0,
								$statusCode = 303, $format = NULL) {
		if ($this->mediaType === 'application/json') {
			// render all arguments
			if (!empty($arguments)) {
				foreach ($arguments as $key => $value) {
					$this->view->assign($key, $value);
				}
			}
			// get uri (like AbstractController->redirect())
			// do we need/want the uri?
			if ($packageKey !== NULL && strpos($packageKey, '\\') !== FALSE) {
				list($packageKey, $subpackageKey) = explode('\\', $packageKey, 2);
			} else {
				$subpackageKey = NULL;
			}
			$this->uriBuilder->reset();
			if ($format === NULL) {
				$this->uriBuilder->setFormat($this->request->getFormat());
			} else {
				$this->uriBuilder->setFormat($format);
			}

			$uri = $this->uriBuilder
						->setCreateAbsoluteUri(TRUE)
						->uriFor($actionName, $arguments, $controllerName, $packageKey, $subpackageKey);
			$this->view->assign('see', $uri);
		} else {
			parent::redirect($actionName, $controllerName, $packageKey, $arguments, $delay, $statusCode, $format);
		}
	}
}
