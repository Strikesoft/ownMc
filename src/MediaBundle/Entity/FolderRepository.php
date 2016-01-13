<?php

namespace MediaBundle\Entity;

use Doctrine\ORM\EntityRepository;

/**
 * FolderRepository
 */
class FolderRepository extends EntityRepository
{
    public function addFolder($name, $path, $extensions)
    {
        if ($this->folderNameExist(strip_tags($name))) {
            throw new \Exception('Folder name already exist');
        }

        // TODO : Resolve encoding problem
        if (!is_dir(utf8_decode($path))) {
            throw new \Exception('Not an existing folder');
        }
        $folder = new Folder();
        $folder->setName($name);
        $folder->setPath($path);
        $folder->setExtensions($extensions);
        $folder->setLastCheck(null);
        $this->_em->persist($folder);
        $this->_em->flush();
    }

    public function removeFolder($idFolder) {
        if (!is_numeric($idFolder)) {
            throw new \Exception('Not a folder');
        }
        $idFolder = intval($idFolder);
        $folder = $this->_em->find($this->_entityName, $idFolder);
        if ($folder === null) {
            throw new \Exception('Not an existing folder');
        }
        $this->_em->remove($folder);
        $this->_em->flush();
    }

    public function convertFolderToArray(Folder $folder)
    {
        return array(
            'name' => $folder->getName(),
            'path' => $folder->getPath(),
            'extensions' => $folder->getExtensions(),
            'lastCheck' => $folder->displayLastCheck('dd-MM-YYYY')
        );
    }

    public function editFolder($idFolder, $folderName, $folderPath, $folderExt) {
        $folder = $this->_em->find($this->_entityName, $idFolder);
        if ($folder === null) {
            throw new \Exception('Not an existing folder');
        }

        if ($this->folderNameExist(strip_tags($folderName))) {
            throw new \Exception('Folder name already exist');
        }

        if (!is_dir(utf8_decode($folderPath))) {
            throw new \Exception('Not an existing folder');
        }
        $folder->setName($folderName);
        $folder->setPath($folderPath);
        $folder->setExtensions($folderExt);
        $this->_em->flush();
    }

    private function folderNameExist($name)
    {
        $qb = $this->_em->createQuery('SELECT a FROM MediaBundle:Folder a WHERE a.name = :name');
        $qb->setParameter('name', $name);
        $folder = $qb->getOneOrNullResult();
        return $folder !== null;
    }
}
