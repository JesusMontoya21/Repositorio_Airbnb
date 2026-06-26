<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PropertyAvailabilityBlock extends Model
{
    protected $fillable = [
        'property_id',
        'start_date',
        'end_date',
        'reason',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
