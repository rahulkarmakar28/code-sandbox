"use client"

import type React from "react"

import { Code2, Sun, Moon, Settings, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { dark, light } from "@clerk/themes"

import Link from "next/link"
import { UserButton, useUser } from "@clerk/nextjs"
interface HeaderProps {
  showHomeButton?: boolean
  showSettingsButton?: boolean
  onSettingsClick?: () => void
  children?: React.ReactNode
}

export function Header({ showHomeButton, showSettingsButton, onSettingsClick, children }: HeaderProps) {
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const { isSignedIn } = useUser()

  const headerClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  return (
    <header className={`${headerClasses} border-b px-6 py-4 flex items-center justify-between`}>
      <div className="flex items-center space-x-3">
        <Code2 className="w-8 h-8 text-blue-500" />
        <h1 className="text-xl font-bold">CodeSandbox</h1>
      </div>

      <div className="flex items-center space-x-4">
        {showHomeButton && (
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className={isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        )}

        {children}

        {/* {showSettingsButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            className={isDarkMode ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"}
          >
            <Settings className="w-4 h-4" />
          </Button>
        )} */}

        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className={`${isDarkMode
            ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100"
            : "border-gray-300 hover:bg-gray-100 bg-white text-gray-900"
            }`}
        >
          {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>

        {isSignedIn ? (
          <UserButton
            appearance={{
              baseTheme: isDarkMode ? dark : light,
              elements: {
                avatarBox: "w-8 h-8",
                card: isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900",
                userButtonPopoverCard: isDarkMode
                  ? "bg-gray-800 border border-gray-700 shadow-lg"
                  : "bg-white border border-gray-200 shadow-lg",
                userButtonPopoverUserPreview: isDarkMode
                  ? "bg-gray-800 border-b border-gray-700"
                  : "bg-white border-b border-gray-200",
                userButtonPopoverUserIdentifier: isDarkMode ? "text-white" : "text-gray-900",
                userButtonPopoverActionButton: isDarkMode
                  ? "text-gray-100 hover:bg-gray-700"
                  : "text-gray-900 hover:bg-gray-100",
                userButtonPopoverActionText: isDarkMode ? "text-gray-300" : "text-gray-600",
                userButtonTrigger: isDarkMode ? "text-white" : "text-gray-900",
              },
            }}
          />

        ) : (
          <Link href="/sign-in">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Sign In</Button>
          </Link>
        )}
      </div>
    </header>
  )
}
