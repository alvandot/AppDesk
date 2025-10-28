<?php

use App\Models\Ticket;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

use function Pest\Laravel\get;

beforeEach(function () {
    $this->actingAs(User::factory()->create());
});

test('open filter shows only non-closed and non-resolved tickets', function () {
    Ticket::factory()->create(['status' => 'Open']);
    Ticket::factory()->create(['status' => 'Need to Receive']);
    Ticket::factory()->create(['status' => 'In Progress']);
    Ticket::factory()->create(['status' => 'Resolved', 'completed_at' => now()]);
    Ticket::factory()->create(['status' => 'Closed', 'completed_at' => now()]);

    $response = get('/tickets?filter=open');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('tickets/index')
        ->has('tickets.data', 3)
    );
});

test('closed filter shows only completed closed tickets', function () {
    $closedComplete = Ticket::factory()->create([
        'status' => 'Closed',
        'completed_at' => now(),
    ]);

    Ticket::factory()->create(['status' => 'Closed', 'completed_at' => null]);
    Ticket::factory()->create(['status' => 'Open']);

    $response = get('/tickets?filter=closed');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('tickets/index')
        ->has('tickets.data', 1)
        ->where('tickets.data.0.id', $closedComplete->id)
    );
});

test('no filter shows all tickets', function () {
    Ticket::factory()->count(5)->create(['status' => 'Open']);
    Ticket::factory()->count(3)->create(['status' => 'Closed', 'completed_at' => now()]);
    Ticket::factory()->count(2)->create(['status' => 'In Progress']);

    $response = get('/tickets');

    $response->assertInertia(fn (Assert $page) => $page
        ->component('tickets/index')
        ->has('tickets.data', 10)
    );
});
