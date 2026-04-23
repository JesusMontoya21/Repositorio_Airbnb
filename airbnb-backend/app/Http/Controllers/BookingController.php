<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'check_in'    => 'required|date|after_or_equal:today',
            'check_out'   => 'required|date|after:check_in',
            'guests'      => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:1',
        ]);

        $booking = Booking::create([
            'user_id'     => $request->user()->id,
            'property_id' => $data['property_id'],
            'check_in'    => $data['check_in'],
            'check_out'   => $data['check_out'],
            'guests'      => $data['guests'],
            'total_price' => $data['total_price'],
            'status'      => 'pending',
        ]);

        return response()->json($booking->load('property'), 201);
    }

    public function myBookings(Request $request)
    {
        $bookings = Booking::with('property')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::where('user_id', $request->user()->id)->findOrFail($id);
        $booking->update(['status' => 'cancelled']);
        return response()->json($booking);
    }
}