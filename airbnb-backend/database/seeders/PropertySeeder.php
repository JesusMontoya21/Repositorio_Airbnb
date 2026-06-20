<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\User;

class PropertySeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buscamos o creamos un usuario anfitrión para asociarle las casas
        $user = User::first() ?? User::create([
            'name' => 'Anfitrión de Prueba',
            'email' => 'anfitrion@test.com',
            'password' => bcrypt('password123')
        ]);

        $p1 = Property::create([
            'user_id' => $user->id,
            'title' => 'Moderna Casa con Alberca',
            'description' => 'Disfruta de una estancia de lujo con todas las comodidades.',
            'city' => 'Culiacán',
            'country' => 'México',
            'address' => 'Residencial Primaveras #456',
            'price_per_night' => 2450.00,
            'guests' => 6,
            'bedrooms' => 3,
            'bathrooms' => 2.5,
            'type' => 'house',
            'is_active' => true,
        ]);

        PropertyImage::create([
            'property_id' => $p1->id,
            'url' => 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=700',
            'is_primary' => true
        ]);

        $p2 = Property::create([
            'user_id' => $user->id,
            'title' => 'Loft Céntrico Estilo Industrial',
            'description' => 'Perfecto para viajes de negocios o parejas en el corazón de la ciudad.',
            'city' => 'Culiacán',
            'country' => 'México',
            'address' => 'Av. Álvaro Obregón #12',
            'price_per_night' => 980.00,
            'guests' => 2,
            'bedrooms' => 1,
            'bathrooms' => 1.0,
            'type' => 'apartment',
            'is_active' => true,
        ]);

        PropertyImage::create([
            'property_id' => $p2->id,
            'url' => 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=700',
            'is_primary' => true
        ]);
    }
}