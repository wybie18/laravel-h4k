<?php

namespace App\Filament\Widgets;

use App\Models\Submission;
use App\Models\Team;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class ScoreboardChart extends ChartWidget
{
    protected static ?string $heading = 'Chart';
    protected static bool $isDiscovered = false;
    protected static bool $isLazy = true;
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $teamScores = Submission::join('users', 'submissions.user_id', '=', 'users.id')
            ->join('teams', 'users.team_id', '=', 'teams.id')
            ->join('problems', 'submissions.problem_id', '=', 'problems.id')
            ->where('submissions.is_correct', true)
            ->select(
                'teams.name as team_name',
                DB::raw("SUM(problems.points) as total_score"),
                DB::raw("DATE_FORMAT(submissions.created_at, '%Y-%m-%d %H:%i') as time_group")
            )
            ->groupBy('teams.id', 'teams.name', 'time_group')
            ->orderBy('time_group')
            ->get()
            ->groupBy('team_name');

        $timeGroups = $teamScores->flatMap(function ($scores) {
            return $scores->pluck('time_group');
        })->unique()->sort()->values();

        $datasets = $teamScores->map(function ($scores, $teamName) use ($timeGroups) {
            $scoresByTime = $scores->keyBy('time_group');
            $runningTotal = 0;

            $data = $timeGroups->map(function ($time) use ($scoresByTime, &$runningTotal) {
                $runningTotal += $scoresByTime->get($time)->total_score ?? 0;
                return $runningTotal;
            });

            return [
                'label' => $teamName,
                'data' => $data,
                'borderColor' => '#' . substr(md5($teamName), 0, 6),
                'fill' => false,
            ];
        })->values();

        $timeGroups = $timeGroups->map(function ($time) {
            return substr($time, 11, 5);
        });
        
        return [
            'labels' => $timeGroups->values()->all(),
            'datasets' => $datasets->all(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
