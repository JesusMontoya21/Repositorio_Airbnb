<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Property;

class ReviewController extends Controller
{
    public function store(Request $request, $propertyId)
    {
        $data = $request->validate([
            'rating'  => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10',
        ]);

        $existing = Review::where('user_id', $request->user()->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Ya escribiste una reseña para esta propiedad'], 422);
        }

        $review = Review::create([
            'user_id'     => $request->user()->id,
            'property_id' => $propertyId,
            'rating'      => $data['rating'],
            'comment'     => $data['comment'],
        ]);

        $property = Property::find($propertyId);
        $avgRating = Review::where('property_id', $propertyId)->avg('rating');
        $property->update(['average_rating' => round($avgRating, 2)]);

        return response()->json($review->load('user'), 201);
    }

    public function index($propertyId)
    {
        $reviews = Review::with('user')
            ->where('property_id', $propertyId)
            ->latest()
            ->get();

        return response()->json($reviews);
    }

    public function destroy(Request $request, $id)
    {
        $review = Review::where('user_id', $request->user()->id)->findOrFail($id);
        $propertyId = $review->property_id;
        $review->delete();

        $property = Property::find($propertyId);
        $avgRating = Review::where('property_id', $propertyId)->avg('rating') ?? 0;
        $property->update(['average_rating' => round($avgRating, 2)]);

        return response()->json(['message' => 'Reseña eliminada']);
    }
}