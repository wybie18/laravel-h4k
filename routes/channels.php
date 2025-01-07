<?php

use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('online', function ($user) {
    return $user;
});

Broadcast::channel('team.{teamId}', function (User $user, $teamId) {
    return $user->team_id === (int) $teamId;
});