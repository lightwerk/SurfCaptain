<?php
namespace Lightwerk\SurfCaptain\Mvc\View;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

/**
 * Json View
 *
 * @package Lightwerk\SurfCaptain\Mvc\View
 */
class JsonView extends \TYPO3\Flow\Mvc\View\JsonView {

	/**
	 * The rendering configuration for this JSON view which
	 * determines which properties of each variable to render.
	 * @var array
	 */
	protected $configuration = array(
		'deployment' => array(
			'_exposeObjectIdentifier' => TRUE,
			'_exposeClassName' => 1,
			'_exclude' => array('repository'),
			'_descend' => array(
				'options' => array(),
				'date' => array(),
				'configuration' => array(),
				'logs' => array(
					'_descendAll' => array(
						'_exposeObjectIdentifier' => TRUE,
						'_exposeClassName' => 1,
						'_descend' => array(
							'date' => array(),
						),
					),
				),
			),
		),
		'deployments' => array(
			'_descendAll' => array(
				'_exposeObjectIdentifier' => TRUE,
				'_exposeClassName' => 1,
				'_exclude' => array('repository'),
				'_descend' => array(
					'options' => array(),
					'date' => array(),
				),
			),
		),
		'repositories' => array(
			'_descendAll' => array(
				'_exclude' => array('tags', 'branches', 'deployments', 'presets'),
			),
		),
		'repository' => array(
			'_descend' => array(
				'tags' => array(
					'_descendAll' => array(
						'_descend' => array(
							'commit' => array(
							),
						)
					),
				),
				'branches' => array(
					'_descendAll' => array(
						'_descend' => array(
							'commit' => array(
							),
						)
					),
				),
				'deployments' => array(
					'_exposeObjectIdentifier' => TRUE,
					'_exposeClassName' => 1,
					'_exclude' => array('repository', 'logs'),
					'_descendAll' => array(
						'options' => array(),
						'date' => array(),
						'configuration' => array(),
					),
				),
				'presets' => array(),
			),
		),
	);

	/**
	 * Loads the configuration and transforms the value to a serializable
	 * array.
	 *
	 * @return array An array containing the values, ready to be JSON encoded
	 * @api
	 */
	protected function renderArray() {
		$valueToRender = $this->variables;
		unset($valueToRender['settings']);
		$valueToRender['flashMessages'] = $this->renderFlashMessages();
		$valueToRender['validationErrors'] = $this->renderValidationErrors();
		return $this->transformValue($valueToRender, $this->configuration);
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
