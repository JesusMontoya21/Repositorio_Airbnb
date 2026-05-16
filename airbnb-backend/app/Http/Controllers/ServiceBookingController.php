<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ServiceBooking;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmationMail;
use App\Mail\BookingCancellationMail;

class ServiceBookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'service_id'  => 'required|exists:services,id',
            'date'        => 'required|date|after_or_equal:today',
            'guests'      => 'required|integer|min:1',
            'total_price' => 'required|numeric|min:1',
        ]);

        $booking = ServiceBooking::create([
            'user_id'    => $request->user()->id,
            'service_id' => $data['service_id'],
            'date'       => $data['date'],
            'guests'     => $data['guests'],
            'total_price'=> $data['total_price'],
            'status'     => 'pending',
        ]);

        $booking->load('service');

        try {
            Mail::to($request->user()->email)->send(new BookingConfirmationMail(
                userName: $request->user()->name,
                propertyTitle: $booking->service->title,
                checkIn: $data['date'],
                checkOut: $data['date'],
                guests: $data['guests'],
                totalPrice: $data['total_price'],
                type: 'servicio'
            ));
        } catch (\Exception $e) {
            // Si falla el correo no afecta la reservación
        }

        return response()->json($booking->load('service'), 201);
    }

    public function myBookings(Request $request)
    {
        $bookings = ServiceBooking::with('service')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function cancel(Request $request, $id)
    {
        $booking = ServiceBooking::where('user_id', $request->user()->id)->findOrFail($id);
        $booking->load('service');
        $booking->update(['status' => 'cancelled']);

        try {
            Mail::to($request->user()->email)->send(new BookingCancellationMail(
                userName: $request->user()->name,
                propertyTitle: $booking->service->title,
                checkIn: $booking->date,
                checkOut: $booking->date,
                totalPrice: $booking->total_price,
                type: 'servicio'
            ));
        } catch (\Exception $e) {
            // Si falla el correo no afecta la cancelación
        }

        return response()->json($booking);
    }
}