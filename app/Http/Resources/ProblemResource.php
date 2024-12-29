<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class ProblemResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "title" => $this->title,
            "description" => $this->description,
            "flag" => $this->flag,
            "points" => $this->points,
            "category" => $this->category,
            "is_active" => $this->is_active,
            "file_paths" => $this->file_paths
                ? collect(json_decode($this->file_paths, true))->map(fn($path) => Storage::url($path)) 
                : null,
            "created_at" => (new Carbon($this->created_at)) -> format('Y-m-d'),
            "updated_at" => (new Carbon($this->updated_at)) -> format('Y-m-d'),
        ];
    }
}
