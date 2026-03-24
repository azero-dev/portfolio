import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from 'next-themes';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Sun: () => <div data-testid="sun-icon">Sun</div>,
  Moon: () => <div data-testid="moon-icon">Moon</div>,
}));

// Mock shadcn/ui Button
vi.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, 'aria-label': ariaLabel }: any) => (
    <button
      onClick={onClick}
      className={className}
      data-testid="theme-button"
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

// Mock utils
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

describe('ThemeToggle', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    mockSetTheme.mockClear();
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
    });
  });

  it('should render sun icon when theme is dark', () => {
    render(<ThemeToggle />);

    expect(screen.getByTestId('sun-icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to light theme')).toBeInTheDocument();
  });

  it('should render moon icon when theme is light', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
    });
    render(<ThemeToggle />);

    expect(screen.getByTestId('moon-icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Switch to dark theme')).toBeInTheDocument();
  });

  it('should call setTheme when clicked', () => {
    render(<ThemeToggle />);

    const button = screen.getByTestId('theme-button');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with dark when clicked in light mode', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      themes: ['light', 'dark'],
    });
    render(<ThemeToggle />);

    const button = screen.getByTestId('theme-button');
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });
});
