<?php

namespace App\Console;

use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        //
    ];

    protected function schedule($schedule)
    {
        // $schedule->command('inspire')->hourly();
    }

    protected function commands()
    {
        require base_path('routes/console.php');
    }
}
