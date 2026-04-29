<?php

namespace App\Http\Controllers\Api;

use App\Models\Agent;
use App\Models\Unavailability;
use Illuminate\Http\Request;

class AgentController
{
    public function index(Request $request)
    {
        $serviceId = $request->query('service_id');

        $query = Agent::with(['user', 'service', 'schedules', 'unavailabilities']);

        if ($serviceId) {
            $query->where('service_id', $serviceId);
        }

        return $query->get();
    }

    public function show(Agent $agent)
    {
        return $agent->load('user', 'service', 'schedules', 'unavailabilities');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'service_id' => 'required|exists:services,id',
            'rotation_order' => 'nullable|integer',
        ]);

        $agent = Agent::create($validated);

        return response()->json(['message' => 'Agent created', 'agent' => $agent], 201);
    }

    public function update(Request $request, Agent $agent)
    {
        $validated = $request->validate([
            'rotation_order' => 'nullable|integer',
            'is_available' => 'nullable|boolean',
        ]);

        $agent->update($validated);

        return response()->json(['message' => 'Agent updated', 'agent' => $agent]);
    }

    public function destroy(Agent $agent)
    {
        $agent->delete();

        return response()->json(['message' => 'Agent deleted']);
    }

    public function declareUnavailability(Request $request, Agent $agent)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'reason' => 'nullable|string',
        ]);

        $unavailability = Unavailability::create([
            'agent_id' => $agent->id,
            'date' => $validated['date'],
            'reason' => $validated['reason'] ?? null,
        ]);

        return response()->json([
            'message' => 'Unavailability recorded',
            'unavailability' => $unavailability,
        ], 201);
    }

    public function removeUnavailability(Unavailability $unavailability)
    {
        $unavailability->delete();

        return response()->json(['message' => 'Unavailability removed']);
    }
}