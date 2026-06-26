<?php

namespace App\Console\Commands;

use App\Mail\UserNotificationMail;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendPendingMessageEmailReminders extends Command
{
    protected $signature = 'messages:send-pending-email-reminders';

    protected $description = 'Envía recordatorios por correo cuando hay mensajes de chat pendientes por leer.';

    public function handle(): int
    {
        $candidateUserIds = UserNotification::query()
            ->where('type', 'chat_message')
            ->where('is_read', false)
            ->pluck('user_id')
            ->unique()
            ->values();

        foreach ($candidateUserIds as $userId) {
            $unreadMessages = UserNotification::query()
                ->where('user_id', $userId)
                ->where('type', 'chat_message')
                ->where('is_read', false)
                ->count();

            if ($unreadMessages === 0) {
                continue;
            }

            $alreadySentRecently = UserNotification::query()
                ->where('user_id', $userId)
                ->where('type', 'pending_messages_email')
                ->where('created_at', '>=', now()->subMinutes(30))
                ->exists();

            if ($alreadySentRecently) {
                continue;
            }

            $user = User::query()->find($userId);
            if (!$user) {
                continue;
            }

            try {
                Mail::to($user->email)->send(new UserNotificationMail(
                    userName: $user->name,
                    title: 'Tienes mensajes pendientes por leer',
                    body: "Actualmente tienes {$unreadMessages} mensaje(s) sin leer en tu bandeja.",
                    actionUrl: 'http://localhost:5174/messages',
                ));

                UserNotification::query()->create([
                    'user_id' => $userId,
                    'type' => 'pending_messages_email',
                    'title' => 'Recordatorio de mensajes pendientes enviado',
                    'body' => "Se envió un recordatorio por correo para {$unreadMessages} mensaje(s) pendientes.",
                    'data' => [
                        'unread_messages' => $unreadMessages,
                    ],
                    'is_read' => true,
                    'read_at' => now(),
                ]);
            } catch (\Throwable $exception) {
                Log::warning('No se pudo enviar recordatorio de mensajes pendientes.', [
                    'user_id' => $userId,
                    'error' => $exception->getMessage(),
                ]);
            }
        }

        return self::SUCCESS;
    }
}
