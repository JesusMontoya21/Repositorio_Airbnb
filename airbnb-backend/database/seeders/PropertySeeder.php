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
        $user = User::first();

        if (!$user) {
            $user = User::create([
                'name' => 'Admin',
                'email' => 'admin@airbnb.com',
                'password' => bcrypt('12345678'),
            ]);
        }

        $properties = [
            [
                'title' => 'Departamento frente al mar',
                'description' => 'Hermoso departamento con vista al océano, completamente equipado.',
                'city' => 'Mazatlán',
                'address' => 'Av. del Mar 123, Zona Dorada',
                'price_per_night' => 850,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'average_rating' => 4.91,
                'images' => [
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
                ],
            ],
            [
                'title' => 'Casa con alberca privada',
                'description' => 'Casa amplia con alberca privada, ideal para familias.',
                'city' => 'Mazatlán',
                'address' => 'Calle Palmeras 456, Cerritos',
                'price_per_night' => 1200,
                'guests' => 6,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'average_rating' => 4.85,
                'images' => [
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                ],
            ],
            [
                'title' => 'Habitación en zona dorada',
                'description' => 'Acogedora habitación en el corazón de la zona dorada.',
                'city' => 'Mazatlán',
                'address' => 'Av. Camarón Sábalo 789',
                'price_per_night' => 550,
                'guests' => 2,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'average_rating' => 4.78,
                'images' => [
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
                    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
                ],
            ],
            [
                'title' => 'Penthouse con vista al océano',
                'description' => 'Lujoso penthouse con terraza y vista panorámica al océano.',
                'city' => 'Mazatlán',
                'address' => 'Torre del Mar, Piso 15',
                'price_per_night' => 2100,
                'guests' => 8,
                'bedrooms' => 4,
                'bathrooms' => 3,
                'average_rating' => 4.96,
                'images' => [
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800',
                    'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800',
                ],
            ],
            [
                'title' => 'Loft en Providencia',
                'description' => 'Moderno loft en la exclusiva colonia Providencia.',
                'city' => 'Guadalajara',
                'address' => 'Av. Providencia 321',
                'price_per_night' => 780,
                'guests' => 2,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'average_rating' => 4.88,
                'images' => [
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                ],
            ],
            [
                'title' => 'Casa en Zapopan con jardín',
                'description' => 'Amplia casa con jardín privado en Zapopan.',
                'city' => 'Guadalajara',
                'address' => 'Calle Jardines 654, Zapopan',
                'price_per_night' => 950,
                'guests' => 5,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'average_rating' => 4.82,
                'images' => [
                    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
                ],
            ],
            [
                'title' => 'Departamento en Chapalita',
                'description' => 'Cómodo departamento en la tranquila colonia Chapalita.',
                'city' => 'Guadalajara',
                'address' => 'Av. Chapultepec 987, Chapalita',
                'price_per_night' => 650,
                'guests' => 3,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'average_rating' => 4.75,
                'images' => [
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
                ],
            ],
            [
                'title' => 'Villa en zona hotelera',
                'description' => 'Espectacular villa frente al mar Caribe con acceso privado a la playa.',
                'city' => 'Cancún',
                'address' => 'Blvd. Kukulcán Km 12, Zona Hotelera',
                'price_per_night' => 3200,
                'guests' => 10,
                'bedrooms' => 5,
                'bathrooms' => 4,
                'average_rating' => 4.95,
                'images' => [
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                ],
            ],
            [
                'title' => 'Departamento frente al Caribe',
                'description' => 'Departamento moderno con vista al mar Caribe.',
                'city' => 'Cancún',
                'address' => 'Blvd. Kukulcán Km 8, Zona Hotelera',
                'price_per_night' => 1800,
                'guests' => 4,
                'bedrooms' => 2,
                'bathrooms' => 2,
                'average_rating' => 4.87,
                'images' => [
                    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
                    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800',
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                ],
            ],
            [
                'title' => 'Apartamento en Condesa',
                'description' => 'Elegante apartamento en la bohemia colonia Condesa.',
                'city' => 'Ciudad de México',
                'address' => 'Av. Ámsterdam 147, Condesa',
                'price_per_night' => 980,
                'guests' => 3,
                'bedrooms' => 2,
                'bathrooms' => 1,
                'average_rating' => 4.93,
                'images' => [
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
                    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800',
                ],
            ],
            [
                'title' => 'Loft en Roma Norte',
                'description' => 'Acogedor loft en la trendy colonia Roma Norte.',
                'city' => 'Ciudad de México',
                'address' => 'Calle Orizaba 258, Roma Norte',
                'price_per_night' => 750,
                'guests' => 2,
                'bedrooms' => 1,
                'bathrooms' => 1,
                'average_rating' => 4.86,
                'images' => [
                    'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
                    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800',
                    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
                ],
            ],
            [
                'title' => 'Casa en Coyoacán',
                'description' => 'Hermosa casa colonial en el mágico barrio de Coyoacán.',
                'city' => 'Ciudad de México',
                'address' => 'Calle Francisco Sosa 369, Coyoacán',
                'price_per_night' => 1100,
                'guests' => 6,
                'bedrooms' => 3,
                'bathrooms' => 2,
                'average_rating' => 4.89,
                'images' => [
                    'https://images.unsplash.com/photo-1598928636135-d146006ff4be?w=800',
                    'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
                    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
                ],
            ],
        ];

        foreach ($properties as $data) {
            $property = Property::create([
                'user_id'         => $user->id,
                'title'           => $data['title'],
                'description'     => $data['description'],
                'city'            => $data['city'],
                'country'         => 'México',
                'address'         => $data['address'],
                'price_per_night' => $data['price_per_night'],
                'guests'          => $data['guests'],
                'bedrooms'        => $data['bedrooms'],
                'bathrooms'       => $data['bathrooms'],
                'average_rating'  => $data['average_rating'],
                'is_active'       => true,
            ]);

            foreach ($data['images'] as $index => $url) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'url'         => $url,
                    'is_primary'  => $index === 0,
                ]);
            }
        }
    }
}