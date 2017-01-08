<?php
namespace Lightwerk\SurfCaptain\Domain\Model;

/*                                                                        *
 * This script belongs to the TYPO3 Flow package "Lightwerk.SurfCaptain". *
 *                                                                        *
 *                                                                        */

/**
 * Branch
 *
 * @package Lightwerk\SurfCaptain
 */
class Branch
{
    /**
     * @var string
     */
    protected $name;

    /**
     * @var Commit
     */
    protected $commit;

    /**
     * @return string
     */
    public function getType()
    {
        return 'Branch';
    }

    /**
     * @return string
     */
    public function getGroup()
    {
        return 'Branches';
    }

    /**
     * @return string
     */
    public function getIdentifier()
    {
        return 'branch-' . strtolower($this->getName()) . '-' . $this->getCommit()->getId();
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string $name
     * @return Branch
     */
    public function setName($name)
    {
        $this->name = $name;
        return $this;
    }

    /**
     * @return Commit
     */
    public function getCommit()
    {
        return $this->commit;
    }

    /**
     * @param Commit $commit
     * @return Tag
     */
    public function setCommit($commit)
    {
        $this->commit = $commit;
        return $this;
    }
}
