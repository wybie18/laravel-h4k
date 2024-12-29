<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeamResource;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Team::query();
        $sortField = request("sort_field", "id");
        $sortDirection = request("sort_direction", "asc");
        if (request("search")) {
            $searchTerm = request("search");
            $query->where(function ($q) use ($searchTerm) {
                $q->where("name", "like", "%$searchTerm%")
                  ->orWhere("description", "like", "%$searchTerm%");
            });
        }

        $teams = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);

        return Inertia::render('Admin/Team/Index', [
            "teams" => TeamResource::collection($teams),
            "queryParams" => request()->query() ?: null,
            "success" => session('success'),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);

        Team::create($data);

        return to_route('team.index')->with('success', 'Team created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Team $team)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
        ]);
        $team->update($data);

        return to_route("team.index")->with('success', 'Team "' . $team->name . '" was updated ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        $team->delete();
        return to_route('team.index')->with('success','Team "' . $team->name . '" was deleted ');
    }
}
