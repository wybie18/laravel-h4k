<?php

namespace App\Filament\Widgets;

use App\Models\Submission;
use App\Models\Team;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class ScoreboardChart extends ChartWidget
{
    protected static ?string $heading = 'Score Progression';
    protected static bool $isDiscovered = false;
    protected static bool $isLazy = true;
    protected int | string | array $columnSpan = 'full';

    protected function getData(): array
    {
        $firstSolves = Submission::select([
            'users.team_id',
            'submissions.problem_id',
            DB::raw('MIN(submissions.created_at) as first_submission_time'),
        ])
        ->join('users', 'submissions.user_id', '=', 'users.id')
        ->where('submissions.is_correct', true)
        ->groupBy('users.team_id', 'submissions.problem_id');

        $teamScores = DB::table(DB::raw("({$firstSolves->toSql()}) as first_solves"))
            ->mergeBindings($firstSolves->getQuery())
            ->join('problems', 'first_solves.problem_id', '=', 'problems.id')
            ->join('teams', 'first_solves.team_id', '=', 'teams.id')
            ->select(
                'teams.name as team_name',
                DB::raw("SUM(problems.points) as total_score"),
                DB::raw("DATE_FORMAT(first_solves.first_submission_time, '%Y-%m-%d %H:%i') as time_group")
            )
            ->groupBy('teams.id', 'teams.name', 'time_group')
            ->orderBy('time_group')
            ->get()
            ->groupBy('team_name');

        $timeGroups = $teamScores->flatMap(fn ($scores) => $scores->pluck('time_group'))
            ->unique()
            ->sort()
            ->values();

        $datasets = $teamScores->map(function ($scores, $teamName) use ($timeGroups) {
            $scoresByTime = $scores->keyBy('time_group');
            $cumulativeScore = 0;
            $dataPoints = collect();

            foreach ($timeGroups as $time) {
                $cumulativeScore += $scoresByTime->get($time)->total_score ?? 0;
                $dataPoints->push($cumulativeScore);
            }

            if ($timeGroups->isNotEmpty()) {
                $dataPoints->prepend(0);
            }

            return [
                'label' => $teamName,
                'data' => $dataPoints->all(),
                'borderColor' => $this->getTeamColor($teamName),
                'fill' => false,
            ];
        })->values();

        $labels = $timeGroups->map(fn ($time) => substr($time, 11, 5));
        if ($timeGroups->isNotEmpty()) {
            $labels->prepend('Start');
        }

        return [
            'labels' => $labels->all(),
            'datasets' => $datasets->all(),
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }

    protected function getOptions(): array
    {
        return [
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Score'
                    ]
                ],
                'x' => [
                    'title' => [
                        'display' => true,
                        'text' => 'Time'
                    ]
                ]
            ],
            'elements' => [
                'line' => [
                    'tension' => 0.4
                ]
            ]
        ];
    }

    private function getTeamColor(string $teamName): string
    {
        $colors = [
            '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236',
            '#166a8f', '#00a950', '#58595b', '#8549ba', '#4dc9f6',
        ];
        
        return $colors[crc32($teamName) % count($colors)];
    }
}