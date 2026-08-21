import React from 'react';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { Play, Sparkles, Terminal, Code, ShieldCheck, Activity, Cpu, Sliders, Server, Zap, Radio } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export function DashboardView({
  visualizer,
  visMode,
  onChangeVisMode,
  tracks,
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  onPlayTrack,
  onSeek
}) {
  const albums = [
    { title: 'Cosmic Drift', type: 'Album', gradient: 'from-purple-900 to-indigo-600' },
    { title: 'Synthetica Flux', type: 'Album', gradient: 'from-cyan-800 to-pink-600' },
    { title: 'Echo Chambers', type: 'Album', gradient: 'from-blue-900 to-teal-500' },
    { title: 'Pentacolor', type: 'Album', gradient: 'from-orange-800 to-purple-600' },
    { title: 'Elementic Flats', type: 'Album', gradient: 'from-emerald-800 to-blue-600' }
  ];

  const features = [
    { icon: Activity, title: 'WebGL 3D Visualizers', desc: 'Morphing wireframe mesh & real-time spectrum analysis.' },
    { icon: Sliders, title: '10-Band Graphic EQ', desc: 'Biquad filter DSP processing with custom genre presets.' },
    { icon: Server, title: 'Subsonic API Sync', desc: 'Connect to Navidrome & Airsonic self-hosted servers.' },
    { icon: Zap, title: 'Zero-Latency Seek', desc: 'Instant local IndexedDB storage & WASM audio streaming.' }
  ];

  const dockerYaml = `1 docker-compose.yml
2 
3 services:
4   openpulse:
5     container_name: OpenPulse
6     ports:
7       - 8080:8080
8       - 9000:9000
9     environment:
10      NODE_ENV=production
11      AUDIO_DIR=/music
12    volumes:
13      - /music/authboard=/music
14    healthcheck:
15      - openPulse.sync`;

  const jsonConfig = `{
  "server": "online",
  "audio": {
    "wasmDSP": true,
    "sampleRate": 48000
  },
  "ui": {
    "theme": "cyber-glass"
  }
}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto">
      {/* Left / Center Main Section (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        
        {/* LANDING PAGE INTRODUCTION HERO CARD */}
        <Card className="bg-gradient-to-r from-slate-900/90 via-slate-950/95 to-indigo-950/90 border-cyan-500/30 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <CardHeader className="p-6 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-cyan-500/30">
                Self-Hosted Audio Workstation
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold uppercase tracking-wider border border-emerald-500/30">
                v1.2.0 Active Node
              </span>
            </div>
            
            <CardTitle className="text-2xl font-black tracking-tight text-white">
              Welcome to <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">OpenPulse</span>
            </CardTitle>
            
            <CardDescription className="text-xs text-slate-300 leading-relaxed mt-1">
              OpenPulse is a high-fidelity, containerized web audio player and DSP processing workstation.
              Built for self-hosters and audiophiles, it delivers real-time 3D WebGL visualizations, zero-latency local caching, 
              10-band equalizer filters, and seamless Subsonic / Navidrome library synchronization.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-2">
              {features.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-md flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-cyan-400">
                      <IconComponent className="w-4 h-4" />
                      <span className="font-bold text-xs text-white">{feat.title}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Hero Visualizer Card */}
        <Card className="bg-slate-950/80 border-cyan-500/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <CardHeader className="p-5 pb-2 flex flex-row justify-between items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">OPENPULSE VISUALIZER STAGE</div>
              <CardTitle className="text-lg font-extrabold text-white">WebGL & WASM Frequency Stage</CardTitle>
              <CardDescription className="text-xs text-slate-400">Real-time multi-layered 3D wireframe mesh wave generator</CardDescription>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold text-purple-400">Morphing wave in real-time</span>
              <p className="text-[11px] text-slate-400">Above zero-latency sleek seek</p>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            {/* Visualizer Stage */}
            <AudioVisualizer
              visualizer={visualizer}
              visMode={visMode}
              onChangeMode={onChangeVisMode}
            />

            {/* Seekbar along bottom of Visualizer */}
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-mono text-cyan-300 mb-1">
                <span>Zero-latency sleek seek bar</span>
                <span>
                  {Math.floor(currentTime / 60)}:{('0' + Math.floor(currentTime % 60)).slice(-2)} / {Math.floor(duration / 60)}:{('0' + Math.floor(duration % 60)).slice(-2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="slider-range w-full accent-cyan-400"
              />
            </div>
          </CardContent>
        </Card>

        {/* Featured Albums Grid */}
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>Featured Audio Collections</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {albums.map((album, idx) => {
              const trackMatch = tracks[idx % tracks.length];
              return (
                <Card
                  key={idx}
                  onClick={() => trackMatch && onPlayTrack(trackMatch)}
                  className="group relative bg-slate-900/60 border-white/10 p-3 cursor-pointer hover:border-primary/60 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/10"
                >
                  <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${album.gradient} flex items-center justify-center relative overflow-hidden mb-3`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                    <Play className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 drop-shadow-md" />
                  </div>
                  <div className="font-bold text-xs text-white truncate">{album.title}</div>
                  <div className="text-[11px] text-slate-400">{album.type}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Sidebar Panel (4 cols) */}
      <div className="lg:col-span-4 flex flex-col gap-6">
        {/* Quickstart Deployment Card */}
        <Card className="bg-slate-900/80 border-white/10 p-5 backdrop-blur-xl">
          <CardHeader className="p-0 mb-3 flex flex-row items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Quickstart Deployment (Docker)
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-cyan-300 border border-cyan-500/20 overflow-x-auto leading-relaxed">
              <pre>{dockerYaml}</pre>
            </div>
          </CardContent>
        </Card>

        {/* Configuration Card */}
        <Card className="bg-slate-900/80 border-white/10 p-5 backdrop-blur-xl">
          <CardHeader className="p-0 mb-3 flex flex-row items-center gap-2">
            <Code className="w-4 h-4 text-purple-400" />
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Configuration (OpenPulse.config.json)
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="bg-slate-950 p-4 rounded-xl font-mono text-[11px] text-purple-300 border border-purple-500/20 overflow-x-auto leading-relaxed">
              <pre>{jsonConfig}</pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
