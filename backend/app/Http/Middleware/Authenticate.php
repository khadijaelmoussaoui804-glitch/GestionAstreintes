<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        // Retourner null pour les requêtes API (JSON au lieu de redirect)
        return $request->expectsJson() ? null : null;
    }
}
