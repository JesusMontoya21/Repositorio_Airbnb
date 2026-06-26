<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeasonalPrice extends Model
{
    protected $fillable = [
        'property_id',
        'name',
        'start_date',
        'end_date',
        'price_per_night',
        'priority',
        'is_active',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'price_per_night' => 'decimal:2',
        'priority' => 'integer',
        'is_active' => 'boolean',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
