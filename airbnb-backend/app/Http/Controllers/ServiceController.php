<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::where('is_active', true);

        if ($request->category && $request->category !== 'Todos') {
            $query->where('category', $request->category);
        }

        if ($request->location) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        $services = $query->latest()->get();
        return response()->json($services);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'       => 'required|string|max:255',
            'description' => 'nullable|string',
            'category'    => 'required|string',
            'location'    => 'required|string',
            'price'       => 'required|numeric|min:1',
            'image'       => 'nullable|url',
        ]);

        $service = Service::create([
            'user_id' => $request->user()->id,
            ...$data,
        ]);

        return response()->json($service, 201);
    }

    public function show($id)
    {
        $service = Service::findOrFail($id);
        return response()->json($service);
    }

    public function destroy(Request $request, $id)
    {
        $service = Service::where('user_id', $request->user()->id)->findOrFail($id);
        $service->delete();
        return response()->json(['message' => 'Servicio eliminado']);
    }
}