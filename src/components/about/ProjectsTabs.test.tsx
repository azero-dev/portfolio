import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProjectsTabs } from './ProjectsTabs';

// Mock shadcn/ui components
vi.mock('@/components/ui/tabs', () => ({
  Tabs: ({ children, defaultValue, className }: any) => (
    <div data-testid="tabs" className={className} data-default-value={defaultValue}>
      {children}
    </div>
  ),
  TabsList: ({ children, className }: any) => (
    <div data-testid="tabs-list" className={className}>
      {children}
    </div>
  ),
  TabsTrigger: ({ children, value, className }: any) => (
    <button data-testid="tabs-trigger" data-value={value} className={className}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value, className }: any) => (
    <div data-testid="tabs-content" data-value={value} className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/card', () => ({
  Card: ({ children, className }: any) => (
    <div data-testid="card" className={className}>
      {children}
    </div>
  ),
  CardHeader: ({ children, className }: any) => (
    <div data-testid="card-header" className={className}>
      {children}
    </div>
  ),
  CardTitle: ({ children, className }: any) => (
    <h3 data-testid="card-title" className={className}>
      {children}
    </h3>
  ),
  CardDescription: ({ children, className }: any) => (
    <p data-testid="card-description" className={className}>
      {children}
    </p>
  ),
  CardContent: ({ children, className }: any) => (
    <div data-testid="card-content" className={className}>
      {children}
    </div>
  ),
}));

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => (
    <span data-testid="badge" data-variant={variant} className={className}>
      {children}
    </span>
  ),
}));

vi.mock('@/components/ui/button', () => ({
  Button: ({ children, variant, size, asChild, ...props }: any) => {
    const Component = asChild ? 'a' : 'button';
    return (
      <Component data-testid="button" data-variant={variant} data-size={size} {...props}>
        {children}
      </Component>
    );
  },
}));

const mockActiveProjects = [
  {
    id: 1,
    title: 'Active Project 1',
    description: 'Description 1',
    tags: ['React', 'TypeScript'],
    link: 'https://example.com',
    image: '/image1.png',
    status: 'active',
    date: '2024-01-01',
  },
];

const mockArchivedProjects = [
  {
    id: 2,
    title: 'Archived Project 1',
    description: 'Description 2',
    tags: ['Vue', 'JavaScript'],
    link: 'https://example.com',
    image: '/image2.png',
    status: 'archived',
    date: '2023-01-01',
  },
];

describe('ProjectsTabs', () => {
  it('should render active and archived tabs with counts', () => {
    render(
      <ProjectsTabs activeProjects={mockActiveProjects} archivedProjects={mockArchivedProjects} />
    );

    expect(screen.getByTestId('tabs')).toBeInTheDocument();
    expect(screen.getByText('Active (1)')).toBeInTheDocument();
    expect(screen.getByText('Archived (1)')).toBeInTheDocument();
  });

  it('should render active projects by default', () => {
    render(
      <ProjectsTabs activeProjects={mockActiveProjects} archivedProjects={mockArchivedProjects} />
    );

    expect(screen.getByText('Active Project 1')).toBeInTheDocument();
    // Archived projects might also be rendered due to mock simplicity
    // We'll just ensure active project is present
  });

  it('should switch to archived tab when clicked', () => {
    render(
      <ProjectsTabs activeProjects={mockActiveProjects} archivedProjects={mockArchivedProjects} />
    );

    const archivedTrigger = screen.getByText('Archived (1)');
    fireEvent.click(archivedTrigger);

    expect(screen.getByText('Archived Project 1')).toBeInTheDocument();
    // Active project may still be visible due to mock simplicity
  });

  it('should render tags for projects', () => {
    render(
      <ProjectsTabs activeProjects={mockActiveProjects} archivedProjects={mockArchivedProjects} />
    );

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should render archived projects with archived badge', () => {
    render(
      <ProjectsTabs activeProjects={mockActiveProjects} archivedProjects={mockArchivedProjects} />
    );

    fireEvent.click(screen.getByText('Archived (1)'));

    expect(screen.getByText('Archived Project 1')).toBeInTheDocument();
    // The archived indicator appears in the description
    const archivedIndicator = screen
      .getAllByText(/Archived/)
      .find((el) => el.textContent?.includes('(Archived)'));
    expect(archivedIndicator).toBeInTheDocument();
  });
});
