<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Favorite;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $favorites = Favorite::with('property')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($favorites);
    }

    public function toggle(Request $request, $propertyId)
    {
        $existing = Favorite::where('user_id', $request->user()->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json(['favorited' => false]);
        }

        Favorite::create([
            'user_id'     => $request->user()->id,
            'property_id' => $propertyId,
        ]);

        return response()->json(['favorited' => true]);
    }

    public function check(Request $request, $propertyId)
    {
        $exists = Favorite::where('user_id', $request->user()->id)
            ->where('property_id', $propertyId)
            ->exists();

        return response()->json(['favorited' => $exists]);
    }
}