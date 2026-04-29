<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    // backend/database/seeders/DatabaseSeeder.php
public function run(): void
{
    $this->call([
        OcpServicesSeeder::class,  // ← zid had le seter
    ]);
}
}
