import React from 'react';
import { X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ShortcutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', description: 'Play / Pause audio playback' },
    { key: 'K', description: 'Toggle Play / Pause' },
    { key: 'J', description: 'Skip backward' },
    { key: 'L', description: 'Skip forward' },
    { key: 'Arrow Up', description: 'Increase volume by 10%' },
    { key: 'Arrow Down', description: 'Decrease volume by 10%' },
    { key: 'M', description: 'Mute / Unmute audio' },
    { key: 'E', description: 'Toggle 10-Band Equalizer' },
    { key: 'C', description: 'Toggle Synced Lyrics Drawer' },
    { key: '?', description: 'Open this Keyboard Shortcuts guide' }
  ];

  return (
    <div className="modal-overlay open">
      <div className="modal-card max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">Keyboard Shortcuts</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="btn-icon">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((sc, i) => (
            <div key={i} className="flex justify-between items-center bg-slate-950 p-2.5 rounded-xl border border-white/5">
              <span className="text-xs text-slate-300 font-medium">{sc.description}</span>
              <kbd className="px-2.5 py-1 bg-white/10 border border-white/20 rounded-md font-mono text-[11px] font-bold text-cyan-300 shadow">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
