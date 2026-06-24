<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ExperienceBookingController;
use App\Http\Controllers\ServiceBookingController;

// Rutas públicas
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/properties', [PropertyController::class, 'index']);
Route::get('/properties/{id}', [PropertyController::class, 'show']);
Route::get('/properties/{id}/availability', [BookingController::class, 'availability']);
Route::post('/properties/{id}/quote', [BookingController::class, 'quote']);
Route::get('/properties/{id}/reviews', [ReviewController::class, 'index']);
Route::get('/experiences', [ExperienceController::class, 'index']);
Route::get('/experiences/{id}', [ExperienceController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/host/dashboard', [PropertyController::class, 'dashboard']);

// Rutas protegidas
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Perfil
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);

    // Propiedades
    Route::post('/properties', [PropertyController::class, 'store']);
    Route::put('/properties/{id}', [PropertyController::class, 'update']);
    Route::delete('/properties/{id}', [PropertyController::class, 'destroy']);
    Route::get('/my-properties', [PropertyController::class, 'myProperties']);
    Route::get('/host/properties/{id}', [PropertyController::class, 'hostShow']);
    Route::get('/host/properties/{id}/availability', [PropertyController::class, 'hostAvailability']);
    Route::post('/host/properties/{id}/availability-blocks', [PropertyController::class, 'addAvailabilityBlock']);
    Route::delete('/host/properties/{id}/availability-blocks/{blockId}', [PropertyController::class, 'removeAvailabilityBlock']);

    // Reservas de hospedaje
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);
    Route::put('/bookings/{id}/cancel', [BookingController::class, 'cancel']);

    // Reseñas
    Route::post('/properties/{id}/reviews', [ReviewController::class, 'store']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);

    // Favoritos
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites/{propertyId}', [FavoriteController::class, 'toggle']);
    Route::get('/favorites/{propertyId}/check', [FavoriteController::class, 'check']);

    // Experiencias
    Route::post('/experiences', [ExperienceController::class, 'store']);
    Route::delete('/experiences/{id}', [ExperienceController::class, 'destroy']);

    // Reservas de experiencias
    Route::post('/experience-bookings', [ExperienceBookingController::class, 'store']);
    Route::get('/my-experience-bookings', [ExperienceBookingController::class, 'myBookings']);
    Route::put('/experience-bookings/{id}/cancel', [ExperienceBookingController::class, 'cancel']);

    // Servicios
    Route::post('/services', [ServiceController::class, 'store']);
    Route::delete('/services/{id}', [ServiceController::class, 'destroy']);

    // Reservas de servicios
    Route::post('/service-bookings', [ServiceBookingController::class, 'store']);
    Route::get('/my-service-bookings', [ServiceBookingController::class, 'myBookings']);
    Route::put('/service-bookings/{id}/cancel', [ServiceBookingController::class, 'cancel']);
});