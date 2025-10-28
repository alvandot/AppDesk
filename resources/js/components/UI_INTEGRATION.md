# UI Libraries Integration

This project integrates three powerful UI libraries:

## 1. ShadCN UI
- **Purpose**: High-quality, accessible React components built on Radix UI primitives
- **Location**: `resources/js/components/ui/`
- **Usage**: Import components from `@/components/ui/[component-name]`
- **Example**:
  ```tsx
  import { Button } from '@/components/ui/button';
  import { Card, CardHeader, CardContent } from '@/components/ui/card';
  
  <Button variant="default">Click me</Button>
  <Card>
    <CardHeader>Title</CardHeader>
    <CardContent>Content</CardContent>
  </Card>
  ```

## 2. DaisyUI
- **Purpose**: Beautiful Tailwind CSS component library with semantic class names
- **Configuration**: Configured in `resources/css/app.css` using `@plugin "daisyui"`
- **Usage**: Use DaisyUI class names directly in JSX
- **Example**:
  ```tsx
  <button className="btn btn-primary">DaisyUI Button</button>
  <div className="card bg-base-100 shadow-xl">
    <div className="card-body">
      <h2 className="card-title">Card Title</h2>
      <p>Card content</p>
    </div>
  </div>
  ```

## 3. Radix UI Themes
- **Purpose**: Themeable component system with design tokens
- **Import**: `import * as Radix from '@radix-ui/themes'`
- **Styling**: Styles imported in `resources/css/app.css`
- **Example**:
  ```tsx
  import * as Radix from '@radix-ui/themes';
  
  <Radix.Button>Radix Button</Radix.Button>
  <Radix.Flex gap="3" align="center">
    <Radix.Avatar fallback="A" />
    <Radix.Text>Text content</Radix.Text>
  </Radix.Flex>
  ```

## Best Practices for Integration

### 1. Component Hierarchy
Use each library for its strengths:
- **ShadCN**: Form inputs, dialogs, dropdowns, data tables
- **DaisyUI**: Quick prototyping, alerts, buttons, cards
- **Radix UI Themes**: Layout (Flex, Grid, Box), typography, design system

### 2. Styling Consistency
All three libraries work with Tailwind CSS v4. Custom design tokens are defined in `resources/css/app.css`:

```css
@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  /* ... more tokens */
}
```

### 3. Dark Mode
All libraries support dark mode through Tailwind's dark mode:
- ShadCN: Uses `dark:` prefix automatically
- DaisyUI: Configured with light/dark themes
- Radix UI: Built-in theme support

### 4. TypeScript Support
Type declarations are included for all libraries:
- ShadCN: Full TypeScript support
- DaisyUI: Works with Tailwind utilities
- Radix UI: Complete TypeScript definitions
- CSS imports: Type declarations in `resources/js/types/css-modules.d.ts`

## Example: Mixed Component Usage

```tsx
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import * as Radix from '@radix-ui/themes';

export function MixedExample() {
  return (
    <Card>
      <CardHeader>
        <Radix.Flex justify="between" align="center">
          <Radix.Heading size="4">User Profile</Radix.Heading>
          <Badge variant="secondary">Premium</Badge>
        </Radix.Flex>
      </CardHeader>
      <CardContent>
        <Radix.Flex gap="3" direction="column">
          <Radix.Text>Welcome to the dashboard</Radix.Text>
          <div className="flex gap-2">
            <Button variant="default">ShadCN Button</Button>
            <button className="btn btn-primary">DaisyUI Button</button>
            <Radix.Button>Radix Button</Radix.Button>
          </div>
        </Radix.Flex>
      </CardContent>
    </Card>
  );
}
```

## Component Showcase

See `resources/js/components/ui-showcase.tsx` for a comprehensive demonstration of all three libraries working together.

## Updating Components

### Adding ShadCN Components
```bash
npx shadcn@latest add [component-name]
```

### DaisyUI Configuration
Modify `resources/css/app.css` to customize DaisyUI themes and settings.

### Radix UI Themes
Import additional Radix components as needed:
```tsx
import { Dialog, DropdownMenu, Select } from '@radix-ui/themes';
```

## Resources

- [ShadCN UI Documentation](https://ui.shadcn.com)
- [DaisyUI Documentation](https://daisyui.com)
- [Radix UI Themes Documentation](https://www.radix-ui.com/themes)
- [Tailwind CSS v4 Documentation](https://tailwindcss.com)
