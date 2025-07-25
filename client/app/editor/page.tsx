"use client"
import type React from "react"
import { useState, useRef, useCallback, useEffect } from "react"
import { Play, Loader2, Settings, Maximize2, Minimize2, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { runCodeService } from "../services/operation"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { useTheme } from "@/contexts/theme-context"
import { useUser } from "@clerk/nextjs"
import dynamic from "next/dynamic"
import { useSocket } from "../../hooks/useSocket"

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
}

const languages = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
  { value: "c", label: "C" },
  // { value: "go", label: "Go" },
  // { value: "rust", label: "Rust" },
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
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"
  const { user } = useUser()
  const [selectedLanguage, setSelectedLanguage] = useState("python")
  const [code, setCode] = useState(codeTemplates.python)
  const [output, setOutput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [panelWidth, setPanelWidth] = useState(70)
  const [isResizing, setIsResizing] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
  const [mobileActivePanel, setMobileActivePanel] = useState<"editor" | "output">("editor")
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Editor settings
  const [fontSize, setFontSize] = useState([14])
  const [wordWrap, setWordWrap] = useState(true)
  const [minimap, setMinimap] = useState(false)
  const [lineNumbers, setLineNumbers] = useState(true)
  const [autoIndent, setAutoIndent] = useState(true)
  const [tabSize, setTabSize] = useState([4])

  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<any>(null)

  // Check if mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Add fullscreen detection
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange)
  }, [])

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error)
    }
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setCode(codeTemplates[language as keyof typeof codeTemplates])
    setOutput("")
    setError("")
  }

  useSocket(`${user?.id}`, (result) => {
    const { output, error } = JSON.parse(result)
    if (!error) setOutput(output)
    else setError(error)
    setIsLoading(false)
  })

  const handleRunCode = async () => {
    if (!sessionStorage.getItem("verified")) {
      setError("❌ Human verification failed!")
      return
    }
    setIsLoading(true)
    setError("")
    setOutput("")
    if (isMobileView) {
      setMobileActivePanel("output")
    }
    try {
      await runCodeService(code, selectedLanguage, user?.id!)
    } catch (err) {
      console.log(err)
      setError(err ? String(err) : "Unexpected error")
      setIsLoading(false)
    }
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (isMobileView) return
      setIsResizing(true)
      e.preventDefault()
    },
    [isMobileView],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !containerRef.current || isMobileView) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
      const constrainedWidth = Math.min(Math.max(newWidth, 30), 80)
      setPanelWidth(constrainedWidth)
    },
    [isResizing, isMobileView],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing && !isMobileView) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp, isMobileView])

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ tabSize: tabSize[0] })
    }
  }, [tabSize])

  const themeClasses = isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
  const panelClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
  const monacoTheme = isDarkMode ? "vs-dark" : "light"

  return (
    <div className={`h-screen flex flex-col ${themeClasses}`}>
      {/* Custom Header for Editor */}
      <Header showHomeButton variant="editor" >
        {/* Desktop Controls */}
        <div className="hidden sm:flex items-center space-x-3">
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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100"
                    : "border-gray-300 hover:bg-gray-100 bg-white text-gray-900"
                }`}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`w-80 ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}
            >
              <div className="space-y-4">
                <h4 className="font-medium">Editor Settings</h4>
                <div className="space-y-2">
                  <Label className="text-sm">Font Size: {fontSize[0]}px</Label>
                  <Slider value={fontSize} onValueChange={setFontSize} max={24} min={10} step={1} className="w-full" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm">Tab Size: {tabSize[0]}</Label>
                  <Slider value={tabSize} onValueChange={setTabSize} max={8} min={2} step={1} className="w-full" />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Word Wrap</Label>
                  <Switch checked={wordWrap} onCheckedChange={setWordWrap} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Minimap</Label>
                  <Switch checked={minimap} onCheckedChange={setMinimap} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Line Numbers</Label>
                  <Switch checked={lineNumbers} onCheckedChange={setLineNumbers} />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Auto Indent</Label>
                  <Switch checked={autoIndent} onCheckedChange={setAutoIndent} />
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullscreen}
            className={`${
              isDarkMode
                ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100"
                : "border-gray-300 hover:bg-gray-100 bg-white text-gray-900"
            }`}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
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
        </div>

        {/* Mobile Controls - Language, Settings, Run */}
        <div className="sm:hidden flex items-center justify-end gap-9">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger
              className={`flex-1 max-w-[100px] text-xs ${
                isDarkMode ? "bg-gray-700 border-gray-600" : "bg-gray-100 border-gray-300"
              }`}
            >
              <SelectValue />
              <ChevronDown className="w-3 h-3 ml-1" />
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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className={`p-2 ${
                  isDarkMode
                    ? "border-gray-600 hover:bg-gray-700 bg-gray-800 text-gray-100"
                    : "border-gray-300 hover:bg-gray-100 bg-white text-gray-900"
                }`}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={`w-72 ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}
            >
              {/* Mobile settings content */}
            </PopoverContent>
          </Popover>

          <Button
            onClick={handleRunCode}
            disabled={isLoading}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-xs"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Run
              </>
            ) : (
              <>
                <Play className="w-3 h-3 mr-1" />
                Run
              </>
            )}
          </Button>
        </div>
      </Header>

      {/* Mobile Panel Switcher */}
      {isMobileView && (
        <div className={`${panelClasses} border-b px-3 py-2 flex gap-2`}>
          <Button
            variant={mobileActivePanel === "editor" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMobileActivePanel("editor")}
            className="flex-1 text-sm"
          >
            Code Editor
          </Button>
          <Button
            variant={mobileActivePanel === "output" ? "default" : "ghost"}
            size="sm"
            onClick={() => setMobileActivePanel("output")}
            className="flex-1 text-sm"
          >
            Output
          </Button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden" ref={containerRef}>
        {/* Desktop Layout */}
        {!isMobileView && (
          <>
            {/* Code Editor Panel */}
            <div className={`${panelClasses} border-r flex flex-col`} style={{ width: `${panelWidth}%` }}>
              <div
                className={`px-4 py-3 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } flex items-center justify-between`}
              >
                <h2 className="text-sm font-medium">Code Editor</h2>
                <div className="flex items-center space-x-4">
                  <span className="text-xs opacity-60">
                    {languages.find((l) => l.value === selectedLanguage)?.label}
                  </span>
                  <span className="text-xs opacity-60">Ctrl+Enter to run</span>
                </div>
              </div>
              <div className="flex-1">
                <MonacoEditor
                  height="100%"
                  language={selectedLanguage}
                  value={code}
                  onChange={(value) => setCode(value!)}
                  theme={monacoTheme}
                  options={{
                    minimap: { enabled: minimap },
                    fontSize: fontSize[0],
                    lineNumbers: lineNumbers ? "on" : "off",
                    roundedSelection: false,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: tabSize[0],
                    insertSpaces: true,
                    wordWrap: wordWrap ? "on" : "off",
                    contextmenu: true,
                    selectOnLineNumbers: true,
                    glyphMargin: false,
                    folding: true,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 3,
                    renderLineHighlight: "line",
                    autoIndent: autoIndent ? "advanced" : "none",
                    formatOnPaste: true,
                    formatOnType: true,
                    scrollbar: {
                      vertical: "visible",
                      horizontal: "visible",
                      useShadows: false,
                      verticalHasArrows: false,
                      horizontalHasArrows: false,
                    },
                  }}
                  onMount={(editor) => {
                    editorRef.current = editor
                  }}
                />
              </div>
            </div>

            {/* Resize Handle */}
            <div
              className={`w-1 cursor-col-resize hover:bg-blue-500 transition-colors ${
                isDarkMode ? "bg-gray-700" : "bg-gray-300"
              } ${isResizing ? "bg-blue-500" : ""}`}
              onMouseDown={handleMouseDown}
            />

            {/* Output Panel */}
            <div className={`${panelClasses} flex flex-col`} style={{ width: `${100 - panelWidth}%` }}>
              <div
                className={`px-4 py-3 border-b ${
                  isDarkMode ? "border-gray-700" : "border-gray-200"
                } flex items-center justify-between`}
              >
                <h2 className="text-sm font-medium">Output</h2>
                {(output || error) && (
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
          </>
        )}

        {/* Mobile Layout */}
        {isMobileView && (
          <div className="flex-1 flex flex-col">
            {mobileActivePanel === "editor" ? (
              <div className="flex-1 flex flex-col">
                <div
                  className={`px-3 py-2 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } flex items-center justify-between`}
                >
                  <h2 className="text-sm font-medium">Code Editor</h2>
                  <span className="text-xs opacity-60">
                    {languages.find((l) => l.value === selectedLanguage)?.label}
                  </span>
                </div>
                <div className="flex-1">
                  <MonacoEditor
                    height="100%"
                    language={selectedLanguage}
                    value={code}
                    onChange={(value) => setCode(value!)}
                    theme={monacoTheme}
                    options={{
                      minimap: { enabled: false },
                      fontSize: fontSize[0],
                      lineNumbers: lineNumbers ? "on" : "off",
                      roundedSelection: false,
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 4,
                      insertSpaces: true,
                      wordWrap: wordWrap ? "on" : "off",
                      contextmenu: true,
                      selectOnLineNumbers: true,
                      glyphMargin: false,
                      folding: true,
                      lineDecorationsWidth: 0,
                      lineNumbersMinChars: 2,
                      renderLineHighlight: "line",
                      autoIndent: "advanced",
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
            ) : (
              <div className="flex-1 flex flex-col">
                <div
                  className={`px-3 py-2 border-b ${
                    isDarkMode ? "border-gray-700" : "border-gray-200"
                  } flex items-center justify-between`}
                >
                  <h2 className="text-sm font-medium">Output</h2>
                  {(output || error) && (
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
                <div className="flex-1 p-3 overflow-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="flex items-center text-blue-500">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
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
            )}
          </div>
        )}
      </div>
    </div>
  )
}
