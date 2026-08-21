import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Shuffle,
  RotateCcw,
  SkipBack,
  Play,
  Pause,
  Square,
  SkipForward,
  RotateCw,
  Repeat,
  Heart,
  Volume2,
  VolumeX
} from 'lucide-react';

export function PlayerBar({
  currentTrack,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  isShuffle,
  isRepeat,
  playbackRate,
  onTogglePlay,
  onStop,
  onPrev,
  onNext,
  onSeek,
  onToggleShuffle,
  onToggleRepeat,
  onToggleMute,
  onVolumeChange,
  onToggleSpeed,
  onToggleFavorite
}) {
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <footer className="player-bar">
      {/* Track Info */}
      <div className="now-playing-cell">
        <div className="now-playing-cover">
          <img
            src={currentTrack?.coverArt || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='%2364748b'><rect width='100' height='100'/></svg>"}
            alt={currentTrack?.title || "Album Cover"}
          />
        </div>
        <div className="now-playing-details">
          <div className="now-playing-title">{currentTrack?.title || "No track selected"}</div>
          <div className="now-playing-artist">{currentTrack?.artist || "Select a song to play"}</div>
        </div>
        {currentTrack && (
          <button
            className={`control-btn ${currentTrack.isFavorite ? 'active' : ''}`}
            onClick={() => onToggleFavorite(currentTrack.id)}
            title="Favorite"
          >
            <Heart className={`w-4 h-4 ${currentTrack.isFavorite ? 'fill-primary text-primary' : ''}`} />
          </button>
        )}
      </div>

      {/* Controls & Progress */}
      <div className="player-controls-group">
        <div className="transport-buttons">
          <button
            className={`control-btn ${isShuffle ? 'active' : ''}`}
            onClick={onToggleShuffle}
            title="Toggle Shuffle"
          >
            <Shuffle className="w-4 h-4" />
          </button>
          <button className="control-btn" onClick={() => onSeek(Math.max(0, currentTime - 10))} title="Rewind 10s">
            <RotateCcw className="w-4 h-4" />
          </button>
          <button className="control-btn" onClick={onPrev} title="Previous Track">
            <SkipBack className="w-4 h-4" />
          </button>

          <Button
            onClick={onTogglePlay}
            className="control-btn control-btn-play rounded-full"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
          </Button>

          <button className="control-btn" onClick={onStop} title="Stop">
            <Square className="w-4 h-4" />
          </button>
          <button className="control-btn" onClick={onNext} title="Next Track">
            <SkipForward className="w-4 h-4" />
          </button>
          <button className="control-btn" onClick={() => onSeek(Math.min(duration, currentTime + 10))} title="Fast-Forward 10s">
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            className={`control-btn ${isRepeat ? 'active' : ''}`}
            onClick={onToggleRepeat}
            title="Toggle Repeat"
          >
            <Repeat className="w-4 h-4" />
          </button>
        </div>

        <div className="timeline-container flex items-center gap-3 w-full">
          <span>{formatTime(currentTime)}</span>
          <div className="relative flex-1 cursor-pointer">
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime || 0}
              step="0.1"
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              className="slider-range"
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Utilities */}
      <div className="player-utilities-group">
        <Button variant="ghost" size="sm" onClick={onToggleSpeed} className="text-xs font-mono">
          {playbackRate.toFixed(1)}x
        </Button>
        <div className="volume-slider-wrapper">
          <button className="control-btn" onClick={onToggleMute} title={isMuted ? "Unmute" : "Mute"}>
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
            className="slider-range"
          />
        </div>
      </div>
    </footer>
  );
}
