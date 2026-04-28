<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthRegistrationCreatesScheduleTest extends TestCase
{
    use RefreshDatabase;

    public function test_register_creates_a_default_schedule_and_shift(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'Salma',
            'email' => 'salma@example.com',
            'password' => 'password1',
            'role' => 'user',
        ]);

        $response->assertCreated()
            ->assertJsonPath('user.name', 'Salma')
            ->assertJsonPath('schedule.name', 'Planning de Salma')
            ->assertJsonPath('schedule.status', 'draft')
            ->assertJsonPath('schedule.shifts.0.shift_type', 'day')
            ->assertJsonPath('schedule.shifts.0.status', 'scheduled');

        $this->assertDatabaseHas('users', [
            'email' => 'salma@example.com',
            'role' => 'user',
        ]);

        $this->assertDatabaseHas('on_call_schedules', [
            'name' => 'Planning de Salma',
            'status' => 'draft',
        ]);

        $this->assertDatabaseHas('on_call_shifts', [
            'shift_type' => 'day',
            'status' => 'scheduled',
        ]);
    }
}
