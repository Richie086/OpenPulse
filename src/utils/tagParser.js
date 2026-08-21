// Metadata Tag Parser using browser jsmediatags with fallback filename parsing

import jsmediatags from 'jsmediatags/dist/jsmediatags.min.js';

export async function parseAudioMetadata(file) {
  return new Promise((resolve) => {
    // Default metadata derived from filename
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, "");
    let fallbackTitle = fileNameWithoutExt;
    let fallbackArtist = 'Unknown Artist';
    
    if (fileNameWithoutExt.includes(' - ')) {
      const parts = fileNameWithoutExt.split(' - ');
      fallbackArtist = parts[0].trim();
      fallbackTitle = parts.slice(1).join(' - ').trim();
    }

    const defaultMeta = {
      title: fallbackTitle,
      artist: fallbackArtist,
      album: 'Unknown Album',
      duration: 0,
      artData: null
    };

    try {
      const reader = jsmediatags || window.jsmediatags;
      if (reader && reader.read) {
        reader.read(file, {
          onSuccess: function(tag) {
            const tags = tag.tags;
            const meta = {
              title: tags.title ? tags.title.trim() : defaultMeta.title,
              artist: tags.artist ? tags.artist.trim() : defaultMeta.artist,
              album: tags.album ? tags.album.trim() : defaultMeta.album,
              duration: 0,
              artData: null
            };

            // Extract album art picture
            if (tags.picture) {
              try {
                const { data, format } = tags.picture;
                let base64String = "";
                for (let i = 0; i < data.length; i++) {
                  base64String += String.fromCharCode(data[i]);
                }
                meta.artData = `data:${format};base64,${btoa(base64String)}`;
              } catch (err) {
                console.warn("Failed to parse picture blob:", err);
              }
            }

            resolve(meta);
          },
          onError: function(error) {
            console.warn("jsmediatags read error:", error);
            resolve(defaultMeta);
          }
        });
      } else {
        resolve(defaultMeta);
      }
    } catch (err) {
      console.warn("Tag parsing exception:", err);
      resolve(defaultMeta);
    }
  });
}
