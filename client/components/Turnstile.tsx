"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "@/contexts/theme-context"

interface TurnstileProps {
  siteKey: string
  onVerify: (token: string) => void
  onError?: () => void
  onExpire?: () => void
  className?: string
}

export function Turnstile({ siteKey, onVerify, onError, onExpire, className }: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  useEffect(() => {
    if (typeof window === "undefined" || !window.turnstile || !containerRef.current) return

    // Render only once
    const widgetId = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      theme: isDarkMode ? "dark" : "light",
      callback: onVerify,
      "error-callback": onError,
      "expired-callback": onExpire,
    })

    return () => {
      if (window.turnstile && widgetId) {
        window.turnstile.remove(widgetId)
      }
    }
  }, [siteKey, isDarkMode, onVerify, onError, onExpire])

  return <div ref={containerRef} className={className} />
}

declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: any) => string
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}
