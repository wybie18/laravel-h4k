<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProblemResource;
use App\Models\Problem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChallengesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $problems = Problem::select('id', 'title', 'description', 'points', 'category', 'flag', 'file_paths')
            ->where('is_active', true)
            ->orderBy('category')
            ->orderBy('points')
            ->get()
            ->each(function ($problem) {
                $problem->file_paths = $problem->file_paths
                    ? collect($problem->file_paths)
                        ->map(fn($path) => Storage::url($path))
                    : null;
            })
            ->groupBy('category');

        return Inertia::render('User/Challenges', [
            "problems" => $problems,
            "categories" => array_keys($problems->toArray()),
            "success" => session('success'),
        ]);   
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
