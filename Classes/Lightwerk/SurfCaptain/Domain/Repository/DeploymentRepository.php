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
class DeploymentRepository extends Repository
{
    /**
     * @var array
     * @see \TYPO3\Flow\Persistence\Repository
     */
    protected $defaultOrderings = [
        'date' => QueryInterface::ORDER_DESCENDING,
    ];

    /**
     * @param integer $limit
     * @return \TYPO3\Flow\Persistence\QueryResultInterface The query result
     */
    public function findAllWithLimit($limit)
    {
        return $this->createQuery()->setLimit($limit)->execute();
    }

    /**
     * @param integer $daysOld
     * @return \TYPO3\Flow\Persistence\QueryResultInterface
     */
    public function findByDaysOld($daysOld)
    {
        if ($daysOld === 0) {
            return $this->findAll();
        } else {
            $now = new \DateTime();
            $past = $now->sub(new \DateInterval('P' . $daysOld . 'D'));
            $query = $this->createQuery();
            return $query->matching(
                $query->lessThan('date', $past)
            )->execute();
        }
    }

    /**
     * @param string $repositoryUrl
     * @param string $status
     * @return integer
     */
    public function countByRepositoryUrlAndStatus($repositoryUrl, $status)
    {
        $query = $this->createQuery();
        return $query->matching(
            $query->logicalAnd(
                [
                    $query->equals('repositoryUrl', $repositoryUrl),
                    $query->equals('status', $status),
                ]
            )
        )->count();
    }
}
