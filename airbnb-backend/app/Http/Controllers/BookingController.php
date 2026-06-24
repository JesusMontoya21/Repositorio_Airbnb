<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Property;
use App\Models\PropertyAvailabilityBlock;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use App\Mail\BookingConfirmationMail;
use App\Mail\BookingCancellationMail;

class BookingController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'check_in'    => 'required|date|after_or_equal:today',
            'check_out'   => 'required|date|after:check_in',
            'guests'      => 'required|integer|min:1',
        ]);

        $booking = DB::transaction(function () use ($request, $data) {
            $property = Property::query()
                ->with('seasonalPrices')
                ->lockForUpdate()
                ->findOrFail($data['property_id']);

            if ($data['guests'] > $property->guests) {
                throw ValidationException::withMessages([
                    'guests' => 'La cantidad de huéspedes excede la capacidad permitida.',
                ]);
            }

            if ($this->hasOverlap($property->id, $data['check_in'], $data['check_out'])) {
                throw ValidationException::withMessages([
                    'check_in' => 'Las fechas seleccionadas ya no están disponibles.',
                ]);
            }

            $quote = $this->buildQuote($property, $data['check_in'], $data['check_out'], $data['guests']);

            return Booking::create([
                'user_id'     => $request->user()->id,
                'property_id' => $property->id,
                'check_in'    => $data['check_in'],
                'check_out'   => $data['check_out'],
                'guests'      => $data['guests'],
                'total_price' => $quote['total_price'],
                'status'      => 'pending',
            ]);
        });

        $booking->load('property');

        try {
            Mail::to($request->user()->email)->send(new BookingConfirmationMail(
                userName: $request->user()->name,
                propertyTitle: $booking->property->title,
                checkIn: $data['check_in'],
                checkOut: $data['check_out'],
                guests: $data['guests'],
                totalPrice: $booking->total_price,
                type: 'hospedaje'
            ));
        } catch (\Exception $e) {
            // Si falla el correo no afecta la reservación
        }

        return response()->json($booking->load('property'), 201);
    }

    public function availability(Request $request, int $id)
    {
        $property = Property::query()->findOrFail($id);

        $windowStart = $request->input('start')
            ? Carbon::parse($request->input('start'))->startOfDay()
            : now()->startOfDay();

        $windowEnd = $request->input('end')
            ? Carbon::parse($request->input('end'))->startOfDay()
            : now()->addMonths(12)->startOfDay();

        if ($windowEnd->lte($windowStart)) {
            return response()->json([
                'message' => 'La fecha de fin debe ser posterior a la fecha de inicio.'
            ], 422);
        }

        $blockedRanges = Booking::query()
            ->where('property_id', $property->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('check_in', '<', $windowEnd->toDateString())
            ->where('check_out', '>', $windowStart->toDateString())
            ->orderBy('check_in')
            ->get(['check_in', 'check_out'])
            ->map(fn (Booking $booking) => [
                'check_in' => Carbon::parse($booking->check_in)->toDateString(),
                'check_out' => Carbon::parse($booking->check_out)->toDateString(),
            ])
            ->values();

        $manualBlocks = $property->availabilityBlocks()
            ->where('start_date', '<', $windowEnd->toDateString())
            ->where('end_date', '>', $windowStart->toDateString())
            ->orderBy('start_date')
            ->get(['start_date', 'end_date'])
            ->map(fn ($block) => [
                'check_in' => Carbon::parse($block->start_date)->toDateString(),
                'check_out' => Carbon::parse($block->end_date)->addDay()->toDateString(),
            ])
            ->values();

        return response()->json([
            'property_id' => $property->id,
            'window_start' => $windowStart->toDateString(),
            'window_end' => $windowEnd->toDateString(),
            'blocked_ranges' => $blockedRanges->merge($manualBlocks)->sortBy('check_in')->values(),
        ]);
    }

    public function quote(Request $request, int $id)
    {
        $data = $request->validate([
            'check_in' => 'required|date|after_or_equal:today',
            'check_out' => 'required|date|after:check_in',
            'guests' => 'required|integer|min:1',
        ]);

        $property = Property::query()->with('seasonalPrices')->findOrFail($id);

        if ($data['guests'] > $property->guests) {
            return response()->json([
                'message' => 'La cantidad de huéspedes excede la capacidad permitida.'
            ], 422);
        }

        if ($this->hasOverlap($property->id, $data['check_in'], $data['check_out'])) {
            return response()->json([
                'message' => 'Las fechas seleccionadas ya están ocupadas.',
                'available' => false,
            ], 422);
        }

        return response()->json([
            'available' => true,
            ...$this->buildQuote($property, $data['check_in'], $data['check_out'], $data['guests']),
        ]);
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
            // Si falla el correo no afecta la cancelación
        }

        return response()->json($booking);
    }

    private function hasOverlap(int $propertyId, string $checkIn, string $checkOut): bool
    {
        $bookingOverlap = Booking::query()
            ->where('property_id', $propertyId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('check_in', '<', $checkOut)
            ->where('check_out', '>', $checkIn)
            ->exists();

        if ($bookingOverlap) {
            return true;
        }

        return PropertyAvailabilityBlock::query()
            ->where('property_id', $propertyId)
            ->where('start_date', '<', $checkOut)
            ->whereRaw("(end_date + interval '1 day') > ?", [$checkIn])
            ->exists();
    }

    private function buildQuote(Property $property, string $checkIn, string $checkOut, int $guests): array
    {
        $start = Carbon::parse($checkIn)->startOfDay();
        $end = Carbon::parse($checkOut)->startOfDay();
        $nights = $start->diffInDays($end);
        $basePrice = (float) $property->price_per_night;
        $seasonalRules = $property->seasonalPrices
            ->where('is_active', true)
            ->sortByDesc('priority')
            ->values();

        $nightlyBreakdown = [];
        $subtotal = 0.0;

        foreach (CarbonPeriod::create($start, '1 day', $end->copy()->subDay()) as $nightDate) {
            $effectivePrice = $basePrice;
            $source = 'base';

            foreach ($seasonalRules as $rule) {
                if ($nightDate->betweenIncluded($rule->start_date, $rule->end_date)) {
                    $effectivePrice = (float) $rule->price_per_night;
                    $source = $rule->name ?: 'seasonal';
                    break;
                }
            }

            if ($source === 'base' && in_array($nightDate->dayOfWeekIso, [5, 6], true)) {
                $effectivePrice = $basePrice * 1.10;
                $source = 'weekend';
            }

            $subtotal += $effectivePrice;

            $nightlyBreakdown[] = [
                'date' => $nightDate->toDateString(),
                'price' => round($effectivePrice, 2),
                'source' => $source,
            ];
        }

        return [
            'property_id' => $property->id,
            'guests' => $guests,
            'check_in' => $start->toDateString(),
            'check_out' => $end->toDateString(),
            'nights' => $nights,
            'base_price_per_night' => round($basePrice, 2),
            'nightly_breakdown' => $nightlyBreakdown,
            'subtotal' => round($subtotal, 2),
            'total_price' => round($subtotal, 2),
        ];
    }
}