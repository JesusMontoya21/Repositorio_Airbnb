<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    use HasFactory;

    // Nombre de la tabla en la base de datos
    protected $table = 'usuarios';

    // Campos que se pueden asignar masivamente
    protected $fillable = ['nombre', 'email', 'password'];

    // Campos ocultos cuando se devuelve JSON
    protected $hidden = ['password'];

    /**
     * Crea un usuario nuevo (equivalente a crearUsuario en Node.js)
     */
    public static function crearUsuario($nombre, $email, $password)
    {
        return self::create([
            'nombre' => $nombre,
            'email' => $email,
            'password' => $password
        ]);
    }

    /**
     * Obtiene un usuario por su correo electrónico (equivalente a obtenerUsuarioPorEmail)
     */
    public static function obtenerUsuarioPorEmail($email)
    {
        return self::where('email', $email)->first();
    }
}
