import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles, Film, Tv, Layers, Globe } from 'lucide-react';
import { WATCH_PROVIDERS, WatchProviderItem, getProvidersForRegion } from '../constants/providers';
import { fetchByProvider } from '../services/tmdb';
import { getRegion } from '../services/storage';
import { MediaItem } from '../types';
import MediaCard from './MediaCard';
import { MediaCardSkeleton } from './Skeletons';

interface BrowseByProviderProps {
  className?: string;
}

const REGION_NAMES: Record<string, { label: string; flag: string }> = {
  IN: { label: 'India', flag: '🇮🇳' },
  US: { label: 'United States', flag: '🇺🇸' },
  GB: { label: 'United Kingdom', flag: '🇬🇧' },
  CA: { label: 'Canada', flag: '🇨🇦' },
  AU: { label: 'Australia', flag: '🇦🇺' },
  GLOBAL: { label: 'Global', flag: '🌐' }
};

const BrowseByProvider: React.FC<BrowseByProviderProps> = ({ className = '' }) => {
  const [currentRegion, setCurrentRegion] = useState(() => getRegion());
  const regionalProviders = getProvidersForRegion(currentRegion);
  const [selectedProvider, setSelectedProvider] = useState<WatchProviderItem>(
    () => regionalProviders[0] || WATCH_PROVIDERS[0]
  );
  const [mediaTypeFilter, setMediaTypeFilter] = useState<'all' | 'movie' | 'tv'>('all');
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const providerRowRef = useRef<HTMLDivElement>(null);
  const contentRowRef = useRef<HTMLDivElement>(null);

  // Listen for region changes from Settings
  useEffect(() => {
    const handleRegionChange = (e: any) => {
      const newRegion = e.detail?.region || getRegion();
      setCurrentRegion(newRegion);
      const updatedProviders = getProvidersForRegion(newRegion);
      setSelectedProvider(prev => {
        const stillExists = updatedProviders.find(p => p.id === prev.id);
        return stillExists || updatedProviders[0] || WATCH_PROVIDERS[0];
      });
    };

    window.addEventListener('region-changed', handleRegionChange);
    window.addEventListener('storage', handleRegionChange);
    return () => {
      window.removeEventListener('region-changed', handleRegionChange);
      window.removeEventListener('storage', handleRegionChange);
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;
    const loadProviderContent = async () => {
      setLoading(true);
      try {
        const data = await fetchByProvider(
          selectedProvider.id,
          selectedProvider.networkId,
          mediaTypeFilter,
          1
        );
        if (isCurrent) {
          setItems(data.slice(0, 16));
        }
      } catch (err) {
        console.error('Error loading provider items:', err);
        if (isCurrent) setItems([]);
      } finally {
        if (isCurrent) setLoading(false);
      }
    };

    loadProviderContent();
    return () => {
      isCurrent = false;
    };
  }, [selectedProvider, mediaTypeFilter, currentRegion]);

  const scrollProviders = (direction: 'left' | 'right') => {
    if (providerRowRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      providerRowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollContent = (direction: 'left' | 'right') => {
    if (contentRowRef.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      contentRowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const regionInfo = REGION_NAMES[currentRegion] || { label: currentRegion, flag: '🌐' };

  return (
    <section className={`py-6 sm:py-9 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 ${className}`}>
      {/* Apple TV Section Header */}
      <div className="flex items-end justify-between mb-4 sm:mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase bg-white/[0.08] border border-white/[0.12] text-white/90 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#2997ff]" />
              Streaming Channels
            </span>
            <Link
              to="/settings"
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2997ff]/15 border border-[#2997ff]/25 text-[#2997ff] hover:bg-[#2997ff]/25 transition-colors"
              title="Change Region & Content in Settings"
            >
              <span>{regionInfo.flag}</span>
              <span>{regionInfo.label} Catalog</span>
            </Link>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight font-display">
            Browse by Provider
          </h2>
          <p className="text-xs sm:text-sm text-[#86868b] mt-0.5 max-w-xl font-normal">
            Explore exclusive catalogs and originals available on {regionInfo.label} streaming services
          </p>
        </div>

        {/* Scroll Arrows for Provider Channels (Desktop) */}
        <div className="hidden sm:flex items-center gap-2">
          <button
            onClick={() => scrollProviders('left')}
            aria-label="Scroll providers left"
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-white text-zinc-300 hover:text-black border border-white/10 hover:border-white flex items-center justify-center transition-all active:scale-95 backdrop-blur-xl shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scrollProviders('right')}
            aria-label="Scroll providers right"
            className="w-9 h-9 rounded-full bg-black/60 hover:bg-white text-zinc-300 hover:text-black border border-white/10 hover:border-white flex items-center justify-center transition-all active:scale-95 backdrop-blur-xl shadow-sm"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Apple TV Channel Squircles (Horizontal Carousel) */}
      <div className="relative group/providers mb-7">
        <div
          ref={providerRowRef}
          className="flex items-start gap-3 sm:gap-4.5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 ios-scroll"
        >
          {regionalProviders.map((provider) => {
            const isSelected = selectedProvider.id === provider.id;

            return (
              <button
                key={provider.id}
                onClick={() => setSelectedProvider(provider)}
                className="group/tile flex-none flex flex-col items-center gap-2 cursor-pointer select-none transition-all duration-300 active:scale-95 focus:outline-none"
              >
                {/* Apple TV Channel Squircle */}
                <div
                  className={`w-[74px] h-[74px] sm:w-[88px] sm:h-[88px] md:w-[96px] md:h-[96px] rounded-2xl sm:rounded-[22px] p-3 sm:p-3.5 flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
                    isSelected
                      ? 'bg-zinc-900 shadow-2xl scale-105'
                      : 'bg-[#121216]/80 hover:bg-zinc-800/90 border border-white/[0.08] hover:border-white/25 hover:scale-105'
                  }`}
                  style={{
                    borderColor: isSelected ? provider.brandColor : undefined,
                    borderWidth: isSelected ? '2px' : '1px',
                    boxShadow: isSelected
                      ? `0 0 26px ${provider.brandColor}45, inset 0 0 16px ${provider.brandColor}20`
                      : undefined
                  }}
                >
                  {/* Ambient Brand Bloom */}
                  {isSelected && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${provider.bgGradient} pointer-events-none opacity-65`}
                    />
                  )}

                  {/* Channel High-Res Logo */}
                  <img
                    src={provider.logo}
                    alt={provider.name}
                    loading="lazy"
                    className={`w-full h-full object-contain relative z-10 transition-transform duration-300 filter ${
                      isSelected ? 'scale-110 drop-shadow-md' : 'opacity-80 group-hover/tile:opacity-100'
                    }`}
                  />

                  {/* Active Indicator Pip */}
                  {isSelected && (
                    <span
                      className="absolute bottom-1.5 w-1.5 h-1.5 rounded-full animate-pulse z-10"
                      style={{ backgroundColor: provider.brandColor }}
                    />
                  )}
                </div>

                {/* Channel Label */}
                <span
                  className={`text-[11px] sm:text-xs font-semibold text-center line-clamp-1 transition-colors duration-200 tracking-tight ${
                    isSelected ? 'text-white' : 'text-[#86868b] group-hover/tile:text-zinc-200'
                  }`}
                >
                  {provider.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Provider Showcase Shelf */}
      <div className="rounded-3xl p-4 sm:p-6 bg-gradient-to-b from-white/[0.04] to-black/50 border border-white/[0.08] backdrop-blur-2xl relative overflow-hidden shadow-modal">
        {/* Subtle Ambient Glow matching active channel color */}
        <div
          className="absolute -top-20 left-10 w-96 h-48 rounded-full blur-[110px] pointer-events-none opacity-20 transition-all duration-700"
          style={{ backgroundColor: selectedProvider.brandColor }}
        />

        {/* Shelf Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl p-1 bg-black/70 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden shadow-sm"
              style={{ borderColor: `${selectedProvider.brandColor}50` }}
            >
              <img
                src={selectedProvider.logo}
                alt={selectedProvider.name}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Featured on {selectedProvider.name}
                </h3>
              </div>
              <p className="text-[11px] sm:text-xs text-[#86868b] line-clamp-1 font-medium">
                {selectedProvider.description}
              </p>
            </div>
          </div>

          {/* Type Filter & View All */}
          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {/* Filter Pills (All / Movies / Series) */}
            <div className="flex items-center p-1 rounded-full bg-white/[0.06] border border-white/10 backdrop-blur-xl text-xs">
              <button
                onClick={() => setMediaTypeFilter('all')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  mediaTypeFilter === 'all'
                    ? 'bg-white text-black shadow-apple-button'
                    : 'text-[#86868b] hover:text-white'
                }`}
              >
                <Layers className="w-3 h-3 inline-block mr-1" />
                All
              </button>
              <button
                onClick={() => setMediaTypeFilter('movie')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  mediaTypeFilter === 'movie'
                    ? 'bg-white text-black shadow-apple-button'
                    : 'text-[#86868b] hover:text-white'
                }`}
              >
                <Film className="w-3 h-3 inline-block mr-1" />
                Movies
              </button>
              <button
                onClick={() => setMediaTypeFilter('tv')}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                  mediaTypeFilter === 'tv'
                    ? 'bg-white text-black shadow-apple-button'
                    : 'text-[#86868b] hover:text-white'
                }`}
              >
                <Tv className="w-3 h-3 inline-block mr-1" />
                Series
              </button>
            </div>

            {/* View All Button */}
            <Link
              to={`/provider/${selectedProvider.id}`}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.18] border border-white/12 text-white transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <span>See All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            {/* Content Row Arrows (Desktop) */}
            <div className="hidden md:flex items-center gap-1.5 ml-1">
              <button
                onClick={() => scrollContent('left')}
                aria-label="Scroll titles left"
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollContent('right')}
                aria-label="Scroll titles right"
                className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/[0.16] border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Content Carousel / Shelf */}
        <div className="relative">
          {loading ? (
            <div className="flex gap-4 overflow-hidden py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-[140px] sm:w-44 md:w-48 shrink-0">
                  <MediaCardSkeleton />
                </div>
              ))}
            </div>
          ) : items.length > 0 ? (
            <div
              ref={contentRowRef}
              className="flex items-stretch gap-3.5 sm:gap-4.5 overflow-x-auto no-scrollbar scroll-smooth py-2 px-0.5 ios-scroll"
            >
              {items.map((item) => (
                <div key={`${item.media_type || 'media'}-${item.id}`} className="w-[140px] sm:w-44 md:w-48 shrink-0">
                  <MediaCard item={item} showType={true} />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-[#86868b] text-sm">
              No titles currently available for this channel selection.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BrowseByProvider;
