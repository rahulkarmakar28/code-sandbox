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
    if (!containerRef.current) return

    // Load Cloudflare Turnstile script
    const script = document.createElement("script")
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      if (window.turnstile && containerRef.current) {
        window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme: isDarkMode ? "dark" : "light",
          callback: onVerify,
          "error-callback": onError,
          "expired-callback": onExpire,
        })
      }
    }

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [siteKey, onVerify, onError, onExpire, isDarkMode])

  return <div ref={containerRef} className={className} />
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    turnstile: {
      render: (container: HTMLElement, options: any) => void
      reset: (widgetId?: string) => void
      remove: (widgetId?: string) => void
    }
  }
}
