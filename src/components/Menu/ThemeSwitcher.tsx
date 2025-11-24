import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useId, useState } from 'react'

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'
  const id = useId()

  useEffect(() => {
    setMounted(true)
  }, [])
  const handleToggle = () => {
    setTheme(isDark ? 'light' : 'dark')
  }
  if (!mounted) {
    return <div className="w-13 h-6"></div>
  }

  return (
    <div className="flex items-center">
      <div className="relative inline-block w-14 h-7">
        <input
          type="checkbox"
          id={id}
          checked={isDark}
          onChange={handleToggle}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={`block w-14 h-7 rounded-full cursor-pointer transition-colors ${
            isDark ? 'bg-[#1c5e5c]' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 left-1 flex items-center justify-center w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ease-in-out ${
              isDark ? 'translate-x-7' : ''
            }`}
          >
            {isDark ? (
              <Moon className="h-20 w-4 text-blue-600" />
            ) : (
              <Sun className="h-20 w-4 text-yellow-400" />
            )}
          </span>
        </label>
      </div>
    </div>
  )
}

export { ThemeSwitcher }
