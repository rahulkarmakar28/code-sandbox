"use client"
import { useState, useEffect } from "react"
import { Code2, Play, Zap, Globe, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Turnstile } from "@/components/Turnstile"
import { Header } from "@/components/layout/header"
import { useTheme } from "@/contexts/theme-context"
import Link from "next/link"

const features = [
  {
    icon: <Code2 className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Multi-Language Support",
    description: "Write and execute code in Python, JavaScript, TypeScript, Java, C++, C, Go, and Rust",
  },
  {
    icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Instant Execution",
    description: "Run your code instantly with our fast and reliable execution environment",
  },
  {
    icon: <Globe className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Web-Based IDE",
    description: "No installation required. Code directly in your browser with a professional interface",
  },
  {
    icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
    title: "Beginner Friendly",
    description: "Perfect for learning, prototyping, and sharing code snippets with others",
  },
]

const languages = [
  { name: "Python", color: "bg-blue-500" },
  { name: "JavaScript", color: "bg-yellow-500" },
  { name: "TypeScript", color: "bg-blue-600" },
  { name: "Java", color: "bg-red-500" },
  { name: "C++", color: "bg-purple-500" },
  { name: "Go", color: "bg-cyan-500" },
  { name: "Rust", color: "bg-orange-500" },
  { name: "C", color: "bg-gray-500" },
]

export default function Page() {
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const stored = sessionStorage.getItem("verified") === "true"
    setIsVerified(stored)
  }, [])

  function setVerify() {
    setIsVerified(true)
    sessionStorage.setItem("verified", "true")
  }

  const themeClasses = isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
  const cardClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  return (
    <div className={`min-h-screen ${themeClasses}`}>
      {!isVerified ? (
        <>
          <div className="h-screen w-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-6 text-center space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Verify You’re Human</h1>
                <p className="text-gray-500 mt-2">
                  Please complete the Turnstile check below to continue.
                </p>
              </div>

              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onVerify={setVerify}
                onError={() => setIsVerified(false)}
                onExpire={() => setIsVerified(false)}
              />

              <footer className="text-sm text-gray-400 pt-4 border-t border-gray-200">
                © {new Date().getFullYear()} rahulkarmakar.me — All rights reserved.
              </footer>
            </div>
          </div>
        </>
      ) : (
        <>
          <Header variant="home">
            <Link href="/editor">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
                Launch Editor
              </Button>
            </Link>
          </Header>

          {/* Hero Section */}
          <section className="container mx-auto px-6 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                Code. Run. Share.
              </h1>
              <p className={`text-xl md:text-2xl mb-8 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                The fastest way to write, execute, and share code in your browser. No setup required, just pure coding
                experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Link href="/editor">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                    <Play className="w-5 h-5 mr-2" />
                    Start Coding Now
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className={`px-8 py-3 text-lg ${isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100 hover:text-white"
                    : "border-gray-300 hover:bg-gray-50 bg-white text-gray-900 hover:text-gray-700"
                    }`}
                >
                  View Examples
                </Button>
              </div>

              {/* Language Pills */}
              <div className="px-4">
                <div className="flex flex-wrap justify-center gap-3 mb-16 mx-auto">
                  {languages.map((lang) => (
                    <div
                      key={lang.name}
                      className={`${cardClasses} px-4 py-2.5 rounded-full border flex items-center space-x-2 transition-all duration-200 ${isDarkMode
                        ? "hover:bg-gray-700 hover:border-gray-600"
                        : "hover:bg-gray-100 hover:border-gray-400"
                        }`}
                    >
                      <div className={`w-3 h-3 rounded-full ${lang.color}`}></div>
                      <span className="text-sm font-medium whitespace-nowrap">{lang.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">Why Choose CodeSandbox?</h2>
              <p
                className={`text-lg sm:text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"} px-4 max-w-2xl mx-auto`}
              >
                Everything you need for a seamless coding experience
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className={`${cardClasses} p-6 text-center hover:shadow-lg transition-all duration-300 ${isDarkMode ? "hover:bg-gray-750 hover:border-gray-600" : "hover:bg-gray-50 hover:border-gray-300"
                    }`}
                >
                  <CardContent className="p-0">
                    <div className="text-blue-500 mb-4 flex justify-center">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-3 text-gray-500">{feature.title}</h3>
                    <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} leading-relaxed`}>
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Code Preview Section */}
          <section className={`py-16 sm:py-20 ${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}>
            <div className="container mx-auto px-4 sm:px-6">
              <div className="text-center mb-12 sm:mb-16">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-2">See It In Action</h2>
                <p
                  className={`text-lg sm:text-xl ${isDarkMode ? "text-gray-300" : "text-gray-600"} px-4 max-w-2xl mx-auto`}
                >
                  Professional code editor with instant execution
                </p>
              </div>
              <div className="max-w-4xl mx-auto">
                <Card
                  className={`${cardClasses} overflow-hidden shadow-xl ${isDarkMode ? "shadow-gray-900/50" : "shadow-gray-200/50"
                    }`}
                >
                  <div
                    className={`px-4 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"
                      } flex items-center space-x-2`}
                  >
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className={`ml-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>main.py</span>
                  </div>
                  <div className={`p-4 sm:p-6 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
                    <div className="overflow-x-auto">
                      <pre
                        className={`font-mono text-sm ${isDarkMode ? "text-gray-100" : "text-gray-900"} whitespace-pre min-w-max`}
                      >
                        {`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")`}
                      </pre>
                    </div>
                  </div>
                  <div className={`px-4 sm:px-6 py-4 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
                      <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Output:</span>
                      <Link href="/editor">
                        <Button
                          size="sm"
                          className={`bg-green-600 hover:bg-green-700 text-white transition-all duration-200 ${isDarkMode ? "shadow-lg shadow-green-600/20" : "shadow-md"
                            }`}
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Try It
                        </Button>
                      </Link>
                    </div>
                    <div className="mt-3 overflow-x-auto">
                      <pre
                        className={`text-sm font-mono ${isDarkMode ? "text-green-400" : "text-green-600"} whitespace-pre min-w-max`}
                      >
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
                  </div>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 px-2">Ready to Start Coding?</h2>
              <p
                className={`text-lg sm:text-xl mb-8 sm:mb-10 ${isDarkMode ? "text-gray-300" : "text-gray-600"} px-4 leading-relaxed`}
              >
                Join thousands of developers who use CodeSandbox for quick prototyping, learning, and sharing code
                snippets.
              </p>
              <Link href="/editor">
                <Button
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg w-full max-w-sm sm:max-w-none sm:w-auto font-medium"
                >
                  Launch CodeSandbox
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer
            className={`border-t ${isDarkMode ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-white"} py-6 sm:py-8`}
          >
            <div className="container mx-auto px-4 sm:px-6 text-center">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                <span className="font-semibold text-sm sm:text-base">CodeSandbox</span>
              </div>
              <p className={`text-xs sm:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
                © 2024 CodeSandbox. Built for developers, by developers.
              </p>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
