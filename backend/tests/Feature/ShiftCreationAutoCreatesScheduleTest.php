<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ShiftCreationAutoCreatesScheduleTest extends TestCase
{
    use RefreshDatabase;

    public function test_shift_creation_creates_missing_schedule_for_assigned_user(): void
    {
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password1'),
            'role' => 'admin',
            'is_active' => true,
        ]);

        $user = User::create([
            'name' => 'Hana',
            'email' => 'hana@example.com',
            'password' => bcrypt('password1'),
            'role' => 'user',
            'is_active' => true,
        ]);

        Sanctum::actingAs($admin);

        $response = $this->postJson('/api/shifts', [
            'assigned_to' => $user->id,
            'start_time' => '2026-04-26 08:00:00',
            'end_time' => '2026-04-26 15:00:00',
            'shift_type' => 'weekend',
            'notes' => 'Test shift',
        ]);

        $response->assertCreated()
            ->assertJsonPath('assignee.id', $user->id)
            ->assertJsonPath('schedule.created_by', $user->id)
            ->assertJsonPath('schedule.name', 'Planning de Hana');

        $this->assertDatabaseHas('on_call_schedules', [
            'created_by' => $user->id,
            'name' => 'Planning de Hana',
        ]);

        $this->assertDatabaseHas('on_call_shifts', [
            'assigned_to' => $user->id,
            'shift_type' => 'weekend',
        ]);
    }
}
