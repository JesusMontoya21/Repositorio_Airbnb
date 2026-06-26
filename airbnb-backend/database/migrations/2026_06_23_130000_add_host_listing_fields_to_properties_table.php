<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->json('amenities')->nullable()->after('type');
            $table->json('house_rules')->nullable()->after('amenities');
            $table->string('cancellation_policy')->default('flexible')->after('house_rules');
            $table->string('booking_preference')->default('approve_first')->after('cancellation_policy');
            $table->string('guest_preference')->default('any_guest')->after('booking_preference');
        });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn([
                'amenities',
                'house_rules',
                'cancellation_policy',
                'booking_preference',
                'guest_preference',
            ]);
        });
    }
};
