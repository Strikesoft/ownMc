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
            return $this->handleAjaxRequest($request);
        }

        // Redirect the user if he's already connected
        if ($this->get('security.context')->isGranted('IS_AUTHENTICATED_REMEMBERED')) {
            return $this->redirect($this->generateUrl('front_homepage'));
        }
        return $this->render('UserBundle:Registration:register.html.twig', array());
    }

    private function handleAjaxRequest(Request $request)
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $data = $request->request->all();
        $result = array();

        if ($data['type'] === 'registration') {
            $userManager = $this->container->get('fos_user.user_manager');
            $result = $this->getDoctrine()->getManager()->getRepository('UserBundle:User')->registerUser($data, $userManager);
        }

        $response->setContent(json_encode($result));
        return $response;
    }
}
