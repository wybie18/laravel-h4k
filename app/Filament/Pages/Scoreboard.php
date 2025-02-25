<?php

namespace App\Filament\Pages;

use App\Filament\Widgets\ScoreboardChart;
use App\Filament\Widgets\TopIndividual;
use App\Filament\Widgets\TopTeam;
use Filament\Pages\Page;

class Scoreboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-chart-bar';

    protected static string $view = 'filament.pages.scoreboard';
    protected static ?int $navigationSort = 0;

    protected function getHeaderWidgets(): array
    {
        return [
            ScoreboardChart::class,
            TopTeam::class,
            TopIndividual::class
        ];
    }
}
