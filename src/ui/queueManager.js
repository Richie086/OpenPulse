// Now Playing Queue and Track Sequence Manager

export class QueueManager {
  constructor() {
    this.queue = [];
    this.currentIndex = -1;
    this.repeatMode = 'off'; // 'off' | 'all' | 'one'
    this.isShuffle = false;
    this.history = [];
  }

  setQueue(tracks, startIndex = 0) {
    this.queue = [...tracks];
    this.currentIndex = startIndex;
  }

  getCurrentTrack() {
    if (this.currentIndex >= 0 && this.currentIndex < this.queue.length) {
      return this.queue[this.currentIndex];
    }
    return null;
  }

  getNextTrack() {
    if (this.queue.length === 0) return null;

    if (this.repeatMode === 'one') {
      return this.queue[this.currentIndex];
    }

    if (this.isShuffle) {
      const nextIdx = Math.floor(Math.random() * this.queue.length);
      this.currentIndex = nextIdx;
      return this.queue[this.currentIndex];
    }

    if (this.currentIndex < this.queue.length - 1) {
      this.currentIndex++;
      return this.queue[this.currentIndex];
    } else if (this.repeatMode === 'all') {
      this.currentIndex = 0;
      return this.queue[0];
    }

    return null;
  }

  getPreviousTrack() {
    if (this.queue.length === 0) return null;

    if (this.currentIndex > 0) {
      this.currentIndex--;
      return this.queue[this.currentIndex];
    } else if (this.repeatMode === 'all') {
      this.currentIndex = this.queue.length - 1;
      return this.queue[this.currentIndex];
    }

    return this.queue[0];
  }

  toggleShuffle() {
    this.isShuffle = !this.isShuffle;
    return this.isShuffle;
  }

  toggleRepeat() {
    if (this.repeatMode === 'off') this.repeatMode = 'all';
    else if (this.repeatMode === 'all') this.repeatMode = 'one';
    else this.repeatMode = 'off';
    return this.repeatMode;
  }

  addToQueue(track) {
    this.queue.push(track);
  }

  removeFromQueue(index) {
    if (index >= 0 && index < this.queue.length) {
      this.queue.splice(index, 1);
      if (index < this.currentIndex) {
        this.currentIndex--;
      }
    }
  }
}

export const queueManager = new QueueManager();
