<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agent extends Model
{
    protected $fillable = ['user_id', 'phone', 'service', 'is_active'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function unavailabilities()
    {
        return $this->hasMany(Unavailability::class);
    }
}
