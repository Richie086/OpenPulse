// Playlist Management Engine with Import/Export capabilities

import { savePlaylistToDB, getAllPlaylistsFromDB, deletePlaylistFromDB } from '../db/indexedDB.js';

export class PlaylistManager {
  constructor() {
    this.playlists = [];
    this.activePlaylistId = 'all'; // 'all' | 'favorites' | playlistId
    this.favorites = new Set();
  }

  async init() {
    const savedPlaylists = await getAllPlaylistsFromDB();
    if (savedPlaylists && savedPlaylists.length > 0) {
      this.playlists = savedPlaylists;
    } else {
      // Default initial playlists
      this.playlists = [
        { id: 'pl-synthwave', name: 'Synthwave Chill', trackIds: ['sample-synthwave-pulse'], createdAt: Date.now() },
        { id: 'pl-favorites', name: 'Favorites', trackIds: [], createdAt: Date.now() }
      ];
      for (const pl of this.playlists) {
        await savePlaylistToDB(pl);
      }
    }
  }

  async createPlaylist(name) {
    const newPl = {
      id: 'pl-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      name: name || 'New Playlist',
      trackIds: [],
      createdAt: Date.now()
    };
    this.playlists.push(newPl);
    await savePlaylistToDB(newPl);
    return newPl;
  }

  async deletePlaylist(playlistId) {
    this.playlists = this.playlists.filter(p => p.id !== playlistId);
    await deletePlaylistFromDB(playlistId);
  }

  async addTrackToPlaylist(playlistId, trackId) {
    const pl = this.playlists.find(p => p.id === playlistId);
    if (pl && !pl.trackIds.includes(trackId)) {
      pl.trackIds.push(trackId);
      await savePlaylistToDB(pl);
    }
  }

  async removeTrackFromPlaylist(playlistId, trackId) {
    const pl = this.playlists.find(p => p.id === playlistId);
    if (pl) {
      pl.trackIds = pl.trackIds.filter(id => id !== trackId);
      await savePlaylistToDB(pl);
    }
  }

  toggleFavorite(trackId) {
    if (this.favorites.has(trackId)) {
      this.favorites.delete(trackId);
    } else {
      this.favorites.add(trackId);
    }
    const favPl = this.playlists.find(p => p.id === 'pl-favorites');
    if (favPl) {
      favPl.trackIds = Array.from(this.favorites);
      savePlaylistToDB(favPl);
    }
    return this.favorites.has(trackId);
  }

  exportPlaylistM3U(playlistId, allTracks) {
    const pl = this.playlists.find(p => p.id === playlistId);
    if (!pl) return;

    const tracksInPl = allTracks.filter(t => pl.trackIds.includes(t.id));
    let m3uContent = '#EXTM3U\n';

    tracksInPl.forEach(t => {
      m3uContent += `#EXTINF:${t.duration || 0},${t.artist} - ${t.title}\n${t.url || t.id}\n`;
    });

    const blob = new Blob([m3uContent], { type: 'audio/x-mpegurl' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${pl.name.replace(/\s+/g, '_')}.m3u`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

export const playlistManager = new PlaylistManager();
