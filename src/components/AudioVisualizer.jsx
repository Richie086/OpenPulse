import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2, Activity, Sun, Sparkles } from 'lucide-react';

export function AudioVisualizer({ visualizer, visMode, onChangeMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (visualizer && canvasRef.current) {
      visualizer.initCanvas(canvasRef.current);
    }
  }, [visualizer]);

  return (
    <div className="visualizer-container">
      <canvas ref={canvasRef} id="visualizerCanvas" />
      <div className="visualizer-overlay-controls">
        <span className="badge">Visualizer:</span>
        <Button
          variant={visMode === 'bars' ? 'secondary' : 'ghost'}
          size="icon"
          className="btn-icon h-8 w-8"
          onClick={() => onChangeMode('bars')}
          title="Spectrum Bars"
        >
          <BarChart2 className="w-4 h-4" />
        </Button>
        <Button
          variant={visMode === 'waveform' ? 'secondary' : 'ghost'}
          size="icon"
          className="btn-icon h-8 w-8"
          onClick={() => onChangeMode('waveform')}
          title="Oscilloscope Waveform"
        >
          <Activity className="w-4 h-4" />
        </Button>
        <Button
          variant={visMode === 'radial' ? 'secondary' : 'ghost'}
          size="icon"
          className="btn-icon h-8 w-8"
          onClick={() => onChangeMode('radial')}
          title="Radial Pulse"
        >
          <Sun className="w-4 h-4" />
        </Button>
        <Button
          variant={visMode === 'particles' ? 'secondary' : 'ghost'}
          size="icon"
          className="btn-icon h-8 w-8"
          onClick={() => onChangeMode('particles')}
          title="Cosmic Starfield"
        >
          <Sparkles className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
