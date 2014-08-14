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
 * @Flow\Scope("singleton")
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
	 * @param string $repositoryUrl
	 * @param integer $limit
	 * @return \TYPO3\Flow\Persistence\QueryResultInterface<Deployment>
	 */
	public function findByRepositoryUrlWithLimit($repositoryUrl, $limit) {
		$query = $this->createQuery();
		return $query
			->matching($query->equals('repositoryUrl', $repositoryUrl))
			->setLimit($limit)
			->execute();
	}

	/**
	 * @param integer $limit
	 * @return \TYPO3\Flow\Persistence\QueryResultInterface<Deployment>
	 */
	public function findAllWithLimit($limit) {
		$query = $this->createQuery();
		return $query
			->setLimit($limit)
			->execute();
	}

}