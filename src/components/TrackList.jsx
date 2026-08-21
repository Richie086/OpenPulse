import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Heart, Trash2, Music } from 'lucide-react';

export function TrackList({
  tracks,
  currentTrackId,
  isPlaying,
  onPlayTrack,
  onToggleFavorite,
  onDeleteTrack
}) {
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!tracks || tracks.length === 0) {
    return (
      <div className="track-table-container p-12 text-center text-muted-foreground">
        <Music className="w-12 h-12 mx-auto mb-3 text-white/20" />
        <p className="font-semibold text-base">No tracks found</p>
        <p className="text-xs mt-1">Upload files or add a cloud stream to start playing music.</p>
      </div>
    );
  }

  return (
    <div className="track-table-container">
      <table className="track-table">
        <thead>
          <tr>
            <th style={{ width: '48px' }}>#</th>
            <th>Title & Artist</th>
            <th>Album</th>
            <th style={{ width: '100px' }}>Duration</th>
            <th style={{ width: '100px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((track, idx) => {
            const isCurrent = currentTrackId === track.id;
            return (
              <tr
                key={track.id}
                className={`${isCurrent ? 'playing' : ''}`}
                onDoubleClick={() => onPlayTrack(track)}
              >
                <td className="font-mono text-xs text-muted-foreground">
                  {isCurrent && isPlaying ? (
                    <span className="text-primary font-bold">▶</span>
                  ) : (
                    idx + 1
                  )}
                </td>
                <td>
                  <div className="track-cell-info">
                    <div className="track-thumb">
                      {track.coverArt ? (
                        <img src={track.coverArt} alt={track.title} />
                      ) : (
                        <Music className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="track-title-text">{track.title}</div>
                      <div className="track-artist-text">{track.artist}</div>
                    </div>
                  </div>
                </td>
                <td className="text-muted-foreground text-sm">{track.album || 'Unknown Album'}</td>
                <td className="font-mono text-xs text-muted-foreground">{formatTime(track.duration)}</td>
                <td style={{ textAlign: 'right' }}>
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(track.id);
                      }}
                    >
                      <Heart className={`w-3.5 h-3.5 ${track.isFavorite ? 'fill-primary text-primary' : ''}`} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-red-400"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTrack(track.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
