'use client'

import * as React from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function DarkModeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null 

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        resolvedTheme === 'dark'
          ? 'Activate light mode'
          : 'Activate dark mode'
      }
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
    >
      <Sun
        className={`absolute h-5 w-5 transition-opacity duration-200 ${
          resolvedTheme === 'dark'
            ? 'opacity-0 scale-90'
            : 'opacity-100 scale-100'
        }`}
      />
      <Moon
        className={`absolute h-5 w-5 transition-opacity duration-200 ${
          resolvedTheme === 'dark'
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-90'
        }`}
      />
    </button>
  )
}