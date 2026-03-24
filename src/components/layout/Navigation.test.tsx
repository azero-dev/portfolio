import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Navigation } from './Navigation';

// Mock react-icons
vi.mock('react-icons/ai', () => ({
  AiOutlineGithub: () => <div data-testid="github-icon">GitHub</div>,
  AiOutlineLinkedin: () => <div data-testid="linkedin-icon">LinkedIn</div>,
}));

// Mock lucide-react - return simple divs to avoid nested buttons
vi.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="close-icon">Close</div>,
}));

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: vi.fn(),
  }),
}));

// Mock shadcn/ui Button - render as a div that passes onClick
vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    className,
    'aria-label': ariaLabel,
    ...props
  }: any) => (
    <div
      onClick={onClick}
      className={className}
      data-testid="button"
      data-variant={variant}
      data-size={size}
      aria-label={ariaLabel}
      {...props}
    >
      {children}
    </div>
  ),
}));

// Mock utils
vi.mock('@/lib/utils', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' '),
}));

describe('Navigation', () => {
  it('should render desktop navigation with links and social icons', () => {
    const { getAllByText, getAllByTestId } = render(<Navigation />);

    // There are two >Home links (desktop and mobile), ensure at least one exists
    expect(getAllByText('>Home').length).toBeGreaterThan(0);
    expect(getAllByText('>About').length).toBeGreaterThan(0);

    // There are two github icons (desktop and mobile)
    expect(getAllByTestId('github-icon').length).toBeGreaterThan(0);
    expect(getAllByTestId('linkedin-icon').length).toBeGreaterThan(0);
  });

  it('should open mobile menu when menu button is clicked', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByTestId } = render(<Navigation />);

    const menuButton = getByLabelText('Open menu');
    expect(menuButton).toBeInTheDocument();

    const mobileMenu = getByTestId('mobile-menu');
    expect(mobileMenu).toHaveClass('opacity-0');

    await user.click(menuButton);
    expect(mobileMenu).toHaveClass('opacity-100');
  });

  it('should close mobile menu when close button is clicked', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByTestId } = render(<Navigation />);

    // Open menu
    const menuButton = getByLabelText('Open menu');
    await user.click(menuButton);

    const closeButton = getByLabelText('Close menu');
    expect(closeButton).toBeInTheDocument();

    await user.click(closeButton);
    const mobileMenu = getByTestId('mobile-menu');
    expect(mobileMenu).toHaveClass('opacity-0');
  });

  it('should close mobile menu when clicking a navigation link', async () => {
    const user = userEvent.setup();
    const { getByLabelText, getByTestId } = render(<Navigation />);

    // Open menu
    const menuButton = getByLabelText('Open menu');
    await user.click(menuButton);

    // Click Home link (there are two, but we can click the first one inside mobile menu)
    // The mobile menu links are inside the mobile menu container
    const mobileMenu = getByTestId('mobile-menu');
    const homeLink = mobileMenu.querySelector('a[href="/"]');
    expect(homeLink).toBeInTheDocument();
    await user.click(homeLink!);

    expect(mobileMenu).toHaveClass('opacity-0');
  });
});
