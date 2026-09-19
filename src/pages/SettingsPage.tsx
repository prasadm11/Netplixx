import React, { useState, useEffect } from 'react';
import {
  Check,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import {
  getPlayerSettings,
  savePlayerSettings,
  DEFAULT_SETTINGS,
  getContinueWatching,
  getFavorites,
  getWatchlist
} from '../services/storage';
import { VIDEO_SERVERS } from '../services/streamingServers';
import { setTmdbApiKey, testTmdbConnection } from '../services/tmdb';
import { SUPPORTED_REGIONS } from '../constants/providers';
import { PlayerSettings } from '../types';

type SettingsTab = 'region' | 'playback' | 'sources' | 'advanced';

const TABS: { id: SettingsTab; label: string }[] = [
  { id: 'region', label: 'Region & Catalog' },
  { id: 'playback', label: 'Playback' },
  { id: 'sources', label: 'Streaming Sources' },
  { id: 'advanced', label: 'Advanced & TMDB' }
];

// Minimalist Apple TV Toggle Switch
interface AppleToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const AppleToggle: React.FC<AppleToggleProps> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
      checked ? 'bg-[#34c759]' : 'bg-white/[0.16]'
    } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
  >
    <span
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
        checked ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('region');
  const [settings, setSettings] = useState<PlayerSettings>(() => getPlayerSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  // TMDB API Key State
  const [customKey, setCustomKey] = useState(
    () => localStorage.getItem('netplix_tmdb_api_key') || localStorage.getItem('cinejoy_tmdb_api_key') || ''
  );
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false
  });

  // Reset confirmation modal
  const [showResetModal, setShowResetModal] = useState(false);

  // Local storage counts
  const [counts, setCounts] = useState({ continueWatching: 0, saved: 0 });

  useEffect(() => {
    try {
      setCounts({
        continueWatching: getContinueWatching().length,
        saved: getFavorites().length + getWatchlist().length
      });
    } catch {
      // ignore
    }
  }, []);

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
    handleTestConnection();
  }, []);

  const handleConfirmReset = () => {
    localStorage.clear();
    setSettings(DEFAULT_SETTINGS);
    setCustomKey('');
    setShowResetModal(false);
    setSavedNotice(true);
    setCounts({ continueWatching: 0, saved: 0 });
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const currentRegion = (settings.region || 'IN').toUpperCase();

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-28 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Apple TV Minimalist Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              Settings
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
              Manage content catalogs, video playback, streaming engines, and metadata.
            </p>
          </div>

          {savedNotice && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/10 text-white text-xs font-semibold border border-white/15 animate-fade-in backdrop-blur-xl self-start sm:self-auto">
              <Check className="w-3.5 h-3.5 text-[#2997ff]" />
              <span>Saved</span>
            </div>
          )}
        </div>

        {/* Apple TV Segmented Switcher */}
        <div className="flex items-center justify-start sm:justify-center mb-8 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="inline-flex items-center bg-white/[0.08] backdrop-blur-2xl p-1 rounded-full border border-white/[0.1] shadow-apple-glass">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-black shadow-apple-button'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. REGION & CATALOG TAB */}
        {activeTab === 'region' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-2">
                Content Region & Licensing
              </div>

              {/* Grouped Inset Card */}
              <div className="rounded-2xl bg-[#141416] border border-white/[0.08] backdrop-blur-xl divide-y divide-white/[0.06] overflow-hidden">
                {SUPPORTED_REGIONS.map((region) => {
                  const isSelected = currentRegion === region.code;
                  return (
                    <button
                      key={region.code}
                      onClick={() => updateSetting('region', region.code)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors duration-150 group ${
                        isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02] active:bg-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-4">
                        <span className="text-xl select-none shrink-0">{region.flag}</span>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white tracking-tight">
                              {region.name}
                            </span>
                            <span className="text-[10px] font-medium text-zinc-500 uppercase">
                              {region.code}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-400 mt-0.5 truncate">
                            {region.catalogSubtitle}
                          </p>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#2997ff] stroke-[2.5]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-zinc-500 px-3 mt-2 leading-relaxed">
                Synchronizes content feeds, regional streaming channels (Netflix, Prime Video, Disney+, Apple TV+), and catalog availability to this region.
              </p>
            </div>
          </div>
        )}

        {/* 2. PLAYBACK TAB */}
        {activeTab === 'playback' && (
          <div className="space-y-6 animate-fade-in">
            {/* Playback Automations */}
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-2">
                Automations
              </div>

              <div className="rounded-2xl bg-[#141416] border border-white/[0.08] backdrop-blur-xl divide-y divide-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4">
                  <div className="pr-4">
                    <div className="text-sm font-medium text-white">Auto-Play Next Episode</div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Automatically begins the next episode when watching television series.
                    </div>
                  </div>
                  <AppleToggle
                    checked={settings.autoPlayNext}
                    onChange={(val) => updateSetting('autoPlayNext', val)}
                  />
                </div>

                <div className="flex items-center justify-between px-5 py-4">
                  <div className="pr-4">
                    <div className="text-sm font-medium text-white">Auto-Skip Intros</div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      Automatically skips opening sequences on supported streaming sources.
                    </div>
                  </div>
                  <AppleToggle
                    checked={settings.autoSkipIntro}
                    onChange={(val) => updateSetting('autoSkipIntro', val)}
                  />
                </div>
              </div>
            </div>

            {/* Audio & Video Format */}
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-2">
                Audio & Video
              </div>

              <div className="rounded-2xl bg-[#141416] border border-white/[0.08] backdrop-blur-xl divide-y divide-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <div className="text-sm font-medium text-white">Audio Format</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Spatial audio processing and surround passthrough</div>
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">Dolby Atmos / Auto</span>
                </div>

                <div className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <div className="text-sm font-medium text-white">Streaming Resolution</div>
                    <div className="text-xs text-zinc-400 mt-0.5">Adaptive bitrate based on network speed</div>
                  </div>
                  <span className="text-xs text-zinc-400 font-medium">4K HDR (Best Available)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. STREAMING SOURCES TAB */}
        {activeTab === 'sources' && (
          <div className="space-y-6 animate-fade-in">
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-2">
                Default Streaming Source
              </div>

              <div className="rounded-2xl bg-[#141416] border border-white/[0.08] backdrop-blur-xl divide-y divide-white/[0.06] overflow-hidden">
                {VIDEO_SERVERS.map((server) => {
                  const isSelected = settings.defaultServer === server.id;
                  return (
                    <button
                      key={server.id}
                      onClick={() => updateSetting('defaultServer', server.id)}
                      className={`w-full flex items-center justify-between px-5 py-3.5 text-left transition-colors duration-150 group ${
                        isSelected ? 'bg-white/[0.05]' : 'hover:bg-white/[0.02] active:bg-white/[0.04]'
                      }`}
                    >
                      <div className="min-w-0 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white tracking-tight">
                            {server.name}
                          </span>
                          {server.badge && (
                            <span className="text-[10px] text-zinc-400">
                              • {server.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {server.isDirect ? 'Direct CDN stream' : 'Universal fallback'}
                        </p>
                      </div>

                      <div className="shrink-0 flex items-center">
                        {isSelected && (
                          <Check className="w-4 h-4 text-[#2997ff] stroke-[2.5]" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <p className="text-[11px] text-zinc-500 px-3 mt-2 leading-relaxed">
                The selected source will initialize by default. You can switch servers at any time from inside the video player dock.
              </p>
            </div>
          </div>
        )}

        {/* 4. ADVANCED & TMDB TAB */}
        {activeTab === 'advanced' && (
          <div className="space-y-6 animate-fade-in">
            {/* TMDB API Section */}
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-2">
                Metadata & API Configuration
              </div>

              <div className="rounded-2xl bg-[#141416] border border-white/[0.08] backdrop-blur-xl divide-y divide-white/[0.06] overflow-hidden">
                {/* Status Row */}
                <div className="flex items-center justify-between px-5 py-3.5">
                  <div>
                    <div className="text-sm font-medium text-white">TMDB Connection</div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {customKey ? 'Custom User API Key Active' : 'Built-in Production API Key Active'}
                    </div>
                  </div>

                  <div>
                    {testStatus.loading ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400">
                        <RefreshCw className="w-3 h-3 animate-spin text-[#2997ff]" />
                        <span>Verifying...</span>
                      </span>
                    ) : testStatus.success === true ? (
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Online</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs text-rose-400 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        <span>Offline</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* API Key Input */}
                <div className="p-5 space-y-3">
                  <div className="text-xs font-medium text-zinc-400">
                    TMDB v3 Key / v4 Read Access Token (Optional)
                  </div>

                  <div className="relative">
                    <input
                      type={showKey ? 'text' : 'password'}
                      placeholder="Leave blank for built-in key or paste custom key..."
                      value={customKey}
                      onChange={(e) => setCustomKey(e.target.value)}
                      className="w-full bg-white/[0.05] hover:bg-white/[0.08] focus:bg-white/[0.1] border border-white/[0.1] focus:border-[#2997ff] rounded-xl pl-4 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none font-mono transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={handleSaveTmdbKey}
                      className="px-4 py-2 rounded-full bg-white hover:bg-zinc-200 text-black text-xs font-semibold transition-all shadow-apple-button"
                    >
                      Save Key
                    </button>
                    <button
                      onClick={() => handleTestConnection()}
                      disabled={testStatus.loading}
                      className="px-4 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.1] text-zinc-300 hover:text-white border border-white/[0.08] text-xs font-medium transition-colors disabled:opacity-50"
                    >
                      Test
                    </button>
                    {customKey && (
                      <button
                        onClick={handleResetTmdbKey}
                        className="px-3 py-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors ml-auto"
                      >
                        Reset to default
                      </button>
                    )}
                  </div>

                  {testStatus.message && (
                    <div
                      className={`text-xs p-2.5 rounded-lg flex items-center gap-2 mt-2 ${
                        testStatus.success
                          ? 'bg-emerald-500/10 text-emerald-300'
                          : 'bg-rose-500/10 text-rose-300'
                      }`}
                    >
                      {testStatus.success ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span>{testStatus.message}</span>
                    </div>
                  )}
                </div>

                {/* External link */}
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-5 py-3.5 text-xs text-zinc-400 hover:text-white hover:bg-white/[0.02] transition-colors group"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Get a free TMDB API key</span>
                    <ExternalLink className="w-3 h-3 text-zinc-500" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </a>
              </div>
            </div>

            {/* Storage & Reset Section */}
            <div>
              <div className="text-[11px] font-semibold tracking-wider text-zinc-500 uppercase px-3 mb-2">
                Storage & Privacy
              </div>

              <div className="rounded-2xl bg-[#141416] border border-white/[0.08] backdrop-blur-xl divide-y divide-white/[0.06] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm font-medium text-white">Cached Watch Data</span>
                  <span className="text-xs text-zinc-400">
                    {counts.continueWatching} in progress • {counts.saved} saved
                  </span>
                </div>

                <button
                  onClick={() => setShowResetModal(true)}
                  className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-white/[0.02] transition-colors group"
                >
                  <span className="text-sm font-medium text-[#ff453a] group-hover:text-red-400 transition-colors">
                    Reset All Local Data
                  </span>
                  <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                </button>
              </div>

              <p className="text-[11px] text-zinc-500 px-3 mt-2 leading-relaxed">
                Clears watch progress, favorites, and resets preferences to default.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Apple TV Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#1c1c1e] border border-white/[0.1] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-base font-bold text-white tracking-tight">
                Reset All Local Data?
              </h3>
              <button
                onClick={() => setShowResetModal(false)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              This will clear your continue watching progress, saved favorites, and preferences from this device.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.12] text-zinc-300 hover:text-white text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-full bg-[#ff453a] hover:bg-red-600 text-white text-xs font-semibold transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
