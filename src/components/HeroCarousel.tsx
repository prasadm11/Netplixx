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
  const navigate = useNavigate();
  const carouselItems = items.slice(0, 6);

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
      className="relative w-full h-[72vh] sm:h-[82vh] lg:h-[88vh] overflow-hidden bg-black select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Cinematic Backdrops with Apple TV Crossfade */}
      {carouselItems.map((item, idx) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-out ${idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
        >
          <img
            src={getBackdropUrl(item.backdrop_path, 'original')}
            alt={item.title || item.name}
            className="w-full h-full object-cover object-[center_20%] scale-100 transform transition-transform duration-10000 ease-out"
            loading={idx === 0 ? 'eager' : 'lazy'}
          />

          {/* Apple TV Vignette & Bottom Mask Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent w-full lg:w-3/5" />
          <div className="absolute inset-0 bg-radial-vignette opacity-70 pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-black/80 to-transparent" />
        </div>
      ))}

      {/* Hero Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-2xl animate-fade-in">
          {/* Apple Original Badge */}


          {/* Cinematic Large Title */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2 sm:mb-3 font-display drop-shadow-lg">
            {title}
          </h1>

          {/* Tagline / Overview */}
          <p className="text-zinc-300 text-xs sm:text-base line-clamp-2 sm:line-clamp-3 mb-4 sm:mb-6 leading-relaxed max-w-xl font-normal drop-shadow">
            {current.overview || "Experience this critically acclaimed title in ultra-high definition with immersive spatial audio on Netplix."}
          </p>

          {/* Apple Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            {/* Primary Action: Solid White Pill */}
            <button
              onClick={handleWatchNow}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 bg-white hover:bg-[#e5e5ea] text-black font-bold px-5 sm:px-7 py-3 sm:py-3.5 rounded-full text-xs sm:text-base transition-all duration-200 shadow-apple-button active:scale-95"
            >
              <Play className="w-4 h-4 fill-black ml-0.5" />
              <span>Stream Now</span>
            </button>

            {/* Secondary Action: Apple Frosted Glass Pill */}
            <button
              onClick={handleDetails}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 sm:gap-2 bg-white/[0.12] hover:bg-white/[0.22] text-white font-medium px-4 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs sm:text-base border border-white/[0.18] backdrop-blur-2xl transition-all duration-200 active:scale-95"
            >
              <Info className="w-4 h-4 text-zinc-300" />
              <span>Details</span>
            </button>

            {/* Watchlist Quick Toggle: Circle Glass Pill */}
            <button
              onClick={handleWatchlist}
              className={`w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-full border backdrop-blur-2xl flex items-center justify-center transition-all duration-200 active:scale-90 ${inWatchlist
                ? 'bg-white text-black border-white shadow-apple-button'
                : 'bg-white/[0.12] text-white hover:bg-white/[0.22] border-white/[0.18]'
                }`}
              title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            >
              {inWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile iOS Page Indicator Dots */}
          <div className="flex lg:hidden items-center gap-1.5 mt-4">
            {carouselItems.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentIndex
                    ? 'w-5 h-1.5 bg-white shadow-sm'
                    : 'w-1.5 h-1.5 bg-white/35'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Apple TV Thumbnail Preview Dock (Bottom Right) */}
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

        {/* Mobile / Tablet Minimal Progress Dots */}
        <div className="lg:hidden flex items-center justify-center gap-1.5 mt-6 z-30">
          {carouselItems.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex
                ? 'w-6 bg-white shadow-sm'
                : 'w-2 bg-white/30 hover:bg-white/60'
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

