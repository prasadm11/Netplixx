import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Plus, Check, Info, Star, ChevronLeft, ChevronRight, Volume2 } from 'lucide-react';
import { MediaItem } from '../types';
import { getBackdropUrl, getImageUrl } from '../services/tmdb';
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '../services/storage';

interface HeroCarouselProps {
  items: MediaItem[];
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ items }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const navigate = useNavigate();
  const carouselItems = items.slice(0, 6);

  const minSwipeDistance = 45;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentIndex(prev => (prev + 1) % carouselItems.length);
    }
    if (isRightSwipe) {
      setCurrentIndex(prev => (prev - 1 + carouselItems.length) % carouselItems.length);
    }
  };

  useEffect(() => {
    if (carouselItems.length <= 1 || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % carouselItems.length);
    }, 7000);

    return () => clearInterval(interval);
  }, [carouselItems.length, isPaused]);

  if (!carouselItems.length) return null;

  const current = carouselItems[currentIndex];
  const isTv = current.media_type === 'tv' || (!current.title && !!current.name);
  const title = current.title || current.name || 'Featured Title';
  const year = (current.release_date || current.first_air_date || '').slice(0, 4);
  const rating = current.vote_average ? current.vote_average.toFixed(1) : '8.2';

  const inWatchlist = isInWatchlist(current.id, isTv ? 'tv' : 'movie');

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(current.id, isTv ? 'tv' : 'movie');
    } else {
      addToWatchlist({
        id: current.id,
        mediaType: isTv ? 'tv' : 'movie',
        title,
        poster_path: current.poster_path,
        backdrop_path: current.backdrop_path,
        vote_average: current.vote_average,
        release_date: current.release_date || current.first_air_date
      });
    }
  };

  const handleWatchNow = () => {
    if (isTv) {
      navigate(`/watch/tv/${current.id}/1/1`);
    } else {
      navigate(`/watch/movie/${current.id}`);
    }
  };

  const handleDetails = () => {
    if (isTv) {
      navigate(`/series/${current.id}`);
    } else {
      navigate(`/movie/${current.id}`);
    }
  };

  return (
    <div
      className="relative w-full h-[75vh] min-h-[520px] max-h-[660px] sm:h-[82vh] lg:h-[88vh] overflow-hidden bg-black select-none touch-pan-y"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Cinematic Backdrops with Apple TV Crossfade */}
      {carouselItems.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
        >
          {/* Desktop/Tablet: Crisp Landscape Backdrop */}
          <img
            src={getBackdropUrl(item.backdrop_path, 'original')}
            alt={item.title || item.name}
            className="hidden sm:block w-full h-full object-cover object-[center_20%] scale-100 transform transition-transform duration-10000 ease-out"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />

          {/* Mobile: Full-Bleed Fully Occupied Vertical Poster */}
          <img
            src={getImageUrl(item.poster_path, 'original') || getBackdropUrl(item.backdrop_path, 'original')}
            alt={item.title || item.name}
            className="sm:hidden w-full h-full object-cover object-top"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />

          {/* Apple TV Preserved Poster Clarity & Feathering Gradients */}
          {/* Bottom Edge Fade: Only feathers the bottom edge into the page content below */}
          <div className="absolute bottom-0 left-0 right-0 h-40 sm:h-52 bg-gradient-to-t from-black via-black/65 via-35% to-transparent pointer-events-none" />

          {/* Left Text Scrim: Soft, directional scrim strictly behind text to leave 70% of backdrop vibrant and clear */}
          <div className="hidden sm:block absolute inset-y-0 left-0 w-full sm:w-1/2 lg:w-[45%] bg-gradient-to-r from-black/75 via-black/25 to-transparent pointer-events-none" />

          {/* Top Subtle Navbar Scrim: Minimal feathering for navbar readability without darkening the artwork */}
          <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />

          {/* Mobile Full-Bleed Portrait Scrim */}
          <div className="sm:hidden absolute inset-0 bg-gradient-to-t from-black via-black/70 via-45% to-transparent pointer-events-none" />
        </div>
      ))}

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-3 sm:pb-12 lg:pb-16">
        
        {/* Mobile Full-Bleed Overlay Content (sm:hidden) */}
        <div className="sm:hidden w-full flex flex-col items-center text-center pb-2 px-2 animate-fade-in">
          {/* Apple Original Badge */}
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span className="apple-badge text-[9px] px-2 py-0.5 rounded font-bold tracking-wider text-white/90">
              {isTv ? 'SERIES' : 'FEATURE FILM'} • 4K HDR
            </span>
            {rating && (
              <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-300 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                <Star className="w-3 h-3 fill-amber-300" />
                {rating}
              </span>
            )}
          </div>

          {/* Cinematic Large Title */}
          <h1 className="text-2xl font-black text-white tracking-tight leading-tight mb-1 font-display drop-shadow-[0_2px_14px_rgba(0,0,0,0.95)] line-clamp-1">
            {title}
          </h1>

          {/* Tagline / Overview */}
          <p className="text-zinc-200 text-xs line-clamp-2 mb-3.5 leading-relaxed max-w-sm font-normal drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
            {current.overview || "Experience this critically acclaimed title in ultra-high definition with immersive spatial audio on Netplix."}
          </p>

          {/* Apple Action Buttons */}
          <div className="flex items-center justify-center gap-2 w-full max-w-xs mb-1">
            <button
              onClick={handleWatchNow}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white hover:bg-[#e5e5ea] text-black font-bold px-4 py-2.5 rounded-full text-xs transition-all shadow-apple-button active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
              <span>Stream Now</span>
            </button>

            <button
              onClick={handleDetails}
              className="flex-1 flex items-center justify-center gap-1.5 bg-white/[0.16] hover:bg-white/[0.24] text-white font-medium px-4 py-2.5 rounded-full text-xs border border-white/[0.2] backdrop-blur-2xl transition-all active:scale-95"
            >
              <Info className="w-3.5 h-3.5 text-zinc-300" />
              <span>Details</span>
            </button>

            <button
              onClick={handleWatchlist}
              className={`w-9 h-9 shrink-0 rounded-full border backdrop-blur-2xl flex items-center justify-center transition-all active:scale-90 ${inWatchlist
                ? 'bg-white text-black border-white shadow-apple-button'
                : 'bg-white/[0.16] text-white hover:bg-white/[0.24] border-white/[0.2]'
                }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Desktop Layout (hidden sm:block) */}
        <div className="hidden sm:block max-w-2xl animate-fade-in">
          {/* Apple Original Badge */}
          <div className="flex items-center gap-2 mb-2 sm:mb-2.5">
            <span className="apple-badge text-[9px] sm:text-[10px] px-2 py-0.5 rounded font-bold tracking-wider text-white/90">
              {isTv ? 'SERIES' : 'FEATURE FILM'} • 4K HDR
            </span>
            {rating && (
              <span className="flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-amber-300 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10">
                <Star className="w-3 h-3 fill-amber-300" />
                {rating}
              </span>
            )}
          </div>

          {/* Cinematic Large Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2 sm:mb-3 font-display drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            {title}
          </h1>

          {/* Tagline / Overview */}
          <p className="text-zinc-200 text-xs sm:text-base line-clamp-2 sm:line-clamp-3 mb-3.5 sm:mb-6 leading-relaxed max-w-xl font-normal drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            {current.overview || "Experience this critically acclaimed title in ultra-high definition with immersive spatial audio on Netplix."}
          </p>

          {/* Apple Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Primary Action: Solid White Pill */}
            <button
              onClick={handleWatchNow}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-[#e5e5ea] text-black font-bold px-5 sm:px-7 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-base transition-all duration-200 shadow-apple-button active:scale-95"
            >
              <Play className="w-4 h-4 fill-black ml-0.5" />
              <span>Stream Now</span>
            </button>

            {/* Secondary Action: Apple Frosted Glass Pill */}
            <button
              onClick={handleDetails}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-white/[0.14] hover:bg-white/[0.22] text-white font-medium px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-full text-xs sm:text-base border border-white/[0.18] backdrop-blur-2xl transition-all duration-200 active:scale-95"
            >
              <Info className="w-4 h-4 text-zinc-300" />
              <span>Details</span>
            </button>

            {/* Watchlist Quick Toggle: Circle Glass Pill */}
            <button
              onClick={handleWatchlist}
              className={`w-10 h-10 sm:w-12 sm:h-12 shrink-0 rounded-full border backdrop-blur-2xl flex items-center justify-center transition-all duration-200 active:scale-90 ${inWatchlist
                ? 'bg-white text-black border-white shadow-apple-button'
                : 'bg-white/[0.14] text-white hover:bg-white/[0.22] border-white/[0.18]'
                }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Apple TV Thumbnail Preview Dock (Bottom Right on Desktop) */}
        <div className="hidden lg:flex items-center gap-2.5 absolute bottom-12 right-8 z-30 bg-black/40 backdrop-blur-2xl p-2 rounded-2xl border border-white/10 shadow-apple-glass">
          <button
            onClick={() => setCurrentIndex(prev => (prev - 1 + carouselItems.length) % carouselItems.length)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Previous title"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2">
            {carouselItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative rounded-xl overflow-hidden transition-all duration-300 group ${idx === currentIndex
                  ? 'w-24 h-14 ring-2 ring-white scale-105 shadow-apple-card'
                  : 'w-16 h-11 opacity-50 hover:opacity-90 hover:scale-100'
                  }`}
                title={item.title || item.name}
              >
                <img
                  src={getImageUrl(item.backdrop_path || item.poster_path, 'w300')}
                  alt={item.title || item.name}
                  className="w-full h-full object-cover"
                />
                {idx === currentIndex && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-white shadow-sm" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentIndex(prev => (prev + 1) % carouselItems.length)}
            className="p-1.5 rounded-xl hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            aria-label="Next title"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile / Tablet Minimal Single Progress Dots (Clean Centered iOS Dock) */}
        <div className="lg:hidden flex items-center justify-center gap-1.5 pt-4 pb-1 z-30">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentIndex
                ? 'w-6 bg-white shadow-sm'
                : 'w-1.5 bg-white/35 hover:bg-white/60'
                }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;

