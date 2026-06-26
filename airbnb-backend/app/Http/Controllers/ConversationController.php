<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Conversation;
use App\Models\Message;
use App\Models\MessageAttachment;
use App\Models\UserNotification;
use App\Services\UserNotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class ConversationController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $conversations = Conversation::query()
            ->with([
                'property.images',
                'booking',
                'guest:id,name,email',
                'host:id,name,email',
                'lastMessage.attachment',
            ])
            ->where(function ($query) use ($userId) {
                $query->where('guest_user_id', $userId)
                    ->orWhere('host_user_id', $userId);
            })
            ->orderByDesc('last_message_at')
            ->orderByDesc('updated_at')
            ->get();

        $result = $conversations->map(function (Conversation $conversation) use ($userId) {
            $lastMessage = $conversation->lastMessage;
            $otherUser = $conversation->guest_user_id === $userId ? $conversation->host : $conversation->guest;

            $unreadCount = Message::query()
                ->where('conversation_id', $conversation->id)
                ->where('is_read', false)
                ->where(function ($query) use ($userId) {
                    $query->whereNull('sender_id')
                        ->orWhere('sender_id', '!=', $userId);
                })
                ->count();

            return [
                'id' => $conversation->id,
                'property' => $conversation->property,
                'booking' => $conversation->booking,
                'other_user' => $otherUser,
                'last_message' => $lastMessage,
                'unread_count' => $unreadCount,
                'last_message_at' => $conversation->last_message_at,
            ];
        });

        return response()->json($result->values());
    }

    public function startFromBooking(Request $request, int $bookingId)
    {
        $booking = Booking::query()->with('property')->findOrFail($bookingId);
        $userId = $request->user()->id;

        if ($booking->user_id !== $userId && $booking->property->user_id !== $userId) {
            abort(403, 'No autorizado para abrir esta conversación.');
        }

        $conversation = Conversation::query()->firstOrCreate(
            ['booking_id' => $booking->id],
            [
                'property_id' => $booking->property_id,
                'guest_user_id' => $booking->user_id,
                'host_user_id' => $booking->property->user_id,
                'last_message_at' => now(),
            ]
        );

        return response()->json([
            'conversation_id' => $conversation->id,
        ]);
    }

    public function messages(Request $request, int $conversationId)
    {
        $conversation = $this->getConversationForUser($request, $conversationId);

        $messages = $conversation->messages()
            ->with(['sender:id,name,email', 'attachment'])
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    public function sendMessage(Request $request, int $conversationId)
    {
        $conversation = $this->getConversationForUser($request, $conversationId);

        $data = $request->validate([
            'body' => 'nullable|string|max:5000',
            'attachment' => 'nullable|file|max:10240',
        ]);

        if (empty(trim((string) ($data['body'] ?? ''))) && !$request->hasFile('attachment')) {
            return response()->json([
                'message' => 'Debes enviar texto o un archivo adjunto.',
            ], 422);
        }

        $message = DB::transaction(function () use ($request, $conversation, $data) {
            $message = Message::query()->create([
                'conversation_id' => $conversation->id,
                'sender_id' => $request->user()->id,
                'type' => 'text',
                'body' => trim((string) ($data['body'] ?? '')),
            ]);

            if ($request->hasFile('attachment')) {
                $file = $request->file('attachment');
                $path = $file->store('chat_attachments', 'local');

                MessageAttachment::query()->create([
                    'message_id' => $message->id,
                    'original_name' => $file->getClientOriginalName(),
                    'mime_type' => $file->getClientMimeType(),
                    'size_bytes' => $file->getSize() ?? 0,
                    'path' => $path,
                ]);
            }

            $conversation->update(['last_message_at' => now()]);

            $recipientId = $conversation->guest_user_id === $request->user()->id
                ? $conversation->host_user_id
                : $conversation->guest_user_id;

            app(UserNotificationService::class)->notify(
                userId: $recipientId,
                type: 'chat_message',
                title: 'Nuevo mensaje',
                body: $message->body !== '' ? mb_substr($message->body, 0, 160) : 'Recibiste un archivo adjunto.',
                data: [
                    'conversation_id' => $conversation->id,
                    'message_id' => $message->id,
                ]
            );

            return $message;
        });

        return response()->json($message->load(['sender:id,name,email', 'attachment']), 201);
    }

    public function markAsRead(Request $request, int $conversationId)
    {
        $conversation = $this->getConversationForUser($request, $conversationId);
        $userId = $request->user()->id;

        Message::query()
            ->where('conversation_id', $conversation->id)
            ->where('is_read', false)
            ->where(function ($query) use ($userId) {
                $query->whereNull('sender_id')
                    ->orWhere('sender_id', '!=', $userId);
            })
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);

        return response()->json(['ok' => true]);
    }

    public function notifications(Request $request)
    {
        $items = UserNotification::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->limit(50)
            ->get();

        return response()->json($items);
    }

    public function unreadCount(Request $request)
    {
        $count = UserNotification::query()
            ->where('user_id', $request->user()->id)
            ->where('is_read', false)
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    public function markNotificationAsRead(Request $request, int $id)
    {
        $notification = UserNotification::query()
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->update([
            'is_read' => true,
            'read_at' => now(),
        ]);

        return response()->json($notification);
    }

    public function downloadAttachment(Request $request, int $attachmentId)
    {
        $attachment = MessageAttachment::query()->with('message.conversation')->findOrFail($attachmentId);
        $conversation = $attachment->message->conversation;
        $userId = $request->user()->id;

        if ($conversation->guest_user_id !== $userId && $conversation->host_user_id !== $userId) {
            abort(403, 'No autorizado para descargar este adjunto.');
        }

        if (!Storage::disk('local')->exists($attachment->path)) {
            abort(404, 'Archivo no encontrado.');
        }

        return Storage::disk('local')->download($attachment->path, $attachment->original_name);
    }

    private function getConversationForUser(Request $request, int $conversationId): Conversation
    {
        $userId = $request->user()->id;

        return Conversation::query()
            ->where('id', $conversationId)
            ->where(function ($query) use ($userId) {
                $query->where('guest_user_id', $userId)
                    ->orWhere('host_user_id', $userId);
            })
            ->firstOrFail();
    }
}
