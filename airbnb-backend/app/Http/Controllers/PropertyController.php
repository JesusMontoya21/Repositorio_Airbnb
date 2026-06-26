<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Property;
use App\Models\PropertyImage;
use App\Models\Booking;
use App\Models\PropertyAvailabilityBlock;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with('images')->where('is_active', true);

        if ($request->city) {
            $query->where(function($q) use ($request) {
                $q->where('city', 'like', '%' . $request->city . '%')
                  ->orWhere('address', 'like', '%' . $request->city . '%')
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
            'amenities'       => 'sometimes|array',
            'amenities.*'     => 'string|max:100',
            'house_rules'     => 'sometimes|array',
            'house_rules.*'   => 'string|max:255',
            'cancellation_policy' => 'sometimes|in:flexible,moderate,strict',
            'booking_preference' => 'sometimes|in:approve_first,instant_book',
            'guest_preference' => 'sometimes|in:any_guest,experienced_guest',
            'images'          => 'sometimes|array',
            'images.*'        => 'url',
        ]);

        $location = $this->resolveLocation($data['address'], $data['city'] ?? null, $data['country'] ?? null);

        $property = Property::create([
            'user_id'         => $request->user()->id,
            'title'           => $data['title'],
            'description'     => $data['description'],
            'city'            => $location['city'],
            'country'         => $location['country'],
            'address'         => $data['address'],
            'price_per_night' => $data['price_per_night'],
            'guests'          => $data['guests'],
            'bedrooms'        => $data['bedrooms'],
            'bathrooms'       => $data['bathrooms'],
            'type'            => $data['type'] ?? 'apartment',
            'amenities'       => $data['amenities'] ?? [],
            'house_rules'     => $data['house_rules'] ?? [],
            'cancellation_policy' => $data['cancellation_policy'] ?? 'flexible',
            'booking_preference' => $data['booking_preference'] ?? 'approve_first',
            'guest_preference' => $data['guest_preference'] ?? 'any_guest',
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
            'type'            => 'sometimes|string',
            'country'         => 'sometimes|string|max:120',
            'amenities'       => 'sometimes|array',
            'amenities.*'     => 'string|max:100',
            'house_rules'     => 'sometimes|array',
            'house_rules.*'   => 'string|max:255',
            'cancellation_policy' => 'sometimes|in:flexible,moderate,strict',
            'booking_preference' => 'sometimes|in:approve_first,instant_book',
            'guest_preference' => 'sometimes|in:any_guest,experienced_guest',
            'images'          => 'sometimes|array',
            'images.*'        => 'url',
            'is_active'       => 'sometimes|boolean',
        ]);

        if (array_key_exists('address', $data) || array_key_exists('city', $data) || array_key_exists('country', $data)) {
            $location = $this->resolveLocation(
                $data['address'] ?? $property->address,
                $data['city'] ?? $property->city,
                $data['country'] ?? $property->country,
            );

            $data['city'] = $location['city'];
            $data['country'] = $location['country'];
        }

        DB::transaction(function () use ($property, $data) {
            $property->update(collect($data)->except('images')->toArray());

            if (array_key_exists('images', $data)) {
                $property->images()->delete();

                foreach ($data['images'] as $index => $url) {
                    PropertyImage::create([
                        'property_id' => $property->id,
                        'url' => $url,
                        'is_primary' => $index === 0,
                    ]);
                }
            }
        });

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

    public function dashboard(Request $request)
    {
        $userId = $request->user()->id;

        $properties = Property::with(['images', 'bookings'])
            ->where('user_id', $userId)
            ->get();

        $totalProperties = $properties->count();

        $totalBookings = $properties->sum(function($property) {
            return $property->bookings->count();
        });

        $totalRevenue = $properties->sum(function($property) {
            return $property->bookings
                ->where('status', '!=', 'cancelled')
                ->sum('total_price');
        });

        $averageRating = $properties->avg('average_rating') ?? 0;

        $recentBookings = Booking::with('property')
            ->whereIn('property_id', $properties->pluck('id'))
            ->latest()
            ->take(5)
            ->get();

        return response()->json([
            'total_properties' => $totalProperties,
            'total_bookings'   => $totalBookings,
            'total_revenue'    => round($totalRevenue, 2),
            'average_rating'   => round($averageRating, 2),
            'properties'       => $properties,
            'recent_bookings'  => $recentBookings,
        ]);
    }

    public function hostShow(Request $request, int $id)
    {
        $property = Property::with(['images', 'availabilityBlocks', 'seasonalPrices'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($property);
    }

    public function hostAvailability(Request $request, int $id)
    {
        $property = Property::where('user_id', $request->user()->id)->findOrFail($id);

        $blocks = $property->availabilityBlocks()
            ->orderBy('start_date')
            ->get()
            ->map(fn (PropertyAvailabilityBlock $block) => [
                'id' => $block->id,
                'start_date' => Carbon::parse($block->start_date)->toDateString(),
                'end_date' => Carbon::parse($block->end_date)->toDateString(),
                'reason' => $block->reason,
            ]);

        $bookings = Booking::query()
            ->where('property_id', $property->id)
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('check_in')
            ->get(['id', 'check_in', 'check_out', 'status'])
            ->map(fn (Booking $booking) => [
                'id' => $booking->id,
                'start_date' => Carbon::parse($booking->check_in)->toDateString(),
                'end_date' => Carbon::parse($booking->check_out)->toDateString(),
                'status' => $booking->status,
                'source' => 'booking',
            ]);

        return response()->json([
            'property_id' => $property->id,
            'manual_blocks' => $blocks,
            'booked_ranges' => $bookings,
        ]);
    }

    public function addAvailabilityBlock(Request $request, int $id)
    {
        $property = Property::where('user_id', $request->user()->id)->findOrFail($id);

        $data = $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'reason' => 'nullable|string|max:255',
        ]);

        $block = PropertyAvailabilityBlock::create([
            'property_id' => $property->id,
            'start_date' => $data['start_date'],
            'end_date' => $data['end_date'],
            'reason' => $data['reason'] ?? null,
        ]);

        return response()->json($block, 201);
    }

    public function removeAvailabilityBlock(Request $request, int $id, int $blockId)
    {
        $property = Property::where('user_id', $request->user()->id)->findOrFail($id);

        $block = $property->availabilityBlocks()->findOrFail($blockId);
        $block->delete();

        return response()->json(['message' => 'Bloqueo eliminado correctamente']);
    }

    private function resolveLocation(string $address, ?string $city, ?string $country): array
    {
        $parts = collect(explode(',', $address))
            ->map(fn (string $part) => trim($part))
            ->filter(fn (string $part) => $part !== '')
            ->values()
            ->all();

        $parts = array_values(array_filter($parts, fn (string $part) => !$this->isPostalSegment($part)));

        $parsedCountry = null;
        if (!empty($parts) && $this->isCountrySegment(end($parts))) {
            $parsedCountry = array_pop($parts);
        }

        if (!empty($parts) && $this->isStateSegment(end($parts))) {
            array_pop($parts);
        }

        $parsedCity = !empty($parts) ? end($parts) : null;
        $resolvedCity = $parsedCity ?: $city ?: 'Sin ciudad';

        if ($city && !$this->looksLikeAddressComponent($city)) {
            $resolvedCity = $city;
        }

        return [
            'city' => trim($resolvedCity),
            'country' => trim($parsedCountry ?: ($country ?: 'México')),
        ];
    }

    private function isPostalSegment(string $segment): bool
    {
        return (bool) preg_match('/^(c\.?p\.?\s*\d{4,6}|c[oó]digo postal\s*\d{4,6}|\d{4,6})$/iu', trim($segment));
    }

    private function isCountrySegment(string $segment): bool
    {
        return in_array(mb_strtolower(trim($segment)), ['méxico', 'mexico'], true);
    }

    private function isStateSegment(string $segment): bool
    {
        $states = [
            'aguascalientes', 'baja california', 'baja california sur', 'campeche', 'chiapas', 'chihuahua',
            'ciudad de méxico', 'coahuila', 'colima', 'durango', 'estado de méxico', 'guanajuato',
            'guerrero', 'hidalgo', 'jalisco', 'michoacán', 'michoacan', 'morelos', 'nayarit', 'nuevo león',
            'nuevo leon', 'oaxaca', 'puebla', 'querétaro', 'queretaro', 'quintana roo', 'san luis potosí',
            'san luis potosi', 'sinaloa', 'sonora', 'tabasco', 'tamaulipas', 'tlaxcala', 'veracruz',
            'yucatán', 'yucatan', 'zacatecas'
        ];

        return in_array(mb_strtolower(trim($segment)), $states, true);
    }

    private function looksLikeAddressComponent(string $value): bool
    {
        return (bool) preg_match('/\d|calle|avenida|\bav\b|boulevard|\bblvd\b|km\b|colonia|residencial|fracc|fraccionamiento|lote|manzana|fase|c\.?p\.?|c[oó]digo postal/iu', trim($value));
    }
}