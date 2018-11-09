<?php

namespace App\Controller;

use App\Utils\Servers;
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
        $content = file_get_contents("http://xivapi.com/{$type}/{$id}");
        $content = json_decode($content, true);

        return $this->render('content.html.twig', [
            'content'  => $content,
            'servers'  => Servers::LIST,
        ]);
    }
    
    /**
     * @Route("/companion/market-prices/{server}/{id}")
     */
    public function ajaxMarketPrices(Request $request, $server, $id)
    {
        $market = @file_get_contents("http://xivapi.com/market/{$server}/items/{$id}");
        $market = json_decode($market, true);
        
        // work out cheapest
        $cheapest = 9999999999999;
        foreach ($market['Prices'] as $row) {
            if ($row['PriceTotal'] < $cheapest) {
                $cheapest = $row['PriceTotal'];
            }
        }
        
        if ($market === false) {
            return $this->render('content.market-prices-none.html.twig', [
                'server' => $server,
            ]);
        }
        
        return $this->render('content.market-prices.html.twig', [
            'market'   => $market,
            'server'   => $server,
            'cheapest' => $cheapest,
        ]);
    }
}
