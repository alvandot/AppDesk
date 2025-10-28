<?php

namespace App\Http\Controllers;

use App\Exports\TicketsExport;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Ticket::query()->with(['assignedTo', 'createdBy']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('ticket_number', 'like', "%{$search}%")
                    ->orWhere('case_id', 'like', "%{$search}%")
                    ->orWhere('company', 'like', "%{$search}%")
                    ->orWhere('problem', 'like', "%{$search}%");
            });
        }

        // Status filter (legacy)
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // New filter parameter for Open/Closed
        if ($request->has('filter') && $request->filter) {
            $filter = $request->filter;

            if ($filter === 'open') {
                // Open tickets: status not Closed or Resolved
                $query->whereNotIn('status', ['Closed', 'Resolved']);
            } elseif ($filter === 'closed') {
                // Closed tickets: status is Closed AND completed_at is not null (benar-benar selesai)
                $query->where('status', 'Closed')
                    ->whereNotNull('completed_at');
            }
        }

        $tickets = $query->latest()->paginate(10)->withQueryString();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
            'filters' => [
                'search' => $request->search,
                'status' => $request->status,
                'filter' => $request->filter,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('tickets/create', [
            'users' => \App\Models\User::select('id', 'name', 'email')->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_number' => 'required|string|unique:tickets,ticket_number',
            'case_id' => 'nullable|string',
            'company' => 'required|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'problem' => 'required|string',
            'schedule' => 'nullable|date',
            'deadline' => 'nullable|date',
            'status' => 'required|in:Open,Need to Receive,In Progress,Resolved,Closed',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $validated['created_by'] = $request->user()?->id;

        Ticket::create($validated);

        return redirect()->route('tickets.index')->with('success', 'Ticket created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket): Response
    {
        return Inertia::render('tickets/show', [
            'ticket' => $ticket->load([
                'assignedTo',
                'createdBy',
                'statusHistories.changedBy',
            ]),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Ticket $ticket): Response
    {
        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
            'users' => \App\Models\User::select('id', 'name', 'email')->get(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'ticket_number' => 'required|string|unique:tickets,ticket_number,'.$ticket->id,
            'case_id' => 'nullable|string',
            'company' => 'required|string|max:255',
            'serial_number' => 'nullable|string|max:255',
            'problem' => 'required|string',
            'schedule' => 'nullable|date',
            'deadline' => 'nullable|date',
            'status' => 'required|in:Open,Need to Receive,In Progress,Resolved,Closed',
            'assigned_to' => 'nullable|exists:users,id',
            'notes' => 'nullable|string',
        ]);

        $ticket->update($validated);

        return redirect()->route('tickets.index')->with('success', 'Ticket updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        $ticket->delete();

        return redirect()->route('tickets.index')->with('success', 'Ticket deleted successfully.');
    }

    /**
     * Export tickets to Excel.
     */
    public function export()
    {
        return Excel::download(new TicketsExport, 'tickets-'.now()->format('Y-m-d').'.xlsx');
    }

    /**
     * Display ticket timeline with activities.
     */
    public function timeline(Ticket $ticket): Response
    {
        return Inertia::render('tickets/timeline', [
            'ticket' => $ticket->load(['assignedTo', 'createdBy', 'activities.user']),
        ]);
    }

    /**
     * Add a new activity to the ticket timeline.
     */
    public function addActivity(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'activity_type' => 'required|in:received,hit_the_road,arrived,start_working,end_working,finish_job,need_part,completed,revisit,status_change,note',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'activity_time' => 'required|date',
        ]);

        $ticket->activities()->create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Activity added successfully.');
    }

    /**
     * Handle end working stage with file uploads.
     */
    public function endWorking(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'ct_bad_part' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'ct_good_part' => 'required|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'bap_file' => 'required|file|mimes:pdf|max:10240',
            'notes' => 'nullable|string',
        ]);

        $attachments = [];

        if ($request->hasFile('ct_bad_part')) {
            $attachments['ct_bad_part'] = $request->file('ct_bad_part')->store('tickets/ct_bad_parts', 'public');
        }

        if ($request->hasFile('ct_good_part')) {
            $attachments['ct_good_part'] = $request->file('ct_good_part')->store('tickets/ct_good_parts', 'public');
        }

        if ($request->hasFile('bap_file')) {
            $attachments['bap_file'] = $request->file('bap_file')->store('tickets/bap_files', 'public');
        }

        // Create end_working activity with attachments
        $ticket->activities()->create([
            'activity_type' => 'end_working',
            'title' => 'End Working',
            'description' => $validated['notes'] ?? 'Work completed with documents uploaded',
            'activity_time' => now(),
            'user_id' => $request->user()->id,
            'attachments' => $attachments,
        ]);

        // Update ticket status to In Progress
        $ticket->update([
            'status' => 'In Progress',
        ]);

        return back()->with('success', 'End working stage completed successfully.');
    }

    /**
     * Mark ticket as completed with file uploads.
     */
    public function complete(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'ct_bad_part' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'ct_good_part' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:10240',
            'bap_file' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
            'completion_notes' => 'nullable|string',
        ]);

        if ($request->hasFile('ct_bad_part')) {
            $validated['ct_bad_part'] = $request->file('ct_bad_part')->store('tickets/ct_bad_parts', 'public');
        }

        if ($request->hasFile('ct_good_part')) {
            $validated['ct_good_part'] = $request->file('ct_good_part')->store('tickets/ct_good_parts', 'public');
        }

        if ($request->hasFile('bap_file')) {
            $validated['bap_file'] = $request->file('bap_file')->store('tickets/bap_files', 'public');
        }

        $ticket->update([
            ...$validated,
            'status' => 'Resolved',
            'completed_at' => now(),
        ]);

        // Add completion activity
        $ticket->activities()->create([
            'activity_type' => 'completed',
            'title' => 'Work Completed',
            'description' => $validated['completion_notes'] ?? 'Ticket work has been completed successfully.',
            'activity_time' => now(),
            'user_id' => $request->user()->id,
            'attachments' => array_filter([
                'ct_bad_part' => $validated['ct_bad_part'] ?? null,
                'ct_good_part' => $validated['ct_good_part'] ?? null,
                'bap_file' => $validated['bap_file'] ?? null,
            ]),
        ]);

        return redirect()->route('tickets.timeline', $ticket)->with('success', 'Ticket marked as completed.');
    }

    /**
     * Mark ticket for revisit.
     */
    public function revisit(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'reason' => 'required|string',
        ]);

        $ticket->update([
            'needs_revisit' => true,
            'status' => 'Need to Receive',
        ]);

        // Add revisit activity
        $ticket->activities()->create([
            'activity_type' => 'revisit',
            'title' => 'Revisit Required',
            'description' => $validated['reason'],
            'activity_time' => now(),
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', 'Ticket marked for revisit.');
    }
}
