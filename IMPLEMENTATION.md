# OpenPulse - Implementation Architecture & Technical Specification

This document provides a deep dive into the software architecture, Web Audio API signal processing pipeline, canvas visualizer algorithms, and data persistence models powering **OpenPulse**.

---

## 1. Web Audio API Processing Pipeline

OpenPulse processes all audio through an explicit `AudioContext` graph, enabling high-fidelity equalizer filters, gain boosting, and real-time frequency analysis.

```
                  +-------------------------+
                  |    HTMLAudioElement     |
                  +------------+------------+
                               |
                               v
                  +------------+------------+
                  |  MediaElementSourceNode |
                  +------------+------------+
                               |
                               v
                  +------------+------------+
                  | 10-Band BiquadFilters   |  (31Hz -> 16kHz)
                  +------------+------------+
                               |
                               v
                  +------------+------------+
                  |        GainNode         |  (Master Volume / Mute)
                  +------------+------------+
                               |
                               v
                  +------------+------------+
                  |       AnalyserNode      |  (FFT 512, Frequency & Time)
                  +-----+-------------+-----+
                        |             |
                        v             v
             +----------+---+     +---+----------+
             | Canvas Visual|     | Audio Output |
             |   Renderer   |     | (Speakers)   |
             +--------------+     +--------------+
```

### 10-Band BiquadFilter Frequencies
- **Sub-Bass**: 31Hz, 62Hz (`lowshelf`)
- **Bass & Low-Mids**: 125Hz, 250Hz, 500Hz (`peaking`)
- **Mid-Range & Treble**: 1kHz, 2kHz, 4kHz, 8kHz (`peaking`)
- **Air & Brilliance**: 16kHz (`highshelf`)

---

## 2. Real-Time Canvas Audio Visualizer

The visualizer module (`src/audio/visualizer.js`) utilizes `requestAnimationFrame` to achieve locked 60 FPS rendering synced to the audio clock.

- **Spectrum Frequency Bars (`bars`)**: Converts byte frequency array into 48 dynamic frequency columns with HSL accent gradients and peak glowing shadows.
- **Oscilloscope Waveform (`waveform`)**: Draws time-domain PCM amplitude values as a smooth glowing sine wave across the canvas centerline.
- **Radial Pulse Ring (`radial`)**: Calculates average bass frequency amplitude (0–120Hz) to modulate the radius of a central glowing circle, projecting 64 outward radial spectrum needles.
- **Cosmic Starfield (`particles`)**: Physics particle engine (70 particles) reacting to bass amplitude spikes by boosting velocity and particle radius.

---

## 3. Data Storage & Local Persistence (`IndexedDB`)

All user tracks, metadata, playlists, and theme preferences are stored locally in browser `IndexedDB` under `SonicPulseDB` (v1):

### Object Stores:
- **`tracks`**:
  - `id` (Primary Key, string)
  - `title`, `artist`, `album`, `duration`
  - `fileData` (Blob/File binary object)
  - `artData` (Base64 data URL string)
  - `source` (`'local'` | `'cloud'` | `'url'`)
  - `addedAt` (Timestamp)
- **`playlists`**:
  - `id` (Primary Key)
  - `name` (string)
  - `trackIds` (Array of track IDs)
  - `createdAt` (Timestamp)
- **`settings`**:
  - Key-value store for skin selection, EQ gains, and last played volume.

---

## 4. Theme & Skinning Engine

Skinning is driven entirely by standard CSS variables defined in `styles/themes.css`.

Switching skins updates the root `data-theme` attribute on the `<html>` element:
```js
document.documentElement.setAttribute('data-theme', 'cyberpunk');
```

 dynamic color tinting extracts the dominant RGB color from the active track's cover art using an off-screen `2D Canvas` and updates `--primary` and `--primary-glow` variables dynamically.
