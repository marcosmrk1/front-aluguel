'use client'

import { ToastContainer } from 'react-toastify'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'

export function ToastProvider() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      theme={theme === 'dark' ? 'dark' : 'light'}
    />
  )
}
