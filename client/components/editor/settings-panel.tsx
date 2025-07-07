"use client"

import { X, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useEditor } from "@/contexts/editor-context"
import { useTheme } from "@/contexts/theme-context"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = useEditor()
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  if (!isOpen) return null

  const panelClasses = isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className={`${panelClasses} w-96 max-h-[80vh] overflow-y-auto`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Editor Settings</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={resetSettings}>
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Font Size */}
          <div className="space-y-2">
            <Label>Font Size: {settings.fontSize}px</Label>
            <Slider
              value={[settings.fontSize]}
              onValueChange={([value]) => updateSettings({ fontSize: value })}
              min={10}
              max={24}
              step={1}
              className="w-full"
            />
          </div>

          {/* Minimap */}
          <div className="flex items-center justify-between">
            <Label htmlFor="minimap">Show Minimap</Label>
            <Switch
              id="minimap"
              checked={settings.minimap}
              onCheckedChange={(checked) => updateSettings({ minimap: checked })}
            />
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <Label htmlFor="wordWrap">Word Wrap</Label>
            <Switch
              id="wordWrap"
              checked={settings.wordWrap}
              onCheckedChange={(checked) => updateSettings({ wordWrap: checked })}
            />
          </div>

          {/* Line Numbers */}
          <div className="flex items-center justify-between">
            <Label htmlFor="lineNumbers">Line Numbers</Label>
            <Switch
              id="lineNumbers"
              checked={settings.lineNumbers}
              onCheckedChange={(checked) => updateSettings({ lineNumbers: checked })}
            />
          </div>

          {/* Auto Save */}
          <div className="flex items-center justify-between">
            <Label htmlFor="autoSave">Auto Save</Label>
            <Switch
              id="autoSave"
              checked={settings.autoSave}
              onCheckedChange={(checked) => updateSettings({ autoSave: checked })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
