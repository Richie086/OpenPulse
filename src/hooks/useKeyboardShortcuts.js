import { useEffect } from 'react';

export function useKeyboardShortcuts({
  onTogglePlay,
  onNext,
  onPrev,
  onVolumeUp,
  onVolumeDown,
  onToggleMute,
  onToggleEQ,
  onToggleLyrics
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore keypress when typing in input fields or textareas
      const targetTag = e.target.tagName.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay?.();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext?.();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrev?.();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onVolumeUp?.();
          break;
        case 'ArrowDown':
          e.preventDefault();
          onVolumeDown?.();
          break;
        case 'KeyM':
          e.preventDefault();
          onToggleMute?.();
          break;
        case 'KeyE':
          e.preventDefault();
          onToggleEQ?.();
          break;
        case 'KeyL':
          e.preventDefault();
          onToggleLyrics?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onTogglePlay, onNext, onPrev, onVolumeUp, onVolumeDown, onToggleMute, onToggleEQ, onToggleLyrics]);
}
