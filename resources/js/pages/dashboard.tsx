import { UIShowcase } from '@/components/ui-showcase';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList>
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="ui-showcase">
                            UI Showcase
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome to AppDesk</CardTitle>
                                <CardDescription>
                                    This application integrates DaisyUI, ShadCN
                                    UI, and Radix UI for a comprehensive UI
                                    component library.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    <Button variant="default">
                                        ShadCN Button
                                    </Button>
                                    <button className="btn btn-primary">
                                        DaisyUI Button
                                    </button>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="mb-2 text-lg font-semibold">
                                        Integrated UI Libraries
                                    </h3>
                                    <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                                        <li>
                                            <strong>ShadCN UI</strong> -
                                            Accessible React components built on
                                            Radix UI
                                        </li>
                                        <li>
                                            <strong>DaisyUI</strong> - Beautiful
                                            Tailwind CSS components
                                        </li>
                                        <li>
                                            <strong>Radix UI Themes</strong> -
                                            Themeable design system
                                        </li>
                                        <li>
                                            <strong>Tailwind CSS v4</strong> -
                                            Modern utility-first CSS framework
                                        </li>
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                            <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                                <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                            </div>
                        </div>

                        <div className="relative min-h-[50vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                            <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                        </div>
                    </TabsContent>

                    <TabsContent value="ui-showcase" className="mt-4">
                        <UIShowcase />
                    </TabsContent>
                </Tabs>
            </div>
        </AppLayout>
    );
}
