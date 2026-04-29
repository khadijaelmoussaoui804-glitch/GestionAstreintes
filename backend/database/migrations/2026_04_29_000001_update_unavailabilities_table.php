<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('unavailabilities', function (Blueprint $table) {
            // Add new columns if they don't exist
            if (!Schema::hasColumn('unavailabilities', 'user_id')) {
                $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('cascade');
            }
            if (!Schema::hasColumn('unavailabilities', 'start_date')) {
                $table->date('start_date')->nullable();
            }
            if (!Schema::hasColumn('unavailabilities', 'end_date')) {
                $table->date('end_date')->nullable();
            }
            if (!Schema::hasColumn('unavailabilities', 'status')) {
                $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');
            }
            if (!Schema::hasColumn('unavailabilities', 'admin_response')) {
                $table->text('admin_response')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('unavailabilities', function (Blueprint $table) {
            $table->dropColumn(['user_id', 'start_date', 'end_date', 'status', 'admin_response']);
        });
    }
};
