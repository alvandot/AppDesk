import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = page.url.startsWith(resolveUrl(item.href));
                    const hasSubItems = item.items && item.items.length > 0;

                    if (!hasSubItems) {
                        return (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={{ children: item.title }}
                                >
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        );
                    }

                    return (
                        <Collapsible
                            key={item.title}
                            asChild
                            defaultOpen={isActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        tooltip={{ children: item.title }}
                                        isActive={isActive}
                                    >
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                        <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {item.items?.map((subItem) => {
                                            const isSubActive =
                                                page.url.includes(
                                                    resolveUrl(subItem.href),
                                                );
                                            const isOpen =
                                                subItem.title.includes('Open');
                                            const isClosed =
                                                subItem.title.includes(
                                                    'Closed',
                                                );

                                            return (
                                                <SidebarMenuSubItem
                                                    key={subItem.title}
                                                >
                                                    <SidebarMenuSubButton
                                                        asChild
                                                        isActive={isSubActive}
                                                        className={
                                                            isOpen
                                                                ? 'hover:bg-green-50 data-[active=true]:bg-green-100 data-[active=true]:text-green-700 dark:hover:bg-green-950/20 dark:data-[active=true]:bg-green-900/30 dark:data-[active=true]:text-green-400'
                                                                : isClosed
                                                                  ? 'hover:bg-red-50 data-[active=true]:bg-red-100 data-[active=true]:text-red-700 dark:hover:bg-red-950/20 dark:data-[active=true]:bg-red-900/30 dark:data-[active=true]:text-red-400'
                                                                  : ''
                                                        }
                                                    >
                                                        <Link
                                                            href={subItem.href}
                                                            prefetch
                                                        >
                                                            <span
                                                                className={
                                                                    isOpen
                                                                        ? 'font-medium text-green-600 dark:text-green-400'
                                                                        : isClosed
                                                                          ? 'font-medium text-red-600 dark:text-red-400'
                                                                          : ''
                                                                }
                                                            >
                                                                {subItem.title}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            );
                                        })}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
