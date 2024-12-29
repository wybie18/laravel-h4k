<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProblemResource;
use App\Models\Problem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ProblemController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Problem::query();
        $sortField = request("sort_field", "id");
        $sortDirection = request("sort_direction", "asc");
        if (request("search")) {
            $searchTerm = request("search");
            $query->where(function ($q) use ($searchTerm) {
                $q->where("title", "like", "%$searchTerm%")
                  ->orWhere("description", "like", "%$searchTerm%")
                  ->orWhere("category", "like", "%$searchTerm%");
            });
        }

        $problems = $query->orderBy($sortField, $sortDirection)->paginate(10)->onEachSide(1);
        return Inertia::render('Admin/Problem/Index', [
            "problems" => ProblemResource::collection($problems),
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
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'flag' => 'required|string|max:255',
            'points' => 'required|integer',
            'category' => 'required|string|max:255',
            'files.*' => 'nullable|file|max:10240',
        ]);

        $problem = Problem::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'flag' => $data['flag'],
            'points' => $data['points'],
            'category' => $data['category'],
        ]);
        if ($request->hasFile('files')) {
            $filePaths = [];
            $directory = 'problems/' . Str::slug($data['title'], '_');
            foreach ($request->file('files') as $file) {
                $filePath = $directory . '/' . $file->getClientOriginalName();
                $file->storeAs($directory, $file->getClientOriginalName(), 'public');
                $filePaths[] = $filePath;
            }
            $problem->update(['file_paths' => json_encode($filePaths)]);
        }

        return to_route('problem.index')->with('success', 'Problem created successfully');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Problem $problem)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'flag' => 'required|string|max:255',
            'points' => 'required|integer',
            'category' => 'required|string|max:255',
            'files.*' => 'nullable|file|max:10240',
            'remove_files' => 'nullable|array',
        ]);

        $problem->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'flag' => $data['flag'],
            'points' => $data['points'],
            'category' => $data['category'],
        ]);
        
        $existingFiles = json_decode($problem->file_paths, true) ?? [];
        if (isset($data['remove_files'])) {
            foreach ($data['remove_files'] as $fileToRemove) {
                $fileToRemove = str_replace('/storage/', '', trim($fileToRemove));
                if (($key = array_search($fileToRemove, $existingFiles)) !== false) {
                    unset($existingFiles[$key]);
                    Storage::disk('public')->delete($fileToRemove);
                }
            }
        }        

        if ($request->hasFile('files')) {
            $directory = 'problems/' . Str::slug($data['title'], '_');
            foreach ($request->file('files') as $file) {
                $filePath = $directory . '/' . $file->getClientOriginalName();
                $file->storeAs($directory, $file->getClientOriginalName(), 'public');
                $existingFiles[] = $filePath;
            }
        }

        $problem->update(['file_paths' => json_encode(array_values($existingFiles))]);

        return to_route('problem.index')->with('success', 'Problem updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
