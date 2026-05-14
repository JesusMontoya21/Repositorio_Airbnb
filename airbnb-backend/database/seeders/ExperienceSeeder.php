<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Experience;

class ExperienceSeeder extends Seeder
{
    public function run(): void
    {
        $experiences = [
            ['title' => 'Tour de Mezcalería con cóctel', 'category' => 'Original', 'location' => 'Ciudad de México', 'city' => 'Ciudad de México', 'price' => 1200, 'duration' => '2 horas', 'rating' => 4.95, 'image' => 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400', 'description' => 'Descubre el mundo del mezcal con un guía experto.'],
            ['title' => 'Taller con un estudio de danza especializado', 'category' => 'Original', 'location' => 'Ciudad de México', 'city' => 'Ciudad de México', 'price' => 850, 'duration' => '3 horas', 'rating' => 4.92, 'image' => 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400', 'description' => 'Aprende los pasos básicos de danza con profesionales.'],
            ['title' => 'Sesión de pintura budista sagrada', 'category' => 'Arte', 'location' => 'Ciudad de México', 'city' => 'Ciudad de México', 'price' => 950, 'duration' => '2 horas', 'rating' => 4.88, 'image' => 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', 'description' => 'Aprende técnicas de pintura budista tradicional.'],
            ['title' => 'Clase de tequila artesanal', 'category' => 'Bienestar', 'location' => 'Ciudad de México', 'city' => 'Ciudad de México', 'price' => 780, 'duration' => '1.5 horas', 'rating' => 4.90, 'image' => 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400', 'description' => 'Conoce el proceso de elaboración del tequila artesanal.'],
            ['title' => 'Clase de cocina con degustación de mezcal', 'category' => 'Alimentos', 'location' => 'Ciudad de México', 'city' => 'Ciudad de México', 'price' => 1500, 'duration' => '3 horas', 'rating' => 4.92, 'image' => 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=400', 'description' => 'Aprende a cocinar platillos mexicanos tradicionales.'],
            ['title' => 'Tour a Teotihuacán', 'category' => 'Recorridos', 'location' => 'Teotihuacán', 'city' => 'Ciudad de México', 'price' => 2300, 'duration' => '8 horas', 'rating' => 4.85, 'image' => 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400', 'description' => 'Visita las pirámides de Teotihuacán con guía experto.'],
            ['title' => 'Tour a los Tequilas y Cantaritos', 'category' => 'Alimentos', 'location' => 'Tlaquepaque, Guadalajara', 'city' => 'Guadalajara', 'price' => 1800, 'duration' => '4 horas', 'rating' => 4.93, 'image' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 'description' => 'Degusta los mejores tequilas de la región.'],
            ['title' => 'Ruta del tequila desde Guadalajara', 'category' => 'Recorridos', 'location' => 'Tequila, Jalisco', 'city' => 'Guadalajara', 'price' => 2500, 'duration' => '7 horas', 'rating' => 4.87, 'image' => 'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=400', 'description' => 'Recorre las destilerías más famosas de Jalisco.'],
            ['title' => 'Snorkel en el arrecife de coral', 'category' => 'Deportes', 'location' => 'Cancún', 'city' => 'Cancún', 'price' => 1200, 'duration' => '3 horas', 'rating' => 4.95, 'image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', 'description' => 'Explora el arrecife de coral más grande del Caribe.'],
            ['title' => 'Tour a Chichén Itzá', 'category' => 'Recorridos', 'location' => 'Yucatán', 'city' => 'Cancún', 'price' => 3200, 'duration' => '10 horas', 'rating' => 4.91, 'image' => 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400', 'description' => 'Visita una de las 7 maravillas del mundo moderno.'],
            ['title' => 'Yoga al amanecer en la playa', 'category' => 'Bienestar', 'location' => 'Cancún', 'city' => 'Cancún', 'price' => 650, 'duration' => '1.5 horas', 'rating' => 4.88, 'image' => 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=400', 'description' => 'Practica yoga frente al mar al amanecer.'],
            ['title' => 'Pesca deportiva en alta mar', 'category' => 'Deportes', 'location' => 'Mazatlán', 'city' => 'Mazatlán', 'price' => 2500, 'duration' => '6 horas', 'rating' => 4.90, 'image' => 'https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=400', 'description' => 'Pesca deportiva en las aguas del Pacífico.'],
            ['title' => 'Tour por el centro histórico', 'category' => 'Recorridos', 'location' => 'Mazatlán', 'city' => 'Mazatlán', 'price' => 450, 'duration' => '3 horas', 'rating' => 4.85, 'image' => 'https://images.unsplash.com/photo-1414609245224-aea7079fdc0b?w=400', 'description' => 'Descubre la historia y arquitectura del centro histórico.'],
            ['title' => 'Surf para principiantes', 'category' => 'Deportes', 'location' => 'Mazatlán', 'city' => 'Mazatlán', 'price' => 850, 'duration' => '2 horas', 'rating' => 4.87, 'image' => 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', 'description' => 'Aprende a surfear con instructores certificados.'],
        ];

        foreach ($experiences as $experience) {
            Experience::create($experience);
        }
    }
}