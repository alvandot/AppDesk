<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Seeder;

class TicketSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        if ($users->isEmpty()) {
            $this->command->error('No users found. Please run UserSeeder first.');

            return;
        }

        // Create Open tickets
        Ticket::factory()->count(15)->create([
            'status' => 'Open',
            'assigned_to' => $users->random()->id,
            'created_by' => $users->random()->id,
        ]);

        // Create Need to Receive tickets
        Ticket::factory()->count(8)->create([
            'status' => 'Need to Receive',
            'assigned_to' => $users->random()->id,
            'created_by' => $users->random()->id,
        ]);

        // Create In Progress tickets
        Ticket::factory()->count(10)->create([
            'status' => 'In Progress',
            'assigned_to' => $users->random()->id,
            'created_by' => $users->random()->id,
        ]);

        // Create Resolved tickets
        Ticket::factory()->count(7)->create([
            'status' => 'Resolved',
            'completed_at' => now()->subDays(rand(1, 10)),
            'assigned_to' => $users->random()->id,
            'created_by' => $users->random()->id,
        ]);

        // Create Closed tickets (completed)
        Ticket::factory()->count(10)->create([
            'status' => 'Closed',
            'completed_at' => now()->subDays(rand(1, 30)),
            'completion_notes' => 'Ticket has been successfully resolved and closed.',
            'assigned_to' => $users->random()->id,
            'created_by' => $users->random()->id,
        ]);

        $this->command->info('Created 50 tickets with various statuses');
    }
}
