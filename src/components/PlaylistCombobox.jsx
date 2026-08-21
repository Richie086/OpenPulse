import React, { useState } from 'react';
import { ListMusic, Check, Plus } from 'lucide-react';
import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty
} from '@/components/ui/combobox';

export function PlaylistCombobox({
  playlists,
  activePlaylistId,
  onSelectPlaylist,
  onCreatePlaylist
}) {
  const [selected, setSelected] = useState(
    playlists.find((p) => p.id === activePlaylistId) || null
  );

  const handleValueChange = (val) => {
    setSelected(val);
    if (val) {
      onSelectPlaylist(val.id, val.name);
    }
  };

  return (
    <div className="w-full">
      <Combobox value={selected} onValueChange={handleValueChange}>
        <ComboboxInput
          placeholder="Filter or select playlist..."
          className="w-full bg-slate-950/80 text-white border-white/10 text-xs rounded-xl focus:border-cyan-400"
        />
        <ComboboxContent className="bg-slate-950 border border-white/10 text-white rounded-xl shadow-2xl backdrop-blur-xl">
          <ComboboxList>
            {playlists.length === 0 ? (
              <ComboboxEmpty>No playlists found.</ComboboxEmpty>
            ) : (
              playlists.map((pl) => (
                <ComboboxItem
                  key={pl.id}
                  value={pl}
                  className="flex items-center justify-between text-xs py-2 px-3 hover:bg-cyan-500/20 rounded-lg cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-2">
                    <ListMusic className="w-4 h-4 text-cyan-400" />
                    <span className="font-semibold text-slate-200">{pl.name}</span>
                  </div>
                  {activePlaylistId === pl.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </ComboboxItem>
              ))
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
