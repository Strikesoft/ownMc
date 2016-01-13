<?php

namespace MediaBundle\Entity;

use Doctrine\ORM\Mapping as ORM;

/**
 * Folder
 *
 * @ORM\Table()
 * @ORM\Entity(repositoryClass="MediaBundle\Entity\FolderRepository")
 */
class Folder
{
    /**
     * @var integer
     *
     * @ORM\Column(name="id", type="integer")
     * @ORM\Id
     * @ORM\GeneratedValue(strategy="AUTO")
     */
    private $id;

    /**
     * @var string
     *
     * @ORM\Column(name="name", type="string", length=255)
     */
    private $name;

    /**
     * @var string
     *
     * @ORM\Column(name="path", type="string", length=255)
     */
    private $path;

    /**
     * @var array
     *
     * @ORM\Column(name="extensions", type="array")
     */
    private $extensions;

    /**
     * @var \DateTime
     *
     * @ORM\Column(name="lastCheck", type="datetime", nullable=true)
     */
    private $lastCheck;


    /**
     * Get id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Set name
     *
     * @param string $name
     *
     * @return Folder
     */
    public function setName($name)
    {
        $this->name = strip_tags($name);

        return $this;
    }

    /**
     * Get name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Set path
     *
     * @param string $path
     *
     * @return Folder
     */
    public function setPath($path)
    {
        $this->path = strip_tags($path);
        return $this;
    }

    /**
     * Get path
     *
     * @return string
     */
    public function getPath()
    {
        return $this->path;
    }

    /**
     * Set extensions
     *
     * @param array $extensions
     *
     * @return Folder
     */
    public function setExtensions($extensions)
    {
        $nbExt = count($extensions);
        for ($i = 0; $i < $nbExt; $i++) {
            $extensions[$i] = strip_tags($extensions[$i]);
        }
        $this->extensions = $extensions;

        return $this;
    }

    /**
     * Get extensions
     *
     * @return array
     */
    public function getExtensions()
    {
        return $this->extensions;
    }

    public function displayExtensions() {
        return implode(',', $this->extensions);
    }

    /**
     * Set lastCheck
     *
     * @param \DateTime $lastCheck
     *
     * @return Folder
     */
    public function setLastCheck($lastCheck)
    {
        $this->lastCheck = $lastCheck;

        return $this;
    }

    /**
     * Get lastCheck
     *
     * @return \DateTime
     */
    public function getLastCheck()
    {
        return $this->lastCheck;
    }

    public function displayLastCheck($format)
    {
        if ($this->lastCheck === null) {
            return '';
        }
        return $this->lastCheck->format($format);
    }
}

