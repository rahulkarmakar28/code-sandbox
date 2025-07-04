import type { Metadata } from 'next'
import {
  ClerkProvider
} from '@clerk/nextjs'
import { dark } from '@clerk/themes' // Optional, if you're using themes

import './globals.css'

export const metadata: Metadata = {
  title: 'Code Sandbox',
  description: 'code compilation website',
  generator: 'rahulkarmakar28',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
            elements: {
              card: "shadow-none bg-gray-900 text-white",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              formButtonPrimary: "bg-indigo-600 hover:bg-indigo-700 text-white",
              formFieldInput: "bg-gray-800 text-white placeholder-gray-400",
            },
          }}
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
