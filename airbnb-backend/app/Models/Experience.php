<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    // Esto permite que Laravel acepte los datos del Seeder
    protected $fillable = [
        'title',
        'location',
        'category',
        'duration',
        'price',
        'rating',
        'image',
    ];
}