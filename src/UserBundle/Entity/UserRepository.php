<?php

namespace UserBundle\Entity;

use Doctrine\ORM\EntityRepository;

class UserRepository extends EntityRepository
{
	public function registerUser($data, $userManager) {
        try {
            $this->checkRegistrationData($data, $userManager);
            $user = $userManager->createUser();
            $user->setUsername($data['login']);
            $user->setEmail($data['email']);
            $user->setPlainPassword($data['password']);
            $user->setDateRegister(new \DateTime());
            $user->setLocked(true);
            $userManager->updateUser($user);

            return array(
                'result' => true,
                'message' => 'success'
            );
        }
        catch(\Exception $e) {
            return array(
                'result' => false,
                'message' => $e->getMessage()
            );
        }
	}

    private function checkRegistrationData($data, $userManager) {
        if (!isset($data['login']) || empty($data['login'])) {
            throw new \Exception("No login key");
        }
        if ($userManager->findUserByUsername($data['login']) !== null) {
            throw new \Exception("Login already existed");
        }
        if (!isset($data['email']) || empty($data['email'])) {
            throw new \Exception("No email key");
        }
        if ($userManager->findUserByEmail($data['email']) !== null) {
            throw new \Exception("Email already attached to an account");
        }
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            throw new \Exception("Not a valid email");
        }
        if (!isset($data['password']) || empty($data['password'])) {
            throw new \Exception("No password key");
        }
    }
}
