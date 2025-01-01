<?php

namespace App\Filament\Widgets;

use App\Models\Team;
use Filament\Widgets\ChartWidget;
use Flowframe\Trend\Trend;
use Flowframe\Trend\TrendValue;

class TeamsChart extends ChartWidget
{
    protected static ?string $heading = 'Teams Chart';
    protected static string $color = 'info';
    protected static ?int $sort = 2;

    protected function getData(): array
    {
        $data = Trend::model(Team::class)
        ->between(
            start: now()->startOfMonth(),
            end: now()->endOfMonth(),
        )
        ->perWeek()
        ->count();
 
        return [
            'datasets' => [
                [
                    'label' => 'Teams',
                    'data' => $data->map(fn (TrendValue $value) => $value->aggregate),
                ],
            ],
            'labels' => $data->map(fn (TrendValue $value) => $value->date),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
