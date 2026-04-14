<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('city');
            $table->string('country')->default('México');
            $table->string('address');
            $table->decimal('price_per_night', 10, 2);
            $table->integer('guests');
            $table->integer('bedrooms');
            $table->integer('bathrooms');
            $table->string('type')->default('apartment');
            $table->decimal('average_rating', 3, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};