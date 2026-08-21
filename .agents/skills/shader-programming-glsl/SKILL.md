---
name: shader-programming-glsl
description: >-
  Writing custom GLSL fragment/vertex shaders reactive to real-time audio frequency, bass levels, and dynamic spectrum waveforms.
---

# Shader Programming & GLSL Audio Reactivity Skill

## Shader Guidelines
1. **Audio Uniform Ingestion**:
   - Pass audio energy bands as uniform floats (`u_bass`, `u_mid`, `u_treble`) and time (`u_time`) to the shader context.
2. **Frequency Distortion**:
   - Warp vertex positions using trigonometric wave functions modulated by realtime Web Audio frequency averages.
3. **Fragment Glow Procedurals**:
   - Compute distance field gradients (`length(uv)`) and color ramps mapped to dynamic HSL accent variables.
