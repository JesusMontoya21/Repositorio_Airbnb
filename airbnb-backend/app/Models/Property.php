<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'description',
        'city',
        'country',
        'address',
        'price_per_night',
        'guests',
        'bedrooms',
        'bathrooms',
        'type',
        'amenities',
        'house_rules',
        'cancellation_policy',
        'booking_preference',
        'guest_preference',
        'average_rating',
        'is_active',
    ];

    protected $casts = [
        'price_per_night' => 'decimal:2',
        'average_rating'  => 'decimal:2',
        'is_active'       => 'boolean',
        'amenities'       => 'array',
        'house_rules'     => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function images()
    {
        return $this->hasMany(PropertyImage::class);
    }

    public function bookings()
    {
        return $this->hasMany(\App\Models\Booking::class);
    }

    public function reviews()
    {
        return $this->hasMany(\App\Models\Review::class);
    }

    public function seasonalPrices()
    {
        return $this->hasMany(\App\Models\SeasonalPrice::class);
    }

    public function availabilityBlocks()
    {
        return $this->hasMany(\App\Models\PropertyAvailabilityBlock::class);
    }
}