<?php

namespace AdminBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;

class AdminController extends Controller
{
    public function indexAction()
    {
        return $this->render('AdminBundle:Default:index.html.twig', array());
    }

    public function registrationAction()
    {
        $tabPendings = $this->getDoctrine()->getManager()->getRepository('UserBundle:User')->getPendingRegistrations();
        return $this->render('AdminBundle:Default:registration.html.twig', array(
            'tabPendings' => $tabPendings
        ));
    }
}
