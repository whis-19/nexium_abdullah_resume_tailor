import * as React from 'react';
import * as Switch from '@radix-ui/react-switch';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import clsx from 'clsx';

export function ThemeToggle({ isDark, toggleTheme, className }) {
  return (
    <Switch.Root
      className={clsx(
        'inline-flex items-center w-12 h-7 rounded-full p-1 transition-colors',
        isDark ? 'bg-gray-700' : 'bg-gray-300',
        className
      )}
      checked={isDark}
      onCheckedChange={toggleTheme}
      aria-label="Toggle theme"
    >
      <Switch.Thumb
        className={clsx(
          'w-5 h-5 rounded-full shadow-lg flex items-center justify-center transition-transform duration-200',
          isDark ? 'bg-gray-900 translate-x-5' : 'bg-white translate-x-0'
        )}
      >
        {isDark ? (
          <SunIcon className="w-4 h-4 text-yellow-400" />
        ) : (
          <MoonIcon className="w-4 h-4 text-gray-700" />
        )}
      </Switch.Thumb>
    </Switch.Root>
  );
} 