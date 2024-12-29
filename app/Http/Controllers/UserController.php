<?php

namespace App\Http\Controllers;

use App\Http\Resources\TeamResource;
use App\Http\Resources\UserResource;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = User::where('id', '!=', auth()->id());

        $sortField = request("sort_field", "id");
        $sortDirection = request("sort_direction", "asc");

        if (request("search")) {
            $searchTerm = request("search");
            $query->where(function ($q) use ($searchTerm) {
                $q->where("name", "like", "%$searchTerm%")
                  ->orWhere("username", "like", "%$searchTerm%")
                  ->orWhere("role", "like", "%$searchTerm%")
                  ->orWhereHas('team', function ($teamQuery) use ($searchTerm) {
                      $teamQuery->where("name", "like", "%$searchTerm%");
                  });
            });
        }

        $users = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        $teams = Team::all();
        return Inertia::render('Admin/User/Index', [
            'users' => UserResource::collection($users),
            'teams' => $teams,
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
            "name" => ["required", "string", "max:200"],
            "username" => ["required","string", "max:200", "unique:users,username"],
            "role" => ["required", "string", "in:admin,user"],
            "team_id" => ["nullable", "exists:teams,id"],
            "password"=> [
                "required",
                "confirmed",
                Password::min(8)->letters()->symbols(),
            ],
        ]);
        $data['password'] = bcrypt($data['password']);
        User::create($data);

        return to_route('user.index')->with('success', 'User created successfully');
    }
    
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            "name" => ["required", "string", "max:200"],
            "username" => ["required","string", "max:200", Rule::unique('users', 'username')->ignore($user->id)],
            "role" => ["required", "string", "in:admin,user"],
            "team_id" => ["nullable", "exists:teams,id"],
            "password"=> [
                "nullable",
                "confirmed",
                Password::min(8)->letters()->symbols(),
            ],
        ]);
        $password = $data['password'] ?? null;
        if ($password){
            $data['password'] = bcrypt($password);
        }else{
            unset($data['password']);
        }
        $user->update($data);
        return to_route("user.index")->with('success', 'User "' . $user->name . '" was updated ');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
        return to_route('user.index')->with('success','User "' . $user->name . '" was deleted ');
    }
}
