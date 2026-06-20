<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\BookingConfirmationMail;
use App\Mail\BookingCancellationMail;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'check_in'    => 'required|date',
            'check_out'   => 'required|date',
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

        $booking->load('property');

        try {
            Mail::to($request->user()->email)->send(new BookingConfirmationMail(
                userName: $request->user()->name,
                propertyTitle: $booking->property->title,
                checkIn: $data['check_in'],
                checkOut: $data['check_out'],
                guests: $data['guests'],
                totalPrice: $data['total_price'],
                type: 'hospedaje'
            ));
        } catch (\Exception $e) {

        }

        return response()->json($booking->load('property'), 201);
    }

    public function myBookings(Request $request)
    {
        $bookings = Booking::with('property.images') 
            ->where('user_id', $request->user()->id)
            ->where('status', '!=', 'cancelled')
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function cancel(Request $request, $id)
    {
        $booking = Booking::where('user_id', $request->user()->id)->findOrFail($id);
        $booking->load('property');
        $booking->update(['status' => 'cancelled']);

        try {
            Mail::to($request->user()->email)->send(new BookingCancellationMail(
                userName: $request->user()->name,
                propertyTitle: $booking->property->title,
                checkIn: $booking->check_in,
                checkOut: $booking->check_out,
                totalPrice: $booking->total_price,
                type: 'hospedaje'
            ));
        } catch (\Exception $e) {

        }

        return response()->json($booking);
    }

    public function confirm(Request $request, $id)
    {
        try {
            $booking = Booking::find($id);
            
            if (!$booking) {
                return response()->json(['message' => 'Reserva no encontrada en la base de datos'], 404);
            }

            $booking->status = 'confirmed'; 
            $booking->save();

            return response()->json([
                'message' => 'Reserva confirmada con éxito',
                'booking' => $booking
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error en confirmación de reserva: " . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
}