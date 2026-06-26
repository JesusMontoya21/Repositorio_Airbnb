<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    protected $fillable = [
        'property_id',
        'booking_id',
        'guest_user_id',
        'host_user_id',
        'last_message_at',
    ];

    protected $casts = [
        'last_message_at' => 'datetime',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function guest()
    {
        return $this->belongsTo(User::class, 'guest_user_id');
    }

    public function host()
    {
        return $this->belongsTo(User::class, 'host_user_id');
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }

    public function lastMessage()
    {
        return $this->hasOne(Message::class)->latestOfMany();
    }
}
