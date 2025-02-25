<?php

namespace App\Filament\Widgets;

use App\Models\Team;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class TopTeam extends BaseWidget
{
    protected static bool $isDiscovered = false;
    public function table(Table $table): Table
    {
        return $table
            ->query(Team::query())
            ->defaultSort('score', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name'),
                Tables\Columns\TextColumn::make('score')
            ])
            ->paginated([5, 10, 'all']);
    }
}
