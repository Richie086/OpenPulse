// SonicPulse Main Application Entry Point

import { createIcons, icons } from 'lucide';
import { audioEngine, EQ_PRESETS } from './audio/audioEngine.js';
import { AudioVisualizer } from './audio/visualizer.js';
import { initDB, getAllTracksFromDB, saveTrackToDB, deleteTrackFromDB } from './db/indexedDB.js';
import { parseAudioMetadata } from './utils/tagParser.js';
import { themeEngine, THEME_PRESETS } from './utils/themeEngine.js';
import { playlistManager } from './ui/playlistManager.js';
import { queueManager } from './ui/queueManager.js';
import { cloudService } from './services/cloudConnectors.js';
import { SAMPLE_TRACKS } from './utils/sampleAudio.js';

let allTracks = [];
let displayedTracks = [];
let visualizer = null;
let currentView = 'all-tracks';

document.addEventListener('DOMContentLoaded', async () => {
  createIcons({ icons });

  // 1. Initialize DB & Load Library
  await initDB();
  await playlistManager.init();

  let dbTracks = await getAllTracksFromDB();
  if (!dbTracks || dbTracks.length === 0) {
    // Populate sample tracks for initial out-of-the-box demo
    for (const st of SAMPLE_TRACKS) {
      await saveTrackToDB(st);
    }
    allTracks = [...SAMPLE_TRACKS];
  } else {
    allTracks = dbTracks;
  }

  // 2. Setup Queue & Visualizer
  queueManager.setQueue(allTracks);
  
  const canvas = document.getElementById('visualizerCanvas');
  visualizer = new AudioVisualizer(canvas, audioEngine.analyser);
  visualizer.start();

  // 3. Render UI Components
  renderSidebarPlaylists();
  renderTrackList();
  setupEventListeners();
  setupAudioEngineListeners();
  setupKeyboardShortcuts();
});

// Render Sidebar Custom Playlists
function renderSidebarPlaylists() {
  const container = document.getElementById('playlistListMenu');
  container.innerHTML = '';

  playlistManager.playlists.forEach(pl => {
    const li = document.createElement('li');
    li.className = `nav-item ${playlistManager.activePlaylistId === pl.id ? 'active' : ''}`;
    li.dataset.playlistId = pl.id;
    li.innerHTML = `
      <i data-lucide="list-music"></i>
      <span style="flex: 1; overflow: hidden; text-overflow: ellipsis;">${pl.name}</span>
    `;
    li.addEventListener('click', () => switchView('playlist', pl.id, pl.name));
    container.appendChild(li);
  });

  createIcons({ icons });
}

// Render Track Table
function renderTrackList() {
  const tbody = document.getElementById('trackTableBody');
  tbody.innerHTML = '';

  // Filter based on view & search query
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  
  if (currentView === 'favorites') {
    displayedTracks = allTracks.filter(t => playlistManager.favorites.has(t.id));
  } else if (currentView === 'playlist') {
    const pl = playlistManager.playlists.find(p => p.id === playlistManager.activePlaylistId);
    displayedTracks = pl ? allTracks.filter(t => pl.trackIds.includes(t.id)) : [];
  } else {
    displayedTracks = [...allTracks];
  }

  if (query) {
    displayedTracks = displayedTracks.filter(t => 
      t.title.toLowerCase().includes(query) ||
      t.artist.toLowerCase().includes(query) ||
      t.album.toLowerCase().includes(query)
    );
  }

  document.getElementById('viewSubtitle').textContent = `${displayedTracks.length} tracks in view`;

  if (displayedTracks.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 40px; color: var(--text-muted);">
          No tracks found. Click "Add Music" to upload audio files.
        </td>
      </tr>
    `;
    return;
  }

  displayedTracks.forEach((track, idx) => {
    const tr = document.createElement('tr');
    const isCurrentPlaying = audioEngine.currentTrack && audioEngine.currentTrack.id === track.id;
    if (isCurrentPlaying) tr.className = 'playing';

    const isFav = playlistManager.favorites.has(track.id);
    const coverSrc = track.artData || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40' fill='%2364748b'><rect width='40' height='40'/></svg>";

    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>
        <div class="track-cell-info">
          <div class="track-thumb">
            <img src="${coverSrc}" alt="cover">
          </div>
          <div>
            <div class="track-title-text">${escapeHtml(track.title)}</div>
            <div class="track-artist-text">${escapeHtml(track.artist)}</div>
          </div>
        </div>
      </td>
      <td><span class="track-artist-text">${escapeHtml(track.album || 'Single')}</span></td>
      <td style="font-family: var(--font-mono); font-size: 0.82rem;">${formatTime(track.duration || 0)}</td>
      <td style="text-align: right;">
        <button class="control-btn btn-fav-track" data-id="${track.id}" style="color: ${isFav ? 'var(--primary)' : 'inherit'};">
          <i data-lucide="heart"></i>
        </button>
        <button class="control-btn btn-delete-track" data-id="${track.id}">
          <i data-lucide="trash-2"></i>
        </button>
      </td>
    `;

    // Row Click to play
    tr.addEventListener('dblclick', () => {
      queueManager.setQueue(displayedTracks, idx);
      audioEngine.play(track);
    });

    tbody.appendChild(tr);
  });

  // Attach action button events inside table
  tbody.querySelectorAll('.btn-fav-track').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const trackId = btn.dataset.id;
      playlistManager.toggleFavorite(trackId);
      renderTrackList();
    });
  });

  tbody.querySelectorAll('.btn-delete-track').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const trackId = btn.dataset.id;
      await deleteTrackFromDB(trackId);
      allTracks = allTracks.filter(t => t.id !== trackId);
      renderTrackList();
    });
  });

  createIcons({ icons });
}

// Event Listeners Setup
function setupEventListeners() {
  // Search Input
  document.getElementById('searchInput').addEventListener('input', renderTrackList);

  // Play / Pause Toggle Button
  document.getElementById('btnPlayPause').addEventListener('click', () => {
    if (audioEngine.isPlaying) {
      audioEngine.pause();
    } else {
      if (audioEngine.currentTrack) {
        audioEngine.play();
      } else if (displayedTracks.length > 0) {
        queueManager.setQueue(displayedTracks, 0);
        audioEngine.play(displayedTracks[0]);
      }
    }
  });

  // Stop Button
  document.getElementById('btnStop').addEventListener('click', () => audioEngine.stop());

  // Next & Prev Buttons
  document.getElementById('btnNext').addEventListener('click', () => {
    const next = queueManager.getNextTrack();
    if (next) audioEngine.play(next);
  });

  document.getElementById('btnPrev').addEventListener('click', () => {
    const prev = queueManager.getPreviousTrack();
    if (prev) audioEngine.play(prev);
  });

  // Fast-Forward & Rewind
  document.getElementById('btnFastForward').addEventListener('click', () => audioEngine.fastForward(10));
  document.getElementById('btnRewind').addEventListener('click', () => audioEngine.rewind(10));

  // Shuffle & Repeat Mode Toggles
  const btnShuffle = document.getElementById('btnShuffle');
  btnShuffle.addEventListener('click', () => {
    const active = queueManager.toggleShuffle();
    btnShuffle.classList.toggle('active', active);
  });

  const btnRepeat = document.getElementById('btnRepeat');
  btnRepeat.addEventListener('click', () => {
    const mode = queueManager.toggleRepeat();
    btnRepeat.classList.toggle('active', mode !== 'off');
    btnRepeat.title = `Repeat: ${mode.toUpperCase()}`;
  });

  // Seek Slider
  const seekSlider = document.getElementById('seekSlider');
  seekSlider.addEventListener('input', () => {
    const targetSec = (seekSlider.value / 100) * (audioEngine.audio.duration || 0);
    audioEngine.seek(targetSec);
  });

  // Volume & Mute
  const volumeSlider = document.getElementById('volumeSlider');
  volumeSlider.addEventListener('input', () => {
    audioEngine.setVolume(parseFloat(volumeSlider.value));
  });

  document.getElementById('btnMuteToggle').addEventListener('click', () => {
    const muted = audioEngine.toggleMute();
    document.getElementById('btnMuteToggle').innerHTML = `<i data-lucide="${muted ? 'volume-x' : 'volume-2'}"></i>`;
    createIcons({ icons });
  });

  // Speed Selector
  const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
  let speedIdx = 2;
  document.getElementById('btnSpeedToggle').addEventListener('click', () => {
    speedIdx = (speedIdx + 1) % speeds.length;
    const rate = speeds[speedIdx];
    audioEngine.setSpeed(rate);
    document.getElementById('btnSpeedToggle').textContent = `${rate}x`;
  });

  // Play All & Shuffle Buttons
  document.getElementById('btnPlayAll').addEventListener('click', () => {
    if (displayedTracks.length > 0) {
      queueManager.setQueue(displayedTracks, 0);
      audioEngine.play(displayedTracks[0]);
    }
  });

  document.getElementById('btnShuffleAll').addEventListener('click', () => {
    if (displayedTracks.length > 0) {
      queueManager.isShuffle = true;
      document.getElementById('btnShuffle').classList.add('active');
      const randomIdx = Math.floor(Math.random() * displayedTracks.length);
      queueManager.setQueue(displayedTracks, randomIdx);
      audioEngine.play(displayedTracks[randomIdx]);
    }
  });

  // Visualizer Mode Selector
  document.getElementById('btnVisBars').addEventListener('click', () => visualizer.setMode('bars'));
  document.getElementById('btnVisWave').addEventListener('click', () => visualizer.setMode('waveform'));
  document.getElementById('btnVisRadial').addEventListener('click', () => visualizer.setMode('radial'));
  document.getElementById('btnVisParticles').addEventListener('click', () => visualizer.setMode('particles'));

  // Equalizer Drawer Toggle & Controls
  const eqDrawer = document.getElementById('eqDrawer');
  document.getElementById('btnToggleEQ').addEventListener('click', () => eqDrawer.classList.toggle('open'));
  document.getElementById('btnCloseEQ').addEventListener('click', () => eqDrawer.classList.remove('open'));

  document.getElementById('eqPresetSelect').addEventListener('change', (e) => {
    const presetGains = audioEngine.applyEQPreset(e.target.value);
    document.querySelectorAll('.eq-slider').forEach((slider, idx) => {
      slider.value = presetGains[idx];
    });
  });

  document.querySelectorAll('.eq-slider').forEach(slider => {
    slider.addEventListener('input', (e) => {
      const bandIdx = parseInt(e.target.dataset.band, 10);
      audioEngine.setEQBand(bandIdx, parseFloat(e.target.value));
    });
  });

  // Skin Studio Drawer
  const skinDrawer = document.getElementById('skinDrawer');
  document.getElementById('btnToggleSkinStudio').addEventListener('click', () => skinDrawer.classList.toggle('open'));
  document.getElementById('btnCloseSkinStudio').addEventListener('click', () => skinDrawer.classList.remove('open'));

  document.querySelectorAll('.theme-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      themeEngine.setTheme(card.dataset.themeId);
    });
  });

  // Ingest Modal (Upload & Stream Attachment)
  const ingestModal = document.getElementById('ingestModal');
  document.getElementById('btnOpenIngestModal').addEventListener('click', () => ingestModal.classList.add('open'));
  document.getElementById('btnCloseIngestModal').addEventListener('click', () => ingestModal.classList.remove('open'));

  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');

  dropzone.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', (e) => handleAudioFiles(e.target.files));

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--primary)';
  });

  dropzone.addEventListener('dragleave', () => {
    dropzone.style.borderColor = 'var(--border-color)';
  });

  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.style.borderColor = 'var(--border-color)';
    if (e.dataTransfer.files) handleAudioFiles(e.dataTransfer.files);
  });

  // Stream URL Submit
  document.getElementById('btnAddStreamUrl').addEventListener('click', async () => {
    const urlInput = document.getElementById('streamUrlInput');
    const url = urlInput.value.trim();
    if (url) {
      try {
        const streamTrack = await cloudService.addUrlSource(url);
        await saveTrackToDB(streamTrack);
        allTracks.unshift(streamTrack);
        renderTrackList();
        urlInput.value = '';
        ingestModal.classList.remove('open');
      } catch (err) {
        alert("Could not add audio stream: " + err.message);
      }
    }
  });

  // Create Playlist
  document.getElementById('btnNewPlaylist').addEventListener('click', async () => {
    const name = prompt("Enter playlist name:", "My Chill Playlist");
    if (name) {
      await playlistManager.createPlaylist(name);
      renderSidebarPlaylists();
    }
  });

  // Export M3U Playlist
  document.getElementById('btnExportM3U').addEventListener('click', () => {
    playlistManager.exportPlaylistM3U(playlistManager.activePlaylistId, allTracks);
  });
}

// Audio Engine Events Binding
function setupAudioEngineListeners() {
  audioEngine.on('timeupdate', ({ currentTime, duration }) => {
    document.getElementById('currTimeText').textContent = formatTime(currentTime);
    document.getElementById('durTimeText').textContent = formatTime(duration);

    if (duration > 0) {
      document.getElementById('seekSlider').value = (currentTime / duration) * 100;
    }
  });

  audioEngine.on('play', () => {
    document.getElementById('btnPlayPause').innerHTML = `<i data-lucide="pause"></i>`;
    createIcons({ icons });
  });

  audioEngine.on('pause', () => {
    document.getElementById('btnPlayPause').innerHTML = `<i data-lucide="play"></i>`;
    createIcons({ icons });
  });

  audioEngine.on('trackchange', (track) => {
    document.getElementById('npTitle').textContent = track.title;
    document.getElementById('npArtist').textContent = track.artist;
    
    if (track.artData) {
      document.getElementById('npCoverImg').src = track.artData;
    } else {
      document.getElementById('npCoverImg').src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%2364748b'><rect width='100' height='100'/></svg>";
    }

    renderTrackList();
  });

  audioEngine.on('ended', () => {
    const next = queueManager.getNextTrack();
    if (next) audioEngine.play(next);
  });
}

// Process Uploaded Files
async function handleAudioFiles(files) {
  for (const file of files) {
    if (file.type.startsWith('audio/') || /\.(mp3|wav|ogg|flac)$/i.test(file.name)) {
      const meta = await parseAudioMetadata(file);
      const track = {
        id: 'local-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
        title: meta.title,
        artist: meta.artist,
        album: meta.album,
        duration: meta.duration,
        fileData: file,
        artData: meta.artData,
        source: 'local',
        addedAt: Date.now()
      };

      await saveTrackToDB(track);
      allTracks.unshift(track);
    }
  }

  renderTrackList();
  document.getElementById('ingestModal').classList.remove('open');
}

// Navigation View Switcher
function switchView(type, id = null, title = 'All Tracks') {
  currentView = type === 'playlist' ? 'playlist' : id || type;
  if (type === 'playlist') playlistManager.activePlaylistId = id;
  else playlistManager.activePlaylistId = 'all';

  document.getElementById('viewTitle').textContent = title;
  renderTrackList();
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

    if (e.code === 'Space') {
      e.preventDefault();
      document.getElementById('btnPlayPause').click();
    } else if (e.code === 'ArrowRight') {
      audioEngine.fastForward(5);
    } else if (e.code === 'ArrowLeft') {
      audioEngine.rewind(5);
    } else if (e.code === 'KeyM') {
      document.getElementById('btnMuteToggle').click();
    }
  });
}

// Helpers
function formatTime(seconds) {
  if (!isFinite(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function escapeHtml(str) {
  return (str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
