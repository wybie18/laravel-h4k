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
                    ->addSelect([
                        'score' => function ($query) {
                            $query->selectRaw('COALESCE(SUM(points), 0)')
                                  ->from('problems')
                                  ->whereIn('id', function ($subQuery) {
                                      $subQuery->select('problem_id')
                                               ->from('submissions')
                                               ->whereColumn('user_id', 'users.id')
                                               ->where('is_correct', true)
                                               ->distinct();
                                  });
                        }
                    ])
                    ->where('users.role', '!=', 'admin')
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
