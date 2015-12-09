<?php

namespace AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class PendingRegistrationController extends Controller
{
    public function registrationAction(Request $request)
    {
        if ($request->isXmlHttpRequest() && $request->getMethod() === 'POST') {
            return $this->handleAjaxRequest($request);
        }

        $tabPendings = $this->getDoctrine()->getManager()->getRepository('UserBundle:User')->getPendingRegistrations();
        return $this->render('AdminBundle:Default:registration.html.twig', array(
            'tabPendings' => $tabPendings
        ));
    }

    private function handleAjaxRequest(Request $request) {
        $response = new Response();
        $response->headers->set('Content-Type', 'application/json');
        $data = $request->request->all();
        $userRepo = $this->getDoctrine()->getManager()->getRepository('UserBundle:User');
        $userManager = $this->container->get('fos_user.user_manager');
        $result = array();
        $idUser = $data['user'];

        try {
            if ($data['type'] === 'acceptRegistration') {
                $userRepo->acceptRegistration($userManager, $idUser);
            }

            if ($data['type'] === 'refuseRegistration') {
                $userRepo->refuseRegistration($userManager, $idUser);
            }
            $result = array('result' => 'success');
        }
        catch(\Exception $e) {
            $result = array(
                'result' => 'error',
                'errorMsg' => $e->getMessage()
            );
        }

        $response->setContent(json_encode($result));
        return $response;
    }
}