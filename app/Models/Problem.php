<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Problem extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'flag',
        'points',
        'file_paths',
        'category',
        'is_active'
    ];

    protected $casts = [
        'file_paths' => 'array',
    ];
    public function submissions() {
        return $this->hasMany(Submission::class);
    }
    
}
