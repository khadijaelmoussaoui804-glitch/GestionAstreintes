<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OnCallShift extends Model
{
    /** @use HasFactory<\Database\Factories\OnCallShiftFactory> */
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'assigned_to',
        'start_time',
        'end_time',
        'shift_type',
        'status',
        'notes',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function schedule(): BelongsTo
    {
        return $this->belongsTo(OnCallSchedule::class, 'schedule_id');
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function handovers(): HasMany
    {
        return $this->hasMany(Handover::class, 'shift_id');
    }

    public function alerts(): HasMany
    {
        return $this->hasMany(Alert::class, 'shift_id');
    }
}
