<?php

namespace App\Console\Commands;

use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Message;
use App\Services\UserNotificationService;
use Illuminate\Console\Command;

class SendBookingChatTemplates extends Command
{
    protected $signature = 'bookings:send-chat-templates';

    protected $description = 'Envía plantillas automáticas de recordatorio y check-in por chat.';

    public function handle(): int
    {
        $this->sendReminderTemplates();
        $this->sendCheckinTemplates();

        return self::SUCCESS;
    }

    private function sendReminderTemplates(): void
    {
        $targetDate = now()->addDay()->toDateString();

        $bookings = Booking::query()
            ->with('property')
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('check_in', $targetDate)
            ->whereNull('reminder_template_sent_at')
            ->get();

        foreach ($bookings as $booking) {
            $conversation = $this->ensureConversation($booking);

            Message::query()->create([
                'conversation_id' => $conversation->id,
                'sender_id' => null,
                'type' => 'template',
                'template_key' => 'checkin_reminder',
                'body' => "Recordatorio: tu check-in para {$booking->property->title} es mañana ({$booking->check_in->toDateString()}).",
            ]);

            app(UserNotificationService::class)->notify(
                userId: $booking->user_id,
                type: 'checkin_reminder',
                title: 'Recordatorio de check-in',
                body: "Tu check-in en {$booking->property->title} es mañana.",
                data: [
                    'booking_id' => $booking->id,
                    'property_id' => $booking->property_id,
                    'conversation_id' => $conversation->id,
                ]
            );

            app(UserNotificationService::class)->notify(
                userId: $booking->property->user_id,
                type: 'guest_checkin_reminder',
                title: 'Recordatorio de llegada de huésped',
                body: "Mañana llega un huésped a {$booking->property->title}.",
                data: [
                    'booking_id' => $booking->id,
                    'property_id' => $booking->property_id,
                    'conversation_id' => $conversation->id,
                ]
            );

            $conversation->update(['last_message_at' => now()]);
            $booking->update(['reminder_template_sent_at' => now()]);
        }
    }

    private function sendCheckinTemplates(): void
    {
        $today = now()->toDateString();

        $bookings = Booking::query()
            ->with('property')
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereDate('check_in', $today)
            ->whereNull('checkin_template_sent_at')
            ->get();

        foreach ($bookings as $booking) {
            $conversation = $this->ensureConversation($booking);

            Message::query()->create([
                'conversation_id' => $conversation->id,
                'sender_id' => null,
                'type' => 'template',
                'template_key' => 'checkin_day',
                'body' => "Hoy es tu check-in en {$booking->property->title}. ¡Te deseamos una gran estancia!",
            ]);

            app(UserNotificationService::class)->notify(
                userId: $booking->user_id,
                type: 'checkin_day',
                title: 'Hoy es tu check-in',
                body: "Tu check-in en {$booking->property->title} es hoy.",
                data: [
                    'booking_id' => $booking->id,
                    'property_id' => $booking->property_id,
                    'conversation_id' => $conversation->id,
                ]
            );

            app(UserNotificationService::class)->notify(
                userId: $booking->property->user_id,
                type: 'guest_checkin_day',
                title: 'Hoy llega tu huésped',
                body: "El huésped de {$booking->property->title} hace check-in hoy.",
                data: [
                    'booking_id' => $booking->id,
                    'property_id' => $booking->property_id,
                    'conversation_id' => $conversation->id,
                ]
            );

            $conversation->update(['last_message_at' => now()]);
            $booking->update(['checkin_template_sent_at' => now()]);
        }
    }

    private function ensureConversation(Booking $booking): Conversation
    {
        $booking->loadMissing('property');

        return Conversation::query()->firstOrCreate(
            ['booking_id' => $booking->id],
            [
                'property_id' => $booking->property_id,
                'guest_user_id' => $booking->user_id,
                'host_user_id' => $booking->property->user_id,
                'last_message_at' => now(),
            ]
        );
    }
}
