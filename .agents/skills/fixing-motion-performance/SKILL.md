---
name: fixing-motion-performance
description: >-
  Optimizing 60fps canvas requestAnimationFrame loops, Web Audio AnalyserNode array buffering, zero-garbage-collection rendering, and eliminating frame drops during audio playback.
---

# Motion Performance & 60FPS Optimization Skill

## Core Directives
1. **Garbage Collection Elimination**: Reuse `Uint8Array` byte buffers across animation ticks instead of reallocating typed arrays inside `draw()`.
2. **Context Scale Safety**: Always pair canvas transform scaling (`ctx.scale`) with explicit canvas width resets or `save()` / `restore()` calls to prevent compounding scale matrices.
3. **Smooth Audio Smoothing**: Apply temporal decay factor (e.g. `smoothingTimeConstant = 0.85`) on `AnalyserNode` to prevent visual jitter.
4. **DOM Paint Isolation**: Render high-frequency visuals on independent `<canvas>` layers isolated from main layout reflows.
