<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Alert extends Model
{
    /** @use HasFactory<\Database\Factories\AlertFactory> */
    use HasFactory;

    protected $fillable = [
        'shift_id',
        'title',
        'description',
        'severity',
        'status',
        'sent_at',
        'acknowledged_at',
        'resolution_notes',
    ];

    protected $casts = [
        'sent_at' => 'datetime',
        'acknowledged_at' => 'datetime',
    ];

    public function shift(): BelongsTo
    {
        return $this->belongsTo(OnCallShift::class, 'shift_id');
    }
}
