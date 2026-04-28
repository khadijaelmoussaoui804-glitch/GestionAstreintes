<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Handover extends Model
{
    /** @use HasFactory<\Database\Factories\HandoverFactory> */
    use HasFactory;

    protected $fillable = [
        'shift_id',
        'from_user_id',
        'to_user_id',
        'handover_time',
        'reason',
        'notes',
        'status',
    ];

    protected $casts = [
        'handover_time' => 'datetime',
    ];

    public function shift(): BelongsTo
    {
        return $this->belongsTo(OnCallShift::class, 'shift_id');
    }

    public function fromUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'from_user_id');
    }

    public function toUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'to_user_id');
    }
}
