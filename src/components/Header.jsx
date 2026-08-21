import React from 'react';
import { Button } from '@/components/ui/button';
import { Disc3, Search, PlusCircle, Sliders, Palette, Server, Mic2, Bell, User, Signal } from 'lucide-react';

export function Header({
  searchQuery,
  onSearchChange,
  onOpenIngest,
  onOpenSubsonic,
  onToggleEQ,
  onToggleSkinStudio,
  onToggleLyrics
}) {
  return (
    <header className="top-header">
      <div className="brand flex items-center gap-3">
        <div className="brand-icon-wrapper bg-gradient-to-r from-purple-500 to-cyan-400 p-2 rounded-xl">
          <Disc3 className="w-5 h-5 text-white animate-spin-slow" />
        </div>
        <span className="font-extrabold text-xl tracking-tight text-white">OpenPulse</span>
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

      <div className="flex items-center gap-4">
        <div className="header-actions">
          <Button onClick={onOpenIngest} className="btn-primary gap-2 text-xs">
            <PlusCircle className="w-4 h-4" />
            <span>Add Music</span>
          </Button>
          <Button variant="outline" size="icon" onClick={onOpenSubsonic} title="Subsonic / Navidrome Sync" className="btn-icon">
            <Server className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onToggleLyrics} title="Synced Lyrics Viewer" className="btn-icon">
            <Mic2 className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onToggleEQ} title="10-Band Equalizer" className="btn-icon">
            <Sliders className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onToggleSkinStudio} title="Skins & Themes Studio" className="btn-icon">
            <Palette className="w-4 h-4" />
          </Button>
        </div>

        {/* Server & User Node Profile Pill matching mockup */}
        <div className="flex items-center gap-3 pl-3 border-l border-white/10 text-xs">
          <Bell className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1">
            <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="w-3.5 h-3.5 text-slate-200" />
            </div>
            <div className="flex flex-col text-[11px]">
              <span className="font-bold leading-tight">Server</span>
              <span className="text-[10px] text-slate-400 leading-tight">Personal Audio Node</span>
            </div>
          </div>
          <Signal className="w-4 h-4 text-emerald-400" title="Node Online" />
        </div>
      </div>
    </header>
  );
}
