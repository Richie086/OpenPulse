import React from 'react';
import { Button } from '@/components/ui/button';
import { X, Mic2, AlignLeft } from 'lucide-react';

export function LyricsDrawer({ isOpen, onClose, currentTrack, currentTime }) {
  // Sample synced LRC lyrics fallback
  const sampleLyrics = [
    { time: 0, text: "♪ (Synthwave Introlude) ♪" },
    { time: 10, text: "Neon lights reflecting on the rainy street" },
    { time: 20, text: "Driving fast into the night, feeling the beat" },
    { time: 35, text: "Synthwave vibrations pulsing in my mind" },
    { time: 50, text: "Leaving all the shadows and doubts behind" },
    { time: 70, text: "♪ (Cosmic Arpeggio Solo) ♪" },
    { time: 90, text: "OpenPulse playing music free and clear" },
    { time: 110, text: "Endless sound reverberating far and near" },
    { time: 130, text: "♪ (Fade out into the horizon) ♪" }
  ];

  const lyrics = currentTrack?.lyrics || sampleLyrics;

  const currentLyricIndex = lyrics.findIndex((line, idx) => {
    const nextLine = lyrics[idx + 1];
    if (nextLine) {
      return currentTime >= line.time && currentTime < nextLine.time;
    }
    return currentTime >= line.time;
  });

  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`}>
      <div className="drawer-header">
        <div className="drawer-title flex items-center gap-2">
          <Mic2 className="w-5 h-5 text-primary" />
          <span>Synced Lyrics Viewer</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="mb-4">
        <div className="text-sm font-bold text-white">{currentTrack?.title || "No Track Playing"}</div>
        <div className="text-xs text-muted-foreground">{currentTrack?.artist || "Unknown Artist"}</div>
      </div>

      <div className="flex flex-col gap-3 py-4 max-h-[70vh] overflow-y-auto pr-2">
        {lyrics.map((line, idx) => {
          const isActive = idx === currentLyricIndex;
          return (
            <div
              key={idx}
              className={`p-3 rounded-lg transition-all duration-300 text-sm ${
                isActive
                  ? 'bg-primary/20 text-white font-bold border-l-4 border-primary scale-[1.02] shadow-lg'
                  : 'text-muted-foreground hover:text-white/80'
              }`}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}
