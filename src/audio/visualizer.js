// Audio Visualizer Canvas Renderer powered by Web Audio API AnalyserNode

export class AudioVisualizer {
  constructor(canvas = null, analyser = null) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.analyser = analyser;

    this.mode = 'bars'; // 'bars' | 'waveform' | 'radial' | 'particles'
    this.animId = null;

    this.particles = [];
    this.initParticles();
    if (this.canvas) {
      this.resize();
    }

    window.addEventListener('resize', () => this.resize());
  }

  initCanvas(canvas) {
    if (!canvas) return;
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.resize();
    this.start();
  }

  connectAudioEngine(audioEngine) {
    if (audioEngine && audioEngine.analyser) {
      this.analyser = audioEngine.analyser;
    }
  }

  setMode(mode) {
    this.mode = mode;
  }

  resize() {
    if (!this.canvas || !this.ctx) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
    this.ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  initParticles() {
    this.particles = [];
    for (let i = 0; i < 70; i++) {
      this.particles.push({
        x: Math.random() * (window.innerWidth || 800),
        y: Math.random() * 300,
        radius: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        color: `hsl(${Math.random() * 360}, 80%, 65%)`
      });
    }
  }

  start() {
    if (this.animId) cancelAnimationFrame(this.animId);

    const render = () => {
      this.draw();
      this.animId = requestAnimationFrame(render);
    };
    render();
  }

  stop() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  draw() {
    if (!this.canvas || !this.ctx) return;

    const width = this.canvas.width / (window.devicePixelRatio || 1);
    const height = this.canvas.height / (window.devicePixelRatio || 1);

    if (width === 0 || height === 0) return;

    this.ctx.clearRect(0, 0, width, height);

    if (!this.analyser) {
      this.drawIdleState(width, height);
      return;
    }

    const bufferLength = this.analyser.frequencyBinCount;
    const freqData = new Uint8Array(bufferLength);
    const timeData = new Uint8Array(bufferLength);

    this.analyser.getByteFrequencyData(freqData);
    this.analyser.getByteTimeDomainData(timeData);

    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#6366f1';
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#06b6d4';

    switch (this.mode) {
      case 'bars':
        this.drawBars(freqData, width, height, primaryColor, accentColor);
        break;
      case 'waveform':
        this.drawWaveform(timeData, width, height, primaryColor);
        break;
      case 'radial':
        this.drawRadial(freqData, width, height, primaryColor, accentColor);
        break;
      case 'particles':
        this.drawParticles(freqData, width, height, primaryColor, accentColor);
        break;
      default:
        this.drawBars(freqData, width, height, primaryColor, accentColor);
    }
  }

  drawIdleState(width, height) {
    if (!this.ctx) return;
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Audio Visualizer Ready - Play a Track to Begin', width / 2, height / 2);
  }

  drawBars(freqData, width, height, primary, accent) {
    if (!this.ctx) return;
    const barCount = 48;
    const barWidth = (width / barCount) - 3;
    const step = Math.floor(freqData.length / barCount);

    for (let i = 0; i < barCount; i++) {
      const value = freqData[i * step] || 0;
      const percent = value / 255;
      const barHeight = Math.max(4, percent * height * 0.85);

      const x = i * (barWidth + 3);
      const y = height - barHeight;

      const gradient = this.ctx.createLinearGradient(0, height, 0, 0);
      gradient.addColorStop(0, primary);
      gradient.addColorStop(1, accent);

      this.ctx.fillStyle = gradient;
      this.ctx.shadowColor = accent;
      this.ctx.shadowBlur = percent > 0.6 ? 12 : 0;
      this.ctx.fillRect(x, y, barWidth, barHeight);
    }
    this.ctx.shadowBlur = 0;
  }

  drawWaveform(timeData, width, height, color) {
    if (!this.ctx) return;
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = color;
    this.ctx.shadowColor = color;
    this.ctx.shadowBlur = 15;
    this.ctx.beginPath();

    const sliceWidth = width / timeData.length;
    let x = 0;

    for (let i = 0; i < timeData.length; i++) {
      const v = timeData[i] / 128.0;
      const y = (v * height) / 2;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      x += sliceWidth;
    }

    this.ctx.lineTo(width, height / 2);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  drawRadial(freqData, width, height, primary, accent) {
    if (!this.ctx) return;
    const centerX = width / 2;
    const centerY = height / 2;
    const baseRadius = Math.min(width, height) * 0.25;

    let sum = 0;
    for (let i = 0; i < 30; i++) sum += freqData[i];
    const avgBass = sum / 30;
    const pulseRadius = baseRadius + (avgBass / 255) * 25;

    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
    this.ctx.strokeStyle = primary;
    this.ctx.lineWidth = 4;
    this.ctx.shadowColor = primary;
    this.ctx.shadowBlur = 20;
    this.ctx.stroke();

    const bars = 64;
    for (let i = 0; i < bars; i++) {
      const rad = (i / bars) * Math.PI * 2;
      const value = freqData[i * 2] || 0;
      const lineLen = (value / 255) * 50;

      const x1 = centerX + Math.cos(rad) * pulseRadius;
      const y1 = centerY + Math.sin(rad) * pulseRadius;
      const x2 = centerX + Math.cos(rad) * (pulseRadius + lineLen);
      const y2 = centerY + Math.sin(rad) * (pulseRadius + lineLen);

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.strokeStyle = accent;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
    this.ctx.shadowBlur = 0;
  }

  drawParticles(freqData, width, height, primary, accent) {
    if (!this.ctx) return;
    let sum = 0;
    for (let i = 0; i < 40; i++) sum += freqData[i];
    const bassLevel = sum / 40 / 255;

    this.particles.forEach((p) => {
      p.x += p.speedX * (1 + bassLevel * 2);
      p.y += p.speedY * (1 + bassLevel * 2);

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      const size = p.radius * (1 + bassLevel * 1.5);
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
      this.ctx.fillStyle = bassLevel > 0.5 ? accent : primary;
      this.ctx.shadowColor = primary;
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
    });
    this.ctx.shadowBlur = 0;
  }
}
