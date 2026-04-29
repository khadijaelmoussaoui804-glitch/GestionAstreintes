<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unavailability extends Model
{
    protected $fillable = [
        'agent_id',
        'user_id',
        'date',
        'start_date',
        'end_date',
        'reason',
        'status',
        'admin_response',
    ];

    protected $casts = [
        'date'       => 'date',
        'start_date' => 'date',
        'end_date'   => 'date',
    ];

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}