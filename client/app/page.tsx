"use client"

import { useEffect, useState } from "react"
import { Code2, Play, Zap, Globe, Users, ArrowRight, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Turnstile from "@/components/turnstile"
import AuthSection from "@/components/auth-section"
import { useTheme } from "@/contexts/theme-context"

const features = [
  {
    icon: <Code2 className="w-8 h-8" />,
    title: "Multi-Language Support",
    description: "Write and execute code in Python, JavaScript, TypeScript, Java, C++, C, Go, and Rust",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Instant Execution",
    description: "Run your code instantly with our fast and reliable execution environment",
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Web-Based IDE",
    description: "No installation required. Code directly in your browser with a professional interface",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Beginner Friendly",
    description: "Perfect for learning, prototyping, and sharing code snippets with others",
  },
]

const languages = [
  { name: "Python", color: "bg-blue-500", example: "print('Hello World')" },
  { name: "JavaScript", color: "bg-yellow-500", example: "console.log('Hello World')" },
  { name: "TypeScript", color: "bg-blue-600", example: "console.log('Hello World')" },
  { name: "Java", color: "bg-red-500", example: "System.out.println('Hello World')" },
  { name: "C++", color: "bg-purple-500", example: "cout << 'Hello World'" },
  { name: "Go", color: "bg-cyan-500", example: "fmt.Println('Hello World')" },
  { name: "Rust", color: "bg-orange-500", example: "println!('Hello World')" },
  { name: "C", color: "bg-gray-500", example: "printf('Hello World')" },
]

export default function LandingPage() {
  // Remove this line:
  // const [isDarkMode, setIsDarkMode] = useState(true)

  // Add this instead:
  const { theme, toggleTheme } = useTheme()
  const isDarkMode = theme === "dark"
  const [verified, setVerified] = useState(false)
  const [message, setMessage] = useState("")
  const [authLoading, setAuthLoading] = useState(true)

  const themeClasses = isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
  const headerClasses = isDarkMode ? "bg-gray-800/50 border-gray-700" : "bg-white/50 border-gray-200"
  const cardClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  const handleToken = async (token: string) => {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL
      if (!backendUrl) {
        console.error("Backend URL not configured")
        setMessage("❌ Configuration error!")
        return
      }

      const res = await fetch(`${backendUrl}/api/v1/verify-turnstile`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })

      if (res.ok) {
        setVerified(true)
        sessionStorage.setItem("verified", "true")
        setMessage("✅ Human verified!")
      } else {
        setVerified(false)
        setMessage("❌ Verification failed!")
      }
    } catch (error) {
      console.error("Verification error:", error)
      setMessage("❌ Verification error!")
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem("verified")) {
      setVerified(true)
    }
  }, [])

  useEffect(() => {
    // Simulate auth loading time and then set to false
    const timer = setTimeout(() => {
      setAuthLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {/* Header */}
      <header className={`${headerClasses} border-b backdrop-blur-sm sticky top-0 z-50`}>
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          {/* Mobile Layout */}
          <div className="flex items-center justify-between lg:hidden">
            <div className="flex items-center space-x-2">
              <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
              <h1 className="text-lg sm:text-xl font-bold">CodeSandbox</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className={`p-2 ${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100"
                    : "border-gray-300 hover:bg-gray-100 bg-white text-gray-900"
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <AuthSection isMobile={true} />
            </div>
          </div>

          {/* Mobile CTA Row */}
          <div className="mt-3 flex justify-center lg:hidden">
            <Link href="/editor" className="w-full max-w-xs">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2">Launch Editor</Button>
            </Link>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Code2 className="w-8 h-8 text-blue-500" />
              <h1 className="text-xl font-bold">CodeSandbox</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className={`${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100"
                    : "border-gray-300 hover:bg-gray-100 bg-white text-gray-900"
                }`}
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Link href="/editor">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">Launch Editor</Button>
              </Link>
              <AuthSection isMobile={false} />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent leading-tight">
            Code. Run. Share.
          </h1>
          <p
            className={`text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 px-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            The fastest way to write, execute, and share code in your browser. No setup required, just pure coding
            experience.
          </p>
          {!verified && (
            <div className="mb-6 sm:mb-8">
              <Turnstile onSuccess={handleToken} />
              {message && <p className="mt-4 text-sm">{message}</p>}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <Link href="/editor" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 text-base sm:text-lg"
              >
                <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Start Coding Now
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className={`w-full sm:w-auto px-6 sm:px-8 py-3 text-base sm:text-lg ${
                isDarkMode
                  ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100 hover:text-white"
                  : "border-gray-300 hover:bg-gray-50 bg-white text-gray-900 hover:text-gray-700"
              }`}
            >
              View Examples
            </Button>
          </div>
          {/* Language Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12 sm:mb-16 px-4">
            {languages.map((lang) => (
              <div
                key={lang.name}
                className={`${cardClasses} px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border flex items-center space-x-1.5 sm:space-x-2 transition-all duration-200 ${
                  isDarkMode ? "hover:bg-gray-700 hover:border-gray-600" : "hover:bg-gray-100 hover:border-gray-400"
                }`}
              >
                <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full ${lang.color}`}></div>
                <span className="text-xs sm:text-sm font-medium">{lang.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Why Choose CodeSandbox?</h2>
          <p className={`text-base sm:text-lg px-4 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Everything you need for a seamless coding experience
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`${cardClasses} p-4 sm:p-6 text-center hover:shadow-lg transition-all duration-300 ${
                isDarkMode ? "hover:bg-gray-700 hover:border-gray-600" : "hover:bg-gray-50 hover:border-gray-300"
              }`}
            >
              <CardContent className="p-0">
                <div className="text-blue-500 mb-3 sm:mb-4 flex justify-center">{feature.icon}</div>
                <h3
                  className={`text-lg sm:text-xl font-semibold mb-2 sm:mb-3 ${isDarkMode ? "text-gray-100" : "text-gray-800"}`}
                >
                  {feature.title}
                </h3>
                <p className={`text-sm sm:text-base ${isDarkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Code Preview Section */}
      <section className={`py-20 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">See It In Action</h2>
            <p className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Professional code editor with instant execution
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <Card
              className={`${cardClasses} overflow-hidden shadow-xl ${
                isDarkMode ? "shadow-gray-900/50" : "shadow-gray-200/50"
              }`}
            >
              <div
                className={`px-4 py-3 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } flex items-center space-x-2`}
              >
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className={`ml-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>main.py</span>
              </div>
              <div className={`p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                <pre className={`font-mono text-sm ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}>
                  {`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`}
                </pre>
              </div>
              <div className={`px-6 py-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Output:</span>
                  <Link href="/editor">
                    <Button
                      size="sm"
                      className={`bg-green-600 hover:bg-green-700 text-white transition-all duration-200 ${
                        isDarkMode ? "shadow-lg shadow-green-600/20" : "shadow-md"
                      }`}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Try It
                    </Button>
                  </Link>
                </div>
                <pre className={`mt-2 text-sm font-mono ${isDarkMode ? "text-green-400" : "text-green-600"}`}>
                  {`F(0) = 0
F(1) = 1
F(2) = 1
F(3) = 2
F(4) = 3
F(5) = 5
F(6) = 8
F(7) = 13
F(8) = 21
F(9) = 34`}
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Coding?</h2>
          <p className={`text-lg mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Join thousands of developers who use CodeSandbox for quick prototyping, learning, and sharing code snippets.
          </p>
          <Link href="/editor">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
              Launch CodeSandbox
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`border-t ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} py-8`}>
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Code2 className="w-6 h-6 text-blue-500" />
            <span className="font-semibold">CodeSandbox</span>
          </div>
          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            © 2025 CodeSandbox. Built for developers, by developers.
          </p>
        </div>
      </footer>
    </div>
  )
}
