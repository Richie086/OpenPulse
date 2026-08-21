# OpenPulse - Architectural Decision Records (ADRs)

This document records the key architectural and design decisions made during the development of **OpenPulse**.

---

## ADR 001: Pure Client-Side Static SPA Architecture
- **Status**: Accepted
- **Context**: The application must be easily self-hostable by anyone on any hardware (NAS, Raspberry Pi, VPS, Nginx, Docker) without requiring database servers or complex backends.
- **Decision**: Build OpenPulse as a pure static Single Page Application (SPA) using HTML5, Vanilla JavaScript (ES Modules), and standard CSS variables. All data storage is handled client-side using `IndexedDB`.
- **Consequences**: Zero server dependencies required. Extremely low CPU/RAM overhead on host machines.

---

## ADR 002: Web Audio API vs Standard HTML5 `<audio>` Tag
- **Status**: Accepted
- **Context**: Standard `<audio>` elements do not provide frequency analysis for visualizers or multi-band equalizer filtering.
- **Decision**: Route the `HTMLAudioElement` through an `AudioContext.createMediaElementSource()` pipeline connected to 10 `BiquadFilterNode` instances and an `AnalyserNode`.
- **Consequences**: Enables real-time 60 FPS canvas visualization and full 10-band equalization.

---

## ADR 003: Vanilla CSS Variables over TailwindCSS
- **Status**: Accepted
- **Context**: The app requires deep skinning and dynamic color tinting based on album artwork.
- **Decision**: Use Vanilla CSS custom properties (`var(--primary)`, `var(--bg-app)`, etc.) instead of utility classes.
- **Consequences**: Instant theme switching by modifying single root attribute or CSS variable. Zero utility CSS bloat.

---

## ADR 004: IndexedDB for Local Binary & Metadata Storage
- **Status**: Accepted
- **Context**: `LocalStorage` has a strict 5MB limit which is insufficient for audio binary files.
- **Decision**: Use browser `IndexedDB` with asynchronous transactions to store full audio `Blob` objects and extracted ID3 artwork.
- **Consequences**: Supports gigabytes of local offline music storage directly within the user's browser workspace.
