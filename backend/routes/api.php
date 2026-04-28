<?php
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ShiftController;
use App\Http\Controllers\Api\HandoverController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/auth/register', fn () => redirect()->away('http://localhost:3000/register'));
Route::get('/auth/login', fn () => redirect()->away('http://localhost:3000/login'));

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/services', [ServiceController::class, 'index']);

Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::put('/auth/profile', [AuthController::class, 'updateProfile']);
    Route::get('/users', [UserController::class, 'index']);

    // Schedule routes
    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::post('/schedules', [ScheduleController::class, 'store']);
    Route::get('/schedules/{schedule}', [ScheduleController::class, 'show']);
    Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
    Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);
    Route::post('/schedules/{schedule}/publish', [ScheduleController::class, 'publish']);

    // Shift routes
    Route::get('/shifts', [ShiftController::class, 'index']);
    Route::post('/shifts', [ShiftController::class, 'store']);
    Route::get('/shifts/{shift}', [ShiftController::class, 'show']);
    Route::put('/shifts/{shift}', [ShiftController::class, 'update']);
    Route::delete('/shifts/{shift}', [ShiftController::class, 'destroy']);

    // Handover routes
    Route::post('/handovers', [HandoverController::class, 'store']);
    Route::post('/handovers/{handover}/accept', [HandoverController::class, 'accept']);
    Route::post('/handovers/{handover}/reject', [HandoverController::class, 'reject']);

    // Agent and Unavailability routes
    Route::get('/agents', [\App\Http\Controllers\Api\AgentController::class, 'index']);
    Route::post('/agents', [\App\Http\Controllers\Api\AgentController::class, 'store']);
    Route::get('/agents/{agent}', [\App\Http\Controllers\Api\AgentController::class, 'show']);
    Route::put('/agents/{agent}', [\App\Http\Controllers\Api\AgentController::class, 'update']);
    Route::delete('/agents/{agent}', [\App\Http\Controllers\Api\AgentController::class, 'destroy']);
    Route::post('/agents/{agent}/unavailability', [\App\Http\Controllers\Api\AgentController::class, 'declareUnavailability']);
    Route::delete('/unavailabilities/{unavailability}', [\App\Http\Controllers\Api\AgentController::class, 'removeUnavailability']);

    Route::get('/availabilities', function () {
    try {
        $unavailabilities = \App\Models\Unavailability::with('agent.user')
            ->get()
            ->map(function($u) {
                $u->user = $u->agent ? $u->agent->user : null;
                return $u;
            });
        return response()->json($unavailabilities);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
    // Service routes
    Route::post('/services', [ServiceController::class, 'store']);
    Route::get('/services/{service}', [ServiceController::class, 'show']);
    Route::put('/services/{service}', [ServiceController::class, 'update']);
    Route::delete('/services/{service}', [ServiceController::class, 'destroy']);
});
