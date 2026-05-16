<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExperienceBooking;
use Illuminate\Support\Facades\Mail;
use App\Mail\BookingConfirmationMail;
use App\Mail\BookingCancellationMail;

class ExperienceBookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'experience_id' => 'required|exists:experiences,id',
            'date'          => 'required|date|after_or_equal:today',
            'guests'        => 'required|integer|min:1',
            'total_price'   => 'required|numeric|min:1',
        ]);

        $booking = ExperienceBooking::create([
            'user_id'       => $request->user()->id,
            'experience_id' => $data['experience_id'],
            'date'          => $data['date'],
            'guests'        => $data['guests'],
            'total_price'   => $data['total_price'],
            'status'        => 'pending',
        ]);

        $booking->load('experience');

        try {
            Mail::to($request->user()->email)->send(new BookingConfirmationMail(
                userName: $request->user()->name,
                propertyTitle: $booking->experience->title,
                checkIn: $data['date'],
                checkOut: $data['date'],
                guests: $data['guests'],
                totalPrice: $data['total_price'],
                type: 'experiencia'
            ));
        } catch (\Exception $e) {
            // Si falla el correo no afecta la reservación
        }

        return response()->json($booking->load('experience'), 201);
    }

    public function myBookings(Request $request)
    {
        $bookings = ExperienceBooking::with('experience')
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    public function cancel(Request $request, $id)
    {
        $booking = ExperienceBooking::where('user_id', $request->user()->id)->findOrFail($id);
        $booking->load('experience');
        $booking->update(['status' => 'cancelled']);

        try {
            Mail::to($request->user()->email)->send(new BookingCancellationMail(
                userName: $request->user()->name,
                propertyTitle: $booking->experience->title,
                checkIn: $booking->date,
                checkOut: $booking->date,
                totalPrice: $booking->total_price,
                type: 'experiencia'
            ));
        } catch (\Exception $e) {
            // Si falla el correo no afecta la cancelación
        }

        return response()->json($booking);
    }
}