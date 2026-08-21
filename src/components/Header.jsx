import React from 'react';
import { Button } from '@/components/ui/button';
import { Disc3, Search, PlusCircle, Sliders, Palette } from 'lucide-react';

export function Header({
  searchQuery,
  onSearchChange,
  onOpenIngest,
  onToggleEQ,
  onToggleSkinStudio
}) {
  return (
    <header className="top-header">
      <div className="brand">
        <div className="brand-icon-wrapper">
          <Disc3 className="w-5 h-5 text-white" />
        </div>
        <span>OpenPulse</span>
      </div>

      <div className="search-box">
        <Search className="search-icon" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tracks, artists, albums..."
          autoComplete="off"
        />
      </div>

      <div className="header-actions">
        <Button onClick={onOpenIngest} className="btn-primary gap-2">
          <PlusCircle className="w-4 h-4" />
          <span>Add Music</span>
        </Button>
        <Button variant="outline" size="icon" onClick={onToggleEQ} title="10-Band Equalizer" className="btn-icon">
          <Sliders className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onToggleSkinStudio} title="Skins & Themes Studio" className="btn-icon">
          <Palette className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
}
