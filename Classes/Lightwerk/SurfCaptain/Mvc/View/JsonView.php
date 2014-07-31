<?php
namespace Lightwerk\SurfCaptain\Mvc\View;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

class JsonView extends \TYPO3\Flow\Mvc\View\JsonView {

	 /**
	  * empty array instead of array('value')
	  *
	  * @var array
	  */
	 protected $variablesToRender = array();

	/**
	 * Transforms the value view variable to a serializable
	 * array represantion using a YAML view configuration and JSON encodes
	 * the result.
	 *
	 * @return string The JSON encoded variables
	 * @api
	 */
	public function render() {
		if (count($this->variablesToRender) === 0) {
			// render all variables exclude settings
			foreach($this->variables AS $key => $value) {
				if ($key !== 'settings') {
					$this->variablesToRender[] = $key;
				}
			}
		}
		$propertiesToRender = $this->renderArray();
		$flashMessagesToRender = $this->renderFlashMessages();
		$propertiesToRender['flashMessages'] = $flashMessagesToRender;
		return json_encode($propertiesToRender);
	}

	/**
	 * Loads the configuration and transforms the value to a serializable
	 * array.
	 * 
	 * lw_af always render assoc
	 *
	 * @return array An array containing the values, ready to be JSON encoded
	 * @api
	 */
	protected function renderArray() {
		$valueToRender = array();
		foreach ($this->variablesToRender as $variableName) {
			$valueToRender[$variableName] = isset($this->variables[$variableName]) ? $this->variables[$variableName] : NULL;
		}
		$configuration = $this->configuration;
		return $this->transformValue($valueToRender, $configuration);
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
			$messages[] = array(
				'message' => $message->getMessage(),
				'title' => $message->getTitle(),
				'severity' => $message->getSeverity()
			);
		}
		return $messages;
	}
}
