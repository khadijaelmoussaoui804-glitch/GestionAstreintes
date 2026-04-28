<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OnCallSchedule;
use App\Models\OnCallShift;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ShiftController extends Controller
{
    public function index(Request $request)
    {
        $query = OnCallShift::with('schedule', 'assignee');

        if ($request->has('schedule_id')) {
            $query->where('schedule_id', $request->schedule_id);
        }

        if (in_array($request->user()->role, ['staff', 'user'])) {
            $query->where('assigned_to', $request->user()->id);
        }

        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('start_time', [$request->start_date, $request->end_date]);
        }

        return response()->json($query->orderBy('start_time', 'desc')->paginate(20));
    }

    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'schedule_id' => 'sometimes|nullable|exists:on_call_schedules,id',
            'assigned_to' => 'required|exists:users,id',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'shift_type' => 'sometimes|in:day,night,weekend,oncall',
            'notes' => 'sometimes|string',
        ]);

        $assignee = User::findOrFail($validated['assigned_to']);
        $schedule = $this->resolveScheduleForAssignee($validated, $assignee);

        $shift = OnCallShift::create([
            ...$validated,
            'schedule_id' => $schedule->id,
        ]);

        return response()->json($shift->load('schedule', 'assignee'), 201);
    }

    private function resolveScheduleForAssignee(array $validated, User $assignee): OnCallSchedule
    {
        if (!empty($validated['schedule_id'])) {
            $schedule = OnCallSchedule::findOrFail($validated['schedule_id']);

            if ((int) $schedule->created_by !== (int) $assignee->id) {
                throw ValidationException::withMessages([
                    'schedule_id' => 'Le planning selectionne ne correspond pas a cet utilisateur.',
                ]);
            }

            return $schedule;
        }

        $shiftStart = Carbon::parse($validated['start_time']);
        $shiftEnd = Carbon::parse($validated['end_time']);

        $existingSchedule = OnCallSchedule::query()
            ->where('created_by', $assignee->id)
            ->whereDate('start_date', '<=', $shiftStart->toDateString())
            ->whereDate('end_date', '>=', $shiftEnd->toDateString())
            ->orderByDesc('created_at')
            ->first();

        if ($existingSchedule) {
            return $existingSchedule;
        }

        return OnCallSchedule::create([
            'name' => 'Planning de ' . $assignee->name,
            'description' => 'Planning cree automatiquement lors de la creation d une astreinte.',
            'created_by' => $assignee->id,
            'status' => 'draft',
            'start_date' => $shiftStart->toDateString(),
            'end_date' => $shiftEnd->toDateString(),
        ]);
    }

    public function show(OnCallShift $shift)
    {
        return response()->json($shift->load('schedule', 'assignee', 'handovers', 'alerts'));
    }

    public function update(Request $request, OnCallShift $shift)
    {
        if (!in_array($request->user()->role, ['admin', 'manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'assigned_to' => 'sometimes|exists:users,id',
            'status' => 'sometimes|in:scheduled,active,completed,cancelled',
            'notes' => 'sometimes|string',
        ]);

        $shift->update($validated);

        return response()->json($shift);
    }

    public function destroy(Request $request, OnCallShift $shift)
    {
        if (!in_array($request->user()->role, ['admin', 'manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $shift->delete();

        return response()->json(['message' => 'Shift deleted']);
    }
}
