<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::statement("UPDATE users SET role = 'user' WHERE role = 'staff'");

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('admin', 'manager', 'team_lead', 'user', 'staff') NOT NULL DEFAULT 'user'");
        }
    }

    public function down(): void
    {
        DB::statement("UPDATE users SET role = 'staff' WHERE role = 'user'");

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE users MODIFY role ENUM('admin', 'manager', 'team_lead', 'staff') NOT NULL DEFAULT 'staff'");
        }
    }
};
