import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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
  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-title">Skins & Theme Engine</div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-4">Select a skin preset for OpenPulse:</p>

      <div className="theme-grid">
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
    </div>
  );
}
