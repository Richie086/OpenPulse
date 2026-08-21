// Subsonic / Navidrome API Connector Service

export class SubsonicConnector {
  constructor(serverUrl, username, password) {
    this.serverUrl = serverUrl ? serverUrl.replace(/\/$/, '') : '';
    this.username = username || '';
    this.password = password || '';
  }

  getAuthParams() {
    // Standard Subsonic API auth format: u=user&p=pass&v=1.16.1&c=OpenPulse
    const params = new URLSearchParams({
      u: this.username,
      p: this.password,
      v: '1.16.1',
      c: 'OpenPulse',
      f: 'json'
    });
    return params.toString();
  }

  async ping() {
    try {
      const res = await fetch(`${this.serverUrl}/rest/ping.view?${this.getAuthParams()}`);
      const data = await res.json();
      return data['subsonic-response']?.status === 'ok';
    } catch (e) {
      console.error('Subsonic ping failed:', e);
      return false;
    }
  }

  async getRandomSongs(count = 20) {
    try {
      const res = await fetch(`${this.serverUrl}/rest/getRandomSongs.view?${this.getAuthParams()}&size=${count}`);
      const data = await res.json();
      const songs = data['subsonic-response']?.randomSongs?.song || [];
      return songs.map((s) => ({
        id: `subsonic_${s.id}`,
        title: s.title || 'Untitled',
        artist: s.artist || 'Unknown Artist',
        album: s.album || 'Unknown Album',
        duration: s.duration || 0,
        url: `${this.serverUrl}/rest/stream.view?${this.getAuthParams()}&id=${s.id}`,
        coverArt: s.coverArt ? `${this.serverUrl}/rest/getCoverArt.view?${this.getAuthParams()}&id=${s.coverArt}` : null,
        source: 'cloud',
        addedAt: Date.now()
      }));
    } catch (e) {
      console.error('Subsonic fetch failed:', e);
      return [];
    }
  }
}
