<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'user_id',
        'property_id',
        'check_in',
        'check_out',
        'guests',
        'total_price',
        'status',
        'reminder_template_sent_at',
        'checkin_template_sent_at',
    ];

    protected $casts = [
        'check_in'    => 'date',
        'check_out'   => 'date',
        'total_price' => 'decimal:2',
        'reminder_template_sent_at' => 'datetime',
        'checkin_template_sent_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function property()
    {
        return $this->belongsTo(Property::class)->with('images');
    }
}