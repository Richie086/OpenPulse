import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, UploadCloud } from 'lucide-react';

export function AddMusicModal({ isOpen, onClose, onAddFiles, onAddStreamUrl }) {
  const fileInputRef = useRef(null);
  const [streamUrl, setStreamUrl] = useState('');

  if (!isOpen) return null;

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onAddFiles(Array.from(e.dataTransfer.files));
      onClose();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onAddFiles(Array.from(e.target.files));
      onClose();
    }
  };

  const handleStreamSubmit = (e) => {
    e.preventDefault();
    if (streamUrl.trim()) {
      onAddStreamUrl(streamUrl.trim());
      setStreamUrl('');
      onClose();
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-card">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold">Add Music / Cloud Integration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-5">
          {/* Dropzone */}
          <div
            className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center bg-white/5 hover:border-primary transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <UploadCloud className="w-10 h-10 text-primary mx-auto mb-2" />
            <p className="font-semibold text-sm">Drag & Drop Audio Files / Folders Here</p>
            <p className="text-xs text-muted-foreground mt-1">Supports MP3, FLAC, OGG, WAV audio files</p>
            <input
              type="file"
              ref={fileInputRef}
              multiple
              accept="audio/*"
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* URL Stream Ingestion */}
          <form onSubmit={handleStreamSubmit} className="border-t border-white/10 pt-4">
            <label className="text-xs font-semibold block mb-2">Attach Stream URL / Cloud Link:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                placeholder="https://example.com/audio-stream.mp3"
                className="btn w-full text-left bg-glass-card border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <Button type="submit" className="btn-primary">
                Attach
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
