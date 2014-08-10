<?php
namespace Lightwerk\SurfCaptain\Mvc\View;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

class JsonView extends \TYPO3\Flow\Mvc\View\JsonView {

	/**
	 * The rendering configuration for this JSON view which
	 * determines which properties of each variable to render.
	 * @var array
	 */
	protected $configuration = array(
		'_exposeObjectIdentifier' => TRUE,
	);

	/**
	 * Transforms the value view variable to a serializable
	 * array represantion using a YAML view configuration and JSON encodes
	 * the result.
	 *
	 * @return string The JSON encoded variables
	 * @api
	 */
	public function render() {
		$propertiesToRender = $this->renderArray();
		$propertiesToRender['flashMessages'] = $this->renderFlashMessages();
		$propertiesToRender['validationErrors'] = $this->renderValidationErrors();
		return json_encode($propertiesToRender);
	}

	/**
	 * renderFlashMessages 
	 * 
	 * @return array
	 */
	protected function renderFlashMessages() {
		$allMessages = $this->controllerContext->getFlashMessageContainer()->getMessagesAndFlush();
		$messages = array();
		foreach ($allMessages AS $message) {
			/** @var \TYPO3\Flow\Error\Message $message */
			$messages[] = array(
				'message' => $message->render(),
				'title' => $message->getTitle(),
				'severity' => $message->getSeverity()
			);
		}
		return $messages;
	}

	/**
	 * renderValidationErrors 
	 *
	 * @return array
	 */
	protected function renderValidationErrors() {
		$arguments = $this->controllerContext->getArguments();
		$validationResults = $arguments->getValidationResults();
		$validationErrors = array();
		foreach ($validationResults->getFlattenedErrors() as $key => $errors) {
			$validationError  = array('property' => $key, 'errors' => array());
			foreach ($errors as $error) {
				/** @var \TYPO3\Flow\Error\Error $error */
				$validationError['errors'][] = array(
					'message' => $error->getMessage(),
					'code' => $error->getCode()
				);
			}
			$validationErrors[] = $validationError;
		}
		return $validationErrors;
	}
}
