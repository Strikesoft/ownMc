<?php

namespace UserBundle\Entity;

use FOS\UserBundle\Model\User as BaseUser;
use Doctrine\ORM\Mapping as ORM;

/**
 * @ORM\Entity(repositoryClass="UserBundle\Entity\UserRepository")
 * @ORM\Table(name="User")
 */
class User extends BaseUser
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    protected $id;

    /**
     * @var \DateTime
     * @ORM\Column(name="dateRegister", type="datetime", nullable=true)
     */
    private $dateRegister;

    public function __construct() {
        parent::__construct();
    }

    /**
     * Get date registration
     * @return \DateTime
     */
    public function getDateRegister()
    {
        return $this->dateRegister;
    }

    /**
     * Set date registration
     * @param \DateTime $date
     * @return User
     */
    public function setDateRegister(\DateTime $date)
    {
        $this->dateRegister = $date;
        return $this;
    }
}