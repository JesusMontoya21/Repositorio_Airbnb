<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        // ...
        try {

            $request->validate([
                'nombre' => 'required|string|max:255',
                'email' => 'required|string|email|unique:usuarios',
                'password' => 'required|string|min:6',
            ]);

            $usuario = Usuario::create([
                'nombre' => $request->nombre,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            return response()->json([
                'success' => true,
                'message' => '✅ Usuario registrado con éxito',
                'usuario' => $usuario
            ], 201);

        } catch (\Exception $e) {
            //Log::error($e); 
            return response()->json([
                'success' => false,
                'message' => '❌ Error al registrar usuario'
            ], 500);
        }
    }

    public function login(Request $request)
    {
        // ...
        try {
            $usuario = Usuario::where('email', $request->email)->first();

            if (!$usuario) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ Usuario no encontrado'
                ], 401);
            }

            if (!Hash::check($request->password, $usuario->password)) {
                return response()->json([
                    'success' => false,
                    'message' => '❌ Contraseña incorrecta'
                ], 401);
            }

            $token = 'TOKEN_DE_PRUEBA';

            return response()->json([
                'success' => true,
                'message' => '✅ Inicio de sesión exitoso',
                'token' => $token,
                'usuario' => [
                    'id' => $usuario->id,
                    'nombre' => $usuario->nombre,
                    'email' => $usuario->email,
                ]
            ]);

        } catch (\Exception $e) {
            Log::error($e->getMessage()); // <- Aquí también
            return response()->json([
                'success' => false,
                'message' => '❌ Error al iniciar sesión'
            ], 500);
        }
    }
}

