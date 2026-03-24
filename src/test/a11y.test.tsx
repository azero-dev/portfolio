import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import axe from 'axe-core';
import { Navigation } from '@/components/layout/Navigation';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import { ProjectsTabs } from '@/components/about/ProjectsTabs';

// Mock dependencies for components
vi.mock('react-icons/ai', () => ({
  AiOutlineGithub: () => <div aria-label="GitHub">GitHub</div>,
  AiOutlineLinkedin: () => <div aria-label="LinkedIn">LinkedIn</div>,
}));

vi.mock('lucide-react', () => ({
  Menu: () => <div aria-label="Menu">Menu</div>,
  X: () => <div aria-label="Close">Close</div>,
  Sun: () => <div aria-label="Sun">Sun</div>,
  Moon: () => <div aria-label="Moon">Moon</div>,
}));

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'dark', setTheme: vi.fn(), themes: ['light', 'dark'] }),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, asChild, ...props }: any) => {
    if (asChild) {
      // Render the child element directly without wrapping button
      // Children should be a single React element (e.g., <a>)
      return children;
    }
    return <button {...props}>{children}</button>;
  },
}));

vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, value }: any) => <button data-value={value}>{children}</button>,
  TabsContent: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h3>{children}</h3>,
  CardDescription: ({ children }: any) => <p>{children}</p>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: any) => <span>{children}</span>,
}));

vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

const runAxe = async (container: HTMLElement) => {
  const results = await axe.run(container, {
    rules: {
      // Disable color contrast checks because our theme may not be fully set up in tests
      'color-contrast': { enabled: false },
    },
  });
  return results;
};

describe('Accessibility', () => {
  it('Navigation should have no critical accessibility violations', async () => {
    const { container } = render(<Navigation />);
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('ThemeToggle should have no critical accessibility violations', async () => {
    const { container } = render(<ThemeToggle />);
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('ProjectsTabs should have no critical accessibility violations', async () => {
    const mockActiveProjects = [
      {
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        tags: ['React'],
        link: 'https://example.com',
        image: '',
        status: 'active',
        date: '2024-01-01',
      },
    ];
    const mockArchivedProjects: any[] = [];
    const { container } = render(
      <ProjectsTabs activeProjects={mockActiveProjects} archivedProjects={mockArchivedProjects} />
    );
    const results = await runAxe(container);
    expect(results.violations).toHaveLength(0);
  });
});
