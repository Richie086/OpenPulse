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
      // Ignore shortcut keypresses if user is typing in an input or textarea
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) {
        return;
      }

      switch (e.code) {
        case 'Space':
        case 'KeyK':
          e.preventDefault();
          onTogglePlay?.();
          break;
        case 'KeyL':
          e.preventDefault();
          onNext?.();
          break;
        case 'KeyJ':
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
        case 'KeyC':
          e.preventDefault();
          onToggleLyrics?.();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onTogglePlay,
    onNext,
    onPrev,
    onVolumeUp,
    onVolumeDown,
    onToggleMute,
    onToggleEQ,
    onToggleLyrics
  ]);
}
