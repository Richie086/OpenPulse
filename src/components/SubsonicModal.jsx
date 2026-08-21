import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Server, CheckCircle2, AlertCircle } from 'lucide-react';
import { SubsonicConnector } from '@/services/subsonicConnector';

export function SubsonicModal({ isOpen, onClose, onSyncSongs }) {
  const [serverUrl, setServerUrl] = useState('https://demo.navidrome.org');
  const [username, setUsername] = useState('demo');
  const [password, setPassword] = useState('demo');
  const [status, setStatus] = useState(null); // null | 'testing' | 'success' | 'error'
  const [statusMsg, setStatusMsg] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setStatus('testing');
    setStatusMsg('Pinging server...');
    const connector = new SubsonicConnector(serverUrl, username, password);
    const ok = await connector.ping();
    if (ok) {
      setStatus('success');
      setStatusMsg('Connected successfully to Subsonic / Navidrome server!');
    } else {
      setStatus('error');
      setStatusMsg('Connection failed. Please check server URL, username, and password.');
    }
  };

  const handleSync = async () => {
    setStatus('testing');
    setStatusMsg('Fetching songs from remote library...');
    const connector = new SubsonicConnector(serverUrl, username, password);
    const songs = await connector.getRandomSongs(25);
    if (songs.length > 0) {
      onSyncSongs(songs);
      setStatus('success');
      setStatusMsg(`Synced ${songs.length} songs from remote library!`);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setStatus('error');
      setStatusMsg('No songs returned from server or connection error.');
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`}>
      <div className="modal-card">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Connect Subsonic / Navidrome Server</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mb-4">
          Sync your personal music collection from any Subsonic, Navidrome, Airsonic, or Funkwhale instance.
        </p>

        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs font-semibold block mb-1">Server URL:</label>
            <input
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              placeholder="https://music.yourdomain.com"
              className="btn w-full text-left bg-glass-card border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold block mb-1">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="btn w-full text-left bg-glass-card border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="text-xs font-semibold block mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="btn w-full text-left bg-glass-card border border-white/10 px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {statusMsg && (
            <div className={`p-2.5 rounded text-xs flex items-center gap-2 ${status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : status === 'error' ? 'bg-red-500/20 text-red-300' : 'bg-blue-500/20 text-blue-300'}`}>
              {status === 'success' && <CheckCircle2 className="w-4 h-4" />}
              {status === 'error' && <AlertCircle className="w-4 h-4" />}
              <span>{statusMsg}</span>
            </div>
          )}

          <div className="flex justify-end gap-2 mt-2">
            <Button variant="outline" onClick={handleTestConnection} className="text-xs">
              Test Connection
            </Button>
            <Button onClick={handleSync} className="btn-primary text-xs">
              Sync Library
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
