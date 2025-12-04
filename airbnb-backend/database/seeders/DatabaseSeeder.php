<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Faker\Factory as FakerFactory;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Usuario fijo (no necesita Faker)
        User::create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'remember_token' => Str::random(10),
        ]);

        // Otros usuarios fijos adicionales
        User::create([
            'name' => 'Airbnb',
            'email' => 'airbnb@airbnb.com',
            'email_verified_at' => now(),
            'password' => Hash::make('airbnb123'), // contraseña conocida
            'remember_token' => Str::random(10),
        ]);
    }
}
