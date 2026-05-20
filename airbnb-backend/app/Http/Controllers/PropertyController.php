<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\PropertyImage;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with('images')->where('is_active', true);

        if ($request->city) {
    $query->where(function($q) use ($request) {
        $q->where('city', 'like', '%' . $request->city . '%')
          ->orWhere('title', 'like', '%' . $request->city . '%');
            });
        }

        if ($request->guests) {
            $query->where('guests', '>=', $request->guests);
        }

        if ($request->min_price) {
            $query->where('price_per_night', '>=', $request->min_price);
        }

        if ($request->max_price) {
            $query->where('price_per_night', '<=', $request->max_price);
        }

        $properties = $query->latest()->paginate(20);

        return response()->json($properties);
    }

    public function show($id)
    {
        $property = Property::with(['images', 'user'])->findOrFail($id);
        return response()->json($property);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'           => 'required|string|max:255',
            'description'     => 'required|string',
            'city'            => 'required|string',
            'country'         => 'sometimes|string',
            'address'         => 'required|string',
            'price_per_night' => 'required|numeric|min:1',
            'guests'          => 'required|integer|min:1',
            'bedrooms'        => 'required|integer|min:0',
            'bathrooms'       => 'required|numeric|min:0.5',
            'type'            => 'sometimes|string',
            'images'          => 'sometimes|array',
            'images.*'        => 'url',
        ]);

        $property = Property::create([
            'user_id'         => $request->user()->id,
            'title'           => $data['title'],
            'description'     => $data['description'],
            'city'            => $data['city'],
            'country'         => $data['country'] ?? 'México',
            'address'         => $data['address'],
            'price_per_night' => $data['price_per_night'],
            'guests'          => $data['guests'],
            'bedrooms'        => $data['bedrooms'],
            'bathrooms'       => $data['bathrooms'],
            'type'            => $data['type'] ?? 'apartment',
        ]);

        if (!empty($data['images'])) {
            foreach ($data['images'] as $index => $url) {
                PropertyImage::create([
                    'property_id' => $property->id,
                    'url'         => $url,
                    'is_primary'  => $index === 0,
                ]);
            }
        }

        return response()->json($property->load('images'), 201);
    }

    public function update(Request $request, $id)
    {
        $property = Property::where('user_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'title'           => 'sometimes|string|max:255',
            'description'     => 'sometimes|string',
            'city'            => 'sometimes|string',
            'address'         => 'sometimes|string',
            'price_per_night' => 'sometimes|numeric|min:1',
            'guests'          => 'sometimes|integer|min:1',
            'bedrooms'        => 'sometimes|integer|min:0',
            'bathrooms'       => 'sometimes|numeric|min:0.5',
            'is_active'       => 'sometimes|boolean',
        ]);

        $property->update($data);

        return response()->json($property->load('images'));
    }

    public function destroy(Request $request, $id)
    {
        $property = Property::where('user_id', $request->user()->id)->findOrFail($id);
        $property->delete();
        return response()->json(['message' => 'Propiedad eliminada correctamente']);
    }

    public function myProperties(Request $request)
    {
        $properties = Property::with('images')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($properties);
    }
}