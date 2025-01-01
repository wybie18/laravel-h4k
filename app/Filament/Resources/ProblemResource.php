<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProblemResource\Pages;
use App\Models\Problem;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Infolists\Components\Grid;
use Filament\Infolists\Components\Section;
use Filament\Infolists\Components\TextEntry;
use Filament\Infolists\Infolist;
use Filament\Resources\Resource;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Actions\ActionGroup;
use Filament\Tables\Table;

class ProblemResource extends Resource
{
    protected static ?string $model = Problem::class;

    protected static ?string $navigationIcon = 'heroicon-o-clipboard-document';
    protected static ?int $navigationSort = 5;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('flag')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('points')
                    ->required()
                    ->numeric(),
                Forms\Components\FileUpload::make('file_paths')
                    ->multiple()
                    ->disk('public')
                    ->directory('problems/files')
                    ->maxFiles(5)
                    ->preserveFilenames()
                    ->previewable(false)
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('category')
                    ->required()
                    ->maxLength(255),
                Forms\Components\Toggle::make('is_active')
                    ->required(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('flag')
                    ->searchable(),
                Tables\Columns\TextColumn::make('points')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('category')
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('file_paths')
                    ->label('Files')
                    ->listWithLineBreaks()
                    ->formatStateUsing(function ($state) {
                        if ($state === "None") {
                            return '<span>No files</span>';
                        }

                        $files = explode(', ', $state);
                        return collect($files)
                            ->map(function ($file) {
                                $url = asset('storage/' . $file);
                                return "<a href='{$url}' target='_blank' class='text-blue-500 underline'>Download</a>";
                            })
                            ->join('<br>');
                    })
                    ->default('None')
                    ->html(),
                Tables\Columns\IconColumn::make('is_active')
                    ->boolean(),
                Tables\Columns\TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                ActionGroup::make([
                    Tables\Actions\ViewAction::make(),
                    Tables\Actions\EditAction::make(),
                    Tables\Actions\DeleteAction::make(),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProblems::route('/'),
            'create' => Pages\CreateProblem::route('/create'),
            'edit' => Pages\EditProblem::route('/{record}/edit'),
            'view' => Pages\ViewProblem::route('/{record}/view'),
        ];
    }

    public static function infolist(Infolist $infolist): Infolist
    {
        return $infolist
            ->schema([
                Section::make()
                ->schema([
                    TextEntry::make('title')
                        ->weight(FontWeight::Bold),
                    TextEntry::make('description'),
                    Grid::make(2)
                        ->schema([
                            TextEntry::make('flag'),
                            TextEntry::make('points')
                                ->numeric()
                                ->color('primary'),
                        ]),
                    TextEntry::make('category')
                        ->badge()
                        ->formatStateUsing(fn($state) => strtoupper($state)),
                    TextEntry::make('file_paths')
                        ->label('Files')
                        ->formatStateUsing(function ($state) {
                            if ($state === 'None') {
                                return '<span class="text-gray-500">No files available</span>';
                            }

                            $files = explode(', ', $state);
                            return collect($files)
                                ->map(function ($file) {
                                    $url = asset('storage/' . $file);
                                    $filename = str_replace('problems/files/', '', $file);
                                    return "<a href='{$url}' target='_blank' class='text-blue-500 underline'>{$filename}</a>";
                                })
                                ->join('<br>');
                        })
                        ->default('None')
                        ->html(),
                ]),
            ]);
    }
}
