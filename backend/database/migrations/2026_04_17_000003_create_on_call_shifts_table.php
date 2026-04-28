<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('on_call_shifts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('schedule_id')->constrained('on_call_schedules')->onDelete('cascade');
            $table->foreignId('assigned_to')->constrained('users')->onDelete('cascade');
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->enum('shift_type', ['day', 'night', 'weekend', 'oncall'])->default('oncall');
            $table->enum('status', ['scheduled', 'active', 'completed', 'cancelled'])->default('scheduled');
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('on_call_shifts');
    }
};
