<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Experience;

class ExperienceController extends Controller
{
    public function index(Request $request)
    {
        $query = Experience::where('is_active', true);

        if ($request->category && $request->category !== 'Todos') {
            $query->where('category', $request->category);
        }

        if ($request->city) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        $experiences = $query->latest()->get();
        return response()->json($experiences);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|string',
            'location'    => 'required|string',
            'city'        => 'required|string',
            'price'       => 'required|numeric|min:1',
            'duration'    => 'nullable|string',
            'image'       => 'nullable|url',
        ]);

        $experience = Experience::create([
            'user_id' => $request->user()->id,
            ...$data,
        ]);

        return response()->json($experience, 201);
    }

    public function show($id)
    {
        $experience = Experience::findOrFail($id);
        return response()->json($experience);
    }

    public function destroy(Request $request, $id)
    {
        $experience = Experience::where('user_id', $request->user()->id)->findOrFail($id);
        $experience->delete();
        return response()->json(['message' => 'Experiencia eliminada']);
    }
}