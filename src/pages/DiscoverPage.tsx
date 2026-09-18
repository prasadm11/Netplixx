import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown, 
  RotateCcw,
  Film,
  Tv
} from 'lucide-react';
import { fetchDiscoverMedia } from '../services/tmdb';
import { MediaItem } from '../types';
import MediaCard from '../components/MediaCard';
import { MediaGridSkeleton } from '../components/Skeletons';

const GENRES_MOVIE = [
  { id: 'all', name: 'All Genres' },
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
  { id: 'all', name: 'All Genres' },
  { id: '10759', name: 'Action & Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10765', name: 'Sci-Fi & Fantasy' },
  { id: '9648', name: 'Mystery' }
];

const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];

const LANGUAGES = [
  { code: 'all', name: 'All Languages' },
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'ta', name: 'Tamil' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'ko', name: 'Korean' },
  { code: 'ja', name: 'Japanese' },
  { code: 'es', name: 'Spanish' }
];

const DiscoverPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = (searchParams.get('type') as 'movie' | 'tv') || 'movie';
  const genre = searchParams.get('genre') || 'all';
  const year = searchParams.get('year') || '';
  const rating = searchParams.get('rating') || '';
  const runtime = searchParams.get('runtime') || '';
  const language = searchParams.get('language') || 'all';
  const sort = searchParams.get('sort') || 'popularity.desc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

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
      genre: genre !== 'all' ? genre : undefined,
      year: year || undefined,
      rating: rating || undefined,
      runtime: runtime || undefined,
      language: language !== 'all' ? language : undefined,
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
  }, [type, genre, year, rating, runtime, language, sort, page]);

  const currentGenres = type === 'tv' ? GENRES_TV : GENRES_MOVIE;
  const hasActiveFilters = (genre !== 'all') || year || rating || runtime || (language !== 'all');

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title and Type Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Discover
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Explore films and series by genre, rating, and runtime in full 4K HDR.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Apple TV Segmented Switcher */}
            <div className="inline-flex items-center bg-white/[0.06] backdrop-blur-2xl p-1 rounded-full border border-white/[0.08] shadow-apple-glass">
              <button
                onClick={() => handleTypeChange('movie')}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all duration-300 flex items-center gap-1.5 ${
                  type === 'movie'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Movies</span>
              </button>
              <button
                onClick={() => handleTypeChange('tv')}
                className={`px-4 sm:px-5 py-1.5 rounded-full text-xs font-semibold tracking-normal transition-all duration-300 flex items-center gap-1.5 ${
                  type === 'tv'
                    ? 'bg-white text-black shadow-sm'
                    : 'text-zinc-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>TV Shows</span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 transition-colors backdrop-blur-xl"
                title="Reset all filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Apple Frosted Dropdowns Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 mb-6">
          {/* Year Filter */}
          <div className="relative">
            <select
              value={year}
              onChange={e => updateParam('year', e.target.value)}
              className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
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
              className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
            >
              <option value="" className="bg-zinc-900 text-white">Any Rating</option>
              <option value="5" className="bg-zinc-900 text-white">★ 5+ Stars</option>
              <option value="6" className="bg-zinc-900 text-white">★ 6+ Stars</option>
              <option value="7" className="bg-zinc-900 text-white">★ 7+ Stars (Top Rated)</option>
              <option value="8" className="bg-zinc-900 text-white">★ 8+ Stars (Masterpiece)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Runtime Filter (for movies) */}
          {type === 'movie' && (
            <div className="relative">
              <select
                value={runtime}
                onChange={e => updateParam('runtime', e.target.value)}
                className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
              >
                <option value="" className="bg-zinc-900 text-white">Any Duration</option>
                <option value="90" className="bg-zinc-900 text-white">≤ 90 mins (Quick Watch)</option>
                <option value="120" className="bg-zinc-900 text-white">≤ 2 hours</option>
                <option value="150" className="bg-zinc-900 text-white">≤ 2.5 hours</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          )}

          {/* Language Filter */}
          <div className="relative">
            <select
              value={language}
              onChange={e => updateParam('language', e.target.value)}
              className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
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
          <div className="relative ml-auto">
            <select
              value={sort}
              onChange={e => updateParam('sort', e.target.value)}
              className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
            >
              <option value="popularity.desc" className="bg-zinc-900 text-white">Most Popular</option>
              <option value="vote_average.desc" className="bg-zinc-900 text-white">Highest Rated</option>
              <option value={type === 'tv' ? 'first_air_date.desc' : 'primary_release_date.desc'} className="bg-zinc-900 text-white">
                Newest Releases
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Apple TV Horizontal Genre Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8">
          {currentGenres.map(g => {
            const active = (genre === g.id) || (genre === 'all' && g.id === 'all');
            return (
              <button
                key={g.id}
                onClick={() => updateParam('genre', g.id)}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-normal transition-all duration-300 whitespace-nowrap backdrop-blur-xl border ${
                  active
                    ? 'bg-white text-black font-semibold border-white shadow-sm'
                    : 'bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 hover:text-white border-white/[0.08] hover:border-white/20'
                }`}
              >
                {g.name}
              </button>
            );
          })}
        </div>

        {/* Results Grid */}
        {loading ? (
          <MediaGridSkeleton count={18} />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-white/[0.08] rounded-3xl apple-glass p-8">
            <Film className="w-12 h-12 text-zinc-500 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">No Titles Found</h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6">
              Try loosening your filters or resetting to view more titles in the catalog.
            </p>
            <button
              onClick={handleReset}
              className="bg-white hover:bg-[#e5e5ea] text-black font-semibold px-6 py-2.5 rounded-full text-xs shadow-apple-button"
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  disabled={page <= 1}
                  onClick={() => updateParam('page', String(page - 1))}
                  className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] disabled:opacity-30 disabled:pointer-events-none text-white border border-white/10 transition-colors shadow-sm"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-xs font-semibold text-zinc-400">
                  Page <span className="text-white">{page}</span> of <span className="text-white">{totalPages}</span>
                </span>

                <button
                  disabled={page >= totalPages}
                  onClick={() => updateParam('page', String(page + 1))}
                  className="p-2.5 rounded-full bg-white/[0.06] hover:bg-white/[0.14] disabled:opacity-30 disabled:pointer-events-none text-white border border-white/10 transition-colors shadow-sm"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
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
