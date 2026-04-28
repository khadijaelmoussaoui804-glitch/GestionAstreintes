<?php
namespace App\Http\Controllers\Api;
use App\Models\OnCallSchedule;
use App\Models\OnCallShift;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
class AuthController extends \App\Http\Controllers\Controller
{
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|min:2',
                'email' => 'required|string|email|unique:users,email',
                'password' => 'required|string|min:8',
                'role' => 'required|string|in:user,admin',
            ], [
                'name.required' => 'Le nom est obligatoire.',
                'name.min' => 'Le nom doit contenir au moins 2 caracteres.',
                'name.max' => 'Le nom ne peut pas depasser 255 caracteres.',
                'email.required' => 'L\'email est obligatoire.',
                'email.email' => 'L\'email doit etre valide.',
                'email.unique' => 'Cet email est deja utilise.',
                'password.required' => 'Le mot de passe est obligatoire.',
                'password.min' => 'Le mot de passe doit contenir au moins 8 caracteres.',
                'role.required' => 'Le role est obligatoire.',
                'role.in' => 'Le role doit etre utilisateur ou administrateur.',
            ]);
            $user = DB::transaction(function () use ($validated) {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'role' => $validated['role'],
                    'is_active' => true,
                ]);
                $scheduleStart = Carbon::today();
                $scheduleEnd = (clone $scheduleStart)->addDays(6);
                $schedule = OnCallSchedule::create([
                    'name' => 'Planning de ' . $user->name,
                    'description' => 'Planning cree automatiquement lors de l inscription.',
                    'created_by' => $user->id,
                    'status' => 'draft',
                    'start_date' => $scheduleStart->toDateString(),
                    'end_date' => $scheduleEnd->toDateString(),
                ]);
                OnCallShift::create([
                    'schedule_id' => $schedule->id,
                    'assigned_to' => $user->id,
                    'start_time' => $scheduleStart->copy()->setTime(9, 0, 0),
                    'end_time' => $scheduleStart->copy()->setTime(17, 0, 0),
                    'shift_type' => 'day',
                    'status' => 'scheduled',
                ]);
                return $user->fresh('schedules.shifts');
            });
            $token = $user->createToken('auth_token')->plainTextToken;
            $createdSchedule = $user->schedules->first();
            return response()->json([
                'message' => 'User registered successfully',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                ],
                'schedule' => $createdSchedule?->load('shifts.assignee'),
                'token' => $token,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }}
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        $user = User::where('email', $validated['email'])->first();
        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }
        if (!$user->is_active) {
            throw ValidationException::withMessages([
                'email' => ['This account has been deactivated.'],
            ]);
        }
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'profile_picture' => $user->profile_picture,
            ],
            'token' => $token,
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logout successful']);
    }
    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'profile_picture' => $user->profile_picture,
                'is_active' => $user->is_active,
            ],
        ]);}
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'profile_picture' => 'sometimes|string',
            'current_password' => 'required_with:password|string',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);
        $user = $request->user();
        $profileData = collect($validated)
            ->only(['name', 'profile_picture'])
            ->toArray();
        if (array_key_exists('password', $validated)) {
            if (!Hash::check($validated['current_password'], $user->password)) {
                throw ValidationException::withMessages([
                    'current_password' => ['Le mot de passe actuel est incorrect.'],
                ]);
            }
            $profileData['password'] = Hash::make($validated['password']);
        }
        $user->update($profileData);
        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(),
        ]);
    }
}