# OpenPulse - Project Roadmap

This document outlines the product vision, planned features, and upcoming release milestones for OpenPulse.

---

## 🎯 Release Schedule & Version Goals

### 🟢 Phase 1: Core Foundation & MVP (v1.0.0) — *Completed*
- [x] HTML5 / Vite static SPA foundation & React 19 + shadcn/ui modular components.
- [x] Local file upload & drag-and-drop ingestion.
- [x] Browser IndexedDB storage for offline track persistence.
- [x] Web Audio API engine with 10-Band Graphic Equalizer.
- [x] HTML5 Canvas Audio Visualizer (4 modes: Bars, Waveform, Radial, Particles).
- [x] 5 Built-in Skins (*Obsidian Glass, Cyberpunk 1984, OLED Midnight, Nordic Aurora, Retro Winamp*).
- [x] Playlist manager with M3U file export & Now-Playing queue.
- [x] Containerized Docker & Docker Compose setup.

---

## 🟡 Phase 2: Enhanced Cloud & Audio Features (v1.1.0) — *In Progress / Shipped Features*
- [x] **Subsonic / Navidrome API Sync**: Connect directly to hosted Subsonic/Navidrome servers to stream remote music libraries.
- [x] **Custom Theme Builder UI**: Visual color pickers for custom CSS variable theme creation.
- [ ] **Crossfade & Gapless Playback**: Implement smooth 2-second crossfade transitions between queued tracks.
- [ ] **Lyrics Display**: ID3 USLT embedded lyrics and LRC synced lyrics viewer panel.

---

## 🔵 Phase 3: Social & Multi-User Integration (v1.2.0) — *Target Q1 2027*
- [ ] **PWA Offline Support**: Service worker for full progressive web app offline installation.
- [ ] **Last.fm Scrobbling**: Automatic scrobble integration.
- [ ] **Keyboard Shortcut Rebinder**: Configurable global key bindings.

---

## 🟣 Phase 4: Native Desktop / Mobile Builds (v2.0.0) — *Target Q2 2027*
- [ ] Tauri cross-platform desktop build (macOS, Linux, Windows).
- [ ] Mobile responsive touch-first UI optimizations.
