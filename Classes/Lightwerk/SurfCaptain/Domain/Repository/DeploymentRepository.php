<?php
namespace Lightwerk\SurfCaptain\Domain\Repository;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

use TYPO3\Flow\Annotations as Flow;
use TYPO3\Flow\Persistence\QueryInterface;
use TYPO3\Flow\Persistence\Repository;

/**
 * Deployment Repository
 *
 * @Flow\Scope("singleton")
 * @package Lightwerk\SurfCaptain
 */
class DeploymentRepository extends Repository {

	/**
	 * @var array
	 * @see \TYPO3\Flow\Persistence\Repository
	 */
	protected $defaultOrderings = array(
		'date' => QueryInterface::ORDER_DESCENDING,
	);

	/**
	 * @param integer $limit
	 * @return \TYPO3\Flow\Persistence\QueryResultInterface The query result
	 */
	public function findAllWithLimit($limit) {
		return $this->createQuery()->setLimit($limit)->execute();
	}

	/**
	 * @param string $repositoryUrl
	 * @param string $status
	 * @return integer
	 */
	public function countByRepositoryUrlAndStatus($repositoryUrl, $status) {
		$query = $this->createQuery();
		return $query->matching(
			$query->logicalAnd(
				array(
					$query->equals('repositoryUrl', $repositoryUrl),
					$query->equals('status', $status),
				)
			)
		)->count();
	}
}