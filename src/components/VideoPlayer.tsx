import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import {
  Server,
  RefreshCw,
  Maximize2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Tv,
  Film,
  HelpCircle,
  Command,
  Radio,
  Sliders,
  Sparkles,
  Play,
  Check,
  Zap,
  Globe,
  ShieldCheck,
  Volume2
} from 'lucide-react';
import { VIDEO_SERVERS, getServerById } from '../services/streamingServers';
import { saveContinueWatching, getPlayerSettings } from '../services/storage';
import { getBackdropUrl } from '../services/tmdb';
import { fetchDirectStream, DecryptedStreamResult } from '../services/movyStreamService';
import { MediaItem, Episode, Season, VideoServer } from '../types';

interface VideoPlayerProps {
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  season?: number;
  episode?: number;
  title: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  episodeName?: string;
  onNextEpisode?: () => void;
  onPrevEpisode?: () => void;
  hasNextEpisode?: boolean;
  hasPrevEpisode?: boolean;
  episodes?: Episode[];
  seasons?: Season[];
  onSelectEpisode?: (seasonNum: number, episodeNum: number) => void;
  relatedItems?: MediaItem[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  tmdbId,
  mediaType,
  season = 1,
  episode = 1,
  title,
  poster_path = null,
  backdrop_path = null,
  episodeName,
  onNextEpisode,
  onPrevEpisode,
  hasNextEpisode,
  hasPrevEpisode,
}) => {
  const settings = getPlayerSettings();
  const [currentServerId, setCurrentServerId] = useState(settings.defaultServer || 'movy-boise');
  const [iframeKey, setIframeKey] = useState(0);
  const [isTheater, setIsTheater] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isSourceMenuOpen, setIsSourceMenuOpen] = useState(false);
  const [serverToast, setServerToast] = useState<{ message: string; type: 'info' | 'warning' } | null>(null);
  const [loadTimerCount, setLoadTimerCount] = useState(0);

  // Direct HLS stream state (from Movy engine)
  const [directStream, setDirectStream] = useState<DecryptedStreamResult | null>(null);
  const [isDirectPlaying, setIsDirectPlaying] = useState(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('auto');
  const [isResolvingDirect, setIsResolvingDirect] = useState(false);

  const [isPlayerFocused, setIsPlayerFocused] = useState(false);
  const playerTouchStartY = useRef<number | null>(null);

  const playerContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const sourceMenuRef = useRef<HTMLDivElement>(null);

  const server = getServerById(currentServerId);
  const embedUrl = mediaType === 'movie'
    ? server.getMovieUrl(tmdbId)
    : server.getTvUrl(tmdbId, season, episode);

  // Auto-shift to next server function
  const switchToNextServer = (reason?: string) => {
    const currentIndex = VIDEO_SERVERS.findIndex(s => s.id === currentServerId);
    const nextIndex = (currentIndex + 1) % VIDEO_SERVERS.length;
    const currentName = server.name.split(' ')[0];
    const nextServer = VIDEO_SERVERS[nextIndex];

    setCurrentServerId(nextServer.id);
    setIsLoading(true);
    setLoadTimerCount(0);
    setIframeKey(k => k + 1);
    setDirectStream(null);
    setIsDirectPlaying(false);

    const msg = reason
      ? `${currentName} server not responding. Switched to ${nextServer.name.split(' ')[0]}.`
      : `Switched to ${nextServer.name.split(' ')[0]}.`;

    setServerToast({ message: msg, type: 'warning' });
  };

  // Auto-dismiss server toast after 5s
  useEffect(() => {
    if (!serverToast) return;
    const timer = setTimeout(() => setServerToast(null), 5000);
    return () => clearTimeout(timer);
  }, [serverToast]);

  // Loading timer & Watchdog to auto-shift if server hangs (>12s)
  useEffect(() => {
    if (!isLoading) {
      setLoadTimerCount(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadTimerCount(c => {
        const next = c + 1;
        if (next >= 12) {
          switchToNextServer('Stream timed out');
          return 0;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, currentServerId]);

  // Close source dropdown and release player focus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sourceMenuRef.current && !sourceMenuRef.current.contains(e.target as Node)) {
        setIsSourceMenuOpen(false);
      }
      if (playerContainerRef.current && !playerContainerRef.current.contains(e.target as Node)) {
        setIsPlayerFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save to Continue Watching
  useEffect(() => {
    saveContinueWatching({
      id: tmdbId,
      mediaType,
      title,
      poster_path,
      backdrop_path,
      season: mediaType === 'tv' ? season : undefined,
      episode: mediaType === 'tv' ? episode : undefined,
      episodeName: mediaType === 'tv' ? episodeName : undefined,
      progress: 15
    });
  }, [tmdbId, mediaType, season, episode, title, poster_path, backdrop_path, episodeName]);

  // Attempt Direct Stream Extraction when a Movy server is active
  useEffect(() => {
    let isCancelled = false;

    if (server.isDirect) {
      setIsResolvingDirect(true);
      setIsLoading(true);

      fetchDirectStream({
        tmdbId,
        mediaType,
        title,
        season,
        episode,
        serverEndpoint: server.endpoint || 'miami'
      }).then(result => {
        if (isCancelled) return;
        if (result && ((result.sources && result.sources.length > 0) || result.playlist)) {
          setDirectStream(result);
          setIsDirectPlaying(true);
          setIsLoading(false);
        } else {
          // Fall back to embedded player
          setDirectStream(null);
          setIsDirectPlaying(false);
          setIsLoading(false);
        }
      }).catch(() => {
        if (isCancelled) return;
        setDirectStream(null);
        setIsDirectPlaying(false);
        setIsLoading(false);
      }).finally(() => {
        if (!isCancelled) setIsResolvingDirect(false);
      });
    } else {
      setDirectStream(null);
      setIsDirectPlaying(false);
      setIsLoading(true);
      const timer = setTimeout(() => setIsLoading(false), 2000);
      return () => clearTimeout(timer);
    }

    return () => {
      isCancelled = true;
    };
  }, [currentServerId, tmdbId, season, episode, server]);

  // Hls.js initialization for direct stream playback
  useEffect(() => {
    if (!isDirectPlaying || !directStream) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    let streamUrl = directStream.playlist;
    if (!streamUrl && directStream.sources && directStream.sources.length > 0) {
      if (selectedQuality === 'auto') {
        streamUrl = directStream.sources[0]?.url;
      } else {
        const matched = directStream.sources.find(s => s.quality === selectedQuality);
        streamUrl = matched?.url || directStream.sources[0]?.url;
      }
    } else if (selectedQuality !== 'auto' && directStream.sources) {
      const matched = directStream.sources.find(s => s.quality === selectedQuality);
      if (matched) streamUrl = matched.url;
    }

    if (!streamUrl) return;

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(() => { });
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setIsDirectPlaying(false);
              switchToNextServer('Stream playback error');
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(() => { });
        setIsLoading(false);
      });
      video.addEventListener('error', () => {
        switchToNextServer('Video playback error');
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [isDirectPlaying, directStream, selectedQuality]);

  // Handle Provider PostMessage Events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        if (!data) return;

        if (data.currentTime !== undefined && data.duration && data.duration > 0) {
          const progressPercent = Math.min(100, Math.max(1, Math.round((data.currentTime / data.duration) * 100)));
          saveContinueWatching({
            id: tmdbId,
            mediaType,
            title,
            poster_path,
            backdrop_path,
            progress: progressPercent,
            duration: data.duration,
            season: mediaType === 'tv' ? season : undefined,
            episode: mediaType === 'tv' ? episode : undefined,
          });
        }
      } catch (e) {
        // Non-JSON messages are safely ignored
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [tmdbId, mediaType, title, poster_path, backdrop_path, season, episode]);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey(k => k + 1);
  };

  const handleFullscreen = () => {
    const el = playerContainerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {
          const iframe = document.getElementById('netplix-player-iframe') as HTMLIFrameElement;
          iframe?.requestFullscreen?.();
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        handleFullscreen();
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        setIsTheater(prev => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRefresh();
      } else if (e.key === 'Escape') {
        setIsSourceMenuOpen(false);
        setIsPlayerFocused(false);
        if (showShortcuts) {
          setShowShortcuts(false);
        }
      } else if ((e.key === 'n' || e.key === 'N') && hasNextEpisode && onNextEpisode) {
        e.preventDefault();
        onNextEpisode();
      } else if ((e.key === 'p' || e.key === 'P') && hasPrevEpisode && onPrevEpisode) {
        e.preventDefault();
        onPrevEpisode();
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        switchToNextServer();
      } else if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasNextEpisode, onNextEpisode, hasPrevEpisode, onPrevEpisode, currentServerId, showShortcuts]);

  // Server categorizations for Apple TV grouped source dropdown
  const directServers = VIDEO_SERVERS.filter(s => s.isDirect);
  const embedServers = VIDEO_SERVERS.filter(s => !s.isDirect);

  return (
    <div className={`relative z-20 w-full transition-all duration-700 ease-out ${isTheater ? 'max-w-none' : 'max-w-7xl mx-auto'}`}>
      {/* 1. Cinematic Apple Cinema Ambient Backlight Glow */}
      {backdrop_path && (
        <div
          className="absolute -inset-6 sm:-inset-12 -z-10 rounded-[48px] opacity-40 blur-[90px] sm:blur-[130px] pointer-events-none transition-all duration-1000 transform-gpu overflow-hidden"
          style={{
            backgroundImage: `url(${getBackdropUrl(backdrop_path, 'w780')})`,
            backgroundSize: 'cover'
          }}
        />
      )}

      {/* 2. Apple QuickTime Cinema Player Frame */}
      <div
        ref={playerContainerRef}
        onMouseEnter={() => setIsPlayerFocused(true)}
        onMouseMove={() => setIsPlayerFocused(true)}
        onMouseLeave={() => setIsPlayerFocused(false)}
        onTouchStart={() => setIsPlayerFocused(true)}
        className="group relative aspect-video w-full bg-[#05070a] rounded-none sm:rounded-[32px] overflow-hidden border-y sm:border border-white/[0.12] ring-0 sm:ring-1 sm:ring-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.9)] sm:shadow-[0_35px_100px_-20px_rgba(0,0,0,0.95)] transition-all duration-500"
      >
        {/* Apple TV Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center gap-3 transition-opacity duration-300 pointer-events-none">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full border-2 border-white/10 border-t-[#2997ff] animate-spin" />
              <div className="absolute w-2 h-2 rounded-full bg-[#2997ff] shadow-[0_0_8px_#2997ff]" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold text-white tracking-wide">
                {isDirectPlaying ? 'Connecting to Apple Cinema Direct 4K...' : `Buffering via ${server.name.split(' ')[0]}...`}
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5 font-medium">
                {isDirectPlaying ? 'High-bitrate HLS master playlist • Zero ads' : 'Optimizing 4K stream & audio channels'}
              </p>
            </div>
          </div>
        )}

        {/* Video Stream: Direct HLS Video or Embed Iframe */}
        {isDirectPlaying ? (
          <video
            ref={videoRef}
            controls
            playsInline
            className="w-full h-full object-contain relative z-0 bg-black"
            onTimeUpdate={() => {
              const video = videoRef.current;
              if (video && video.duration) {
                const progressPercent = Math.min(100, Math.max(1, Math.round((video.currentTime / video.duration) * 100)));
                saveContinueWatching({
                  id: tmdbId,
                  mediaType,
                  title,
                  poster_path,
                  backdrop_path,
                  progress: progressPercent,
                  duration: video.duration,
                  season: mediaType === 'tv' ? season : undefined,
                  episode: mediaType === 'tv' ? episode : undefined,
                });
              }
            }}
          />
        ) : (
          <iframe
            key={`${currentServerId}-${iframeKey}-${tmdbId}-${season}-${episode}`}
            id="netplix-player-iframe"
            src={embedUrl}
            title={`${title} - Player`}
            className="w-full h-full border-0 relative z-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => switchToNextServer('Connection failed')}
          />
        )}

        {/* Smart Scroll Forwarding Shield: active on desktop mouse wheel scroll, disabled on mobile so touches reach player directly */}
        {!isDirectPlaying && !isPlayerFocused && (
          <div
            className="hidden sm:block absolute inset-0 z-20 cursor-pointer select-none"
            onMouseEnter={() => setIsPlayerFocused(true)}
            onMouseMove={() => setIsPlayerFocused(true)}
            onWheel={(e) => {
              window.scrollBy({
                top: e.deltaY,
                left: e.deltaX,
                behavior: 'auto'
              });
            }}
            onClick={() => {
              setIsPlayerFocused(true);
            }}
          />
        )}

        {/* Server Switch Notification Toast */}
        {serverToast && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4 py-2 rounded-full bg-black/85 backdrop-blur-2xl border border-[#2997ff]/40 text-xs font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-fade-in pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-[#2997ff] animate-pulse" />
            <span>{serverToast.message}</span>
            <button
              onClick={() => setServerToast(null)}
              className="ml-1.5 text-zinc-400 hover:text-white transition-colors"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Slow loading failover prompt */}
        {isLoading && loadTimerCount >= 5 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 px-4 py-2 rounded-full bg-black/85 backdrop-blur-xl border border-white/20 shadow-2xl animate-fade-in pointer-events-auto">
            <span className="text-xs text-zinc-300 font-medium">Server taking too long?</span>
            <button
              onClick={() => switchToNextServer('Manual server shift')}
              className="px-3 py-1 rounded-full bg-white text-black text-xs font-bold hover:bg-[#e5e5ea] transition-all flex items-center gap-1.5 shadow-sm"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Shift to Next Server</span>
            </button>
          </div>
        )}

      </div>

      {/* 4A. Mobile Apple TV Minimalist Control Strip (sm:hidden) */}
      <div className="sm:hidden mt-2 px-3.5 flex items-center justify-between gap-2">
        {/* Source Dropdown Pill */}
        <div className="relative" ref={sourceMenuRef}>
          <button
            onClick={() => setIsSourceMenuOpen(prev => !prev)}
            className="h-8 px-3 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/[0.12] text-white text-[11px] font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
            <span className="truncate max-w-[100px]">{server.name.split(' ')[0]}</span>
            <ChevronDown className={`w-3 h-3 text-zinc-400 shrink-0 transition-transform ${isSourceMenuOpen ? 'rotate-180 text-white' : ''}`} />
          </button>

          {/* Mobile Source Dropdown Popover */}
          {isSourceMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl bg-[#141418] border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl z-50 p-2 animate-fade-in divide-y divide-white/10 max-h-[320px] overflow-y-auto">
              <div className="pb-2">
                <div className="px-3 py-1 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3 h-3 text-[#2997ff]" />
                  <span>Direct 4K Streams</span>
                </div>
                <div className="space-y-1 mt-1">
                  {directServers.map(s => {
                    const isCurrent = s.id === currentServerId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setCurrentServerId(s.id);
                          setIsSourceMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isCurrent ? 'bg-[#2997ff] text-black font-bold shadow-md' : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{s.name}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2">
                <div className="px-3 py-1 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-purple-400" />
                  <span>Multi-Source Embed Backups</span>
                </div>
                <div className="space-y-1 mt-1">
                  {embedServers.map(s => {
                    const isCurrent = s.id === currentServerId;
                    return (
                      <button
                        key={s.id}
                        onClick={() => {
                          setCurrentServerId(s.id);
                          setIsSourceMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          isCurrent ? 'bg-white text-black font-bold shadow-md' : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span>{s.name}</span>
                        {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls Right: Switch, TV Episodes, Fullscreen */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Quick Server Switch Icon */}
          <button
            onClick={() => switchToNextServer()}
            className="h-8 w-8 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/[0.12] text-zinc-200 flex items-center justify-center transition-all shadow-sm"
            title="Switch Server"
          >
            <Radio className="w-3.5 h-3.5 text-[#2997ff]" />
          </button>

          {/* Episode Steppers */}
          {mediaType === 'tv' && (
            <>
              {hasPrevEpisode && onPrevEpisode && (
                <button
                  onClick={onPrevEpisode}
                  className="h-8 px-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 text-zinc-200 border border-white/[0.12] text-[11px] font-semibold flex items-center gap-1 transition-all shadow-sm"
                  title="Previous Episode"
                >
                  <ChevronLeft className="w-3.5 h-3.5 -ml-0.5" />
                  <span>Ep {episode - 1}</span>
                </button>
              )}
              {hasNextEpisode && onNextEpisode && (
                <button
                  onClick={onNextEpisode}
                  className="h-8 px-3 rounded-full bg-[#0071e3] hover:bg-[#0077ed] active:scale-95 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-sm shadow-[#0071e3]/30"
                  title="Next Episode"
                >
                  <span>Ep {episode + 1}</span>
                  <ChevronRight className="w-3.5 h-3.5 -mr-0.5" />
                </button>
              )}
            </>
          )}

          {/* Circular Apple TV Fullscreen Button */}
          <button
            onClick={handleFullscreen}
            className="h-8 w-8 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/[0.12] text-white flex items-center justify-center transition-all shadow-sm"
            title="Fullscreen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 4B. Desktop Apple TV Cinema Controller Shelf (hidden sm:block) */}
      <div className="hidden sm:block mt-3.5 sm:mt-5 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-[#141418]/85 backdrop-blur-3xl border border-white/[0.10] shadow-[0_16px_48px_rgba(0,0,0,0.7)] relative z-30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">

          {/* Row 1 / Left: Apple TV Source Selector Dropdown & Quick Switch */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Source Dropdown Pill */}
            <div className="relative flex-1 sm:flex-initial">
              <button
                onClick={() => setIsSourceMenuOpen(prev => !prev)}
                className="w-full sm:w-auto h-10 flex items-center justify-between sm:justify-start gap-2.5 px-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.98] border border-white/[0.12] text-white text-xs font-semibold transition-all shadow-sm group"
              >
                <div className="flex items-center gap-2 truncate">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  <Server className="w-3.5 h-3.5 text-[#2997ff] shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-[200px]">{server.name.split(' ')[0]}</span>
                  {server.badge && (
                    <span className="hidden sm:inline text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-white/15 text-[#2997ff] border border-white/10 uppercase shrink-0">
                      {server.badge}
                    </span>
                  )}
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isSourceMenuOpen ? 'rotate-180 text-white' : ''}`} />
              </button>

              {/* Apple TV Frosted Glass Dropdown Popover */}
              {isSourceMenuOpen && (
                <div className="absolute left-0 top-full mt-2 w-72 sm:w-80 rounded-2xl bg-[#141418] border border-white/25 shadow-[0_25px_60px_rgba(0,0,0,0.95)] backdrop-blur-3xl z-50 p-2.5 animate-fade-in divide-y divide-white/10 max-h-[360px] sm:max-h-[440px] overflow-y-auto">
                  {/* Category 1: Direct 4K Streams */}
                  <div className="pb-2">
                    <div className="px-3 py-1 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-[#2997ff]" />
                      <span>Direct 4K Streams (Ad-Free)</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {directServers.map(s => {
                        const isCurrent = s.id === currentServerId;
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              setCurrentServerId(s.id);
                              setIsSourceMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${isCurrent
                              ? 'bg-[#2997ff] text-black font-bold shadow-md'
                              : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span>{s.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {s.badge && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${isCurrent ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
                                  }`}>
                                  {s.badge}
                                </span>
                              )}
                              {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Category 2: Embedded Fallback Providers */}
                  <div className="pt-2">
                    <div className="px-3 py-1 text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Globe className="w-3 h-3 text-purple-400" />
                      <span>Multi-Source Embed Backups</span>
                    </div>
                    <div className="space-y-1 mt-1">
                      {embedServers.map(s => {
                        const isCurrent = s.id === currentServerId;
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              setCurrentServerId(s.id);
                              setIsSourceMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${isCurrent
                              ? 'bg-white text-black font-bold shadow-md'
                              : 'text-zinc-300 hover:bg-white/10 hover:text-white'
                              }`}
                          >
                            <span className="truncate">{s.name}</span>
                            <div className="flex items-center gap-1.5">
                              {s.badge && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${isCurrent ? 'bg-black/20 text-black' : 'bg-white/10 text-zinc-400'
                                  }`}>
                                  {s.badge}
                                </span>
                              )}
                              {isCurrent && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Switch Button (Desktop & Mobile, fits cleanly) */}
            <button
              onClick={() => switchToNextServer()}
              className="h-10 px-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.98] border border-white/[0.12] text-zinc-200 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
              title="Switch to next provider (Shortcut: S)"
            >
              <Radio className="w-3.5 h-3.5 text-[#2997ff]" />
              <span className="text-xs">Switch</span>
            </button>

            {/* Reload Stream Button (Desktop) */}
            <button
              onClick={handleRefresh}
              className="hidden sm:flex h-10 w-10 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.98] border border-white/[0.12] text-zinc-200 items-center justify-center shrink-0 transition-colors"
              title="Reload Stream (R)"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#2997ff]" />
            </button>

            {/* Direct HLS Quality Selector Capsule */}
            {isDirectPlaying && directStream?.sources && directStream.sources.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-white/[0.08] border border-white/[0.14] px-3 h-10 rounded-xl text-xs font-semibold">
                <Sliders className="w-3 h-3 text-[#2997ff]" />
                <span className="text-[11px] text-zinc-400">Quality:</span>
                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="bg-transparent text-white font-bold text-xs cursor-pointer focus:outline-none"
                >
                  <option value="auto" className="bg-zinc-900 text-white">Auto (Best)</option>
                  {directStream.sources.map(src => (
                    <option key={src.quality} value={src.quality} className="bg-zinc-900 text-white">
                      {src.quality === '2160p' ? '4K Ultra HD (2160p)' : src.quality}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Row 2 / Right: Actions Cluster (Symmetrical, Equal Widths on Mobile) */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {mediaType === 'tv' && (
              <div className="flex items-center gap-2 flex-1 sm:flex-initial">
                {hasPrevEpisode && onPrevEpisode && (
                  <button
                    onClick={onPrevEpisode}
                    className="flex-1 sm:flex-initial h-10 px-3.5 bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.98] text-white rounded-xl text-xs font-semibold border border-white/[0.12] transition-all flex items-center justify-center gap-1 truncate shadow-sm"
                    title="Previous Episode"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Ep {episode - 1}</span>
                  </button>
                )}
                {hasNextEpisode && onNextEpisode && (
                  <button
                    onClick={onNextEpisode}
                    className="flex-1 sm:flex-initial h-10 px-3.5 bg-[#0071e3] hover:bg-[#0077ed] active:scale-[0.98] text-white rounded-xl text-xs font-bold transition-all shadow-[0_4px_14px_rgba(0,113,227,0.3)] border border-[#0071e3]/40 flex items-center justify-center gap-1 truncate"
                    title="Next Episode"
                  >
                    <span className="truncate">Ep {episode + 1}</span>
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 stroke-[2.5]" />
                  </button>
                )}
              </div>
            )}

            {/* Theater Mode (Desktop only) */}
            <button
              onClick={() => setIsTheater(!isTheater)}
              className="h-10 px-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-zinc-300 hover:text-white text-xs font-semibold transition-colors hidden md:flex items-center gap-1.5"
              title="Toggle Theater Mode (T)"
            >
              <span>{isTheater ? 'Standard' : 'Theater'}</span>
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={handleFullscreen}
              className={`h-10 px-4 rounded-xl ${mediaType === 'tv' ? 'flex-1 sm:flex-initial' : 'flex-1 sm:flex-initial'} bg-white/[0.08] hover:bg-white/[0.14] active:scale-[0.98] border border-white/[0.12] text-white text-xs font-semibold transition-all shadow-sm flex items-center justify-center gap-1.5`}
              title="Fullscreen (F)"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Fullscreen</span>
            </button>
          </div>
        </div>

        {/* Apple TV Tech Specs & Shortcuts Bar */}
        <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-[#8e8e93]">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
            <span className="truncate">
              {isDirectPlaying
                ? 'Direct High-Speed Stream • 4K UHD'
                : `Connected via ${server.name.split(' ')[0]} • Auto 1080p HD`}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-3 text-zinc-500 text-[10px]">
            <span>Shortcuts: <strong className="text-zinc-400">F</strong> Fullscreen • <strong className="text-zinc-400">S</strong> Next Server • <strong className="text-zinc-400">R</strong> Reload</span>
            <button
              onClick={() => setShowShortcuts(s => !s)}
              className="text-[#2997ff] hover:underline flex items-center gap-1 font-semibold ml-1"
            >
              <span>Guide</span>
            </button>
          </div>
        </div>
      </div>


      {/* 5. Apple TV Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          onClick={() => setShowShortcuts(false)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md p-6 sm:p-8 rounded-3xl apple-glass shadow-modal border border-white/20 animate-scale-up"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Command className="w-5 h-5 text-[#2997ff]" />
                <h3 className="text-base font-bold text-white font-display">Player Shortcuts</h3>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-zinc-400 hover:text-white text-xs px-2.5 py-1 rounded-full bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 text-xs text-zinc-300">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                <span>Toggle Fullscreen</span>
                <kbd className="px-2 py-1 bg-white/15 text-white font-mono rounded-lg border border-white/20 text-[11px]">F</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                <span>Toggle Theater Mode</span>
                <kbd className="px-2 py-1 bg-white/15 text-white font-mono rounded-lg border border-white/20 text-[11px]">T</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                <span>Reload Stream</span>
                <kbd className="px-2 py-1 bg-white/15 text-white font-mono rounded-lg border border-white/20 text-[11px]">R</kbd>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                <span>Cycle Next Streaming Server</span>
                <kbd className="px-2 py-1 bg-white/15 text-white font-mono rounded-lg border border-white/20 text-[11px]">S</kbd>
              </div>
              {mediaType === 'tv' && (
                <>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                    <span>Next Episode</span>
                    <kbd className="px-2 py-1 bg-white/15 text-white font-mono rounded-lg border border-white/20 text-[11px]">N</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04]">
                    <span>Previous Episode</span>
                    <kbd className="px-2 py-1 bg-white/15 text-white font-mono rounded-lg border border-white/20 text-[11px]">P</kbd>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
