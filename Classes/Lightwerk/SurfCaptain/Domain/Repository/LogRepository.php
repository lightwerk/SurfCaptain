<?php
namespace Lightwerk\SurfCaptain\Domain\Repository;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use Lightwerk\SurfCaptain\Domain\Model\Deployment;
use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Persistence\QueryInterface;
use TYPO3\Flow\Persistence\Repository;

/**
 * Log Repository
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class LogRepository extends Repository {

	/**
	 * @var array
	 * @see \TYPO3\Flow\Persistence\Repository
	 */
	protected $defaultOrderings = array(
		'date' => QueryInterface::ORDER_DESCENDING,
		'number' => QueryInterface::ORDER_DESCENDING,
	);

	/**
	 * @param Deployment $deployment
	 * @param integer $offset
	 * @return \TYPO3\Flow\Persistence\QueryResultInterface
	 */
	public function findByDeploymentWithOffset(Deployment $deployment, $offset) {
		$query = $this->createQuery();
		return $query->matching($query->equals('deployment', $deployment))
			->setOffset($offset)
			->execute();
	}

}