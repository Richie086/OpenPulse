import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Keyboard } from 'lucide-react';

export function ShortcutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'Space', desc: 'Play / Pause Audio' },
    { key: '→ (Right Arrow)', desc: 'Next Track' },
    { key: '← (Left Arrow)', desc: 'Previous Track' },
    { key: '↑ (Up Arrow)', desc: 'Increase Volume +10%' },
    { key: '↓ (Down Arrow)', desc: 'Decrease Volume -10%' },
    { key: 'M', desc: 'Toggle Mute' },
    { key: 'E', desc: 'Toggle 10-Band Equalizer' },
    { key: 'L', desc: 'Toggle Synced Lyrics' }
  ];

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Keyboard Shortcuts</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Control OpenPulse directly using global hotkeys:
        </p>

        <div className="flex flex-col gap-2 max-h-[60vh] overflow-y-auto pr-1">
          {shortcuts.map((s, idx) => (
            <div key={idx} className="flex justify-between items-center p-2.5 rounded bg-white/5 border border-white/10 text-xs">
              <span className="text-muted-foreground">{s.desc}</span>
              <kbd className="px-2 py-1 rounded bg-primary/20 border border-primary/40 font-mono text-[11px] text-primary font-bold">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
