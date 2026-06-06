<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['title' => 'Cocina hiperlocal con ingredientes silvestres', 'category' => 'Chefs', 'location' => 'Ciudad de México', 'price' => 1822, 'rating' => 5.0, 'image' => 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=400', 'description' => 'Chef privado con ingredientes locales y silvestres.'],
            ['title' => 'Cena privada de lujo con el chef Matsuhisa', 'category' => 'Chefs', 'location' => 'Cancún', 'price' => 3027, 'rating' => 4.50, 'image' => 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', 'description' => 'Experiencia gastronómica de lujo con chef reconocido.'],
            ['title' => 'Cocina de autor con Cristina', 'category' => 'Chefs', 'location' => 'Monterrey', 'price' => 869, 'rating' => 4.96, 'image' => 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400', 'description' => 'Menú de autor con los mejores ingredientes de temporada.'],
            ['title' => 'Menú mediterráneo de temporada', 'category' => 'Chefs', 'location' => 'Ciudad de México', 'price' => 3129, 'rating' => 4.98, 'image' => 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400', 'description' => 'Deliciosos platillos mediterráneos preparados en casa.'],
            ['title' => 'Entrenamiento personal con Deyten', 'category' => 'Entrenamiento', 'location' => 'Guadalajara', 'price' => 184, 'rating' => 4.71, 'image' => 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400', 'description' => 'Entrenamiento personalizado según tus objetivos.'],
            ['title' => 'Entrenamiento corporal total con Peter', 'category' => 'Entrenamiento', 'location' => 'Ciudad de México', 'price' => 893, 'rating' => 5.0, 'image' => 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400', 'description' => 'Rutina completa de entrenamiento funcional.'],
            ['title' => 'Fitness en grupo y personal', 'category' => 'Entrenamiento', 'location' => 'Monterrey', 'price' => 1534, 'rating' => 5.0, 'image' => 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400', 'description' => 'Clases grupales e individuales de fitness.'],
            ['title' => 'Yoga y meditación con Julia', 'category' => 'Bienestar', 'location' => 'Virtual', 'price' => 460, 'rating' => 4.94, 'image' => 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400', 'description' => 'Sesiones de yoga y meditación para principiantes.'],
            ['title' => 'Relajación y masaje de tejido profundo', 'category' => 'Masaje', 'location' => 'Ciudad de México', 'price' => 950, 'rating' => 5.0, 'image' => 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400', 'description' => 'Masaje relajante y de tejido profundo a domicilio.'],
            ['title' => 'Masaje de aromaterapia con Jenna', 'category' => 'Masaje', 'location' => 'Cancún', 'price' => 3313, 'rating' => 4.89, 'image' => 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400', 'description' => 'Masaje con aceites esenciales de aromaterapia.'],
            ['title' => 'Masaje japonés de té matcha', 'category' => 'Masaje', 'location' => 'Ciudad de México', 'price' => 2701, 'rating' => 4.95, 'image' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400', 'description' => 'Técnica japonesa con extractos de té matcha.'],
            ['title' => 'Spa completo con tratamiento facial', 'category' => 'Belleza', 'location' => 'Cancún', 'price' => 2500, 'rating' => 4.88, 'image' => 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400', 'description' => 'Tratamiento facial completo con productos naturales.'],
        ];

        foreach ($services as $service) {
            Service::create($service);
        }
    }
}