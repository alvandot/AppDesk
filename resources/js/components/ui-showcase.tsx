import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import * as Radix from '@radix-ui/themes';

/**
 * UI Showcase Component
 * Demonstrates the integration of DaisyUI, ShadCN, and Radix UI components
 */
export function UIShowcase() {
    return (
        <div className="space-y-8 p-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold">
                    UI Library Integration Showcase
                </h1>
                <p className="text-muted-foreground">
                    A comprehensive demonstration of DaisyUI, ShadCN, and Radix
                    UI working together
                </p>
            </div>

            <Separator />

            {/* ShadCN UI Components */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">ShadCN UI Components</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Buttons</CardTitle>
                            <CardDescription>
                                Various button styles from ShadCN
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Button>Default</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="destructive">Destructive</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost</Button>
                            <Button variant="link">Link</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Form Controls</CardTitle>
                            <CardDescription>
                                Input fields and checkboxes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox id="terms" />
                                <Label htmlFor="terms">
                                    Accept terms and conditions
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch id="notifications" />
                                <Label htmlFor="notifications">
                                    Enable notifications
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Badges & Avatar</CardTitle>
                            <CardDescription>
                                Visual indicators and user avatars
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge>Default</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="destructive">
                                    Destructive
                                </Badge>
                                <Badge variant="outline">Outline</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage
                                        src="https://github.com/shadcn.png"
                                        alt="@shadcn"
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-sm font-medium">
                                        John Doe
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        john@example.com
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Tabs</CardTitle>
                        <CardDescription>
                            Tabbed interface example
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="account" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="account">
                                    Account
                                </TabsTrigger>
                                <TabsTrigger value="settings">
                                    Settings
                                </TabsTrigger>
                                <TabsTrigger value="notifications">
                                    Notifications
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="account" className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Make changes to your account here.
                                </p>
                            </TabsContent>
                            <TabsContent value="settings" className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Change your settings here.
                                </p>
                            </TabsContent>
                            <TabsContent
                                value="notifications"
                                className="space-y-4"
                            >
                                <p className="text-sm text-muted-foreground">
                                    Configure your notification preferences.
                                </p>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </section>

            <Separator />

            {/* DaisyUI Components */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">DaisyUI Components</h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>DaisyUI Buttons</CardTitle>
                            <CardDescription>
                                Button styles from DaisyUI
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <button className="btn">Default</button>
                            <button className="btn btn-primary">Primary</button>
                            <button className="btn btn-secondary">
                                Secondary
                            </button>
                            <button className="btn btn-accent">Accent</button>
                            <button className="btn btn-ghost">Ghost</button>
                            <button className="btn btn-link">Link</button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>DaisyUI Alerts</CardTitle>
                            <CardDescription>
                                Alert components from DaisyUI
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div role="alert" className="alert alert-info">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    ></path>
                                </svg>
                                <span>Info alert!</span>
                            </div>
                            <div role="alert" className="alert alert-success">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>Success!</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>DaisyUI Badges</CardTitle>
                            <CardDescription>
                                Badge variants from DaisyUI
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <div className="badge">Default</div>
                            <div className="badge badge-primary">Primary</div>
                            <div className="badge badge-secondary">
                                Secondary
                            </div>
                            <div className="badge badge-accent">Accent</div>
                            <div className="badge badge-ghost">Ghost</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>DaisyUI Cards</CardTitle>
                        <CardDescription>
                            Card components from DaisyUI
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">Card Title</h2>
                                <p>
                                    This is a DaisyUI card component with a
                                    title and description.
                                </p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary">
                                        Action
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body">
                                <h2 className="card-title">
                                    Another Card
                                    <div className="badge badge-secondary">
                                        NEW
                                    </div>
                                </h2>
                                <p>
                                    Cards can be combined with badges and other
                                    components.
                                </p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-ghost btn-sm">
                                        Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            <Separator />

            {/* Radix UI Components */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Radix UI Themes Components
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Radix Buttons</CardTitle>
                            <CardDescription>
                                Button components from Radix UI Themes
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-wrap gap-2">
                            <Radix.Button>Default</Radix.Button>
                            <Radix.Button variant="soft">Soft</Radix.Button>
                            <Radix.Button variant="outline">
                                Outline
                            </Radix.Button>
                            <Radix.Button variant="ghost">Ghost</Radix.Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Radix Text & Heading</CardTitle>
                            <CardDescription>
                                Typography components
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Radix.Heading size="4">
                                This is a Heading
                            </Radix.Heading>
                            <Radix.Text size="2">
                                This is regular text from Radix UI Themes.
                            </Radix.Text>
                            <Radix.Text size="1" color="gray">
                                This is smaller muted text.
                            </Radix.Text>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Radix Badge & Code</CardTitle>
                            <CardDescription>
                                Inline components from Radix
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Radix.Badge>Default</Radix.Badge>
                                <Radix.Badge color="blue">Blue</Radix.Badge>
                                <Radix.Badge color="green">Green</Radix.Badge>
                                <Radix.Badge color="red">Red</Radix.Badge>
                            </div>
                            <Radix.Code>const greeting = "Hello World";</Radix.Code>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Radix Flex & Grid Layouts</CardTitle>
                        <CardDescription>
                            Layout components from Radix UI
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Radix.Flex gap="3" align="center">
                            <Radix.Avatar
                                size="3"
                                src="https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?&w=256&h=256&q=70&crop=focalpoint&fp-x=0.5&fp-y=0.3&fp-z=1&fit=crop"
                                fallback="A"
                            />
                            <Radix.Box>
                                <Radix.Text as="div" size="2" weight="bold">
                                    Radix UI Layout
                                </Radix.Text>
                                <Radix.Text as="div" size="1" color="gray">
                                    Using Flex and Box components
                                </Radix.Text>
                            </Radix.Box>
                        </Radix.Flex>
                    </CardContent>
                </Card>
            </section>

            <Separator />

            {/* Mixed Integration Example */}
            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">
                    Mixed Integration Example
                </h2>
                <Card>
                    <CardHeader>
                        <CardTitle>User Profile Card</CardTitle>
                        <CardDescription>
                            Combining ShadCN, DaisyUI, and Radix UI components
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Radix.Flex gap="4" align="center">
                            {/* ShadCN Avatar */}
                            <Avatar className="h-16 w-16">
                                <AvatarImage
                                    src="https://github.com/shadcn.png"
                                    alt="User"
                                />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>

                            <Radix.Box className="flex-1">
                                {/* Radix Typography */}
                                <Radix.Heading size="4">
                                    John Doe
                                </Radix.Heading>
                                <Radix.Text size="2" color="gray">
                                    Software Engineer
                                </Radix.Text>

                                {/* Mixed badges */}
                                <div className="mt-2 flex gap-2">
                                    <Badge variant="secondary">ShadCN</Badge>
                                    <div className="badge badge-primary">
                                        DaisyUI
                                    </div>
                                    <Radix.Badge color="green">
                                        Radix
                                    </Radix.Badge>
                                </div>
                            </Radix.Box>

                            {/* ShadCN Button with DaisyUI styling */}
                            <div className="flex gap-2">
                                <Button variant="outline">Edit</Button>
                                <button className="btn btn-primary">
                                    Contact
                                </button>
                            </div>
                        </Radix.Flex>

                        <Separator />

                        <div className="grid gap-4 md:grid-cols-3">
                            <div>
                                <Radix.Text
                                    as="div"
                                    size="1"
                                    weight="bold"
                                    className="mb-1"
                                >
                                    Projects
                                </Radix.Text>
                                <Radix.Text size="3" weight="bold">
                                    24
                                </Radix.Text>
                            </div>
                            <div>
                                <Radix.Text
                                    as="div"
                                    size="1"
                                    weight="bold"
                                    className="mb-1"
                                >
                                    Followers
                                </Radix.Text>
                                <Radix.Text size="3" weight="bold">
                                    1,234
                                </Radix.Text>
                            </div>
                            <div>
                                <Radix.Text
                                    as="div"
                                    size="1"
                                    weight="bold"
                                    className="mb-1"
                                >
                                    Following
                                </Radix.Text>
                                <Radix.Text size="3" weight="bold">
                                    567
                                </Radix.Text>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
