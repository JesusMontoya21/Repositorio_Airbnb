<?php

namespace App\Services;

use App\Mail\UserNotificationMail;
use App\Models\User;
use App\Models\UserNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class UserNotificationService
{
    public function notify(int $userId, string $type, string $title, ?string $body = null, array $data = []): ?UserNotification
    {
        $user = User::query()->find($userId);
        if (!$user) {
            return null;
        }

        $notification = UserNotification::query()->create([
            'user_id' => $userId,
            'type' => $type,
            'title' => $title,
            'body' => $body,
            'data' => $data,
        ]);

        try {
            $actionUrl = null;
            if (!empty($data['conversation_id'])) {
                $actionUrl = 'http://localhost:5174/messages?conversation=' . $data['conversation_id'];
            } elseif (!empty($data['booking_id'])) {
                $actionUrl = 'http://localhost:5174/my-bookings';
            }

            Mail::to($user->email)->send(new UserNotificationMail(
                userName: $user->name,
                title: $title,
                body: $body,
                actionUrl: $actionUrl,
            ));
        } catch (\Throwable $exception) {
            Log::warning('No se pudo enviar correo de notificación.', [
                'user_id' => $userId,
                'type' => $type,
                'error' => $exception->getMessage(),
            ]);
        }

        return $notification;
    }
}
