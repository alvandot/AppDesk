// Type declarations for CSS imports
declare module '*.css' {
    const content: Record<string, string>;
    export default content;
}

// Specific declaration for Radix UI themes
declare module '@radix-ui/themes/styles.css';
