"use client"

import { useState, useEffect } from "react"
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import Link from "next/link"

interface AuthSectionProps {
  isMobile?: boolean
}

export default function AuthSection({ isMobile = false }: AuthSectionProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Small delay to prevent flash, then show auth components
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 50)

    return () => clearTimeout(timer)
  }, [])

  const avatarSize = isMobile ? "w-8 h-8" : "w-10 h-10"
  const buttonSize = isMobile ? "px-3 py-2 text-xs" : "px-4 py-2.5 text-sm"
  const containerSize = isMobile ? "min-w-[60px] h-8" : "min-w-[100px] h-10"
  const skeletonSize = isMobile ? "w-8 h-8" : "w-10 h-10"

  return (
    <div className={`flex items-center justify-end ${containerSize}`}>
      {!isLoaded ? (
        <div className={`${skeletonSize} rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse`}></div>
      ) : (
        <>
          <SignedIn>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: avatarSize,
                },
              }}
            />
          </SignedIn>
          <SignedOut>
            <Link
              href="/sign-in"
              className={`inline-block ${buttonSize} font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition whitespace-nowrap`}
            >
              Sign In
            </Link>
          </SignedOut>
        </>
      )}
    </div>
  )
}
