---
name: 3d-web-experience
description: >-
  Crafting advanced WebGL, Canvas 2D/3D, and Three.js visualizer modes, multi-layered 3D wireframe mesh wave stages, and GPU-driven spectrum particle systems for audio applications.
---

# 3D Web Experience Skill Guide

## Capabilities
1. **WebGL & Canvas Rendering**: Construct high-performance real-time canvas visualizers responsive to Web Audio API AnalyserNode frequency data.
2. **Wireframe Wave Stage**: Generate dynamic 3D wireframe mesh surfaces using sine wave modulations and logarithmic audio frequency bin interpolation.
3. **GPU Particle Systems**: Manage animated particle field states with velocity physics and bass-triggered pulse multipliers.

## Implementation Guidelines
- Always ensure canvas size matches device pixel ratio: `width * window.devicePixelRatio`.
- Perform zero-allocation render passes inside `requestAnimationFrame` loops.
- Use CSS variable theme injection (`--primary`, `--accent`) for seamless visualizer skinning.
