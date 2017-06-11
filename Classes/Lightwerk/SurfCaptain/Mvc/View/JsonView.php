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
class JsonView extends \TYPO3\Flow\Mvc\View\JsonView
{
    /**
     * The rendering configuration for this JSON view which
     * determines which properties of each variable to render.
     * @var array
     */
    protected $configuration = [
        'deployment' => [
            '_exposeObjectIdentifier' => true,
            '_exposeClassName' => 1,
            '_exclude' => ['repository'],
            '_descend' => [
                'options' => [],
                'date' => [],
                'configuration' => [],
                'logs' => [
                    '_descendAll' => [
                        '_exposeObjectIdentifier' => true,
                        '_exposeClassName' => 1,
                        '_descend' => [
                            'date' => [],
                        ],
                    ],
                ],
            ],
        ],
        'deployments' => [
            '_descendAll' => [
                '_exposeObjectIdentifier' => true,
                '_exposeClassName' => 1,
                '_exclude' => ['repository', 'logs', 'repositoryUrl'],
                '_descend' => [
                    'options' => [],
                    'date' => [],
                ],
            ],
        ],
        'repositories' => [
            '_descendAll' => [
                '_exclude' => ['tags', 'branches', 'deployments', 'presets'],
            ],
        ],
        'repository' => [
            '_descend' => [
                'tags' => [
                    '_descendAll' => [
                        '_descend' => [
                            'commit' => [
                            ],
                        ]
                    ],
                ],
                'branches' => [
                    '_descendAll' => [
                        '_descend' => [
                            'commit' => [
                            ],
                        ]
                    ],
                ],
                'deployments' => [
                    '_descendAll' => [
                        '_exposeObjectIdentifier' => true,
                        '_exposeClassName' => 1,
                        '_exclude' => ['repository', 'logs', 'repositoryUrl'],
                        '_descend' => [
                            'options' => [],
                            'date' => [],
                        ],
                    ],
                ],
                'presets' => [],
            ],
        ],
        'crawlingResult' => [
            '_descend' => [
                'projects' => [
                    '_descendAll' => [
                        '_descend' => [
                            'packages' => [],
                            'packageCategories' => []
                        ]
                    ],
                ],
                'packages' => [
                    '_descendAll' => [
                        '_descend' => [
                            'versions' => []
                        ]
                    ]
                ]
            ],
        ],

    ];

    /**
     * Loads the configuration and transforms the value to a serializable
     * array.
     *
     * @return array An array containing the values, ready to be JSON encoded
     * @api
     */
    protected function renderArray()
    {
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
    protected function renderFlashMessages()
    {
        $allMessages = $this->controllerContext->getFlashMessageContainer()->getMessagesAndFlush();
        $messages = [];
        foreach ($allMessages as $message) {
            /** @var \TYPO3\Flow\Error\Message $message */
            $messages[] = [
                'message' => $message->render(),
                'title' => $message->getTitle(),
                'severity' => $message->getSeverity()
            ];
        }
        return $messages;
    }

    /**
     * renderValidationErrors
     *
     * @return array
     */
    protected function renderValidationErrors()
    {
        $arguments = $this->controllerContext->getArguments();
        $validationResults = $arguments->getValidationResults();
        $validationErrors = [];
        foreach ($validationResults->getFlattenedErrors() as $key => $errors) {
            $validationError = ['property' => $key, 'errors' => []];
            foreach ($errors as $error) {
                /** @var \TYPO3\Flow\Error\Error $error */
                $validationError['errors'][] = [
                    'message' => $error->getMessage(),
                    'code' => $error->getCode()
                ];
            }
            $validationErrors[] = $validationError;
        }
        return $validationErrors;
    }
}
