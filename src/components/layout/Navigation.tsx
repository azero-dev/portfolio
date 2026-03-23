'use client';

import { useState } from 'react';
import { AiOutlineGithub, AiOutlineLinkedin } from 'react-icons/ai';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Blog', href: '/blog' },
];

const SOCIAL_LINKS = [
  {
    label: 'GitHub',
    href: 'https://github.com/azero-dev',
    icon: AiOutlineGithub,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/franrodriguez1/',
    icon: AiOutlineLinkedin,
  },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <ul className="flex items-center gap-6">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                &gt;{item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label={social.label}
            >
              <social.icon className="h-5 w-5" />
            </a>
          ))}
        </div>
      </nav>

      {/* Mobile menu button */}
      <Button
        variant="outline"
        size="icon"
        className="md:hidden h-9 w-9"
        onClick={() => setMobileMenuOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          'transition-all duration-300 ease-out',
          mobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none translate-y-4',
          'md:hidden'
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className={cn(
            'flex flex-col h-full items-center justify-center gap-12',
            'transition-all duration-300 ease-out delay-100',
            mobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          )}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute top-6 right-6 h-9 w-9"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </Button>

          <ul className="flex flex-col items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="font-mono text-2xl text-foreground hover:text-primary transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  &gt;{item.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-8">
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:text-primary transition-colors"
                aria-label={social.label}
                onClick={() => setMobileMenuOpen(false)}
              >
                <social.icon className="h-8 w-8" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
