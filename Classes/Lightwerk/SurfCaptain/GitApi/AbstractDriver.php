<?php
namespace Lightwerk\SurfCaptain\GitApi;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use Lightwerk\SurfCaptain\Mapper\DataMapper;

abstract class AbstractDriver implements DriverInterface {

	/**
	 * @var array
	 */
	protected $settings;

	/**
	 * @FLow\Inject
	 * @var DataMapper
	 */
	protected $dataMapper;

	/**
	 * @var \Lightwerk\SurfCaptain\GitApi\ApiRequest
	 */
	protected $apiRequest;

	/**
	 * @var \TYPO3\Flow\Object\ObjectManagerInterface
	 * @Flow\Inject
	 */
	protected $objectManager;

}
