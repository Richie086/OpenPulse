// Web Audio API Audio Engine & Equalizer Controller

export const EQ_FREQUENCIES = [31, 62, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export const EQ_PRESETS = {
  flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bassBoost: [6, 5, 4, 2, 0, 0, 0, 0, 1, 2],
  vocal: [-2, -1, 1, 3, 4, 4, 3, 1, 0, -1],
  electronic: [5, 4, 2, 0, -2, 2, 1, 3, 4, 5],
  rock: [4, 3, 2, 1, -1, -1, 0, 2, 3, 4],
  pop: [-1, 1, 3, 4, 4, 3, 1, 0, 1, 2]
};

export class AudioEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.crossOrigin = "anonymous";

    this.audioCtx = null;
    this.sourceNode = null;
    this.eqFilters = [];
    this.gainNode = null;
    this.analyser = null;

    this.currentTrack = null;
    this.isPlaying = false;
    this.volume = 0.8;
    this.playbackRate = 1.0;
    this.isMuted = false;

    this.listeners = {
      timeupdate: [],
      ended: [],
      play: [],
      pause: [],
      trackchange: [],
      error: []
    };

    this.initAudioElementEvents();
  }

  initAudioContext() {
    if (this.audioCtx) return;

    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtxClass();

      this.sourceNode = this.audioCtx.createMediaElementSource(this.audio);

      // Create 10-band BiquadFilterNodes
      let lastNode = this.sourceNode;
      this.eqFilters = EQ_FREQUENCIES.map((freq, idx) => {
        const filter = this.audioCtx.createBiquadFilter();
        filter.type = idx === 0 ? 'lowshelf' : idx === EQ_FREQUENCIES.length - 1 ? 'highshelf' : 'peaking';
        filter.frequency.value = freq;
        filter.gain.value = 0;
        filter.Q.value = 1.4;

        lastNode.connect(filter);
        lastNode = filter;
        return filter;
      });

      // Master Gain Node
      this.gainNode = this.audioCtx.createGain();
      this.gainNode.gain.value = this.volume;
      lastNode.connect(this.gainNode);

      // Analyser Node for Visualizers
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.82;
      this.gainNode.connect(this.analyser);

      // Connect to output destination
      this.analyser.connect(this.audioCtx.destination);
    } catch (err) {
      console.warn("AudioContext setup warning:", err);
    }
  }

  initAudioElementEvents() {
    this.audio.addEventListener('timeupdate', () => {
      this.emit('timeupdate', {
        currentTime: this.audio.currentTime,
        duration: this.audio.duration || 0
      });
    });

    this.audio.addEventListener('ended', () => {
      this.isPlaying = false;
      this.emit('ended', this.currentTrack);
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      if (this.audioCtx && this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      this.emit('play', this.currentTrack);
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.emit('pause', this.currentTrack);
    });

    this.audio.addEventListener('error', (e) => {
      console.error("Audio playback error:", e);
      this.isPlaying = false;
      this.emit('error', e);
    });
  }

  async loadTrack(track) {
    this.initAudioContext();
    this.currentTrack = track;

    if (track.fileData) {
      // Blob from local upload / IndexedDB
      this.audio.src = URL.createObjectURL(track.fileData);
    } else if (track.url) {
      this.audio.src = track.url;
    }

    this.audio.playbackRate = this.playbackRate;
    this.emit('trackchange', track);
  }

  async play(track = null) {
    this.initAudioContext();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      await this.audioCtx.resume();
    }

    if (track && track !== this.currentTrack) {
      await this.loadTrack(track);
    }

    try {
      await this.audio.play();
      this.isPlaying = true;
    } catch (err) {
      console.error("Play error:", err);
    }
  }

  pause() {
    this.audio.pause();
    this.isPlaying = false;
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
    this.emit('timeupdate', { currentTime: 0, duration: this.audio.duration || 0 });
  }

  seek(seconds) {
    if (isFinite(seconds)) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.audio.duration || 0));
    }
  }

  fastForward(seconds = 10) {
    this.seek(this.audio.currentTime + seconds);
  }

  rewind(seconds = 10) {
    this.seek(this.audio.currentTime - seconds);
  }

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    this.audio.volume = this.volume;
    if (this.gainNode) {
      this.gainNode.gain.value = this.isMuted ? 0 : this.volume;
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.audio.muted = this.isMuted;
    return this.isMuted;
  }

  setSpeed(rate) {
    this.playbackRate = rate;
    this.audio.playbackRate = rate;
  }

  setEQBand(index, gainValue) {
    if (this.eqFilters[index]) {
      this.eqFilters[index].gain.value = gainValue;
    }
  }

  applyEQPreset(presetName) {
    const preset = EQ_PRESETS[presetName] || EQ_PRESETS.flat;
    preset.forEach((gain, idx) => {
      this.setEQBand(idx, gain);
    });
    return preset;
  }

  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }
}

export const audioEngine = new AudioEngine();
