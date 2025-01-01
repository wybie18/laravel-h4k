<?php

namespace App\Livewire;

use Filament\Forms\Components\Section;
use Joaopaulolndev\FilamentEditProfile\Livewire\EditProfileForm;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;

class CustomEditProfileForm extends EditProfileForm
{
    public function mount(): void
    {
        $this->user = $this->getUser();

        $this->userClass = get_class($this->user);

        $this->form->fill($this->user->only(config('filament-edit-profile.avatar_column', 'avatar_url'), 'name', 'username'));
    }
    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Section::make(__('Profile Information'))
                    ->aside()
                    ->description(__('Update your profile information'))
                    ->schema([
                        TextInput::make('name')
                            ->label(__('Name'))
                            ->required(),
                        TextInput::make('username')
                            ->label(__('Username'))
                            ->required()
                            ->unique($this->userClass, ignorable: $this->user),
                    ]),
            ])
            ->statePath('data');
    }
}
