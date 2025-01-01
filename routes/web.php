<?php

use App\Http\Controllers\ChallengesController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TeamController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Route::middleware(['auth', 'verified', 'admin'])->group(function () {
//     Route::get('/admin/dashboard', [DashboardController::class, 'index'])->name('dashboard');

//     Route::get('/admin/team', [TeamController::class, 'index'])->name('team.index');
//     Route::post('/admin/team', [TeamController::class, 'store'])->name('team.store');
//     Route::delete('/admin/team/{team}', [TeamController::class, 'destroy'])->name('team.destroy');
//     Route::put('/admin/team/{team}', [TeamController::class, 'update'])->name('team.update');

//     Route::get('/admin/user', [UserController::class, 'index'])->name('user.index');
//     Route::post('/admin/user', [UserController::class, 'store'])->name('user.store');
//     Route::delete('/admin/user/{user}', [UserController::class, 'destroy'])->name('user.destroy');
//     Route::put('/admin/user/{user}', [UserController::class, 'update'])->name('user.update');

//     Route::get('/admin/problem', [ProblemController::class, 'index'])->name('problem.index');
//     Route::post('/admin/problem', [ProblemController::class, 'store'])->name('problem.store');
//     Route::put('/admin/problem/{problem}', [ProblemController::class, 'update'])->name('problem.update');
//     Route::delete('/admin/problem/{problem}', [ProblemController::class, 'destroy'])->name('problem.destroy');
// });

Route::middleware(['auth:web', 'verified', 'participant'])->group(function () {
    Route::get('/challenges', [ChallengesController::class, 'index'])->name('challenges');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
