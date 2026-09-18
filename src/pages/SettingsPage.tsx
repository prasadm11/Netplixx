import React, { useState, useEffect } from 'react';
import { Settings, Server, Sliders, Check, Trash2, Key, RefreshCw, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { getPlayerSettings, savePlayerSettings, DEFAULT_SETTINGS } from '../services/storage';
import { VIDEO_SERVERS } from '../services/streamingServers';
import { getTmdbApiKey, setTmdbApiKey, testTmdbConnection } from '../services/tmdb';
import { PlayerSettings } from '../types';

const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<PlayerSettings>(() => getPlayerSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  // TMDB Key state
  const [customKey, setCustomKey] = useState(() => localStorage.getItem('netplix_tmdb_api_key') || localStorage.getItem('cinejoy_tmdb_api_key') || '');
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({ loading: false });

  const updateSetting = <K extends keyof PlayerSettings>(key: K, value: PlayerSettings[K]) => {
    const updated = { ...settings, [key]: value };
    setSettings(updated);
    savePlayerSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleSaveTmdbKey = () => {
    setTmdbApiKey(customKey);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
    handleTestConnection(customKey);
  };

  const handleResetTmdbKey = () => {
    setCustomKey('');
    setTmdbApiKey('');
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
    handleTestConnection('');
  };

  const handleTestConnection = async (keyToTest?: string) => {
    setTestStatus({ loading: true });
    const res = await testTmdbConnection(keyToTest !== undefined ? keyToTest : customKey);
    setTestStatus({ loading: false, success: res.success, message: res.message });
  };

  useEffect(() => {
    // Initial silent test
    handleTestConnection();
  }, []);

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear your local history and saved library?')) {
      localStorage.clear();
      setSettings(DEFAULT_SETTINGS);
      setCustomKey('');
      alert('Local storage data cleared.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Preferences
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Customize your Netplix player, stream sources, and browser playback.
            </p>
          </div>

          {savedNotice && (
            <div className="flex items-center gap-1.5 bg-white/10 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/20 animate-fade-in backdrop-blur-xl">
              <Check className="w-3.5 h-3.5 text-[#2997ff]" />
              <span>Saved</span>
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* TMDB API Key Section */}
          <div className="p-6 sm:p-8 rounded-3xl apple-glass shadow-apple-glass">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-[#2997ff]" />
                <h3 className="text-base font-bold text-white">TMDB Metadata & API Access</h3>
              </div>
              {testStatus.success === true && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>API Online</span>
                </span>
              )}
              {testStatus.success === false && (
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>API Error</span>
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 mb-5">
              Netplix uses The Movie Database (TMDB) for posters, trailers, casts, and ratings. You can configure your own TMDB v3 API Key or v4 Read Access Token.
            </p>

            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <input
                    type="password"
                    placeholder="Enter TMDB API Key (or leave blank for default)..."
                    value={customKey}
                    onChange={(e) => setCustomKey(e.target.value)}
                    className="w-full bg-white/[0.05] border border-white/[0.12] rounded-2xl px-4 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] font-mono transition-all"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveTmdbKey}
                    className="px-4 py-3 rounded-2xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition-all shadow-apple-button"
                  >
                    Save Key
                  </button>
                  <button
                    onClick={() => handleTestConnection()}
                    disabled={testStatus.loading}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-xs font-semibold text-white transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin text-[#2997ff]' : ''}`} />
                    <span>Test</span>
                  </button>
                  {customKey && (
                    <button
                      onClick={handleResetTmdbKey}
                      className="px-3.5 py-3 rounded-2xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 text-xs font-semibold transition-all"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>

              {testStatus.message && (
                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${testStatus.success ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                  {testStatus.success ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                  <span>{testStatus.message}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 text-[11px] text-zinc-500">
                <span>Active source: {customKey ? 'Custom API Key (User Override)' : 'Built-in Production TMDB Key'}</span>
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#2997ff] hover:underline"
                >
                  <span>Get Free TMDB API Key</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Region & Language Preferences */}
          <div className="p-6 sm:p-8 rounded-3xl apple-glass shadow-apple-glass">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🇮🇳</span>
                <h3 className="text-base font-bold text-white">Region & Content Catalog</h3>
              </div>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/30">
                {settings.region === 'IN' || !settings.region ? 'India (IN) Active' : 'Global Active'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mb-5">
              Set the regional content priority for your Home, Movies, and TV series feeds.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => updateSetting('region', 'IN')}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${settings.region === 'IN' || !settings.region
                    ? 'bg-white text-black border-white shadow-apple-button'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🇮🇳</span>
                  <div>
                    <h5 className={`text-xs font-bold ${settings.region === 'IN' || !settings.region ? 'text-black' : 'text-white'}`}>
                      India (IN) — Default
                    </h5>
                    <span className={`text-[10px] ${settings.region === 'IN' || !settings.region ? 'text-zinc-700' : 'text-zinc-400'}`}>
                      Bollywood, South Indian & Indian OTT Web Series
                    </span>
                  </div>
                </div>
                {(settings.region === 'IN' || !settings.region) && <Check className="w-4 h-4 text-black stroke-[2.5]" />}
              </button>

              <button
                onClick={() => updateSetting('region', 'GLOBAL')}
                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${settings.region === 'GLOBAL'
                    ? 'bg-white text-black border-white shadow-apple-button'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🌐</span>
                  <div>
                    <h5 className={`text-xs font-bold ${settings.region === 'GLOBAL' ? 'text-black' : 'text-white'}`}>
                      Global / Worldwide
                    </h5>
                    <span className={`text-[10px] ${settings.region === 'GLOBAL' ? 'text-zinc-700' : 'text-zinc-400'}`}>
                      US, UK & Worldwide international releases
                    </span>
                  </div>
                </div>
                {settings.region === 'GLOBAL' && <Check className="w-4 h-4 text-black stroke-[2.5]" />}
              </button>
            </div>
          </div>

          {/* Default Server */}
          <div className="p-6 sm:p-8 rounded-3xl apple-glass shadow-apple-glass">
            <div className="flex items-center gap-2 mb-2">
              <Server className="w-4 h-4 text-[#2997ff]" />
              <h3 className="text-base font-bold text-white">Default Streaming Source</h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mb-5">
              Select which streaming server should initialize by default when starting a movie or episode.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {VIDEO_SERVERS.map(s => {
                const isSelected = settings.defaultServer === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => updateSetting('defaultServer', s.id)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${isSelected
                        ? 'bg-white text-black border-white shadow-apple-button'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-zinc-300'
                      }`}
                  >
                    <div>
                      <h5 className={`text-xs font-semibold ${isSelected ? 'text-black' : 'text-white'}`}>{s.name}</h5>
                      <span className={`text-[10px] ${isSelected ? 'text-zinc-700' : 'text-zinc-500'}`}>{s.badge || 'Standard'}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-black stroke-[2.5]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Playback Preferences */}
          <div className="p-6 sm:p-8 rounded-3xl apple-glass shadow-apple-glass">
            <div className="flex items-center gap-2 mb-2">
              <Sliders className="w-4 h-4 text-[#2997ff]" />
              <h3 className="text-base font-bold text-white">Playback Automations</h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mb-5">
              Automations for series binge-watching and intro skips.
            </p>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer transition-colors">
                <div>
                  <span className="text-sm font-semibold text-white block">Auto-play Next Episode</span>
                  <span className="text-xs text-zinc-400 mt-0.5 block">Provide continuous playback controls when watching television series.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoPlayNext}
                  onChange={(e) => updateSetting('autoPlayNext', e.target.checked)}
                  className="w-5 h-5 accent-[#2997ff] cursor-pointer rounded"
                />
              </label>

              <label className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] cursor-pointer transition-colors">
                <div>
                  <span className="text-sm font-semibold text-white block">Auto-skip Intro if available</span>
                  <span className="text-xs text-zinc-400 mt-0.5 block">Automatically bypass title sequences on compatible providers.</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoSkipIntro}
                  onChange={(e) => updateSetting('autoSkipIntro', e.target.checked)}
                  className="w-5 h-5 accent-[#2997ff] cursor-pointer rounded"
                />
              </label>
            </div>
          </div>

          {/* Clear Storage */}
          <div className="p-6 sm:p-8 rounded-3xl apple-glass shadow-apple-glass">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Browser Storage & Cache</h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Reset your watch progress, saved Up Next items, and custom player settings.
                </p>
              </div>

              <button
                onClick={handleClearData}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-400 border border-red-500/30 rounded-full text-xs font-semibold transition-colors self-start sm:self-auto"
              >
                <Trash2 className="w-4 h-4" />
                <span>Reset All Data</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

