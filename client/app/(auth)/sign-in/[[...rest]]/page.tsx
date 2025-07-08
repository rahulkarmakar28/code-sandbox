"use client"

import { SignIn } from "@clerk/nextjs"
import { useTheme } from "@/contexts/theme-context"
import { Code2 } from "lucide-react"
import Link from "next/link"

export default function SignInPage() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  const clerkAppearance = {
    variables: {
      colorPrimary: isDarkMode ? "#3B82F6" : "#2563EB", // Blue-500 or Blue-600
      colorBackground: isDarkMode ? "#1F2937" : "#FFFFFF", // bg-gray-800 or white
      colorText: isDarkMode ? "#FFFFFF" : "#111827", // white or gray-900
      colorTextSecondary: isDarkMode ? "#D1D5DB" : "#6B7280", // gray-300 / gray-600
      colorInputBackground: isDarkMode ? "#374151" : "#FFFFFF", // bg-gray-700 or white
      colorInputText: isDarkMode ? "#F3F4F6" : "#111827", // gray-100 or gray-900
      colorAlphaShade: "transparent",
    },
    elements: {
      rootBox: "mx-auto",
      card: `shadow-2xl border-0 ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`,
      headerTitle: `text-2xl font-bold`,
      headerSubtitle: `text-sm`,
      socialButtonsBlockButton: `${isDarkMode
          ? "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
        }`,
      socialButtonsBlockButtonText: ``,
      formButtonPrimary: `bg-blue-600 hover:bg-blue-700 text-white border-0 shadow-lg transition-all duration-200`,
      formFieldInput: `${isDarkMode
          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
          : "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500"
        }`,
      formFieldLabel: ``,
      dividerLine: ``,
      dividerText: ``,
      footerActionLink: `text-blue-500 hover:text-blue-400 font-medium`,
      identityPreviewText: ``,
      identityPreviewEditButton: ``,
      // footer: "hidden",
    },
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header
        className={`border-b ${isDarkMode ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-white/50"
          } backdrop-blur-sm`}
      >
        <div className="container mx-auto px-6 py-4">
          <Link href="/" className="flex items-center space-x-3 w-fit">
            <Code2 className="w-8 h-8 text-blue-500" />
            <h1 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>CodeSandbox</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Welcome back</h2>
            <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Sign in to your CodeSandbox account</p>
          </div>

          <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" appearance={clerkAppearance} redirectUrl="/" />

          <div className="mt-6 text-center">
            <Link
              href="/"
              className={`text-sm ${isDarkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-600 hover:text-gray-700"
                } transition-colors`}
            >
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
