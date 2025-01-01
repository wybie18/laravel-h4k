<?php

namespace App\Http\Middleware;

use Filament\Http\Middleware\Authenticate;
use Filament\Facades\Filament;
use Illuminate\Database\Eloquent\Model;
use Filament\Models\Contracts\FilamentUser;

class CustomAuth extends Authenticate
{
    protected function authenticate($request, array $guards): void
    {
        $guard = Filament::auth();

        if (! $guard->check()) {
            $this->unauthenticated($request, $guards);

            return; /** @phpstan-ignore-line */
        }

        $this->auth->shouldUse(Filament::getAuthGuard());

        /** @var Model $user */
        $user = $guard->user();

        if (!$user->hasRole('admin')) {
            abort(403, 'You must be an admin to access this panel.');
        }

        $panel = Filament::getCurrentPanel();

        abort_if(
            $user instanceof FilamentUser ?
                (! $user->canAccessPanel($panel)) :
                (config('app.env') !== 'local'),
            403,
        );
    }
}
