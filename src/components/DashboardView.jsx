import React from 'react';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { Play, Sparkles, Terminal, Code, ShieldCheck } from 'lucide-react';
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
    "wasmDSP": true
  },
  "ui": {
    "theme": "cyber-glass"
  }
}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 overflow-y-auto">
      {/* Left / Center Main Section (8 cols) */}
      <div className="lg:col-span-8 flex flex-col gap-6">
        {/* Top Header Summary Callout */}
        <Card className="bg-white/5 border-white/10 backdrop-blur-md">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold tracking-tight">DASHBOARD</h1>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span>Single Docker Container: <strong>single source audio</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Lossless FLAC/AAC Streaming</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Visualizer Card */}
        <Card className="bg-slate-950/80 border-cyan-500/20 shadow-2xl relative overflow-hidden backdrop-blur-xl">
          <CardHeader className="p-5 pb-2 flex flex-row justify-between items-start">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-widest text-cyan-400">OPENPULSE VISUALIZER</div>
              <CardTitle className="text-lg font-extrabold text-white">WebGL & WASM Streaming</CardTitle>
              <CardDescription className="text-xs text-slate-400">High-end frequency 3D wireframe visualizer</CardDescription>
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
