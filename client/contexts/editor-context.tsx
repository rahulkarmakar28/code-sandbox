"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface EditorSettings {
  fontSize: number
  minimap: boolean
  wordWrap: boolean
  lineNumbers: boolean
  autoSave: boolean
}

interface EditorContextType {
  settings: EditorSettings
  updateSettings: (newSettings: Partial<EditorSettings>) => void
  resetSettings: () => void
}

const defaultSettings: EditorSettings = {
  fontSize: 14,
  minimap: false,
  wordWrap: true,
  lineNumbers: true,
  autoSave: true,
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

export function EditorProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings)

  const updateSettings = (newSettings: Partial<EditorSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  return <EditorContext.Provider value={{ settings, updateSettings, resetSettings }}>{children}</EditorContext.Provider>
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error("useEditor must be used within an EditorProvider")
  }
  return context
}
