<?php

namespace App\Filament\Widgets;

use App\Models\Problem;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseWidget;

class LatestProblems extends BaseWidget
{
    protected int | string | array $columnSpan = 'full';
    protected static ?int $sort = 4;
    public function table(Table $table): Table
    {
        return $table
            ->query(Problem::query())
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('title'),
                Tables\Columns\TextColumn::make('category'),
                Tables\Columns\TextColumn::make('points')
            ]);
    }
}
