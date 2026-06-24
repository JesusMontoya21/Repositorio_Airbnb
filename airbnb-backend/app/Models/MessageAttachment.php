<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    protected $fillable = [
        'message_id',
        'original_name',
        'mime_type',
        'size_bytes',
        'path',
    ];

    public function message()
    {
        return $this->belongsTo(Message::class);
    }
}
