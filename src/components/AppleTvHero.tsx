import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Plus, 
  Check, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Share2, 
  ChevronLeft, 
  Video,
  Star
} from 'lucide-react';
import { MovieDetail, TvDetail } from '../types';
import { getBackdropUrl } from '../services/tmdb';

interface AppleTvHeroProps {
  item: MovieDetail | TvDetail;
  mediaType: 'movie' | 'tv';
  trailerKey: string | null;
  inWatchlist: boolean;
  onToggleWatchlist: () => void;
  onPlay: () => void;
  playButtonText?: string;
  onOpenTrailerModal?: () => void;
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
  badgeText
}) => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const [isMuted, setIsMuted] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Toggle Mute via YouTube iframe API
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: nextMuted ? 'mute' : 'unMute',
          args: []
        }),
        '*'
      );
    }
  };

  const handleFullscreen = () => {
    if (onOpenTrailerModal) {
      onOpenTrailerModal();
    } else if (heroRef.current) {
      if (!document.fullscreenElement) {
        heroRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
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

  return (
    <div 
      ref={heroRef}
      className="relative w-full h-[85vh] sm:h-[90vh] min-h-[600px] max-h-[920px] overflow-hidden bg-black select-none flex flex-col justify-end"
    >
      {/* 1. CINEMATIC FULL-BLEED BACKGROUND TRAILER OR BACKDROP */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* High-Res Backdrop Fallback (Underneath trailer) */}
        <img
          src={getBackdropUrl(item.backdrop_path, 'original')}
          alt={title}
          className={`absolute inset-0 w-full h-full object-cover object-[center_20%] transition-opacity duration-700 ${
            videoLoaded && trailerKey ? 'opacity-0' : 'opacity-90'
          }`}
        />

        {/* Full-bleed YouTube Trailer on top */}
        {trailerKey ? (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden">
            <iframe
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&loop=1&playlist=${trailerKey}&playsinline=1&rel=0&showinfo=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&disablekb=1&fs=0`}
              title="Apple TV Background Video"
              className={`w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] object-cover pointer-events-none border-0 scale-105 transition-opacity duration-700 ${
                videoLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              onLoad={() => setVideoLoaded(true)}
            />
          </div>
        ) : null}

        {/* Ambient Gradients matching Apple TV (Keep top 70% completely clear & vibrant) */}
        <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black via-black/80 via-35% to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 via-black/10 to-transparent pointer-events-none" />
      </div>

      {/* 2. APPLE TV TOP BAR (Clean, Dedicated, No Overlapping Icons!) */}
      <header className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 sm:px-10 py-5 transition-all duration-300 ${
        isScrolled ? 'bg-black/75 backdrop-blur-2xl border-b border-white/[0.08] shadow-2xl py-3.5' : 'bg-transparent'
      }`}>
        {/* Left: Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg group"
          title="Back"
          aria-label="Back"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 -ml-0.5 group-hover:-translate-x-0.5 transition-transform" />
        </button>

        {/* Right: Sound, Fullscreen, Share */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sound / Mute Toggle Button */}
          {trailerKey && (
            <button
              onClick={handleToggleMute}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg ${
                !isMuted 
                  ? 'bg-white text-black border-white' 
                  : 'bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border-white/15'
              }`}
              title={isMuted ? 'Unmute Trailer Audio' : 'Mute Audio'}
              aria-label="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          )}

          {/* Fullscreen / Expand Video Button */}
          <button
            onClick={handleFullscreen}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
            title="Fullscreen Video"
            aria-label="Fullscreen"
          >
            <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Share Button */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/45 hover:bg-black/75 text-white/90 hover:text-white border border-white/15 backdrop-blur-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg"
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
      <div className="relative z-20 w-full max-w-[1720px] mx-auto px-6 sm:px-12 lg:px-16 pb-6 sm:pb-8 lg:pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 lg:gap-8">
          
          {/* Left Column: Title, Metadata, Synopsis, Action Buttons */}
          <div className="max-w-2xl flex flex-col items-start">
            
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
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-zinc-300 mb-2">
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
            <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-zinc-400 mb-4 font-medium">
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

            {/* Action Buttons Row (Matching Apple TV layout) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Primary Watch / Play Button */}
              <button
                onClick={onPlay}
                className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full font-bold text-xs sm:text-sm bg-white text-black hover:bg-[#e5e5ea] flex items-center gap-2 shadow-[0_6px_20px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
                <span>{playButtonText || (mediaType === 'tv' ? 'Play Episode 1' : 'Play Movie')}</span>
              </button>

              {/* Secondary Trailer Button */}
              {trailerKey && onOpenTrailerModal && (
                <button
                  onClick={onOpenTrailerModal}
                  className="px-5 py-2.5 sm:px-6 sm:py-3 rounded-full font-semibold text-xs sm:text-sm bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-xl flex items-center gap-2 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Video className="w-4 h-4 text-zinc-200" />
                  <span>Watch Trailer</span>
                </button>
              )}

              {/* Watchlist Circle Button */}
              <button
                onClick={onToggleWatchlist}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border backdrop-blur-xl flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 shadow-md ${
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
