import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { PlayerBar } from '@/components/PlayerBar';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { TrackList } from '@/components/TrackList';
import { EqualizerDrawer } from '@/components/EqualizerDrawer';
import { SkinStudioDrawer } from '@/components/SkinStudioDrawer';
import { AddMusicModal } from '@/components/AddMusicModal';
import { SubsonicModal } from '@/components/SubsonicModal';
import { LyricsDrawer } from '@/components/LyricsDrawer';
import { DashboardView } from '@/components/DashboardView';

import { AudioEngine } from '@/audio/audioEngine';
import { AudioVisualizer as VisualizerEngine } from '@/audio/visualizer';
import { IndexedDBManager } from '@/db/indexedDB';
import { parseAudioMetadata } from '@/utils/tagParser';
import { themeEngine } from '@/utils/themeEngine';
import { sampleTracks } from '@/utils/sampleAudio';
import { exportM3U } from '@/ui/playlistManager';
import { Play, Shuffle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function App() {
  const [audioEngine] = useState(() => new AudioEngine());
  const [visualizer] = useState(() => new VisualizerEngine());
  const [db] = useState(() => new IndexedDBManager());

  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [visMode, setVisMode] = useState('mesh');
  const [currentTheme, setCurrentTheme] = useState('obsidian');

  const [activeView, setActiveView] = useState('dashboard');
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [activePlaylistName, setActivePlaylistName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [isEQOpen, setIsEQOpen] = useState(false);
  const [isSkinOpen, setIsSkinOpen] = useState(false);
  const [isIngestOpen, setIsIngestOpen] = useState(false);
  const [isSubsonicOpen, setIsSubsonicOpen] = useState(false);
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [eqGains, setEqGains] = useState(Array(10).fill(0));
  const [activePreset, setActivePreset] = useState('flat');

  // Initialize DB & Visualizer
  useEffect(() => {
    async function init() {
      await db.init();
      let loadedTracks = await db.getAllTracks();
      if (loadedTracks.length === 0) {
        for (const sample of sampleTracks) {
          await db.addTrack(sample);
        }
        loadedTracks = await db.getAllTracks();
      }
      setTracks(loadedTracks);
      const loadedPlaylists = await db.getAllPlaylists();
      setPlaylists(loadedPlaylists);

      const savedTheme = (await db.getSetting('theme')) || 'obsidian';
      setCurrentTheme(savedTheme);
      themeEngine.setTheme(savedTheme);

      visualizer.connectAudioEngine(audioEngine);
      audioEngine.onTimeUpdate((time, dur) => {
        setCurrentTime(time);
        setDuration(dur);
      });
      audioEngine.onEnded(() => {
        handleNextTrack();
      });
    }
    init();
  }, []);

  // Filtered tracks
  const displayedTracks = tracks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.album && t.album.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeView === 'favorites') return t.isFavorite;
    if (activeView === 'cloud') return t.source === 'cloud' || t.source === 'url';
    if (activeView === 'playlist' && activePlaylistId) {
      const pl = playlists.find((p) => p.id === activePlaylistId);
      return pl ? pl.trackIds.includes(t.id) : false;
    }
    return true;
  });

  const handlePlayTrack = async (track) => {
    setCurrentTrack(track);
    let audioSrc = track.url;
    if (track.fileData) {
      audioSrc = URL.createObjectURL(track.fileData);
    }
    await audioEngine.loadTrack(audioSrc);
    audioEngine.play();
    setIsPlaying(true);
    if (track.coverArt) {
      themeEngine.applyDynamicAccentFromImage(track.coverArt);
    }
  };

  const handleTogglePlay = () => {
    if (!currentTrack && displayedTracks.length > 0) {
      handlePlayTrack(displayedTracks[0]);
      return;
    }
    if (isPlaying) {
      audioEngine.pause();
      setIsPlaying(false);
    } else {
      audioEngine.play();
      setIsPlaying(true);
    }
  };

  const handleStop = () => {
    audioEngine.stop();
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleNextTrack = () => {
    if (displayedTracks.length === 0) return;
    const currentIndex = displayedTracks.findIndex((t) => t.id === currentTrack?.id);
    let nextIndex = (currentIndex + 1) % displayedTracks.length;
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * displayedTracks.length);
    }
    handlePlayTrack(displayedTracks[nextIndex]);
  };

  const handlePrevTrack = () => {
    if (displayedTracks.length === 0) return;
    const currentIndex = displayedTracks.findIndex((t) => t.id === currentTrack?.id);
    let prevIndex = (currentIndex - 1 + displayedTracks.length) % displayedTracks.length;
    handlePlayTrack(displayedTracks[prevIndex]);
  };

  const handleSeek = (time) => {
    audioEngine.seek(time);
    setCurrentTime(time);
  };

  const handleVolumeChange = (newVol) => {
    setVolume(newVol);
    audioEngine.setVolume(newVol);
  };

  const handleToggleMute = () => {
    const muted = !isMuted;
    setIsMuted(muted);
    audioEngine.setMute(muted);
  };

  const handleToggleSpeed = () => {
    const rates = [1.0, 1.25, 1.5, 2.0, 0.75];
    const nextRate = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(nextRate);
    audioEngine.setPlaybackRate(nextRate);
  };

  const handleBandChange = (band, gain) => {
    const newGains = [...eqGains];
    newGains[band] = gain;
    setEqGains(newGains);
    audioEngine.setBandGain(band, gain);
  };

  const handlePresetChange = (preset) => {
    setActivePreset(preset);
    const gains = audioEngine.applyPreset(preset);
    setEqGains(gains);
  };

  const handleSelectTheme = async (themeId) => {
    setCurrentTheme(themeId);
    themeEngine.setTheme(themeId);
    await db.setSetting('theme', themeId);
  };

  const handleAddFiles = async (files) => {
    for (const file of files) {
      const meta = await parseAudioMetadata(file);
      const newTrack = {
        id: 'track_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        title: meta.title,
        artist: meta.artist,
        album: meta.album,
        duration: meta.duration,
        coverArt: meta.picture,
        fileData: file,
        source: 'local',
        addedAt: Date.now()
      };
      await db.addTrack(newTrack);
    }
    const updated = await db.getAllTracks();
    setTracks(updated);
  };

  const handleAddStreamUrl = async (url) => {
    const newTrack = {
      id: 'stream_' + Date.now(),
      title: 'Cloud Stream: ' + url.split('/').pop(),
      artist: 'Online Source',
      album: 'Cloud Streams',
      duration: 0,
      url: url,
      source: 'url',
      addedAt: Date.now()
    };
    await db.addTrack(newTrack);
    const updated = await db.getAllTracks();
    setTracks(updated);
  };

  const handleSyncSubsonicSongs = async (newSongs) => {
    for (const song of newSongs) {
      await db.addTrack(song);
    }
    const updated = await db.getAllTracks();
    setTracks(updated);
  };

  const handleToggleFavorite = async (trackId) => {
    const updated = tracks.map((t) => (t.id === trackId ? { ...t, isFavorite: !t.isFavorite } : t));
    setTracks(updated);
    const target = updated.find((t) => t.id === trackId);
    if (target) {
      await db.updateTrack(target);
    }
  };

  const handleDeleteTrack = async (trackId) => {
    await db.deleteTrack(trackId);
    const updated = await db.getAllTracks();
    setTracks(updated);
    if (currentTrack?.id === trackId) {
      handleStop();
      setCurrentTrack(null);
    }
  };

  const handleCreatePlaylist = async () => {
    const name = prompt('Enter playlist name:');
    if (!name) return;
    const newPl = {
      id: 'pl_' + Date.now(),
      name,
      trackIds: [],
      createdAt: Date.now()
    };
    await db.addPlaylist(newPl);
    setPlaylists(await db.getAllPlaylists());
  };

  const handleExportM3U = () => {
    exportM3U(displayedTracks, activePlaylistName || 'OpenPulse-Playlist');
  };

  return (
    <div className="app-shell flex flex-col h-screen w-screen overflow-hidden relative">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenIngest={() => setIsIngestOpen(true)}
        onOpenSubsonic={() => setIsSubsonicOpen(true)}
        onToggleLyrics={() => setIsLyricsOpen(!isLyricsOpen)}
        onToggleEQ={() => setIsEQOpen(!isEQOpen)}
        onToggleSkinStudio={() => setIsSkinOpen(!isSkinOpen)}
      />

      <div className="main-container">
        <Sidebar
          activeView={activeView}
          onSelectView={(view, id, name) => {
            setActiveView(view);
            setActivePlaylistId(id || null);
            setActivePlaylistName(name || '');
          }}
          playlists={playlists}
          activePlaylistId={activePlaylistId}
          onCreatePlaylist={handleCreatePlaylist}
        />

        <main className="content-area overflow-hidden flex flex-col">
          {activeView === 'dashboard' ? (
            <DashboardView
              visualizer={visualizer}
              visMode={visMode}
              onChangeVisMode={(mode) => {
                setVisMode(mode);
                visualizer.setMode(mode);
              }}
              tracks={tracks}
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              currentTime={currentTime}
              duration={duration}
              onPlayTrack={handlePlayTrack}
              onSeek={handleSeek}
            />
          ) : (
            <div className="p-6 flex flex-col h-full overflow-y-auto">
              <AudioVisualizer
                visualizer={visualizer}
                visMode={visMode}
                onChangeMode={(mode) => {
                  setVisMode(mode);
                  visualizer.setMode(mode);
                }}
              />

              <div className="view-header">
                <div className="view-title-group">
                  <h1>{activeView === 'playlist' ? activePlaylistName : activeView.replace('-', ' ').toUpperCase()}</h1>
                  <p className="view-subtitle">{displayedTracks.length} tracks in view</p>
                </div>
                <div className="header-actions">
                  <Button onClick={() => displayedTracks.length > 0 && handlePlayTrack(displayedTracks[0])} className="btn gap-2">
                    <Play className="w-4 h-4 fill-white" />
                    <span>Play All</span>
                  </Button>
                  <Button
                    onClick={() => {
                      setIsShuffle(true);
                      if (displayedTracks.length > 0) {
                        const rand = Math.floor(Math.random() * displayedTracks.length);
                        handlePlayTrack(displayedTracks[rand]);
                      }
                    }}
                    className="btn gap-2"
                  >
                    <Shuffle className="w-4 h-4" />
                    <span>Shuffle</span>
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleExportM3U} title="Export M3U Playlist" className="btn-icon">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <TrackList
                tracks={displayedTracks}
                currentTrackId={currentTrack?.id}
                isPlaying={isPlaying}
                onPlayTrack={handlePlayTrack}
                onToggleFavorite={handleToggleFavorite}
                onDeleteTrack={handleDeleteTrack}
              />
            </div>
          )}
        </main>
      </div>

      <PlayerBar
        currentTrack={currentTrack}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        isMuted={isMuted}
        isShuffle={isShuffle}
        isRepeat={isRepeat}
        playbackRate={playbackRate}
        onTogglePlay={handleTogglePlay}
        onStop={handleStop}
        onPrev={handlePrevTrack}
        onNext={handleNextTrack}
        onSeek={handleSeek}
        onToggleShuffle={() => setIsShuffle(!isShuffle)}
        onToggleRepeat={() => setIsRepeat(!isRepeat)}
        onToggleMute={handleToggleMute}
        onVolumeChange={handleVolumeChange}
        onToggleSpeed={handleToggleSpeed}
        onToggleFavorite={handleToggleFavorite}
      />

      <EqualizerDrawer
        isOpen={isEQOpen}
        onClose={() => setIsEQOpen(false)}
        eqGains={eqGains}
        onBandChange={handleBandChange}
        activePreset={activePreset}
        onPresetChange={handlePresetChange}
      />

      <SkinStudioDrawer
        isOpen={isSkinOpen}
        onClose={() => setIsSkinOpen(false)}
        currentTheme={currentTheme}
        onSelectTheme={handleSelectTheme}
      />

      <AddMusicModal
        isOpen={isIngestOpen}
        onClose={() => setIsIngestOpen(false)}
        onAddFiles={handleAddFiles}
        onAddStreamUrl={handleAddStreamUrl}
      />

      <SubsonicModal
        isOpen={isSubsonicOpen}
        onClose={() => setIsSubsonicOpen(false)}
        onSyncSongs={handleSyncSubsonicSongs}
      />

      <LyricsDrawer
        isOpen={isLyricsOpen}
        onClose={() => setIsLyricsOpen(false)}
        currentTrack={currentTrack}
        currentTime={currentTime}
      />
    </div>
  );
}
