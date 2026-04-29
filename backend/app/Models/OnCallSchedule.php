<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class OnCallSchedule extends Model
{
    /** @use HasFactory<\Database\Factories\OnCallScheduleFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'created_by',
        'status',
        'start_date',
        'end_date',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function shifts(): HasMany
    {
        return $this->hasMany(OnCallShift::class, 'schedule_id');
    }
    
}