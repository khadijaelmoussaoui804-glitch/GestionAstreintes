<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class ServiceController
{
    public function index()
    {
        if (!Schema::hasTable('services')) {
            return response()->json([]);
        }

        return response()->json(
            DB::table('services')
                ->select('id', 'name', 'description')
                ->orderBy('name')
                ->get()
        );
    }

    public function show(int $service)
    {
        if (!Schema::hasTable('services')) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        $record = DB::table('services')
            ->select('id', 'name', 'description')
            ->where('id', $service)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'Service not found'], 404);
        }

        return response()->json($record);
    }

    public function store(Request $request)
    {
        if (!Schema::hasTable('services')) {
            return response()->json(['message' => 'Services table is not available'], 503);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $id = DB::table('services')->insertGetId([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $service = DB::table('services')
            ->select('id', 'name', 'description')
            ->where('id', $id)
            ->first();

        return response()->json(['message' => 'Service created', 'service' => $service], 201);
    }

    public function update(Request $request, int $service)
    {
        if (!Schema::hasTable('services')) {
            return response()->json(['message' => 'Services table is not available'], 503);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        DB::table('services')
            ->where('id', $service)
            ->update([
                ...$validated,
                'updated_at' => now(),
            ]);

        $updated = DB::table('services')
            ->select('id', 'name', 'description')
            ->where('id', $service)
            ->first();

        return response()->json(['message' => 'Service updated', 'service' => $updated]);
    }

    public function destroy(int $service)
    {
        if (!Schema::hasTable('services')) {
            return response()->json(['message' => 'Services table is not available'], 503);
        }

        DB::table('services')->where('id', $service)->delete();

        return response()->json(['message' => 'Service deleted']);
    }
}
