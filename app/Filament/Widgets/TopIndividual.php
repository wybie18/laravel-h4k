<?php

namespace App\Filament\Widgets;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TopIndividual extends BaseWidget
{
    protected static bool $isDiscovered = false;

    public function table(Table $table): Table
    {
        return $table
            ->query(
                User::query()
                    ->select('users.*')
                    ->where('users.role', '!=', 'admin')
                    ->withCount(['submissions as score' => function (Builder $query) {
                        $query->join('problems', 'submissions.problem_id', '=', 'problems.id')
                              ->where('submissions.is_correct', true)
                              ->selectRaw('SUM(problems.points)');
                    }])
                    ->orderByDesc('score')
            )
            ->defaultSort('score', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('score')
            ])
            ->paginated([5, 10, 'all']);
    }
}
