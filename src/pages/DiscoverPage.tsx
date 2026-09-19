import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  X
} from 'lucide-react';
import { fetchDiscoverMedia } from '../services/tmdb';
import { getProvidersForRegion, WatchProviderItem } from '../constants/providers';
import { getRegion } from '../services/storage';
import { MediaItem } from '../types';
import MediaCard from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/Skeletons';

const GENRES_MOVIE = [
  { id: 'all', name: 'All' },
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '14', name: 'Fantasy' },
  { id: '27', name: 'Horror' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' }
];

const GENRES_TV = [
  { id: 'all', name: 'All' },
  { id: '10759', name: 'Action & Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10765', name: 'Sci-Fi & Fantasy' },
  { id: '9648', name: 'Mystery' }
];

const QUICK_MOODS = [
  { id: '', label: 'All' },
  { id: 'quick', label: 'Quick Watch' },
  { id: 'mystery', label: 'Mind-Bending' },
  { id: 'comedy', label: 'Feel-Good' },
  { id: 'romance', label: 'Romance' },
  { id: 'scary', label: 'Late Night' }
];

const YEARS = ['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2015', '2010', '2000'];

const LANGUAGES = [
  { code: 'all', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'kn', name: 'Kannada' },
  { code: 'ko', name: 'Korean' },
  { code: 'ja', name: 'Japanese' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentRegion, setCurrentRegion] = useState(() => getRegion());
  const channelsRowRef = useRef<HTMLDivElement>(null);

  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
  const provider = searchParams.get('provider') || 'all';
  const genre = searchParams.get('genre') || 'all';
  const mood = searchParams.get('mood') || '';
  const year = searchParams.get('year') || '';
  const rating = searchParams.get('rating') || '';
  const runtime = searchParams.get('runtime') || '';
  const language = searchParams.get('language') || 'all';
  const sort = searchParams.get('sort') || 'popularity.desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Regional provider list
  const regionalProviders = getProvidersForRegion(currentRegion);

  // Listen for region changes from Settings
  useEffect(() => {
    const handleRegionChanged = (e: any) => {
      const newRegion = e.detail?.region || getRegion();
      setCurrentRegion(newRegion);
    };
    window.addEventListener('region-changed', handleRegionChanged);
    window.addEventListener('storage', handleRegionChanged);
    return () => {
      window.removeEventListener('region-changed', handleRegionChanged);
      window.removeEventListener('storage', handleRegionChanged);
    };
  }, []);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === 'all') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
    next.set('page', '1');
    setSearchParams(next);
  };

  const handleTypeChange = (newType: 'movie' | 'tv') => {
    const next = new URLSearchParams();
    next.set('type', newType);
    if (provider && provider !== 'all') next.set('provider', provider);
    setSearchParams(next);
  };

  const handleReset = () => {
    setSearchParams({ type });
  };

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetchDiscoverMedia({
      mediaType: type,
      provider: provider !== 'all' ? provider : undefined,
      genre: genre !== 'all' ? genre : undefined,
      year: year || undefined,
      rating: rating || undefined,
      runtime: runtime || undefined,
      language: language !== 'all' ? language : undefined,
      mood: mood || undefined,
      sortBy: sort,
      page
    })
      .then(res => {
        if (!isCancelled) {
          setItems(res.results);
          setTotalPages(Math.min(res.total_pages, 500));
          setLoading(false);
        }
      })
      .catch(err => {
        if (!isCancelled) {
          console.error('Failed to discover media:', err);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [type, provider, genre, mood, year, rating, runtime, language, sort, page, currentRegion]);

  const currentGenres = type === 'tv' ? GENRES_TV : GENRES_MOVIE;
  const hasActiveFilters = 
    (genre !== 'all') || 
    (provider !== 'all') || 
    Boolean(mood) || 
    Boolean(year) || 
    Boolean(rating) || 
    Boolean(runtime) || 
    (language !== 'all');

  const activeProvider = regionalProviders.find(p => String(p.id) === String(provider));
  const activeGenre = currentGenres.find(g => g.id === genre);
  const activeMood = QUICK_MOODS.find(m => m.id === mood);

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Apple TV Header with Title and Segmented Switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-display">
              Discover
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1 font-normal">
              Explore films and series by channel, genre, rating, and runtime.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            {/* Apple TV Minimalist Segmented Switcher */}
            <div className="inline-flex items-center bg-white/[0.08] backdrop-blur-2xl p-1 rounded-full border border-white/[0.1] shadow-apple-glass">
              <button
                onClick={() => handleTypeChange('movie')}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all duration-200 ${
                  type === 'movie'
                    ? 'bg-white text-black shadow-apple-button'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => handleTypeChange('tv')}
                className={`px-5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all duration-200 ${
                  type === 'tv'
                    ? 'bg-white text-black shadow-apple-button'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                TV Shows
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="text-xs text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors backdrop-blur-xl"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* 1. Apple TV Streaming Channels Strip */}
        <div className="mb-6">
          <div
            ref={channelsRowRef}
            className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-0.5 ios-scroll"
          >
            {/* All Channels Pill */}
            <button
              onClick={() => updateParam('provider', 'all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 border ${
                provider === 'all'
                  ? 'bg-white text-black border-white shadow-apple-button'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] text-zinc-400 hover:text-white border-white/[0.08]'
              }`}
            >
              All Channels
            </button>

            {/* Individual Channels with High-Res Brand Logos */}
            {regionalProviders.map((p) => {
              const isSelected = String(provider) === String(p.id);

              return (
                <button
                  key={p.id}
                  onClick={() => updateParam('provider', String(p.id))}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all duration-200 flex items-center gap-2 border ${
                    isSelected
                      ? 'bg-zinc-900 text-white shadow-lg scale-105'
                      : 'bg-white/[0.04] hover:bg-white/[0.09] text-zinc-300 border-white/[0.08] hover:border-white/20'
                  }`}
                  style={{
                    borderColor: isSelected ? p.brandColor : undefined,
                    boxShadow: isSelected ? `0 0 16px ${p.brandColor}35` : undefined
                  }}
                >
                  <img
                    src={p.logo}
                    alt={p.name}
                    className="w-4 h-4 object-contain rounded"
                    loading="lazy"
                  />
                  <span>{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Apple TV Dropdown Filters Strip */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mb-5">
          {/* Channel Dropdown */}
          <div className="relative">
            <select
              value={provider}
              onChange={e => updateParam('provider', e.target.value)}
              className="appearance-none bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/25 rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
            >
              <option value="all" className="bg-zinc-900 text-white">All Channels</option>
              {regionalProviders.map(p => (
                <option key={p.id} value={String(p.id)} className="bg-zinc-900 text-white">
                  {p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Year Filter */}
          <div className="relative">
            <select
              value={year}
              onChange={e => updateParam('year', e.target.value)}
              className="appearance-none bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/25 rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
            >
              <option value="" className="bg-zinc-900 text-white">All Years</option>
              {YEARS.map(y => (
                <option key={y} value={y} className="bg-zinc-900 text-white">{y}</option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Rating Filter */}
          <div className="relative">
            <select
              value={rating}
              onChange={e => updateParam('rating', e.target.value)}
              className="appearance-none bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/25 rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
            >
              <option value="" className="bg-zinc-900 text-white">All Ratings</option>
              <option value="8" className="bg-zinc-900 text-white">8.0+ Masterpiece</option>
              <option value="7" className="bg-zinc-900 text-white">7.0+ Recommended</option>
              <option value="6" className="bg-zinc-900 text-white">6.0+ Good Quality</option>
              <option value="5" className="bg-zinc-900 text-white">5.0+ Average & Above</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Runtime Filter (for movies) */}
          {type === 'movie' && (
            <div className="relative">
              <select
                value={runtime}
                onChange={e => updateParam('runtime', e.target.value)}
                className="appearance-none bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/25 rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
              >
                <option value="" className="bg-zinc-900 text-white">All Durations</option>
                <option value="90" className="bg-zinc-900 text-white">Under 90 Minutes</option>
                <option value="120" className="bg-zinc-900 text-white">Under 2 Hours</option>
                <option value="150" className="bg-zinc-900 text-white">Under 2.5 Hours</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Language Filter */}
          <div className="relative">
            <select
              value={language}
              onChange={e => updateParam('language', e.target.value)}
              className="appearance-none bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/25 rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
            >
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code} className="bg-zinc-900 text-white">
                  {l.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sort Filter */}
          <div className="relative sm:ml-auto">
            <select
              value={sort}
              onChange={e => updateParam('sort', e.target.value)}
              className="appearance-none bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/25 rounded-full px-4 py-2 pr-8 text-xs font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
            >
              <option value="popularity.desc" className="bg-zinc-900 text-white">Most Popular</option>
              <option value="vote_average.desc" className="bg-zinc-900 text-white">Highest Rated</option>
              <option value={type === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc'} className="bg-zinc-900 text-white">
                Newest Releases
              </option>
              <option value="revenue.desc" className="bg-zinc-900 text-white">Box Office Hits</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* 3. Apple TV Genre Pills Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 mb-5 ios-scroll">
          {currentGenres.map(g => {
            const active = (genre === g.id) || (genre === 'all' && g.id === 'all');
            return (
              <button
                key={g.id}
                onClick={() => updateParam('genre', g.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-normal transition-all duration-200 whitespace-nowrap border ${
                  active
                    ? 'bg-white text-black font-semibold border-white shadow-sm'
                    : 'bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white border-white/[0.08]'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>

        {/* 4. Active Filters Strip (Minimalist Apple TV Badges) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">Active:</span>

            {activeProvider && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                <img src={activeProvider.logo} alt="" className="w-3.5 h-3.5 object-contain rounded" />
                <span>{activeProvider.name}</span>
                <button
                  onClick={() => updateParam('provider', 'all')}
                  className="hover:text-zinc-400 ml-0.5"
                  aria-label="Remove channel filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {activeMood && activeMood.id && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                <span>{activeMood.label}</span>
                <button
                  onClick={() => updateParam('mood', '')}
                  className="hover:text-zinc-400 ml-0.5"
                  aria-label="Remove mood filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {genre !== 'all' && activeGenre && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                <span>{activeGenre.name}</span>
                <button
                  onClick={() => updateParam('genre', 'all')}
                  className="hover:text-zinc-400 ml-0.5"
                  aria-label="Remove genre filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {year && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                <span>{year}</span>
                <button
                  onClick={() => updateParam('year', '')}
                  className="hover:text-zinc-400 ml-0.5"
                  aria-label="Remove year filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {rating && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                <span>{rating}.0+ Rating</span>
                <button
                  onClick={() => updateParam('rating', '')}
                  className="hover:text-zinc-400 ml-0.5"
                  aria-label="Remove rating filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {runtime && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                <span>Under {runtime} min</span>
                <button
                  onClick={() => updateParam('runtime', '')}
                  className="hover:text-zinc-400 ml-0.5"
                  aria-label="Remove duration filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {language !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/[0.08] text-white border border-white/10">
                <span>{LANGUAGES.find(l => l.code === language)?.name || language}</span>
                <button
                  onClick={() => updateParam('language', 'all')}
                  className="hover:text-zinc-400 ml-0.5"
                  aria-label="Remove language filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleReset}
              className="text-xs text-[#2997ff] hover:underline font-medium ml-1"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Results Grid */}
        {loading ? (
          <MediaGridSkeleton count={18} />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-white/[0.08] rounded-3xl apple-glass p-8">
            <h3 className="text-lg font-bold text-white mb-1.5">No Titles Found</h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-5 font-normal">
              No matching titles found for the selected filters.
            </p>
            <button
              onClick={handleReset}
              className="bg-white hover:bg-[#e5e5ea] text-black font-semibold px-6 py-2 rounded-full text-xs shadow-apple-button"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
              {items.map(item => (
                <MediaCard key={`${item.media_type || type}-${item.id}`} item={item} />
              ))}
            </div>

            {/* Apple TV Minimalist Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-14">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParam('page', String(page - 1))}
                  className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] disabled:opacity-20 disabled:pointer-events-none text-white border border-white/10 transition-colors shadow-sm"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="text-xs font-semibold text-zinc-400 tracking-wide">
                  Page <span className="text-white font-bold">{page}</span> of <span className="text-white font-bold">{totalPages}</span>
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => updateParam('page', String(page + 1))}
                  className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] disabled:opacity-20 disabled:pointer-events-none text-white border border-white/10 transition-colors shadow-sm"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DiscoverPage;
