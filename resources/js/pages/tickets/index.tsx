import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import { Plus, MoreVertical, Eye, Pencil, Trash, Download } from 'lucide-react'
import { format } from 'date-fns'

interface User {
	id: number
	name: string
	email: string
}

interface Ticket {
	id: number
	ticket_number: string
	case_id: string | null
	company: string
	serial_number: string | null
	problem: string
	schedule: string | null
	deadline: string | null
	status: string
	assigned_to: number | null
	created_by: number | null
	notes: string | null
	created_at: string
	updated_at: string
	assigned_to_user?: User
	created_by_user?: User
}

interface PaginationLink {
	url: string | null
	label: string
	active: boolean
}

interface PaginatedTickets {
	data: Ticket[]
	current_page: number
	last_page: number
	per_page: number
	total: number
	links: PaginationLink[]
}

interface Props {
	tickets: PaginatedTickets
	filters: {
		search?: string
		status?: string
		filter?: string
	}
}

const statusColors: Record<string, string> = {
	Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
	'Need to Receive':
		'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
	'In Progress':
		'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
	Resolved:
		'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
	Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export default function TicketsIndex({ tickets, filters }: Props) {
	const [search, setSearch] = useState(filters.search || '')
	const [status, setStatus] = useState(filters.status || 'all')
	const [filter, setFilter] = useState(filters.filter || 'all')

	const handleSearch = (value: string) => {
		setSearch(value)
		router.get(
			'/tickets',
			{ search: value, status, filter: filter === 'all' ? undefined : filter },
			{ preserveState: true, replace: true }
		)
	}

	const handleStatusFilter = (value: string) => {
		setStatus(value)
		setFilter('all') // Reset filter when using status
		router.get(
			'/tickets',
			{ search, status: value === 'all' ? undefined : value },
			{ preserveState: true, replace: true }
		)
	}

	const handleFilter = (value: string) => {
		setFilter(value)
		setStatus('all') // Reset status when using filter
		router.get(
			'/tickets',
			{ search, filter: value === 'all' ? undefined : value },
			{ preserveState: true, replace: true }
		)
	}

	const handleDelete = (id: number) => {
		if (confirm('Are you sure you want to delete this ticket?')) {
			router.delete(`/tickets/${id}`)
		}
	}

	// Get current filter display text
	const getFilterDisplayText = () => {
		if (filter === 'open') return '🟢 Open Tickets'
		if (filter === 'closed') return '🔴 Closed Tickets'
		if (status !== 'all') return `Status: ${status}`
		return 'All Tickets'
	}

	return (
		<AppLayout>
			<Head title="Manage Tickets" />

			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="text-3xl font-bold">MANAGE TICKET</h1>
						<p className="text-muted-foreground mt-1">
							View and manage all support tickets
						</p>
						{(filter !== 'all' || status !== 'all') && (
							<div className="mt-2">
								<span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
									filter === 'open'
										? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
										: filter === 'closed'
										? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
										: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
								}`}>
									{getFilterDisplayText()}
								</span>
							</div>
						)}
					</div>
					<div className="flex items-center gap-2">
						<a href="/tickets/export">
							<Button variant="outline">
								<Download className="mr-2 size-4" />
								Export Excel
							</Button>
						</a>
						<Link href="/tickets/create">
							<Button>
								<Plus className="mr-2 size-4" />
								Create Ticket
							</Button>
						</Link>
					</div>
				</div>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2">
						<span className="text-sm">Show</span>
						<Select defaultValue="10">
							<SelectTrigger className="w-20">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="10">10</SelectItem>
								<SelectItem value="25">25</SelectItem>
								<SelectItem value="50">50</SelectItem>
								<SelectItem value="100">100</SelectItem>
							</SelectContent>
						</Select>
						<span className="text-sm">entries</span>
					</div>

					<div className="flex-1" />

					<Select value={filter} onValueChange={handleFilter}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Filter tickets" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Tickets</SelectItem>
							<SelectItem value="open" className="text-green-600 dark:text-green-400 font-medium">
								🟢 Open
							</SelectItem>
							<SelectItem value="closed" className="text-red-600 dark:text-red-400 font-medium">
								🔴 Closed
							</SelectItem>
						</SelectContent>
					</Select>

					<Select value={status} onValueChange={handleStatusFilter}>
						<SelectTrigger className="w-48">
							<SelectValue placeholder="Filter by status" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">All Status</SelectItem>
							<SelectItem value="Open">Open</SelectItem>
							<SelectItem value="Need to Receive">
								Need to Receive
							</SelectItem>
							<SelectItem value="In Progress">
								In Progress
							</SelectItem>
							<SelectItem value="Resolved">Resolved</SelectItem>
							<SelectItem value="Closed">Closed</SelectItem>
						</SelectContent>
					</Select>

					<Input
						type="search"
						placeholder="Search..."
						value={search}
						onChange={(e) => handleSearch(e.target.value)}
						className="w-64"
					/>
				</div>

				<div className="rounded-lg border bg-card">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-16">NO</TableHead>
								<TableHead>NO TICKET</TableHead>
								<TableHead>CASE ID</TableHead>
								<TableHead>COMPANY</TableHead>
								<TableHead>SN</TableHead>
								<TableHead>PROBLEM</TableHead>
								<TableHead>SCHEDULE</TableHead>
								<TableHead>DEADLINE</TableHead>
								<TableHead>STATUS</TableHead>
								<TableHead className="w-32">OPTION</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{tickets.data.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={10}
										className="text-center py-8 text-muted-foreground"
									>
										No tickets found
									</TableCell>
								</TableRow>
							) : (
								tickets.data.map((ticket, index) => (
									<TableRow
										key={ticket.id}
										className="cursor-pointer hover:bg-muted/50"
										onClick={() => router.visit(`/tickets/${ticket.id}/timeline`)}
									>
										<TableCell>
											{(tickets.current_page - 1) *
												tickets.per_page +
												index +
												1}
										</TableCell>
										<TableCell className="font-medium">
											{ticket.ticket_number}
										</TableCell>
										<TableCell>
											{ticket.case_id || '-'}
										</TableCell>
										<TableCell>{ticket.company}</TableCell>
										<TableCell>
											{ticket.serial_number || '-'}
										</TableCell>
										<TableCell className="max-w-xs truncate">
											{ticket.problem}
										</TableCell>
										<TableCell>
											{ticket.schedule
												? format(
														new Date(
															ticket.schedule
														),
														'yyyy-MM-dd HH:mm'
													)
												: '-'}
										</TableCell>
										<TableCell>
											{ticket.deadline
												? format(
														new Date(
															ticket.deadline
														),
														'yyyy-MM-dd HH:mm'
													)
												: '-'}
										</TableCell>
										<TableCell>
											<Badge
												className={
													statusColors[ticket.status]
												}
												variant="outline"
											>
												{ticket.status}
											</Badge>
										</TableCell>
										<TableCell>
											<div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
														>
															<MoreVertical className="size-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem asChild>
															<Link
																href={`/tickets/${ticket.id}`}
															>
																<Eye className="mr-2 size-4" />
																View
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link
																href={`/tickets/${ticket.id}/edit`}
															>
																<Pencil className="mr-2 size-4" />
																Edit
															</Link>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() =>
																handleDelete(
																	ticket.id
																)
															}
															className="text-destructive"
														>
															<Trash className="mr-2 size-4" />
															Delete
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>

												<Link
													href={`/tickets/${ticket.id}/edit`}
												>
													<Button
														variant="ghost"
														size="icon"
													>
														<Pencil className="size-4" />
													</Button>
												</Link>

												<Link
													href={`/tickets/${ticket.id}`}
												>
													<Button
														variant="ghost"
														size="icon"
													>
														<Eye className="size-4" />
													</Button>
												</Link>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

				{tickets.last_page > 1 && (
					<div className="flex items-center justify-between">
						<p className="text-sm text-muted-foreground">
							Showing {(tickets.current_page - 1) * tickets.per_page + 1} to{' '}
							{Math.min(
								tickets.current_page * tickets.per_page,
								tickets.total
							)}{' '}
							of {tickets.total} entries
						</p>

						<div className="flex items-center gap-2">
							{tickets.links.map((link, index) => {
								if (link.label === '&laquo; Previous') {
									return (
										<Button
											key={index}
											variant="outline"
											size="sm"
											disabled={!link.url}
											onClick={() =>
												link.url && router.get(link.url)
											}
										>
											Previous
										</Button>
									)
								}

								if (link.label === 'Next &raquo;') {
									return (
										<Button
											key={index}
											variant="outline"
											size="sm"
											disabled={!link.url}
											onClick={() =>
												link.url && router.get(link.url)
											}
										>
											Next
										</Button>
									)
								}

								return (
									<Button
										key={index}
										variant={
											link.active ? 'default' : 'outline'
										}
										size="sm"
										disabled={!link.url}
										onClick={() =>
											link.url && router.get(link.url)
										}
									>
										{link.label}
									</Button>
								)
							})}
						</div>
					</div>
				)}
			</div>
		</AppLayout>
	)
}
