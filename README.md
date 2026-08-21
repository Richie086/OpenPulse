# 🎧 OpenPulse - Self-Hostable Skinable Web Audio Player

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker Ready](https://img.shields.io/badge/Docker-Ready-brightgreen.svg)](Dockerfile)
[![Built with Vanilla JS](https://img.shields.io/badge/Tech-Vanilla--JS-yellow.svg)](https://developer.mozilla.org)
[![Web Audio API](https://img.shields.io/badge/Audio-Web--Audio--API-purple.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

**OpenPulse** is a modern, skinable, self-hostable web audio player engineered for high performance, local music storage, cloud audio stream attachment, real-time audio visualization, and graphic equalizing.

---

## ✨ Features

- 📂 **Local File Ingestion & Offline Storage**: Drag and drop MP3, FLAC, OGG, WAV audio files directly into your browser. Music metadata and binary files are stored in browser `IndexedDB`.
- ☁️ **Cloud Stream & WebDAV Attachment**: Attach direct HTTP/HTTPS audio streams or connect WebDAV cloud directories.
- 🎚️ **10-Band Graphic Equalizer**: Web Audio API BiquadFilter equalizer pipeline with presets (*Bass Boost, Vocal, Electronic, Rock, Pop, Flat*).
- 🌌 **Real-Time Audio Visualizer**: 60 FPS Canvas rendering with 4 reactive modes:
  - 📊 *Spectrum Frequency Bars*
  - 〰️ *Oscilloscope Waveform*
  - ☀️ *Radial Pulse Ring*
  - ✨ *Cosmic Particle Starfield*
- 🎨 **Skinning & Theme Engine**: 5 built-in modern skins (*Obsidian Glass, Cyberpunk 1984, OLED Midnight, Nordic Aurora, Retro Winamp*) plus dynamic album-art accent color extraction.
- 📑 **Playlist & Queue System**: Drag-and-drop playlist creation, Now-Playing Queue, Favorites, and M3U playlist file export.
- ⚡ **Self-Host Ready**: Lightweight SPA architecture that runs anywhere via Docker, Nginx, or static file hosting.

---

## 🚀 Quick Start

### Local Development

1. **Clone repository**:
   ```bash
   git clone https://github.com/Richie086/OpenPulse.git
   cd OpenPulse
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

---

## 🐳 Self-Hosting with Docker

Deploy OpenPulse on your home server, Synology NAS, Unraid, or VPS with a single command:

```bash
docker-compose up -d --build
```
The web player will be served on port `8080` at `http://your-server-ip:8080`.

---

## 🏛️ Project Architecture

```
OpenPulse/
├── index.html              # Main HTML5 UI Shell & Modals
├── styles/
│   ├── index.css           # Glassmorphism Layout & Animations
│   └── themes.css          # CSS Variables & Skin Palette Definitions
├── src/
│   ├── audio/
│   │   ├── audioEngine.js  # Web Audio API Engine & 10-Band EQ
│   │   └── visualizer.js   # Canvas 2D Audio Visualizer Renderer
│   ├── db/
│   │   └── indexedDB.js    # IndexedDB Local Track & Playlist Store
│   ├── services/
│   │   └── cloudConnectors.js # Cloud Streams & WebDAV Integration
│   ├── ui/
│   │   ├── playlistManager.js # Playlist & M3U Export Logic
│   │   └── queueManager.js    # Queue, Shuffle, & Repeat Handler
│   ├── utils/
│   │   ├── tagParser.js    # ID3 & Cover Art Metadata Reader
│   │   ├── themeEngine.js  # Theme Switcher & Color Extraction
│   │   └── sampleAudio.js  # Pre-loaded Demo Audio Tracks
│   └── main.js             # Application Entry & Event Wiring
├── Dockerfile              # Production Nginx Docker Container
└── docker-compose.yml      # Multi-container orchestration
```

---

## 📖 Comprehensive Documentation

- 📘 [Implementation Details](IMPLEMENTATION.md) — Technical architecture & Web Audio pipeline details.
- 🗺️ [Project Roadmap](ROADMAP.md) — Feature milestones and release versions.
- 🎯 [Milestones](MILESTONES.md) — Progress tracking and target deliverables.
- 📐 [Architectural Decisions (ADRs)](DECISIONS.md) — Rationale behind design and technology choices.

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).
