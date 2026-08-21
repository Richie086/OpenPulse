import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const BANDS = [
  { label: '31Hz', band: 0 },
  { label: '62Hz', band: 1 },
  { label: '125Hz', band: 2 },
  { label: '250Hz', band: 3 },
  { label: '500Hz', band: 4 },
  { label: '1kHz', band: 5 },
  { label: '2kHz', band: 6 },
  { label: '4kHz', band: 7 },
  { label: '8kHz', band: 8 },
  { label: '16kHz', band: 9 }
];

export function EqualizerDrawer({
  isOpen,
  onClose,
  eqGains,
  onBandChange,
  activePreset,
  onPresetChange
}) {
  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-title">10-Band Equalizer</div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-4">
        <label className="text-xs text-muted-foreground block mb-2 font-medium">Presets:</label>
        <select
          value={activePreset}
          onChange={(e) => onPresetChange(e.target.value)}
          className="btn w-full text-left bg-glass-card border border-white/10"
        >
          <option value="flat">Flat (Default)</option>
          <option value="bassBoost">Bass Boost</option>
          <option value="vocal">Vocal Booster</option>
          <option value="electronic">Electronic / Dance</option>
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
        </select>
      </div>

      <div className="eq-container">
        {BANDS.map(({ label, band }) => (
          <div key={band} className="eq-band">
            <input
              type="range"
              className="eq-slider"
              min="-12"
              max="12"
              step="0.5"
              value={eqGains[band] || 0}
              onChange={(e) => onBandChange(band, parseFloat(e.target.value))}
            />
            <span className="eq-label">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
