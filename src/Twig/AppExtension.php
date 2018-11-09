<?php

namespace App\Twig;

use App\Service\Common\Environment;
use App\Service\Common\SiteVersion;
use Carbon\Carbon;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;

class AppExtension extends AbstractExtension
{
    public function getFilters()
    {
        return [
            new TwigFilter('splitWordByCapitalLetters', [$this, 'splitWordByCapitalLetters']),
        ];
    }
    
    public function getFunctions()
    {
        return [];
    }
    
    public function splitWordByCapitalLetters($string)
    {
        return preg_replace('/(?<!\ )[A-Z]/', ' $0', $string);
    }
}
