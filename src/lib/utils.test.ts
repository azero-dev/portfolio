import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('cn utility', () => {
  it('should merge class names', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
  });

  it('should handle conditional classes', () => {
    expect(cn('base', true && 'conditional', false && 'hidden')).toBe('base conditional');
  });

  it('should merge Tailwind classes correctly', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');
  });

  it('should handle empty strings and null/undefined', () => {
    expect(cn('class', '', null, undefined, false && 'no')).toBe('class');
  });

  it('should handle arrays and objects', () => {
    expect(cn(['class1', 'class2'], { class3: true, class4: false })).toBe('class1 class2 class3');
  });
});
