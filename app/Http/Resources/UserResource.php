<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = null;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "name" => $this->name,
            "username" => $this->username,
            "role" => $this->role,
            "team" => new TeamResource($this->team),
            "created_at" => (new Carbon($this->created_at)) -> format('Y-m-d'),
            "updated_at" => (new Carbon($this->updated_at)) -> format('Y-m-d'),
        ];
    }
}
