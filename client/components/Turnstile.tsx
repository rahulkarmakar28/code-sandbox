"use client"

import { useEffect, useRef } from "react"

interface TurnstileProps {
  onSuccess: (token: string) => void
  onError?: () => void
  onExpired?: () => void
  theme?: "light" | "dark" | "auto"
  size?: "normal" | "compact"
}

declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: any) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

export default function Turnstile({ onSuccess, onError, onExpired, theme = "auto", size = "normal" }: TurnstileProps) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | null>(null)

  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

    if (!siteKey) {
      console.error("Turnstile site key not configured")
      return
    }

    const loadTurnstile = () => {
      if (window.turnstile && ref.current) {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: onSuccess,
          "error-callback": onError,
          "expired-callback": onExpired,
          theme,
          size,
        })
      }
    }

    if (window.turnstile) {
      loadTurnstile()
    } else {
      const script = document.createElement("script")
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js"
      script.async = true
      script.defer = true
      script.onload = loadTurnstile
      document.head.appendChild(script)
    }

    return () => {
      if (widgetId.current && window.turnstile) {
        window.turnstile.remove(widgetId.current)
      }
    }
  }, [onSuccess, onError, onExpired, theme, size])

  return <div ref={ref} />
}
