<?php

namespace App\Http\Controllers;

use App\Events\SocketChallenges;
use App\Models\Problem;
use App\Models\Submission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChallengesController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $team = $user->team;
        
        $problems = Problem::select('id', 'title', 'description', 'points', 'category', 'flag', 'file_paths')
            ->where('is_active', true)
            ->orderBy('category')
            ->orderBy('points')
            ->get()
            ->each(function ($problem) use ($team) {
                $problem->file_paths = $problem->file_paths
                ? collect($problem->file_paths)
                    ->map(fn($path) => Storage::url($path))
                : null;

                $problem->is_solved = Submission::where('problem_id', $problem->id)
                ->whereHas('user', function ($query) use ($team) {
                    $query->where('team_id', $team->id);
                })
                ->where('is_correct', true)
                ->exists();
            })
            ->groupBy('category');

        return Inertia::render('User/Challenges', [
            "problems" => $problems,
            "categories" => array_keys($problems->toArray()),
            "status_message" => session('status_message'),
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
        $request->validate([
            'problem_id' => 'required|exists:problems,id',
            'flag' => 'required|string',
        ]);

        $user = $request->user();
        $problem = Problem::findOrFail($request->problem_id);

        $isCorrect = $problem->flag === $request->flag;

        $team = $user->team;
        $alreadySolved = Submission::where('problem_id', $problem->id)
            ->whereHas('user', function ($query) use ($team) {
                $query->where('team_id', $team->id);
            })
            ->where('is_correct', true)
            ->exists();

        if ($alreadySolved) {
            return to_route("challenges")->with('status_message', [
                'type' => 'success',
                'message' => 'Your team already solved this problem!',
            ]);
        }

        Submission::create([
            'user_id' => $user->id,
            'problem_id' => $problem->id,
            'is_correct' => $isCorrect,
        ]);

        if ($isCorrect) {
            $team->increment('score', $problem->points);

            broadcast(new SocketChallenges($problem->id, $team));

            return to_route("challenges")->with('status_message', [
                'type' => 'success',
                'message' => 'Flag correct!',
            ]);
        }

        return to_route("challenges")->with('status_message', [
            'type' => 'error',
            'message' => 'Incorrect flag. Try again!',
        ]);
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
