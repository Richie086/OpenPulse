import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { X, Palette, RotateCcw } from 'lucide-react';
import { themeEngine } from '@/utils/themeEngine';

const THEMES = [
  {
    id: 'obsidian',
    name: 'Obsidian Glass',
    dots: ['#6366f1', '#06b6d4', '#121624']
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk 1984',
    dots: ['#ff007f', '#00f0ff', '#1a092d']
  },
  {
    id: 'oled',
    name: 'OLED Midnight',
    dots: ['#10b981', '#3b82f6', '#000000']
  },
  {
    id: 'nordic',
    name: 'Nordic Aurora',
    dots: ['#14b8a6', '#38bdf8', '#071318']
  },
  {
    id: 'retro',
    name: 'Retro Winamp',
    dots: ['#00ff41', '#ffb703', '#20232a']
  }
];

export function SkinStudioDrawer({ isOpen, onClose, currentTheme, onSelectTheme }) {
  const [customPrimary, setCustomPrimary] = useState('#6366f1');
  const [customBgApp, setCustomBgApp] = useState('#0f172a');
  const [customBgSurface, setCustomBgSurface] = useState('#1e293b');

  const handleApplyCustom = () => {
    themeEngine.applyCustomTheme({
      primary: customPrimary,
      bgApp: customBgApp,
      bgSurface: customBgSurface
    });
  };

  const handleReset = () => {
    themeEngine.setTheme(currentTheme);
  };

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-title flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          <span>Skins & Theme Studio</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-3">Skin Presets:</p>

      <div className="theme-grid mb-4">
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            className={`theme-card ${currentTheme === theme.id ? 'active' : ''}`}
            onClick={() => onSelectTheme(theme.id)}
          >
            <div className="theme-preview-dots">
              {theme.dots.map((color, idx) => (
                <div key={idx} className="theme-dot" style={{ background: color }} />
              ))}
            </div>
            <span className="font-semibold text-xs">{theme.name}</span>
          </div>
        ))}
      </div>

      <Separator className="my-3 bg-white/10" />

      <div>
        <p className="text-xs font-bold text-muted-foreground mb-3 uppercase tracking-wider">Custom Theme Builder</p>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs">Primary Accent Color:</span>
            <input
              type="color"
              value={customPrimary}
              onChange={(e) => setCustomPrimary(e.target.value)}
              className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs">Background App Base:</span>
            <input
              type="color"
              value={customBgApp}
              onChange={(e) => setCustomBgApp(e.target.value)}
              className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs">Surface Glass Card:</span>
            <input
              type="color"
              value={customBgSurface}
              onChange={(e) => setCustomBgSurface(e.target.value)}
              className="w-8 h-8 rounded border border-white/20 cursor-pointer bg-transparent"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button onClick={handleApplyCustom} className="btn-primary flex-1 text-xs py-1.5 h-8">
              Apply Colors
            </Button>
            <Button variant="outline" onClick={handleReset} size="icon" title="Reset to Preset" className="h-8 w-8">
              <RotateCcw className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
