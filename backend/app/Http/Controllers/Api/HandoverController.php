<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Handover;
use App\Models\OnCallShift;
use Illuminate\Http\Request;

class HandoverController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shift_id' => 'required|exists:on_call_shifts,id',
            'to_user_id' => 'required|exists:users,id',
            'reason' => 'sometimes|string',
            'notes' => 'sometimes|string',
        ]);

        $shift = OnCallShift::find($validated['shift_id']);

        if ($shift->assigned_to !== $request->user()->id && 
            !in_array($request->user()->role, ['admin', 'manager'])) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $handover = Handover::create([
            ...$validated,
            'from_user_id' => $request->user()->id,
            'handover_time' => now(),
            'status' => 'pending',
        ]);

        return response()->json($handover->load('fromUser', 'toUser'), 201);
    }

    public function accept(Request $request, Handover $handover)
    {
        if ($handover->to_user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $handover->update([
            'status' => 'accepted',
        ]);

        $shift = $handover->shift;
        $shift->update(['assigned_to' => $request->user()->id]);

        return response()->json([
            'message' => 'Handover accepted',
            'handover' => $handover,
            'shift' => $shift,
        ]);
    }

    public function reject(Request $request, Handover $handover)
    {
        if ($handover->to_user_id !== $request->user()->id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $handover->update(['status' => 'rejected']);

        return response()->json(['message' => 'Handover rejected']);
    }
}
