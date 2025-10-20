<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sactum')->get('/user', function (Request $request){
    return $request->user();
});

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
