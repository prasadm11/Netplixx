import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  Volume2,
  VolumeX,
  Heart,
  Bookmark,
  Share2,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Star,
  Info,
  Check,
  Film,
  Tv,
  Loader2
} from 'lucide-react';
import { ShortItem } from '../types';
import { fetchShortsVideos } from '../services/tmdb';
import {
  addToWatchlist,
  removeFromWatchlist,
  isInWatchlist
} from '../services/storage';
import { ShortsSkeleton } from '../components/Skeletons';

const ShortsPage: React.FC = () => {
  const [shorts, setShorts] = useState<ShortItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('netplix_shorts_likes') || localStorage.getItem('cinejoy_shorts_likes');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [inWatchlistMap, setInWatchlistMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [dragY, setDragY] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);
  const touchCurrentY = useRef<number | null>(null);
  const isScrolling = useRef(false);
  const navigate = useNavigate();

  // Listen to YouTube player state changes via postMessage to detect when playback genuinely starts
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        const data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (data && (data.event === 'onStateChange' || data.event === 'infoDelivery')) {
          const state = data.info?.playerState ?? data.info;
          // State 1 = PLAYING
          if (state === 1) {
            setIsVideoPlaying(true);
          }
        }
      } catch {
        // ignore non-JSON messages
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Reset video playing state on activeIndex change and provide graceful fallback timeout
  useEffect(() => {
    setIsVideoPlaying(false);
    const timer = setTimeout(() => {
      setIsVideoPlaying(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Load dynamic shorts from TMDB
  useEffect(() => {
    let isMounted = true;
    async function loadInitialShorts() {
      setLoading(true);
      try {
        const fetched = await fetchShortsVideos(1);
        if (isMounted && fetched && fetched.length > 0) {
          setShorts(fetched);
        }
      } catch (e) {
        console.warn('Could not load dynamic shorts:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadInitialShorts();
    return () => {
      isMounted = false;
    };
  }, []);

  const currentShort = shorts[activeIndex];

  // Update watchlist state for active item
  useEffect(() => {
    if (currentShort) {
      setInWatchlistMap(prev => ({
        ...prev,
        [currentShort.id]: isInWatchlist(currentShort.tmdbId, currentShort.mediaType)
      }));
    }
    setShowFullOverview(false);
  }, [activeIndex, currentShort]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleNext = useCallback(() => {
    if (activeIndex < shorts.length - 1) {
      setActiveIndex(i => i + 1);
    } else if (!loadingMore) {
      // Fetch next page
      setLoadingMore(true);
      fetchShortsVideos(page + 1).then(more => {
        setLoadingMore(false);
        if (more && more.length > 0) {
          setPage(p => p + 1);
          setShorts(prev => {
            const existingKeys = new Set(prev.map(s => s.videoKey));
            const newItems = more.filter(s => !existingKeys.has(s.videoKey));
            return [...prev, ...newItems];
          });
          setActiveIndex(i => i + 1);
        }
      }).catch(() => setLoadingMore(false));
    }
  }, [activeIndex, shorts.length, loadingMore, page]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      setActiveIndex(i => i - 1);
    }
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted(m => !m);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Mouse wheel navigation
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 30 || isScrolling.current) return;
      isScrolling.current = true;
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    };

    const el = containerRef.current;
    if (el) {
      el.addEventListener('wheel', handleWheel, { passive: true });
      return () => el.removeEventListener('wheel', handleWheel);
    }
  }, [handleNext, handlePrev]);

  // Touch Swipe navigation with real-time rubber-band drag tracking
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    touchCurrentY.current = e.touches[0].clientY;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    touchCurrentY.current = currentY;
    const deltaY = currentY - touchStartY.current;

    // Apply fluid iOS-style damping
    let dampedDelta = deltaY * 0.45;
    // Boundary resistance when dragging past first or last item
    if ((activeIndex === 0 && deltaY > 0) || (activeIndex === shorts.length - 1 && deltaY < 0)) {
      dampedDelta = deltaY * 0.15;
    }

    // Limit maximum travel for pleasant responsiveness
    const clamped = Math.max(-110, Math.min(110, dampedDelta));
    setDragY(clamped);
  };

  const handleTouchEnd = () => {
    if (touchStartY.current === null) return;
    const diff = touchStartY.current - (touchCurrentY.current ?? touchStartY.current);

    // Spring release back to center
    setIsSwiping(false);
    setDragY(0);

    // Require an intentional swipe (> 80px), preventing accidental triggers on small gestures
    const SWIPE_THRESHOLD = 80;
    if (diff > SWIPE_THRESHOLD) {
      handleNext();
    } else if (diff < -SWIPE_THRESHOLD) {
      handlePrev();
    }
    touchStartY.current = null;
    touchCurrentY.current = null;
  };

  const handleToggleLike = (id: string) => {
    setLikedMap(prev => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem('netplix_shorts_likes', JSON.stringify(updated));
      } catch { }
      return updated;
    });
  };

  const handleToggleWatchlist = () => {
    if (!currentShort) return;
    const inList = isInWatchlist(currentShort.tmdbId, currentShort.mediaType);
    if (inList) {
      removeFromWatchlist(currentShort.tmdbId, currentShort.mediaType);
      setInWatchlistMap(prev => ({ ...prev, [currentShort.id]: false }));
      showToast('Removed from Watchlist');
    } else {
      addToWatchlist({
        id: currentShort.tmdbId,
        mediaType: currentShort.mediaType,
        title: currentShort.title.split(' - ')[0],
        poster_path: currentShort.poster,
        backdrop_path: currentShort.backdrop,
        vote_average: currentShort.voteAverage,
        release_date: currentShort.releaseDate
      });
      setInWatchlistMap(prev => ({ ...prev, [currentShort.id]: true }));
      showToast('Added to Watchlist');
    }
  };

  const handleShare = async () => {
    if (!currentShort) return;
    const url = window.location.href;
    const shareData = {
      title: currentShort.title,
      text: `Check out ${currentShort.title} on Netplix Shorts!`,
      url
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch { }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Trailer link copied to clipboard!');
      } catch {
        showToast('Link ready to share');
      }
    }
  };

  const handleWatchFull = () => {
    if (!currentShort) return;
    if (currentShort.mediaType === 'tv') {
      navigate(`/watch/tv/${currentShort.tmdbId}/1/1`);
    } else {
      navigate(`/watch/movie/${currentShort.tmdbId}`);
    }
  };

  const handleViewDetails = () => {
    if (!currentShort) return;
    if (currentShort.mediaType === 'tv') {
      navigate(`/tv/${currentShort.tmdbId}`);
    } else {
      navigate(`/movie/${currentShort.tmdbId}`);
    }
  };

  if (loading && shorts.length === 0) {
    return <ShortsSkeleton />;
  }

  if (shorts.length === 0) {
    return (
      <div className="min-h-screen bg-black pt-28 pb-12 flex flex-col items-center justify-center text-center text-white px-4">
        <Sparkles className="w-10 h-10 text-[#2997ff] mb-3" />
        <h2 className="text-xl font-bold mb-1 font-display">No Shorts Available Right Now</h2>
        <p className="text-zinc-400 text-xs max-w-sm mb-6">
          Could not fetch trailers at the moment. Check your internet connection or try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-white text-black px-6 py-2.5 rounded-full text-xs font-semibold hover:bg-zinc-200 transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  const isCurrentLiked = !!likedMap[currentShort.id];
  const isCurrentInWatchlist = !!inWatchlistMap[currentShort.id];

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="h-[100dvh] sm:min-h-screen bg-black p-0 sm:pt-20 sm:pb-10 flex items-center justify-center relative overflow-hidden text-[#f5f5f7] select-none touch-pan-x"
    >
      {/* Dynamic Ambient Background Blur based on current backdrop */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className="absolute -inset-20 bg-cover bg-center filter blur-3xl opacity-20 transition-all duration-700 scale-110"
          style={{ backgroundImage: `url(${currentShort.backdrop || currentShort.poster})` }}
        />
        <div className="absolute inset-0 bg-black/75" />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 sm:top-24 left-1/2 -translate-x-1/2 z-50 bg-[#1c1c1e]/90 text-white border border-white/20 backdrop-blur-2xl px-5 py-2.5 rounded-full text-xs font-semibold shadow-2xl flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-[#2997ff]" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative z-10 flex items-center justify-center gap-6 w-full h-full max-w-none p-0 sm:max-w-xl sm:px-4 sm:h-auto">
        {/* Main Vertical Video Container */}
        <div
          className="relative w-full h-full sm:max-w-[420px] sm:h-auto sm:aspect-[9/16] sm:max-h-[82vh] bg-black rounded-none sm:rounded-3xl overflow-hidden border-0 sm:border sm:border-white/[0.16] shadow-none sm:shadow-apple-card flex flex-col justify-between"
          style={{
            transform: `translateY(${dragY}px) scale(${1 - Math.abs(dragY) * 0.0006})`,
            transition: isSwiping ? 'none' : 'transform 0.38s cubic-bezier(0.16, 1, 0.3, 1)',
            touchAction: 'pan-x'
          }}
        >
          {/* Subtle Dynamic Drag Indicator Badge */}
          {Math.abs(dragY) > 20 && (
            <div className={`absolute left-1/2 -translate-x-1/2 z-30 pointer-events-none transition-opacity duration-200 ${
              dragY < 0 ? 'bottom-6' : 'top-16'
            }`}>
              <div className="bg-black/80 backdrop-blur-xl border border-white/20 px-3 py-1 rounded-full flex items-center gap-1.5 text-[11px] font-semibold text-white/90 shadow-xl animate-fade-in">
                {dragY < 0 ? (
                  <>
                    <span>Next Video</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#2997ff]" />
                  </>
                ) : (
                  <>
                    <ChevronUp className="w-3.5 h-3.5 text-[#2997ff]" />
                    <span>Previous Video</span>
                  </>
                )}
              </div>
            </div>
          )}

          {/* YouTube Video Player Embed Container */}
          <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
            <iframe
              key={currentShort.videoKey}
              src={`https://www.youtube-nocookie.com/embed/${currentShort.videoKey}?autoplay=1&mute=${isMuted ? 1 : 0
                }&enablejsapi=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3&showinfo=0&origin=${
                  typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''
                }`}
              title={currentShort.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full object-cover scale-[1.35] pointer-events-none border-0"
            />

            {/* Cover Poster Overlay: Completely hides YouTube's initial pause icon / loading bar until genuine playback begins */}
            <div
              className={`absolute inset-0 z-10 bg-black transition-opacity duration-500 pointer-events-none ${
                isVideoPlaying ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <img
                src={currentShort.backdrop || currentShort.poster}
                alt={currentShort.title}
                className="w-full h-full object-cover filter brightness-90 scale-105"
              />
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl">
                  <Loader2 className="w-5 h-5 animate-spin text-[#2997ff]" />
                </div>
              </div>
            </div>
          </div>

          {/* Top Bar Header */}
          <div className="relative z-20 px-3.5 sm:px-4 pt-[max(env(safe-area-inset-top),14px)] sm:pt-4 pb-3 flex items-center justify-between bg-gradient-to-b from-black/90 via-black/40 to-transparent">
            <div className="flex items-center gap-2">
              <span className="apple-badge flex items-center gap-1 text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full font-semibold tracking-wider text-white">
                <Sparkles className="w-3 h-3 text-[#2997ff]" />
                Netplix Shorts
              </span>
              <span className="text-[10px] sm:text-xs font-medium text-white/70 bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-md">
                {activeIndex + 1} / {shorts.length}
              </span>
            </div>

            {/* Audio Mute/Unmute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-xl transition-all border border-white/15 active:scale-95 shadow-md"
              title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 text-white/80" />
              ) : (
                <Volume2 className="w-4 h-4 text-[#2997ff]" />
              )}
            </button>
          </div>

          {/* Right Floating Actions (Likes, Watchlist, Share, Details) */}
          <div className="absolute right-2.5 sm:right-3 bottom-44 sm:bottom-28 z-30 flex flex-col items-center gap-3 sm:gap-4">
            {/* Like */}
            <button
              onClick={() => handleToggleLike(currentShort.id)}
              className="flex flex-col items-center gap-1 group"
              title="Like this trailer"
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 transition-all duration-200 active:scale-90 shadow-lg ${isCurrentLiked
                    ? 'bg-red-500 text-white scale-105'
                    : 'bg-black/60 text-white hover:bg-white/20'
                  }`}
              >
                <Heart className={`w-4 h-4 sm:w-5 sm:h-5 ${isCurrentLiked ? 'fill-white' : ''}`} />
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 drop-shadow-md">
                {isCurrentLiked ? 'Liked' : currentShort.likes}
              </span>
            </button>

            {/* Watchlist */}
            <button
              onClick={handleToggleWatchlist}
              className="flex flex-col items-center gap-1 group"
              title="Save to Watchlist"
            >
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/20 transition-all duration-200 active:scale-90 shadow-lg ${isCurrentInWatchlist
                    ? 'bg-[#2997ff] text-white scale-105'
                    : 'bg-black/60 text-white hover:bg-white/20'
                  }`}
              >
                {isCurrentInWatchlist ? (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 drop-shadow-md">
                {isCurrentInWatchlist ? 'Saved' : 'Watchlist'}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="flex flex-col items-center gap-1 group"
              title="Share trailer"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-2xl border border-white/20 transition-all active:scale-90 shadow-lg">
                <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 drop-shadow-md">
                Share
              </span>
            </button>

            {/* View Details Info */}
            <button
              onClick={handleViewDetails}
              className="flex flex-col items-center gap-1 group"
              title="View full film info"
            >
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-2xl border border-white/20 transition-all active:scale-90 shadow-lg">
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-semibold text-white/90 drop-shadow-md">
                Info
              </span>
            </button>
          </div>

          {/* Bottom Info & Watch CTA */}
          <div className="relative z-20 p-3.5 sm:p-4 pb-[calc(4.75rem+env(safe-area-inset-bottom,0px))] sm:pb-4 bg-gradient-to-t from-black via-black/90 to-transparent pt-8 sm:pt-8">
            {/* Meta Tags & Ratings */}
            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 flex-wrap">
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#f5c518] bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                <Star className="w-3 h-3 fill-[#f5c518]" />
                {currentShort.voteAverage}
              </span>

              {currentShort.releaseDate && (
                <span className="text-[10px] sm:text-[11px] font-medium text-white/70 bg-black/60 px-2 py-0.5 rounded-md border border-white/10">
                  {currentShort.releaseDate.substring(0, 4)}
                </span>
              )}

              <span className="text-[10px] sm:text-[11px] font-medium text-white/70 bg-black/60 px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1">
                {currentShort.mediaType === 'tv' ? (
                  <>
                    <Tv className="w-3 h-3 text-[#2997ff]" /> Series
                  </>
                ) : (
                  <>
                    <Film className="w-3 h-3 text-[#2997ff]" /> Movie
                  </>
                )}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-sm sm:text-base font-bold text-white mb-1 line-clamp-1 drop-shadow-md font-display">
              {currentShort.title}
            </h3>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mb-1.5 sm:mb-2">
              {currentShort.tags.slice(0, 3).map(tag => (
                <span
                  key={tag}
                  className="text-[10px] sm:text-[11px] text-[#2997ff] font-medium bg-[#2997ff]/10 px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Overview / Synopsis Snippet */}
            <p
              onClick={() => setShowFullOverview(!showFullOverview)}
              className={`text-[11px] sm:text-xs text-white/80 mb-2.5 sm:mb-3 cursor-pointer leading-relaxed ${showFullOverview ? '' : 'line-clamp-2'
                }`}
            >
              {currentShort.overview}
              {!showFullOverview && (
                <span className="text-white/40 ml-1 hover:text-white/80">...more</span>
              )}
            </p>

            {/* Watch Full Movie / Series CTA */}
            <div className="flex gap-2">
              <button
                onClick={handleWatchFull}
                className="flex-1 flex items-center justify-center gap-2 bg-white hover:bg-[#e5e5ea] text-black font-bold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm transition-all shadow-apple-button hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-black" />
                <span>
                  Watch {currentShort.mediaType === 'tv' ? 'Series' : 'Full Movie'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Up/Down Desktop Switcher Buttons */}
        <div className="hidden sm:flex flex-col gap-3">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className="p-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/[0.14] text-white disabled:opacity-20 disabled:pointer-events-none transition-all backdrop-blur-xl shadow-lg hover:scale-105 active:scale-95"
            title="Previous (Arrow Up)"
          >
            <ChevronUp className="w-5 h-5" />
          </button>

          <button
            onClick={handleNext}
            disabled={activeIndex === shorts.length - 1 && loadingMore}
            className="p-3.5 rounded-full bg-white/[0.08] hover:bg-white/[0.18] border border-white/[0.14] text-white disabled:opacity-20 disabled:pointer-events-none transition-all backdrop-blur-xl shadow-lg hover:scale-105 active:scale-95"
            title="Next (Arrow Down)"
          >
            {loadingMore ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#2997ff]" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortsPage;
