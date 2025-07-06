"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Play, Loader2, Sun, Moon, Code2, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { runCodeService } from "@/app/services/operation"
import { useSocket } from "../../hooks/useSocket";
import { SignedIn, useUser, UserButton } from '@clerk/nextjs'
import dynamic from "next/dynamic"


// Code templates for different languages
const codeTemplates = {
  python: `# Made by Rahul Karmakar
# https://www.linkedin.com/in/rahul-karmakar-605509257/
print("This is made by Rahul Karmakar")`,

  javascript: `// Made by Rahul Karmakar
// https://www.linkedin.com/in/rahul-karmakar-605509257/
console.log("This is made by Rahul Karmakar");`,

  typescript: `// Made by Rahul Karmakar
// https://www.linkedin.com/in/rahul-karmakar-605509257/
console.log("This is made by Rahul Karmakar");`,

  java: `// Made by Rahul Karmakar
// https://www.linkedin.com/in/rahul-karmakar-605509257/
public class Main {
    public static void main(String[] args) {
        System.out.println("This is made by Rahul Karmakar");
    }
}`,

  cpp: `// Made by Rahul Karmakar
// https://www.linkedin.com/in/rahul-karmakar-605509257/
#include <iostream>
using namespace std;

int main() {
    cout << "This is made by Rahul Karmakar" << endl;
    return 0;
}`,

  c: `// Made by Rahul Karmakar
// https://www.linkedin.com/in/rahul-karmakar-605509257/
#include <stdio.h>

int main() {
    printf("This is made by Rahul Karmakar\\n");
    return 0;
}`,

  go: `// Made by Rahul Karmakar
// https://www.linkedin.com/in/rahul-karmakar-605509257/
package main

import "fmt"

func main() {
    fmt.Println("This is made by Rahul Karmakar")
}`,

  rust: `// Made by Rahul Karmakar
// https://www.linkedin.com/in/rahul-karmakar-605509257/
fn main() {
    println!("This is made by Rahul Karmakar");
}`,
};


const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  //{ value: "rust", label: "Rust" },
]

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="flex items-center space-x-2">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span>Loading Editor...</span>
      </div>
    </div>
  ),
})

export default function CodeEditor() {
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [code, setCode] = useState(codeTemplates.python)
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [panelWidth, setPanelWidth] = useState(70)
  const [isResizing, setIsResizing] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const { user } = useUser();


  useSocket(`${user?.id}`, (result) => {
    console.log(result)
    const { output, error } = JSON.parse(result);
    // console.log({output, error})
    if (!error) setOutput(output);
    else setError(error)
    setIsLoading(false);
  });

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setCode(codeTemplates[language as keyof typeof codeTemplates])
    setOutput("")
    setError("")
  }

  const handleRunCode = async () => {
    if (!sessionStorage.getItem("verified")) {
      setError("❌ Human verification failed!")
      return;
    }
    setIsLoading(true);
    setError("");
    setOutput("");

    try {
      await runCodeService(code, selectedLanguage, user?.id!);
    } catch (err) {
      console.log(err)
      setError(err ? String(err) : "Unexpected error");
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

      // Constrain between 30% and 80%
      const constrainedWidth = Math.min(Math.max(newWidth, 30), 80)
      setPanelWidth(constrainedWidth)
    },
    [isResizing],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add event listeners for mouse move and up
  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])


  const themeClasses = isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"

  const headerClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  const panelClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  const editorClasses = isDarkMode
    ? "bg-gray-900 text-gray-100 border-gray-700"
    : "bg-gray-50 text-gray-900 border-gray-300"

  return (
    <div className={`h-screen flex flex-col ${themeClasses}`}>
      {/* Header */}
      <header className={`${headerClasses} border-b px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center space-x-3">
          <Code2 className="w-8 h-8 text-blue-500" />
          <h1 className="text-xl font-bold">CodeSandbox</h1>
        </div>

        <div className="flex items-center space-x-4">
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

          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger
              className={`w-40 ${isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"}`}
            >
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent className={isDarkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-300"}>
              {languages.map((lang) => (
                <SelectItem
                  key={lang.value}
                  value={lang.value}
                  className={isDarkMode ? "text-gray-100 focus:bg-gray-600" : "text-gray-900 focus:bg-gray-100"}
                >
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`${isDarkMode
              ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100"
              : "border-gray-300 hover:bg-gray-100 bg-white text-gray-900"
              }`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          <Button
            onClick={handleRunCode}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700 text-white px-6"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Code
              </>
            )}
          </Button>
          <div>
            <SignedIn>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        {/* Code Editor Panel */}
        <div className={`${panelClasses} border-r flex flex-col`} style={{ width: `${panelWidth}%` }}>
          <div
            className={`px-4 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} flex items-center justify-between`}
          >
            <h2 className="text-sm font-medium">Code Editor</h2>
            <div className="flex items-center space-x-4">
              <span className="text-xs opacity-60">{languages.find((l) => l.value === selectedLanguage)?.label}</span>
              <span className="text-xs opacity-60">Ctrl+Enter to run</span>
            </div>
          </div>
          <div className="flex-1">
            <MonacoEditor
              height="100%"
              language={selectedLanguage}
              value={code}
              onChange={(value) => setCode(value || "")}
              theme={isDarkMode ? "vs-dark" : "light"}
              options={{
                minimap: { enabled: false },
                fontSize: 15,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 4,
                insertSpaces: true,
                wordWrap: "on",
                contextmenu: true,
                selectOnLineNumbers: true,
                glyphMargin: false,
                folding: true,
                lineDecorationsWidth: 0,
                lineNumbersMinChars: 3,
                renderLineHighlight: "line",
                scrollbar: {
                  vertical: "visible",
                  horizontal: "visible",
                  useShadows: false,
                  verticalHasArrows: false,
                  horizontalHasArrows: false,
                },
              }}
            />
          </div>
        </div>

        {/* Resize Handle */}
        <div
          className={`w-1 cursor-col-resize hover:bg-blue-500 transition-colors ${isDarkMode ? "bg-gray-700" : "bg-gray-300"} ${isResizing ? "bg-blue-500" : ""}`}
          onMouseDown={handleMouseDown}
        />

        {/* Output Panel */}
        <div className={`${panelClasses} flex flex-col`} style={{ width: `${100 - panelWidth}%` }}>
          <div
            className={`px-4 py-3 border-b ${isDarkMode ? "border-gray-700" : "border-gray-200"} flex items-center justify-between`}
          >
            <h2 className="text-sm font-medium">Output</h2>
            {output && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setOutput("")
                  setError("")
                }}
                className="text-xs opacity-60 hover:opacity-100"
              >
                Clear
              </Button>
            )}
          </div>
          <div className="flex-1 p-4 overflow-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="flex items-center text-blue-500">
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Executing code...
                </div>
              </div>
            ) : error ? (
              <div className="text-red-500 font-mono text-sm whitespace-pre-wrap">{error}</div>
            ) : output ? (
              <pre
                className={`font-mono text-sm whitespace-pre-wrap ${isDarkMode ? "text-gray-100" : "text-gray-900"}`}
              >
                {output}
              </pre>
            ) : (
              <div className={`italic ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                Click "Run Code" to see the output here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
