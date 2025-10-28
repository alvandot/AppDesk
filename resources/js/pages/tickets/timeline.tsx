import { Head, Link, useForm } from '@inertiajs/react'
import { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
Dialog,
DialogContent,
DialogDescription,
DialogHeader,
DialogTitle,
} from '@/components/ui/dialog'
import {
Card,
CardContent,
CardDescription,
CardHeader,
CardTitle,
} from '@/components/ui/card'
import {
ArrowLeft,
CheckCircle,
XCircle,
FileText,
Download,
Clock,
User,
Building2,
Hash,
Calendar,
} from 'lucide-react'
import { format } from 'date-fns'

interface User {
id: number
name: string
email: string
}

interface Activity {
id: number
ticket_id: number
activity_type: string
title: string
description: string | null
activity_time: string
user_id: number | null
attachments: {
ct_bad_part?: string
ct_good_part?: string
bap_file?: string
} | null
user?: User
created_at: string
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
ct_bad_part: string | null
ct_good_part: string | null
bap_file: string | null
needs_revisit: boolean
completion_notes: string | null
completed_at: string | null
created_at: string
updated_at: string
assigned_to_user?: User
created_by_user?: User
activities: Activity[]
}

interface Props {
ticket: Ticket
}

interface TimelineStage {
id: number
type: string
title: string
description: string
bgColor: string
requiresInput?: boolean
completedActivity?: Activity
}

const statusColors: Record<string, string> = {
Open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
'Need to Receive':
'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
'In Progress':
'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
Resolved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
Closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
}

export default function Timeline({ ticket }: Props) {
const [currentStageDialog, setCurrentStageDialog] = useState<string | null>(
null
)
const [showFinishDialog, setShowFinishDialog] = useState(false)

const workflowStages: TimelineStage[] = [
{
id: 1,
type: 'received',
title: 'Received Ticket',
description: 'Ticket has been received and logged',
bgColor: 'bg-blue-500',
},
{
id: 2,
type: 'hit_the_road',
title: 'Hit The Road',
description: 'Technician is on the way to location',
bgColor: 'bg-indigo-500',
},
{
id: 3,
type: 'arrived',
title: "It's Arrived",
description: 'Technician has arrived at location',
bgColor: 'bg-purple-500',
},
{
id: 4,
type: 'start_working',
title: 'Start Working',
description: 'Work has started on the issue',
bgColor: 'bg-yellow-500',
},
{
id: 5,
type: 'end_working',
title: 'End Working',
description: 'Upload images and BAP document',
bgColor: 'bg-orange-500',
requiresInput: true,
},
{
id: 6,
type: 'finish_job',
title: 'Finish Job',
description: 'Choose to end case or revisit',
bgColor: 'bg-green-500',
requiresInput: true,
},
]

const stagesWithData = workflowStages.map((stage) => ({
...stage,
completedActivity: ticket.activities.find(
(activity) => activity.activity_type === stage.type
),
}))

const currentStageIndex = stagesWithData.findIndex(
(stage) => !stage.completedActivity
)

const stageForm = useForm({
activity_type: '',
title: '',
description: '',
activity_time: new Date().toISOString().slice(0, 16),
})

const endWorkingForm = useForm({
ct_bad_part: null as File | null,
ct_good_part: null as File | null,
bap_file: null as File | null,
notes: '',
})

const finishForm = useForm({
action: 'end_case' as 'end_case' | 'revisit',
notes: '',
})

const handleStageComplete = (stage: TimelineStage) => {
if (stage.type === 'end_working') {
setCurrentStageDialog('end_working')
} else if (stage.type === 'finish_job') {
setShowFinishDialog(true)
} else {
stageForm.setData({
activity_type: stage.type,
title: stage.title,
description: '',
activity_time: new Date().toISOString().slice(0, 16),
})
setCurrentStageDialog(stage.type)
}
}

const handleSimpleStageSubmit = (e: React.FormEvent) => {
e.preventDefault()
stageForm.post(`/tickets/${ticket.id}/activities`, {
onSuccess: () => {
setCurrentStageDialog(null)
stageForm.reset()
},
})
}

const handleEndWorkingSubmit = (e: React.FormEvent) => {
e.preventDefault()
endWorkingForm.post(`/tickets/${ticket.id}/end-working`, {
onSuccess: () => {
setCurrentStageDialog(null)
endWorkingForm.reset()
},
})
}

const handleFinishSubmit = (e: React.FormEvent) => {
e.preventDefault()
if (finishForm.data.action === 'end_case') {
finishForm.post(`/tickets/${ticket.id}/complete`, {
onSuccess: () => {
setShowFinishDialog(false)
finishForm.reset()
},
})
} else {
finishForm.post(`/tickets/${ticket.id}/revisit`, {
onSuccess: () => {
setShowFinishDialog(false)
finishForm.reset()
},
})
}
}

return (
<AppLayout>
<Head title={`Timeline - ${ticket.ticket_number}`} />

<div className="space-y-6">
<div className="flex items-center justify-between">
<div className="flex items-center gap-4">
<Link href="/tickets">
<Button variant="outline" size="icon">
<ArrowLeft className="size-4" />
</Button>
</Link>
<div>
<div className="flex items-center gap-3">
<h1 className="text-3xl font-bold">WORKFLOW TIMELINE</h1>
<Badge
className={statusColors[ticket.status]}
variant="outline"
>
{ticket.status}
</Badge>
</div>
<p className="text-muted-foreground mt-1">
{ticket.ticket_number}
</p>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
<Card className="lg:col-span-1">
<CardHeader>
<CardTitle className="flex items-center gap-2">
<FileText className="size-5" />
Ticket Information
</CardTitle>
<CardDescription>Details about this support ticket</CardDescription>
</CardHeader>
<CardContent className="space-y-4">
<div className="flex items-start gap-3">
<Building2 className="size-4 mt-1 text-muted-foreground" />
<div className="flex-1">
<p className="text-sm text-muted-foreground">Company</p>
<p className="font-medium">{ticket.company}</p>
</div>
</div>
<div className="flex items-start gap-3">
<Hash className="size-4 mt-1 text-muted-foreground" />
<div className="flex-1">
<p className="text-sm text-muted-foreground">Case ID</p>
<p className="font-medium">{ticket.case_id || '-'}</p>
</div>
</div>
<div className="flex items-start gap-3">
<Hash className="size-4 mt-1 text-muted-foreground" />
<div className="flex-1">
<p className="text-sm text-muted-foreground">Serial Number</p>
<p className="font-medium">{ticket.serial_number || '-'}</p>
</div>
</div>
<div className="flex items-start gap-3">
<FileText className="size-4 mt-1 text-muted-foreground" />
<div className="flex-1">
<p className="text-sm text-muted-foreground">Problem</p>
<p className="font-medium text-sm">{ticket.problem}</p>
</div>
</div>
<div className="flex items-start gap-3">
<User className="size-4 mt-1 text-muted-foreground" />
<div className="flex-1">
<p className="text-sm text-muted-foreground">Assigned To</p>
<p className="font-medium">
{ticket.assigned_to_user?.name || 'Unassigned'}
</p>
</div>
</div>
{ticket.schedule && (
<div className="flex items-start gap-3">
<Calendar className="size-4 mt-1 text-muted-foreground" />
<div className="flex-1">
<p className="text-sm text-muted-foreground">Schedule</p>
<p className="font-medium text-sm">
{format(new Date(ticket.schedule), 'MMM dd, yyyy HH:mm')}
</p>
</div>
</div>
)}
{ticket.deadline && (
<div className="flex items-start gap-3">
<Clock className="size-4 mt-1 text-muted-foreground" />
<div className="flex-1">
<p className="text-sm text-muted-foreground">Deadline</p>
<p className="font-medium text-sm">
{format(new Date(ticket.deadline), 'MMM dd, yyyy HH:mm')}
</p>
</div>
</div>
)}

{ticket.completed_at && (
<>
<Separator className="my-4" />
<div className="space-y-3">
<p className="font-semibold flex items-center gap-2">
<Download className="size-4" />
Completion Documents
</p>
{ticket.ct_bad_part && (
<a
href={`/storage/${ticket.ct_bad_part}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
>
<FileText className="size-4" />
CT Bad Part
</a>
)}
{ticket.ct_good_part && (
<a
href={`/storage/${ticket.ct_good_part}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
>
<FileText className="size-4" />
CT Good Part
</a>
)}
{ticket.bap_file && (
<a
href={`/storage/${ticket.bap_file}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
>
<FileText className="size-4" />
BAP Document
</a>
)}
</div>
</>
)}
</CardContent>
</Card>

<Card className="lg:col-span-2">
<CardHeader>
<CardTitle>Workflow Progress</CardTitle>
<CardDescription>
Follow the sequential workflow to complete this ticket
</CardDescription>
</CardHeader>
<CardContent>
<ScrollArea className="h-[600px] pr-4">
<div className="relative">
<div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

<div className="space-y-6">
{stagesWithData.map((stage, index) => {
const isCompleted = !!stage.completedActivity
const isCurrent = !isCompleted && index === currentStageIndex

// Hanya tampilkan stage yang sudah complete ATAU stage current
// Stage berikutnya tidak ditampilkan (sequential workflow)
if (index > currentStageIndex && !isCompleted) {
return null
}

return (
<div key={stage.id} className="relative flex gap-4">
<div
className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full transition-all ${
isCompleted
? stage.bgColor
: isCurrent
? 'bg-white border-4 border-primary'
: 'bg-gray-300'
}`}
>
{isCompleted ? (
<CheckCircle className="size-6 text-white" />
) : isCurrent ? (
<div className="size-3 rounded-full bg-primary animate-pulse" />
) : (
<div className="size-3 rounded-full bg-gray-500" />
)}
</div>

<div className="flex-1 pb-6">
<div
className={`rounded-lg border p-4 transition-all ${
isCompleted
? 'bg-card border-green-200 dark:border-green-800'
: isCurrent
? 'bg-primary/5 border-primary'
: 'bg-muted/50 border-muted'
}`}
>
<div className="flex items-start justify-between gap-4">
<div className="flex-1">
<div className="flex items-center gap-2">
<h3
className={`font-semibold ${
isCurrent ? 'text-primary' : ''
}`}
>
{stage.title}
</h3>
{isCompleted && (
<Badge
variant="outline"
className="bg-green-50 text-green-700 border-green-200"
>
Completed
</Badge>
)}
{isCurrent && (
<Badge
variant="default"
className="animate-pulse"
>
Current Step
</Badge>
)}
</div>
<p className="text-sm text-muted-foreground mt-1">
{stage.description}
</p>

{isCompleted && stage.completedActivity && (
<div className="mt-3 pt-3 border-t">
<p className="text-xs text-muted-foreground">
Completed on{' '}
{format(
new Date(
stage.completedActivity.activity_time
),
'MMM dd, yyyy HH:mm'
)}
</p>
{stage.completedActivity.description && (
<p className="text-sm mt-2">
{stage.completedActivity.description}
</p>
)}

{stage.completedActivity.attachments && (
<div className="mt-3 space-y-2">
<p className="text-xs font-medium">
Attachments:
</p>
{stage.completedActivity.attachments
.ct_bad_part && (
<a
href={`/storage/${stage.completedActivity.attachments.ct_bad_part}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
>
<Download className="size-3" />
CT Bad Part
</a>
)}
{stage.completedActivity.attachments
.ct_good_part && (
<a
href={`/storage/${stage.completedActivity.attachments.ct_good_part}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
>
<Download className="size-3" />
CT Good Part
</a>
)}
{stage.completedActivity.attachments
.bap_file && (
<a
href={`/storage/${stage.completedActivity.attachments.bap_file}`}
target="_blank"
rel="noopener noreferrer"
className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
>
<FileText className="size-3" />
BAP Document
</a>
)}
</div>
)}
</div>
)}

{isCurrent && (
<div className="mt-4">
<Button
onClick={() =>
handleStageComplete(stage)
}
className="w-full"
>
Complete {stage.title}
</Button>
</div>
)}
</div>
</div>
</div>
</div>
</div>
)
})}
</div>
</div>
</ScrollArea>
</CardContent>
</Card>
</div>

<Dialog
open={
currentStageDialog !== null &&
currentStageDialog !== 'end_working' &&
!showFinishDialog
}
onOpenChange={(open) => !open && setCurrentStageDialog(null)}
>
<DialogContent>
<DialogHeader>
<DialogTitle>{stageForm.data.title || 'Complete Stage'}</DialogTitle>
<DialogDescription>
Add any notes or details about this step
</DialogDescription>
</DialogHeader>
<form onSubmit={handleSimpleStageSubmit} className="space-y-4">
<div>
<Label>Description (Optional)</Label>
<Textarea
value={stageForm.data.description}
onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
stageForm.setData('description', e.target.value)
}
placeholder="Add any notes or observations..."
rows={3}
/>
</div>
<div>
<Label>Completion Time</Label>
<Input
type="datetime-local"
value={stageForm.data.activity_time}
onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
stageForm.setData('activity_time', e.target.value)
}
required
/>
</div>
<div className="flex justify-end gap-2">
<Button
type="button"
variant="outline"
onClick={() => setCurrentStageDialog(null)}
>
Cancel
</Button>
<Button type="submit" disabled={stageForm.processing}>
{stageForm.processing ? 'Saving...' : 'Complete Stage'}
</Button>
</div>
</form>
</DialogContent>
</Dialog>

<Dialog
open={currentStageDialog === 'end_working'}
onOpenChange={(open) => !open && setCurrentStageDialog(null)}
>
<DialogContent className="max-w-2xl">
<DialogHeader>
<DialogTitle>End Working</DialogTitle>
<DialogDescription>
Upload completion documents (CT Bad Part, CT Good Part, BAP)
</DialogDescription>
</DialogHeader>
<form onSubmit={handleEndWorkingSubmit} className="space-y-4">
<div>
<Label>CT Bad Part *</Label>
<Input
type="file"
accept=".jpg,.jpeg,.png,.pdf"
onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
endWorkingForm.setData(
'ct_bad_part',
e.target.files?.[0] || null
)
}
required
/>
<p className="text-xs text-muted-foreground mt-1">
Upload image or PDF (max 10MB)
</p>
</div>
<div>
<Label>CT Good Part *</Label>
<Input
type="file"
accept=".jpg,.jpeg,.png,.pdf"
onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
endWorkingForm.setData(
'ct_good_part',
e.target.files?.[0] || null
)
}
required
/>
<p className="text-xs text-muted-foreground mt-1">
Upload image or PDF (max 10MB)
</p>
</div>
<div>
<Label>BAP (Berita Acara Pekerjaan) *</Label>
<Input
type="file"
accept=".pdf"
onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
endWorkingForm.setData('bap_file', e.target.files?.[0] || null)
}
required
/>
<p className="text-xs text-muted-foreground mt-1">
Upload PDF only (max 10MB)
</p>
</div>
<div>
<Label>Notes (Optional)</Label>
<Textarea
value={endWorkingForm.data.notes}
onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
endWorkingForm.setData('notes', e.target.value)
}
placeholder="Add any completion notes..."
rows={3}
/>
</div>
<div className="flex justify-end gap-2">
<Button
type="button"
variant="outline"
onClick={() => setCurrentStageDialog(null)}
>
Cancel
</Button>
<Button type="submit" disabled={endWorkingForm.processing}>
{endWorkingForm.processing
? 'Uploading...'
: 'Complete End Working'}
</Button>
</div>
</form>
</DialogContent>
</Dialog>

<Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
<DialogContent>
<DialogHeader>
<DialogTitle>Finish Job</DialogTitle>
<DialogDescription>
Choose to close this case or mark it for revisit
</DialogDescription>
</DialogHeader>
<form onSubmit={handleFinishSubmit} className="space-y-4">
<div className="space-y-3">
<Label>Action *</Label>
<div className="grid grid-cols-2 gap-3">
<Button
type="button"
variant={
finishForm.data.action === 'end_case'
? 'default'
: 'outline'
}
className="h-20 flex-col gap-2"
onClick={() => finishForm.setData('action', 'end_case')}
>
<CheckCircle className="size-6" />
<span>End Case</span>
</Button>
<Button
type="button"
variant={
finishForm.data.action === 'revisit' ? 'default' : 'outline'
}
className="h-20 flex-col gap-2"
onClick={() => finishForm.setData('action', 'revisit')}
>
<XCircle className="size-6" />
<span>Revisit</span>
</Button>
</div>
</div>
<div>
<Label>
{finishForm.data.action === 'revisit'
? 'Reason for Revisit *'
: 'Final Notes (Optional)'}
</Label>
<Textarea
value={finishForm.data.notes}
onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
finishForm.setData('notes', e.target.value)
}
placeholder={
finishForm.data.action === 'revisit'
? 'Explain why this ticket needs a revisit...'
: 'Add any final notes...'
}
rows={3}
required={finishForm.data.action === 'revisit'}
/>
</div>
<div className="flex justify-end gap-2">
<Button
type="button"
variant="outline"
onClick={() => setShowFinishDialog(false)}
>
Cancel
</Button>
<Button type="submit" disabled={finishForm.processing}>
{finishForm.processing
? 'Processing...'
: finishForm.data.action === 'end_case'
? 'Close Case'
: 'Mark for Revisit'}
</Button>
</div>
</form>
</DialogContent>
</Dialog>
</div>
</AppLayout>
)
}
