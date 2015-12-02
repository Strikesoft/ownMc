<?php

namespace UserBundle\Controller;

use FOS\UserBundle\Controller\RegistrationController as BaseController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class RegistrationController extends BaseController
{
    public function registerAction(Request $request)
    {
        if ($request->isXmlHttpRequest() && $request->getMethod() === 'POST') {
            $response = new Response();
            return $response;
        }
        if ($this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return $this->redirect($this->generateUrl('front_homepage'));
        }
        return $this->render('UserBundle:Registration:register.html.twig', array());
    }
}
