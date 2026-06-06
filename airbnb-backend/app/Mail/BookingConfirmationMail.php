<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class BookingConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $propertyTitle,
        public string $checkIn,
        public string $checkOut,
        public int $guests,
        public float $totalPrice,
        public string $type = 'hospedaje'
    ) {}

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Reservación confirmada! 🏠',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.booking-confirmation',
        );
    }
}