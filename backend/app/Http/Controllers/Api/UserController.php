<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $users = User::query()
            ->select('id', 'name', 'email', 'role', 'is_active')
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return response()->json($users);
    }
}
