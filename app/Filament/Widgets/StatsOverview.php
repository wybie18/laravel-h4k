<?php

namespace App\Filament\Widgets;

use App\Models\Problem;
use App\Models\Team;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected static ?int $sort = 1;
    protected function getStats(): array
    {
        return [
            Stat::make('Teams', Team::query()->count())
                ->description('Total registered teams')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('success')
                ->url(route('filament.admin.resources.teams.index')),
            Stat::make('Users', User::query()->count())
                ->description('Total registered users')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('success')
                ->url(route('filament.admin.resources.users.index')),
            Stat::make('Problems', Problem::query()->count())
                ->description('Total registered problems')
                ->chart([7, 2, 10, 3, 15, 4, 17])
                ->color('success')
                ->url(route('filament.admin.resources.problems.index')),
        ];
    }
}
