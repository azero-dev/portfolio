---
title: 'Advanced Tailwind CSS Patterns for 2024'
description: 'Beyond the basics: creative uses of Tailwind CSS for modern web development'
pubDate: 2024-03-10
tags: ['tailwind', 'css', 'design', 'frontend']
draft: false
---

# Tailwind CSS Advanced Patterns

Tailwind CSS has evolved beyond utility classes. Here are some advanced patterns for 2024.

## Custom Property Integration

Use CSS custom properties with Tailwind for dynamic theming:

```css
/* In your theme.css */
:root {
  --primary: 20 100% 60%;
  --background: 0 0% 7%;
}

/* In tailwind.config.js */
theme: {
  extend: {
    colors: {
      primary: 'hsl(var(--primary))',
      background: 'hsl(var(--background))',
    },
  },
}
```

## Component Variants with cva

Use `class-variance-authority` for type-safe component variants:

```jsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva('inline-flex items-center justify-center rounded-md font-medium', {
  variants: {
    variant: {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
      outline: 'border border-input bg-background hover:bg-accent',
    },
    size: {
      sm: 'h-9 px-3 text-sm',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
    },
  },
});
```

## Container Queries

Use container queries for component-scoped responsive design:

```html
<div class="@container">
  <div class="block @sm:flex @lg:grid">
    <!-- Content that responds to container size -->
  </div>
</div>
```

## Arbitrary Values with CSS Functions

Use arbitrary values for complex calculations:

```html
<div class="grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))]">
  <!-- Responsive grid without custom CSS -->
</div>
```

## Dark Mode with CSS Variables

Implement dark mode with CSS variable swapping:

```css
.dark {
  --background: 0 0% 7%;
  --foreground: 0 0% 100%;
}
```

## Conclusion

Tailwind CSS continues to evolve. Stay updated with new features and experiment with creative patterns.
