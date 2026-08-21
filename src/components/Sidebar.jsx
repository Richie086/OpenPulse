import React from 'react';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, Music, Server, Settings, FileText, Heart, Plus, ListMusic } from 'lucide-react';
import { SystemStatusCard } from '@/components/SystemStatusCard';

export function Sidebar({
  activeView,
  onSelectView,
  playlists,
  activePlaylistId,
  onCreatePlaylist
}) {
  return (
    <aside className="sidebar flex flex-col justify-between h-full">
      <div className="flex flex-col gap-5">
        <div>
          <ul className="nav-menu">
            <li
              className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
              onClick={() => onSelectView('dashboard')}
            >
              <LayoutDashboard />
              <span>Dashboard</span>
            </li>
            <li
              className={`nav-item ${activeView === 'all-tracks' ? 'active' : ''}`}
              onClick={() => onSelectView('all-tracks')}
            >
              <Music />
              <span>Music Library</span>
            </li>
            <li
              className={`nav-item ${activeView === 'status' ? 'active' : ''}`}
              onClick={() => onSelectView('status')}
            >
              <Server />
              <span>Server Status</span>
            </li>
            <li
              className={`nav-item ${activeView === 'settings' ? 'active' : ''}`}
              onClick={() => onSelectView('settings')}
            >
              <Settings />
              <span>Settings</span>
            </li>
            <li
              className={`nav-item ${activeView === 'docs' ? 'active' : ''}`}
              onClick={() => onSelectView('docs')}
            >
              <FileText />
              <span>Documentation</span>
            </li>
          </ul>
        </div>

        <Separator className="bg-white/10" />

        {/* Technical Specs Callout Bullet List */}
        <div className="px-2 text-[11px] text-slate-400 space-y-2">
          <div className="flex items-start gap-1.5">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Single Docker Container: lightweight audio visualizer</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Embedded SQLite / IndexedDB: Lossless FLAC/AAC Streaming</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-cyan-400 font-bold">•</span>
            <span>High-End Native WebGL UI: DSP Filters via WASM</span>
          </div>
          <div className="flex items-start gap-1.5">
            <span className="text-cyan-400 font-bold">•</span>
            <span>Decentralized Multi-Node Sync</span>
          </div>
        </div>

        <Separator className="bg-white/10" />

        <div>
          <div className="nav-section-title flex justify-between items-center text-[10px] uppercase font-bold text-slate-400">
            <span>Playlists</span>
            <Plus
              className="w-3.5 h-3.5 cursor-pointer hover:text-white transition-colors"
              onClick={onCreatePlaylist}
              title="Create Playlist"
            />
          </div>
          <ul className="nav-menu">
            {playlists.map((pl) => (
              <li
                key={pl.id}
                className={`nav-item ${activeView === 'playlist' && activePlaylistId === pl.id ? 'active' : ''}`}
                onClick={() => onSelectView('playlist', pl.id, pl.name)}
              >
                <ListMusic />
                <span className="truncate">{pl.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SystemStatusCard />
    </aside>
  );
}
