// Skin & Theme Switching Engine

export const THEME_PRESETS = [
  { id: 'obsidian', name: 'Obsidian Glass', primary: '#6366f1', accent: '#06b6d4', dots: ['#6366f1', '#06b6d4', '#121624'] },
  { id: 'cyberpunk', name: 'Cyberpunk 1984', primary: '#ff007f', accent: '#00f0ff', dots: ['#ff007f', '#00f0ff', '#1a092d'] },
  { id: 'oled', name: 'OLED Midnight', primary: '#10b981', accent: '#3b82f6', dots: ['#10b981', '#3b82f6', '#000000'] },
  { id: 'nordic', name: 'Nordic Aurora', primary: '#14b8a6', accent: '#38bdf8', dots: ['#14b8a6', '#a855f7', '#071318'] },
  { id: 'retro', name: 'Retro Winamp', primary: '#00ff41', accent: '#ffb703', dots: ['#00ff41', '#ffb703', '#20232a'] }
];

export class ThemeEngine {
  constructor() {
    this.currentTheme = 'obsidian';
  }

  setTheme(themeId) {
    this.currentTheme = themeId;
    document.documentElement.setAttribute('data-theme', themeId);
  }

  // Dynamic accent color tinting based on album cover image
  extractAccentFromImage(imgElement) {
    if (!imgElement) return;

    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 50;
      canvas.height = 50;

      ctx.drawImage(imgElement, 0, 0, 50, 50);
      const imageData = ctx.getImageData(0, 0, 50, 50).data;

      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < imageData.length; i += 16) {
        r += imageData[i];
        g += imageData[i + 1];
        b += imageData[i + 2];
        count++;
      }

      r = Math.floor(r / count);
      g = Math.floor(g / count);
      b = Math.floor(b / count);

      const dominantHsl = `rgb(${r}, ${g}, ${b})`;
      document.documentElement.style.setProperty('--primary', dominantHsl);
      document.documentElement.style.setProperty('--primary-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);
    } catch (e) {
      console.warn("Color extraction failed:", e);
    }
  }

  resetThemeToPreset() {
    document.documentElement.style.removeProperty('--primary');
    document.documentElement.style.removeProperty('--primary-glow');
  }
}

export const themeEngine = new ThemeEngine();
