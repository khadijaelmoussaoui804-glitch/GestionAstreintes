<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unavailability extends Model
{
    protected $fillable = ['agent_id', 'date', 'reason'];

    public function agent()
    {
        return $this->belongsTo(Agent::class);
    }
}