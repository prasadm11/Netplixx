import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  Share2, 
  ChevronLeft, 
  Video,
  Star
} from 'lucide-react';
import { MovieDetail, TvDetail } from '../types';
import { getBackdropUrl, getImageUrl } from '../services/tmdb';

interface AppleTvHeroProps {
  item: MovieDetail | TvDetail;
  mediaType: 'movie' | 'tv';
  trailerKey: string | null;
  inWatchlist: boolean;
  onToggleWatchlist: () => void;
  onPlay: () => void;
  playButtonText?: string;
  onOpenTrailerModal?: () => void;
  isTrailerModalOpen?: boolean;
  badgeText?: string;
}

const AppleTvHero: React.FC<AppleTvHeroProps> = ({
  item,
  mediaType,
  trailerKey,
  inWatchlist,
  onToggleWatchlist,
  onPlay,
  playButtonText,
  onOpenTrailerModal,
  isTrailerModalOpen,
  badgeText
}) => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<any>(null);
  const loopIntervalRef = useRef<any>(null);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen to native browser fullscreen changes
  useEffect(() => {
    const onFsChange = () => {
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      setIsFullscreen(isFs);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
    };
  }, []);

  // Load YouTube IFrame API and initialize player with strict invisible background controls (Desktop only)
  useEffect(() => {
    let isCancelled = false;
    setIsPlaying(false);

    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }

    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch {
        // ignore
      }
      playerRef.current = null;
    }

    // On mobile screens, disable background trailer autoplay to save bandwidth/battery and show pristine poster artwork
    if (!trailerKey || isMobile) return;

    const loadYouTubeApi = (): Promise<any> => {
      return new Promise((resolve) => {
        if ((window as any).YT && (window as any).YT.Player) {
          resolve((window as any).YT);
          return;
        }

        if (!document.getElementById('yt-iframe-api-script')) {
          const script = document.createElement('script');
          script.id = 'yt-iframe-api-script';
          script.src = 'https://www.youtube.com/iframe_api';
          document.head.appendChild(script);
        }

        const poll = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            clearInterval(poll);
            resolve((window as any).YT);
          }
        }, 100);

        setTimeout(() => {
          clearInterval(poll);
          resolve((window as any).YT || null);
        }, 8000);
      });
    };

    loadYouTubeApi().then((YT) => {
      if (isCancelled || !YT || !playerContainerRef.current) return;

      try {
        // Clear container and create target element
        playerContainerRef.current.innerHTML = '<div id="yt-hero-player-inner" style="width:100%;height:100%;pointer-events:none;"></div>';

        playerRef.current = new YT.Player('yt-hero-player-inner', {
          videoId: trailerKey,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            disablekb: 1,
            fs: 0,
            cc_load_policy: 0,
            autohide: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : undefined
          },
          events: {
            onReady: (event: any) => {
              if (isCancelled) return;
              try {
                event.target.mute();
                event.target.playVideo();
              } catch {
                // ignore
              }
            },
            onStateChange: (event: any) => {
              if (isCancelled) return;
              const state = event.data;
              // YT.PlayerState: PLAYING = 1, ENDED = 0, PAUSED = 2, BUFFERING = 3, CUED = 5
              if (state === 1) {
                // ONLY show video when it is actively rendering video frames
                setIsPlaying(true);
              } else if (state === 0) {
                // Video ended: hide IMMEDIATELY so replay icon is never visible, loop back to 0s
                setIsPlaying(false);
                try {
                  event.target.seekTo(0, true);
                  event.target.playVideo();
                } catch {
                  // ignore
                }
              } else if (state === 2) {
                // Video paused: hide IMMEDIATELY so pause/play icons are never visible
                setIsPlaying(false);
                try {
                  event.target.playVideo();
                } catch {
                  // ignore
                }
              } else {
                // Buffering / unstarted / cued: keep hidden behind backdrop
                setIsPlaying(false);
              }
            }
          }
        });

        // Proactive loop monitor: seek to 0 before the video reaches the end (duration - 0.6s)
        // This ensures YouTube NEVER reaches the ENDED state, preventing the circular replay button from ever appearing
        loopIntervalRef.current = setInterval(() => {
          if (isCancelled || !playerRef.current) return;
          try {
            if (
              typeof playerRef.current.getCurrentTime === 'function' &&
              typeof playerRef.current.getDuration === 'function'
            ) {
              const current = playerRef.current.getCurrentTime();
              const duration = playerRef.current.getDuration();
              if (duration > 3 && current >= duration - 0.6) {
                playerRef.current.seekTo(0, true);
                playerRef.current.playVideo();
              }
            }
          } catch {
            // ignore
          }
        }, 300);
      } catch (err) {
        console.warn('Failed to initialize background trailer:', err);
      }
    });

    return () => {
      isCancelled = true;
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // ignore
        }
        playerRef.current = null;
      }
    };
  }, [trailerKey]);

  // Pause background trailer when modal dialog is open, resume when closed
  useEffect(() => {
    if (isTrailerModalOpen && playerRef.current) {
      try {
        playerRef.current.pauseVideo();
      } catch {
        // ignore
      }
    } else if (!isTrailerModalOpen && playerRef.current && trailerKey) {
      try {
        playerRef.current.playVideo();
      } catch {
        // ignore
      }
    }
  }, [isTrailerModalOpen, trailerKey]);

  const title = (item as MovieDetail).title || (item as TvDetail).name || 'Title';
  const releaseDate = (item as MovieDetail).release_date || (item as TvDetail).first_air_date || '';
  const year = releaseDate ? releaseDate.slice(0, 4) : '';
  
  // Runtime formatting
  const runtime = (item as MovieDetail).runtime;
  const formatRuntime = (mins?: number) => {
    if (!mins) return null;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };
  const durationText = mediaType === 'movie' 
    ? formatRuntime(runtime) 
    : ((item as TvDetail).episode_run_time?.[0] 
        ? `${(item as TvDetail).episode_run_time?.[0]}m` 
        : ((item as TvDetail).number_of_seasons 
            ? `${(item as TvDetail).number_of_seasons} ${(item as TvDetail).number_of_seasons === 1 ? 'Season' : 'Seasons'}` 
            : null));

  // Cast members for "Starring..."
  const starring = item.credits?.cast?.slice(0, 3).map(c => c.name).join(', ');

  // Genre list
  const genres = (item.genres || []).map((g: any) => g.name || g).slice(0, 3);

  // Certification badge
  const ratingCert = item.certification || (mediaType === 'tv' ? 'A' : 'PG-13');

  // Toggle Mute via YouTube API
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (playerRef.current) {
      try {
        if (nextMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      } catch {
        // ignore
      }
    }
  };

  // Expand / Fullscreen Video directly in place
  const handleFullscreen = () => {
    const next = !isFullscreen;
    setIsFullscreen(next);

    // If expanding and muted, unmute so user can enjoy full audio
    if (next && isMuted) {
      setIsMuted(false);
      if (playerRef.current) {
        try {
          playerRef.current.unMute();
        } catch {
          // ignore
        }
      }
    }

    // Attempt native browser fullscreen
    if (next) {
      const el = heroRef.current;
      if (el?.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if ((el as any)?.webkitRequestFullscreen) {
        (el as any)?.webkitRequestFullscreen();
      }
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any)?.webkitFullscreenElement) {
        (document as any)?.webkitExitFullscreen();
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title,
        text: `Watch ${title} on Cinejoy`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Truncate overview for Apple TV style 2-line preview
  const overview = item.overview || 'No synopsis available for this title.';
  const needsTruncation = overview.length > 150;
  const displayOverview = (!isExpanded && needsTruncation) 
    ? `${overview.slice(0, 150)}...` 
    : overview;

  // Dedicated Apple TV Mobile Layout: Showcases the whole uncropped vertical poster with ambient background
  if (isMobile) {
    return (
      <div 
        ref={heroRef}
        className="relative w-full overflow-hidden bg-[#050505] select-none flex flex-col items-center pt-20 pb-8 px-4"
      >
        {/* Ambient Blurred Artwork Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div
            className="absolute -inset-10 bg-cover bg-center filter blur-3xl opacity-30 scale-110"
            style={{
              backgroundImage: `url(${
                getImageUrl(item.poster_path, 'w500') || getBackdropUrl(item.backdrop_path, 'w780')
              })`
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#050505]/85 to-[#050505]" />
        </div>

        {/* Top Header Bar (Safe Area Padding) */}
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 pt-[max(env(safe-area-inset-top),0.85rem)] bg-black/60 backdrop-blur-2xl border-b border-white/[0.08] shadow-lg">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg group"
            title="Back"
            aria-label="Back"
          >
            <ChevronLeft className="w-5 h-5 -ml-0.5 group-hover:-translate-x-0.5 transition-transform" />
          </button>

          <div className="relative">
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg"
              title="Share"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copied && (
              <span className="absolute top-12 right-0 whitespace-nowrap text-[11px] font-semibold bg-white text-black px-2.5 py-1 rounded-full shadow-lg animate-fade-in pointer-events-none">
                Link Copied!
              </span>
            )}
          </div>
        </header>

        {/* Main Mobile Hero Content */}
        <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
          {/* Whole Uncropped Vertical Poster Showcase */}
          <div className="relative w-44 sm:w-52 aspect-[2/3] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.95)] border border-white/[0.18] mb-4">
            <img
              src={getImageUrl(item.poster_path, 'w780') || getBackdropUrl(item.backdrop_path, 'w1280')}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Optional Status Pill Badge */}
          {badgeText && (
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/15 border border-white/20 text-white backdrop-blur-md mb-2 shadow-sm">
              <span>{badgeText}</span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-black uppercase text-center font-display tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] leading-tight mb-2">
            {title}
          </h1>

          {/* Sub-row: TV Show / Movie • Genres • Rating Box • Match */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 text-xs font-medium text-zinc-300 mb-2">
            <span>{mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
            {genres.length > 0 && (
              <>
                <span className="text-zinc-600">•</span>
                <span>{genres.slice(0, 2).join(' • ')}</span>
              </>
            )}
            {ratingCert && (
              <span className="ml-0.5 border border-white/40 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-white/90 bg-white/5">
                {ratingCert}
              </span>
            )}
            {item.vote_average > 0 && (
              <span className="inline-flex items-center gap-1 text-[#34c759] font-bold text-xs ml-0.5">
                <Star className="w-3 h-3 fill-[#34c759]" />
                {Math.round(item.vote_average * 10)}% Match
              </span>
            )}
          </div>

          {/* Clean Real Metadata Row (Year, Duration, Status) */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-zinc-400 mb-3 font-medium">
            {year && <span>{year}</span>}
            {year && durationText && <span className="text-zinc-600">•</span>}
            {durationText && <span>{durationText}</span>}
            {item.status && (
              <>
                <span className="text-zinc-600">•</span>
                <span className="text-zinc-300">{item.status}</span>
              </>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="w-full flex flex-col gap-2.5 mb-4">
            {/* Primary Watch / Play Button */}
            <button
              onClick={onPlay}
              className="w-full py-3 rounded-full font-bold text-sm bg-white text-black hover:bg-[#e5e5ea] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(255,255,255,0.25)] transition-all duration-200 active:scale-[0.98]"
            >
              <Play className="w-4 h-4 fill-black ml-0.5" />
              <span>{playButtonText || (mediaType === 'tv' ? 'Play Episode 1' : 'Play Movie')}</span>
            </button>

            {/* Secondary Trailer & Watchlist Row */}
            <div className="flex items-center gap-2.5 w-full">
              {trailerKey && onOpenTrailerModal && (
                <button
                  onClick={onOpenTrailerModal}
                  className="flex-1 py-3 rounded-full font-semibold text-xs bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                >
                  <Video className="w-4 h-4 text-zinc-200" />
                  <span>Watch Trailer</span>
                </button>
              )}

              <button
                onClick={onToggleWatchlist}
                className={`h-11 px-5 rounded-full border backdrop-blur-xl flex items-center justify-center gap-1.5 transition-all duration-200 active:scale-90 shadow-md ${
                  trailerKey && onOpenTrailerModal ? '' : 'flex-1'
                } ${
                  inWatchlist
                    ? 'bg-white text-black border-white shadow-[0_4px_16px_rgba(255,255,255,0.3)]'
                    : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                }`}
                title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                aria-label="Watchlist Toggle"
              >
                {inWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
                <span className="text-xs font-semibold">{inWatchlist ? 'Saved' : 'Watchlist'}</span>
              </button>
            </div>
          </div>

          {/* Synopsis - Expandable */}
          <div className="text-xs text-zinc-300 leading-relaxed mb-3 text-left w-full font-normal">
            <span>{displayOverview}</span>
            {needsTruncation && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-1.5 text-[10px] font-bold tracking-wider text-white uppercase bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded backdrop-blur-md transition-colors inline-block"
              >
                {isExpanded ? 'LESS' : 'MORE'}
              </button>
            )}
          </div>

          {/* Starring Cast */}
          {starring && (
            <div className="text-[11px] text-zinc-400 font-medium text-left w-full">
              <span className="text-zinc-500 font-normal">Starring </span>
              <span className="text-zinc-200 font-semibold leading-relaxed">{starring}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={heroRef}
      className={`${
        isFullscreen
          ? 'fixed inset-0 z-[100] w-screen h-screen min-h-screen max-h-screen'
          : 'relative w-full h-[70vh] sm:h-[84vh] md:h-[88vh] min-h-[460px] max-h-[920px]'
      } overflow-hidden bg-black select-none flex flex-col justify-end transition-all duration-300`}
    >
      {/* 1. CINEMATIC FULL-BLEED BACKGROUND TRAILER OR BACKDROP */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* High-Res Backdrop Fallback / Mobile Poster (Always crisp, primary on mobile, fallback on desktop) */}
        <img
          src={getBackdropUrl(item.backdrop_path, 'original') || getImageUrl(item.poster_path, 'original')}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover ${
            isMobile ? 'object-[center_15%]' : 'object-[center_20%]'
          } transition-opacity duration-700 ${
            isPlaying && !isMobile ? 'opacity-0' : 'opacity-90'
          }`}
        />

        {/* Full-bleed YouTube Trailer on top - strictly hidden until actively rendering frames (Desktop only) */}
        {!isMobile && trailerKey ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
            <div
              className={`w-[115vw] h-[65vw] min-h-[115vh] min-w-[190vh] object-cover pointer-events-none border-0 scale-125 transition-opacity duration-700 ${
                isPlaying ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <div ref={playerContainerRef} className="w-full h-full pointer-events-none" />
            </div>
          </div>
        ) : null}

        {/* Ambient Gradients matching Apple TV (Keep top 70% completely clear & vibrant) */}
        <div className={`absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black via-black/85 via-35% to-transparent pointer-events-none transition-opacity duration-300 ${
          isFullscreen ? 'opacity-40' : 'opacity-100'
        }`} />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 via-black/15 to-transparent pointer-events-none" />
      </div>

      {/* 2. APPLE TV TOP BAR (Notch and Dynamic Island Safe) */}
      <header className={`${
        isFullscreen ? 'absolute' : 'fixed'
      } top-0 left-0 right-0 z-50 flex items-center justify-between px-4 sm:px-10 py-3 sm:py-5 transition-all duration-300 pt-[max(env(safe-area-inset-top),0.85rem)] ${
        isScrolled ? 'bg-black/80 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl' : 'bg-transparent'
      }`}>
        {/* Left: Back Button */}
        <button
          onClick={() => {
            if (isFullscreen) {
              handleFullscreen();
            } else {
              navigate(-1);
            }
          }}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg group"
          title="Back"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 -ml-0.5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right: Sound, Fullscreen (Desktop only), Share */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound / Mute Toggle Button - Desktop Only */}
          {!isMobile && trailerKey && (
            <button
              onClick={handleToggleMute}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg ${
                !isMuted 
                  ? 'bg-white text-black border-white' 
                  : 'bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border-white/15'
              }`}
              title={isMuted ? 'Unmute Trailer Audio' : 'Mute Audio'}
              aria-label="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          )}

          {/* Fullscreen / Expand Video Button - Desktop Only */}
          {!isMobile && trailerKey && (
            <button
              onClick={handleFullscreen}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Video'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          )}

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 text-white/90 hover:text-white border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg"
              title="Share"
              aria-label="Share"
            >
              <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            {copied && (
              <span className="absolute top-12 right-0 whitespace-nowrap text-[11px] font-semibold bg-white text-black px-2.5 py-1 rounded-full shadow-lg animate-fade-in pointer-events-none">
                Link Copied!
              </span>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO OVERLAY CONTENT (Compact, Anchored to Bottom Lower Third) */}
      <div className={`relative z-20 w-full max-w-[1720px] mx-auto px-4 sm:px-12 lg:px-16 pb-5 sm:pb-8 lg:pb-10 transition-opacity duration-300 ${
        isFullscreen ? 'opacity-0 hover:opacity-100 focus-within:opacity-100' : 'opacity-100'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 sm:gap-5 lg:gap-8">
          
          {/* Left Column: Title, Metadata, Synopsis, Action Buttons */}
          <div className="w-full max-w-2xl flex flex-col items-start">
            
            {/* Optional Status Pill Badge */}
            {badgeText && (
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/15 border border-white/20 text-white backdrop-blur-md mb-2 shadow-sm">
                <span>{badgeText}</span>
              </div>
            )}

            {/* Compact Apple TV Display Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-[44px] font-black text-white tracking-tight uppercase font-display drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] leading-[1.08] mb-2 max-w-xl">
              {title}
            </h1>

            {/* Sub-row: TV Show / Movie • Genres • Rating Box • Match */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-medium text-zinc-300 mb-2">
              <span>{mediaType === 'tv' ? 'TV Show' : 'Movie'}</span>
              
              {genres.length > 0 && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span>{genres.slice(0, 3).join(' • ')}</span>
                </>
              )}

              {/* Rating Box */}
              {ratingCert && (
                <span className="ml-0.5 border border-white/40 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider text-white/90 bg-white/5">
                  {ratingCert}
                </span>
              )}

              {/* Match / Rating */}
              {item.vote_average > 0 && (
                <span className="inline-flex items-center gap-1 text-[#34c759] font-bold text-xs ml-0.5">
                  <Star className="w-3 h-3 fill-[#34c759]" />
                  {Math.round(item.vote_average * 10)}% Match
                </span>
              )}
            </div>

            {/* Synopsis - Concise 2-line preview matching Apple TV */}
            <div className="text-xs sm:text-[13px] text-zinc-300 max-w-xl leading-relaxed mb-2 font-normal line-clamp-2">
              <span>{displayOverview}</span>
              {needsTruncation && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="ml-1.5 text-[10px] font-bold tracking-wider text-white uppercase bg-white/20 hover:bg-white/30 px-1.5 py-0.5 rounded backdrop-blur-md transition-colors inline-block"
                >
                  {isExpanded ? 'LESS' : 'MORE'}
                </button>
              )}
            </div>

            {/* Clean Real Metadata Row (Year, Duration, Status) */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-400 mb-3 sm:mb-4 font-medium">
              {year && <span>{year}</span>}
              {year && durationText && <span className="text-zinc-600">•</span>}
              {durationText && <span>{durationText}</span>}
              {item.status && (
                <>
                  <span className="text-zinc-600">•</span>
                  <span className="text-zinc-300">{item.status}</span>
                </>
              )}
            </div>

            {/* Action Buttons Row (Native Apple TV layout on iOS) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Primary Watch / Play Button */}
              <button
                onClick={onPlay}
                className="w-full sm:w-auto px-6 py-3 rounded-full font-bold text-xs sm:text-sm bg-white text-black hover:bg-[#e5e5ea] flex items-center justify-center gap-2 shadow-[0_6px_20px_rgba(255,255,255,0.25)] transition-all duration-200 active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
                <span>{playButtonText || (mediaType === 'tv' ? 'Play Episode 1' : 'Play Movie')}</span>
              </button>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                {/* Secondary Trailer Button */}
                {trailerKey && onOpenTrailerModal && (
                  <button
                    onClick={onOpenTrailerModal}
                    className="flex-1 sm:flex-initial px-5 py-3 rounded-full font-semibold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-xl flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                  >
                    <Video className="w-4 h-4 text-zinc-200" />
                    <span>Watch Trailer</span>
                  </button>
                )}

                {/* Watchlist Circle Button */}
                <button
                  onClick={onToggleWatchlist}
                  className={`w-11 h-11 sm:w-10 sm:h-10 shrink-0 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all duration-200 active:scale-90 shadow-md ${
                    inWatchlist
                      ? 'bg-white text-black border-white shadow-[0_4px_16px_rgba(255,255,255,0.3)]'
                      : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
                  }`}
                  title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                  aria-label="Watchlist Toggle"
                >
                  {inWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Starring Cast (Ted Lasso layout) */}
          {starring && (
            <div className="text-xs text-zinc-400 font-medium max-w-xs text-left lg:text-right self-start lg:self-end mb-1">
              <span className="text-zinc-500 font-normal">Starring </span>
              <span className="text-zinc-200 font-semibold leading-relaxed">{starring}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppleTvHero;
