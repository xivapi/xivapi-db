<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ContentController extends Controller
{
    /**
     * @Route("/content/{type}/{id}")
     */
    public function index(Request $request, $type, $id)
    {
        $content = file_get_contents('http://xivapi.com/'. $type .'/'. $id);
        $market  = file_get_contents('http://xivapi.com/market/hyperion/items/'. $id);
        
        return $this->render('content.html.twig', [
            'content' => json_decode($content, true),
            'market'  => json_decode($market, true)
        ]);
    }
}
