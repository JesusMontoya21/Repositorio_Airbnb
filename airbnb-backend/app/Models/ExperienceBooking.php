<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ExperienceBooking extends Model
{
    protected $fillable = [
        'user_id',
        'experience_id',
        'date',
        'guests',
        'total_price',
        'status',
    ];

    protected $casts = [
        'date'        => 'date',
        'total_price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function experience()
    {
        return $this->belongsTo(Experience::class);
    }
}