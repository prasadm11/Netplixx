import React, { useState, useEffect } from 'react';
import { Settings, Server, Sliders, Check, Trash2, Key, RefreshCw, AlertCircle, ExternalLink, ShieldCheck, Globe, Sparkles } from 'lucide-react';
import { getPlayerSettings, savePlayerSettings, DEFAULT_SETTINGS } from '../services/storage';
import { VIDEO_SERVERS } from '../services/streamingServers';
import { getTmdbApiKey, setTmdbApiKey, testTmdbConnection } from '../services/tmdb';
import { SUPPORTED_REGIONS } from '../constants/providers';
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2997ff]/15 border border-[#2997ff]/25 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-[#2997ff]" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Region & Content Catalog</h3>
                  <p className="text-[11px] text-zinc-400">Synchronizes all streaming service providers to this region</p>
                </div>
              </div>
              {(() => {
                const currentReg = (settings.region || 'IN').toUpperCase();
                const activeOption = SUPPORTED_REGIONS.find(r => r.code === currentReg) || SUPPORTED_REGIONS[0];
                return (
                  <span className="flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/30 self-start sm:self-auto">
                    <span>{activeOption.flag}</span>
                    <span>{activeOption.name} Active</span>
                  </span>
                );
              })()}
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 mb-5 leading-relaxed">
              Select your preferred country or region. All content feeds, trending collections, and streaming service providers throughout the app will automatically serve the catalog from this region.
            </p>

            {/* Regional Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 mb-5">
              {SUPPORTED_REGIONS.map((region) => {
                const isSelected = (settings.region || 'IN').toUpperCase() === region.code;

                return (
                  <button
                    key={region.code}
                    onClick={() => updateSetting('region', region.code)}
                    className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all duration-300 relative overflow-hidden group/card ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-apple-button scale-[1.01]'
                        : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.08] hover:border-white/20 text-zinc-300'
                    }`}
                  >
                    {/* Active highlight glow */}
                    {isSelected && (
                      <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#2997ff]/20 rounded-full blur-2xl pointer-events-none" />
                    )}

                    {/* Top row: Flag, Name, Checkmark */}
                    <div className="flex items-start justify-between gap-2 mb-2 relative z-10">
                      <div className="flex items-center gap-2.5">
                        <span className="text-2xl sm:text-3xl filter drop-shadow-sm select-none">{region.flag}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h5 className={`text-xs font-bold tracking-tight ${isSelected ? 'text-black' : 'text-white'}`}>
                              {region.name}
                            </h5>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                                isSelected
                                  ? 'bg-black/10 text-black'
                                  : 'bg-white/10 text-zinc-400'
                              }`}
                            >
                              {region.code}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] font-semibold ${
                              isSelected ? 'text-blue-700' : 'text-[#2997ff]'
                            }`}
                          >
                            {region.badge}
                          </span>
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-white/20 shrink-0 opacity-0 group-hover/card:opacity-100 transition-opacity" />
                      )}
                    </div>

                    {/* Description */}
                    <p
                      className={`text-[11px] leading-relaxed mb-3 line-clamp-2 relative z-10 font-normal ${
                        isSelected ? 'text-zinc-700 font-medium' : 'text-zinc-400'
                      }`}
                    >
                      {region.description}
                    </p>

                    {/* Popular Providers Pills */}
                    <div className="flex flex-wrap items-center gap-1 relative z-10 pt-1 border-t border-current/10">
                      {region.popularProviders.slice(0, 4).map((prov, i) => (
                        <span
                          key={i}
                          className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${
                            isSelected
                              ? 'bg-black/[0.08] text-zinc-800'
                              : 'bg-white/[0.06] text-zinc-400'
                          }`}
                        >
                          {prov}
                        </span>
                      ))}
                      {region.popularProviders.length > 4 && (
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                            isSelected ? 'text-zinc-600' : 'text-zinc-500'
                          }`}
                        >
                          +{region.popularProviders.length - 4} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Active Region Confirmation Callout */}
            {(() => {
              const currentReg = (settings.region || 'IN').toUpperCase();
              const activeOption = SUPPORTED_REGIONS.find(r => r.code === currentReg) || SUPPORTED_REGIONS[0];
              return (
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center gap-3">
                  <span className="text-xl shrink-0">{activeOption.flag}</span>
                  <div className="text-xs">
                    <span className="font-bold text-white">Active Catalog: {activeOption.name} ({activeOption.code})</span>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      All streaming channels (Netflix, Prime Video, Disney+, Apple TV+, etc.) and movie feeds are tuned to {activeOption.name}&apos;s catalog: {activeOption.catalogSubtitle}.
                    </p>
                  </div>
                </div>
              );
            })()}
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

