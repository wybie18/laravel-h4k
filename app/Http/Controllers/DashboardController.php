<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $team = $user->team;

        $teamMembers = DB::table('users')
            ->where('team_id', $team->id)
            ->get();

        $teamData = $teamMembers->map(function ($member) {
            $stats = DB::table('submissions')
                ->join('problems', 'submissions.problem_id', '=', 'problems.id')
                ->where('submissions.user_id', $member->id)
                ->select(
                    DB::raw('COUNT(DISTINCT submissions.problem_id) as problems_solved'),
                    DB::raw('SUM(CASE WHEN submissions.is_correct = 1 THEN problems.points ELSE 0 END) as total_score')
                )
                ->first();
    
            return [
                'username' => $member->username,
                'problems_solved' => $stats->problems_solved,
                'total_score' => $stats->total_score,
            ];
        });

        $timeGroups = DB::table('submissions')
            ->join('users', 'submissions.user_id', '=', 'users.id')
            ->where('users.team_id', $team->id)
            ->select(DB::raw("DATE_FORMAT(submissions.created_at, '%Y-%m-%d %H:%i:00') as time_group"))
            ->distinct()
            ->orderBy('time_group')
            ->pluck('time_group');

        $userScores = DB::table('users')
            ->join('submissions', 'users.id', '=', 'submissions.user_id')
            ->join('problems', 'submissions.problem_id', '=', 'problems.id')
            ->where('users.team_id', $team->id)
            ->select(
                'users.username as username',
                DB::raw('SUM(CASE WHEN submissions.is_correct = 1 THEN problems.points ELSE 0 END) as total_score'),
                DB::raw("DATE_FORMAT(submissions.created_at, '%Y-%m-%d %H:%i:00') as time_group")
            )
            ->groupBy('users.id', 'users.username', 'time_group')
            ->orderBy('time_group')
            ->get()
            ->groupBy('username');

        $usersTeamData = $userScores->map(function ($scores, $username) use ($timeGroups) {
            $timeScores = collect($scores)->keyBy('time_group');
            $runningTotal = 0;

            $normalizedScores = $timeGroups->map(function ($timeGroup) use ($timeScores, &$runningTotal) {
                $currentScore = $timeScores->get($timeGroup)->total_score ?? 0;
                $runningTotal += $currentScore;
                return [
                    'time_group' => $timeGroup,
                    'total_score' => $runningTotal,
                ];
            });

            return [
                'times' => $normalizedScores->pluck('time_group'),
                'scores' => $normalizedScores->pluck('total_score'),
            ];
        });

        $submissionStats = DB::table('submissions')
            ->join('users', 'submissions.user_id', '=', 'users.id')
            ->where('users.team_id', $team->id)
            ->select(
                DB::raw('SUM(CASE WHEN submissions.is_correct = 1 THEN 1 ELSE 0 END) as correct'),
                DB::raw('SUM(CASE WHEN submissions.is_correct = 0 THEN 1 ELSE 0 END) as incorrect'),
                DB::raw('COUNT(*) as total')
            )
            ->first();

        $progressStats = DB::table('problems')
            ->select(
                DB::raw('COUNT(DISTINCT problems.id) as total_problems'),
                DB::raw('SUM(CASE WHEN submissions.is_correct = 1 THEN 1 ELSE 0 END) as solved')
            )
            ->leftJoin('submissions', 'problems.id', '=', 'submissions.problem_id')
            ->whereIn('submissions.user_id', function ($query) use ($team) {
                $query->select('id')->from('users')->where('team_id', $team->id);
            })
            ->first();

        return Inertia::render('User/Dashboard', [
            'teamName' => $team->name,
            'teamData' => $teamData,
            'usersTeamData' => $usersTeamData,
            'submissionStats' => [
                'correct' => $submissionStats->total > 0 ? ($submissionStats->correct / $submissionStats->total) * 100 : 0,
                'incorrect' => $submissionStats->total > 0 ? ($submissionStats->incorrect / $submissionStats->total) * 100 : 0,
            ],
            'progressStats' => [
                'solved' => $progressStats->total_problems > 0 ? ($progressStats->solved / $progressStats->total_problems) * 100 : 0,
                'unsolved' => $progressStats->total_problems > 0 ? (($progressStats->total_problems - $progressStats->solved) / $progressStats->total_problems) * 100 : 0,
            ],
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
