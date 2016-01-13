<?php
namespace MediaBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class FoldersController extends Controller
{
    public function indexAction(Request $request) {
        if ($request->isXmlHttpRequest() && $request->getMethod() === 'POST') {
            return $this->handleAjaxRequest($request);
        }
        $tabFolder = $this->getDoctrine()->getManager()->getRepository('MediaBundle:Folder')->findAll();
        return $this->render('MediaBundle:Default:folders.html.twig', array(
            'tabFolder' => $tabFolder
        ));
    }

    private function handleAjaxRequest(Request $request)
    {
        $response = new Response();
        $data = $request->request->all();
        $folderRepo = $this->getDoctrine()->getManager()->getRepository('MediaBundle:Folder');
        $requestType = $data['type'];
        $isJSON = true;

        if ($requestType === 'addFolder') {
            try {
                $folderRepo->addFolder($data['name'], $data['path'], $data['extensions']);
                // TODO : translate success message
                $response->setContent(json_encode(array(
                    'result' => 'success',
                    'message' => 'Folder added !'
                )));
            }
            catch (\Exception $e) {
                // TODO : translate error message
                $response->setContent(json_encode(array(
                    'result' => 'error',
                    'message' => $e->getMessage()
                )));
            }
        }
        elseif ($requestType === 'removeFolder') {
            try {
                $folderRepo->removeFolder($data['folder']);
                $response->setContent(json_encode(array(
                    'result' => 'success'
                )));
            }
            catch (\Exception $e) {
                // TODO : translate error message
                $response->setContent(json_encode(array(
                    'result' => 'error',
                    'message' => $e->getMessage()
                )));
            }
        }
        elseif ($requestType === 'getFolders') {
            $tabFolders = $folderRepo->findAll();
            $engine = $this->container->get('templating');
            $response->setContent($engine->render('MediaBundle:Partial:tableBodyFolders.html.twig', array(
                'tabFolder' => $tabFolders
            )));
            $isJSON = false;
        }
        elseif ($requestType === 'infoFolder') {
            $folder = $folderRepo->find($data['folder']);
            if ($folder !== null) {
                $response->setContent(json_encode($folderRepo->convertFolderToArray($folder)));
            }
            else {
                // TODO : translate error message
                $response->setContent(json_encode(array(
                    'result' => 'error',
                    'message' => 'Not a folder'
                )));
            }
        }
        elseif ($requestType === 'editFolder') {
            try {
                $folderRepo->editFolder($data['folderId'], $data['name'], $data['path'], $data['extensions']);
                $response->setContent(json_encode(array(
                    'result' => 'success',
                    'message' => 'Folder edited !'
                )));
            }
            catch(\Exception $e) {
                // TODO : translate error message
                $response->setContent(json_encode(array(
                    'result' => 'error',
                    'message' => $e->getMessage()
                )));
            }
        }

        if ($isJSON) {
            $response->headers->set('Content-Type', 'application/json');
        }
        return $response;
    }
}