// Cloud Storage Attachment & Stream Connector Service

export class CloudConnectorsService {
  constructor() {
    this.cloudSources = [];
  }

  // Add Direct Stream / URL Audio Source
  async addUrlSource(url, title = 'Web Stream', artist = 'Online Stream') {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      throw new Error("Invalid URL stream format");
    }

    const track = {
      id: 'stream-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      title: title || 'Audio Stream',
      artist: artist || 'Cloud Source',
      album: 'Web Cloud Feed',
      duration: 0,
      url: url,
      artData: null,
      source: 'url',
      addedAt: Date.now()
    };

    return track;
  }

  // WebDAV Folder Fetcher simulation & parser
  async connectWebDAV(serverUrl, username = '', password = '') {
    // Basic WebDAV PROPFIND fetch attempt
    try {
      const response = await fetch(serverUrl, {
        method: 'PROPFIND',
        headers: {
          'Depth': '1',
          'Authorization': username ? 'Basic ' + btoa(`${username}:${password}`) : ''
        }
      });

      if (!response.ok) {
        throw new Error(`WebDAV returned status ${response.status}`);
      }

      const text = await response.text();
      // Parse XML response for audio files (.mp3, .flac, .ogg, .wav)
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, 'text/xml');
      const hrefs = Array.from(xmlDoc.getElementsByTagName('href') || xmlDoc.getElementsByTagName('d:href'));
      
      const audioTracks = hrefs
        .map(h => h.textContent)
        .filter(path => /\.(mp3|wav|ogg|flac)$/i.test(path))
        .map(path => {
          const fileName = path.split('/').pop();
          return {
            id: 'webdav-' + Math.random().toString(36).substr(2, 6),
            title: decodeURIComponent(fileName).replace(/\.[^/.]+$/, ""),
            artist: 'WebDAV Server',
            album: 'Cloud Library',
            duration: 0,
            url: path.startsWith('http') ? path : new URL(path, serverUrl).href,
            source: 'webdav',
            addedAt: Date.now()
          };
        });

      return audioTracks;
    } catch (err) {
      console.warn("WebDAV direct fetch failed or CORS restricted, falling back to direct stream parser:", err);
      throw err;
    }
  }
}

export const cloudService = new CloudConnectorsService();
