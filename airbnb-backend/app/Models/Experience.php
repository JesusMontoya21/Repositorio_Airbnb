<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'location',
        'city',
        'price',
        'duration',
        'image',
        'rating',
        'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}