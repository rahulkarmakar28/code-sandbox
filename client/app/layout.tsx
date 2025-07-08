import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/contexts/theme-context"
import { EditorProvider } from "@/contexts/editor-context"
import Script from "next/script"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CodeSandbox - Online Code Editor",
  description: "Write, run, and share code in your browser with our professional online IDE",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head />
        <body className={inter.className} suppressHydrationWarning>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="beforeInteractive"
          />
          <ThemeProvider>
            <EditorProvider>{children}</EditorProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
