<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('handovers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shift_id')->constrained('on_call_shifts')->onDelete('cascade');
            $table->foreignId('from_user_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('to_user_id')->constrained('users')->onDelete('restrict');
            $table->datetime('handover_time');
            $table->text('reason')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('handovers');
    }
};
