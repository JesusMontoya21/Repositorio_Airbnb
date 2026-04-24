<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        return response()->json($request->user());
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name'                  => 'sometimes|string|max:255',
            'email'                 => 'sometimes|email|unique:users,email,' . $user->id,
            'password'              => 'sometimes|string|min:6|confirmed',
            'current_password'      => 'required_with:password|string',
        ]);

        if (isset($data['password'])) {
            if (!Hash::check($request->current_password, $user->password)) {
                return response()->json(['message' => 'La contraseña actual es incorrecta'], 422);
            }
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        return response()->json([
            'message' => 'Perfil actualizado correctamente',
            'user'    => $user->fresh(),
        ]);
    }
}