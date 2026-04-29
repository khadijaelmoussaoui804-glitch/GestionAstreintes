<?php

namespace App\Http\Controllers\Api;

use App\Models\OnCallSchedule;
use App\Models\OnCallShift;
use Illuminate\Http\Request;

class ScheduleController
{
    public function current()
{
    $today = now();

    $schedules = OnCallSchedule::with(['shifts.assignee', 'service'])
        ->where('status', 'active')
        ->whereDate('start_date', '<=', $today)
        ->whereDate('end_date', '>=', $today)
        ->get();

    $result = [];

    foreach ($schedules as $schedule) {
        foreach ($schedule->shifts as $shift) {
            $result[] = [
                'service' => $schedule->service->name ?? 'Service',
                'agent' => $shift->assignee->name ?? 'N/A',
                'phone' => $shift->assignee->phone ?? '',
                'status' => 'Disponible'
            ];
        }
    }

    return response()->json($result);
}
    public function index(Request $request)
    {
        $query = OnCallSchedule::with('creator', 'shifts.assignee');

        if (in_array($request->user()->role, ['staff', 'user'])) {
            $query->whereHas('shifts', function ($q) use ($request) {
                $q->where('assigned_to', $request->user()->id);
            });
        } elseif ($request->user()->role === 'team_lead') {
            $query->where('created_by', $request->user()->id)
                  ->orWhereHas('shifts', function ($q) use ($request) {
                      $q->where('assigned_to', $request->user()->id);
                  });
        }

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->orderBy('created_at', 'desc')->paginate(15));
    }

    public function store(Request $request)
    {
        if (!in_array($request->user()->role, ['admin', 'manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'sometimes|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
        ]);

        $schedule = OnCallSchedule::create([
            ...$validated,
            'created_by' => $request->user()->id,
        ]);

        return response()->json($schedule, 201);
    }

    public function show(OnCallSchedule $schedule)
    {
        return response()->json($schedule->load('creator', 'shifts.assignee'));
    }

    public function update(Request $request, OnCallSchedule $schedule)
    {
        if (!in_array($request->user()->role, ['admin', 'manager']) && 
            $schedule->created_by !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'status' => 'sometimes|in:draft,active,archived',
            'end_date' => 'sometimes|date',
        ]);

        $schedule->update($validated);

        return response()->json($schedule);
    }

    public function destroy(Request $request, OnCallSchedule $schedule)
    {
        if (!in_array($request->user()->role, ['admin', 'manager']) && 
            $schedule->created_by !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted']);
    }

    public function publish(Request $request, OnCallSchedule $schedule)
    {
        if (!in_array($request->user()->role, ['admin', 'manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $schedule->update(['status' => 'active']);

        return response()->json(['message' => 'Schedule published', 'schedule' => $schedule]);
    }
}

