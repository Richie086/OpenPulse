import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Music, Heart, Disc, Cloud, Plus, ListMusic, Server } from 'lucide-react';

export function Sidebar({
  activeView,
  onSelectView,
  playlists,
  activePlaylistId,
  onCreatePlaylist
}) {
  return (
    <aside className="sidebar">
      <div>
        <div className="nav-section-title">Library</div>
        <ul className="nav-menu">
          <li
            className={`nav-item ${activeView === 'all-tracks' ? 'active' : ''}`}
            onClick={() => onSelectView('all-tracks')}
          >
            <Music />
            <span>All Tracks</span>
          </li>
          <li
            className={`nav-item ${activeView === 'favorites' ? 'active' : ''}`}
            onClick={() => onSelectView('favorites')}
          >
            <Heart />
            <span>Favorites</span>
          </li>
          <li
            className={`nav-item ${activeView === 'albums' ? 'active' : ''}`}
            onClick={() => onSelectView('albums')}
          >
            <Disc />
            <span>Albums</span>
          </li>
          <li
            className={`nav-item ${activeView === 'cloud' ? 'active' : ''}`}
            onClick={() => onSelectView('cloud')}
          >
            <Cloud />
            <span>Cloud Streams</span>
          </li>
        </ul>
      </div>

      <Separator className="my-2 bg-white/10" />

      <div>
        <div className="nav-section-title flex justify-between items-center">
          <span>Playlists</span>
          <Plus
            className="w-4 h-4 cursor-pointer hover:text-white transition-colors"
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

      <div className="mt-auto pt-3 border-t border-white/10">
        <div className="nav-item">
          <Server />
          <span>Self-Hosting Ready</span>
        </div>
      </div>
    </aside>
  );
}
