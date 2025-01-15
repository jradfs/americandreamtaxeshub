"use client"

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'high-contrast'

interface ThemeProviderProps {
  children: React.ReactNode
}

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light')

  useEffect(() => {
    // Check for system high contrast mode
    const mediaQuery = window.matchMedia('(forced-colors: active)')
    const prefersHighContrast = mediaQuery.matches

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as Theme
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    
    // Set initial theme
    if (prefersHighContrast) {
      setTheme('high-contrast')
    } else if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme(systemTheme)
    }

    // Listen for system high contrast mode changes
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        setTheme('high-contrast')
      } else {
        setTheme(localStorage.getItem('theme') as Theme || systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleHighContrastChange)

    return () => {
      mediaQuery.removeEventListener('change', handleHighContrastChange)
    }
  }, [])

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)

    // Update meta theme-color
    const metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        newTheme === 'dark' ? '#000000' : 
        newTheme === 'high-contrast' ? '#000000' : 
        '#ffffff'
      )
    }
  }

  useEffect(() => {
    handleThemeChange(theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  const handleThemeToggle = () => {
    const nextTheme = 
      theme === 'light' ? 'dark' :
      theme === 'dark' ? 'high-contrast' :
      'light'
    setTheme(nextTheme)
  }

  return (
    <button
      onClick={handleThemeToggle}
      className="p-2 rounded-md hover:bg-accent"
      aria-label={`Current theme: ${theme}. Click to switch theme.`}
    >
      {theme === 'light' && (
        <span className="sr-only">Switch to dark mode</span>
      )}
      {theme === 'dark' && (
        <span className="sr-only">Switch to high contrast mode</span>
      )}
      {theme === 'high-contrast' && (
        <span className="sr-only">Switch to light mode</span>
      )}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        className="w-5 h-5"
        aria-hidden="true"
      >
        {theme === 'light' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        )}
        {theme === 'dark' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707"
          />
        )}
        {theme === 'high-contrast' && (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        )}
      </svg>
    </button>
  )
}
