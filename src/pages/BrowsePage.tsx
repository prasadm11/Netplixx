import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, Search, Star, Sparkles, Loader2, RotateCcw } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { fetchDiscoverMedia, fetchAnimePopular, fetchAnimeTrending } from '../services/tmdb';
import { WATCH_PROVIDERS } from '../constants/providers';
import { MediaItem } from '../types';

const GENRES_MOVIE = [
  { id: 'all', name: 'All Genres' },
  { id: '28', name: 'Action' },
  { id: '12', name: 'Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '14', name: 'Fantasy' },
  { id: '36', name: 'History' },
  { id: '27', name: 'Horror' },
  { id: '10402', name: 'Music' },
  { id: '9648', name: 'Mystery' },
  { id: '10749', name: 'Romance' },
  { id: '878', name: 'Sci-Fi' },
  { id: '53', name: 'Thriller' },
  { id: '10752', name: 'War' },
  { id: '37', name: 'Western' }
];

const GENRES_TV = [
  { id: 'all', name: 'All Genres' },
  { id: '10759', name: 'Action & Adventure' },
  { id: '16', name: 'Animation' },
  { id: '35', name: 'Comedy' },
  { id: '80', name: 'Crime' },
  { id: '99', name: 'Documentary' },
  { id: '18', name: 'Drama' },
  { id: '10751', name: 'Family' },
  { id: '10762', name: 'Kids' },
  { id: '9648', name: 'Mystery' },
  { id: '10763', name: 'News' },
  { id: '10764', name: 'Reality' },
  { id: '10765', name: 'Sci-Fi & Fantasy' },
  { id: '10766', name: 'Soap' },
  { id: '10767', name: 'Talk' },
  { id: '10768', name: 'War & Politics' },
  { id: '37', name: 'Western' }
];

const YEARS = ['All Years', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2015', '2010'];

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest Releases' },
  { value: 'revenue.desc', label: 'Box Office Hits' }
];

const RATINGS = [
  { value: '', label: 'Any Rating' },
  { value: '8.0', label: '8.0+ Rating' },
  { value: '7.0', label: '7.0+ Rating' },
  { value: '6.0', label: '6.0+ Rating' }
];

const BrowsePage: React.FC = () => {
  const { type = 'movie', id: providerRouteId } = useParams<{ type?: string; id?: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const providerParam = providerRouteId || searchParams.get('provider') || 'all';

  const currentType = type === 'tv' ? 'tv' : type === 'anime' ? 'anime' : 'movie';

  // Filters State
  const [selectedProvider, setSelectedProvider] = useState(providerParam);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [selectedYear, setSelectedYear] = useState('All Years');
  const [selectedSort, setSelectedSort] = useState('popularity.desc');
  const [selectedRating, setSelectedRating] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const genres = currentType === 'tv' ? GENRES_TV : GENRES_MOVIE;

  useEffect(() => {
    if (providerParam !== selectedProvider) {
      setSelectedProvider(providerParam);
      setPage(1);
    }
  }, [providerParam]);

  // Reset filters when switching type
  useEffect(() => {
    setSelectedGenre('all');
    setSelectedYear('All Years');
    setSelectedSort('popularity.desc');
    setSelectedRating('');
    setPage(1);
    setItems([]);
  }, [currentType]);

  // Load items
  useEffect(() => {
    const loadItems = async () => {
      if (page === 1) setLoading(true);
      else setLoadingMore(true);

      try {
        if (currentType === 'anime') {
          const res = await fetchAnimePopular(page);
          setItems(prev => page === 1 ? res.results : [...prev, ...res.results]);
          setTotalPages(res.totalPages);
        } else {
          const res = await fetchDiscoverMedia({
            mediaType: currentType,
            provider: selectedProvider !== 'all' ? selectedProvider : undefined,
            genre: selectedGenre !== 'all' ? selectedGenre : undefined,
            year: selectedYear !== 'All Years' ? selectedYear : undefined,
            sortBy: selectedSort,
            rating: selectedRating || undefined,
            page
          });
          setItems(prev => page === 1 ? res.results : [...prev, ...res.results]);
          setTotalPages(res.total_pages);
        }
      } catch (err) {
        console.error('Browse fetch error:', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    loadItems();
  }, [currentType, selectedProvider, selectedGenre, selectedYear, selectedSort, selectedRating, page]);

  const handleResetFilters = () => {
    setSelectedProvider('all');
    setSelectedGenre('all');
    setSelectedYear('All Years');
    setSelectedSort('popularity.desc');
    setSelectedRating('');
    setPage(1);
    setSearchParams({});
  };


  return (
    <div className="min-h-screen bg-[#05070a] text-white pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Type Selector Capsule (Movy style) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Browse & Filter
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Find exactly what you want to watch with real-time filtering
            </p>
          </div>

          {/* Segmented Type Switcher */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full bg-white/[0.06] border border-white/10 self-start md:self-auto backdrop-blur-xl">
            <button
              onClick={() => navigate('/browse/movie')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentType === 'movie'
                  ? 'bg-white text-black shadow-apple-button'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Movies
            </button>
            <button
              onClick={() => navigate('/browse/tv')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentType === 'tv'
                  ? 'bg-white text-black shadow-apple-button'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              TV Shows
            </button>
            <button
              onClick={() => navigate('/browse/anime')}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                currentType === 'anime'
                  ? 'bg-white text-black shadow-apple-button'
                  : 'text-zinc-300 hover:text-white hover:bg-white/10'
              }`}
            >
              Anime
            </button>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="my-6 p-4 sm:p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {/* Streaming Provider Dropdown */}
            {currentType !== 'anime' && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Provider
                </label>
                <select
                  value={selectedProvider}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedProvider(val);
                    setPage(1);
                    if (val !== 'all') {
                      setSearchParams({ provider: val });
                    } else {
                      setSearchParams({});
                    }
                  }}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#2997ff] cursor-pointer"
                >
                  <option value="all" className="bg-zinc-900 text-white">All Providers</option>
                  {WATCH_PROVIDERS.map(p => (
                    <option key={p.id} value={String(p.id)} className="bg-zinc-900 text-white">
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Genre Dropdown */}
            {currentType !== 'anime' && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => {
                    setSelectedGenre(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#2997ff] cursor-pointer"
                >
                  {genres.map(g => (
                    <option key={g.id} value={g.id} className="bg-zinc-900 text-white">
                      {g.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Year Dropdown */}
            {currentType !== 'anime' && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Release Year
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#2997ff] cursor-pointer"
                >
                  {YEARS.map(y => (
                    <option key={y} value={y} className="bg-zinc-900 text-white">
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Rating Dropdown */}
            {currentType !== 'anime' && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => {
                    setSelectedRating(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#2997ff] cursor-pointer"
                >
                  {RATINGS.map(r => (
                    <option key={r.value} value={r.value} className="bg-zinc-900 text-white">
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Dropdown */}
            {currentType !== 'anime' && (
              <div>
                <label className="block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Sort By
                </label>
                <select
                  value={selectedSort}
                  onChange={(e) => {
                    setSelectedSort(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-[#2997ff] cursor-pointer"
                >
                  {SORT_OPTIONS.map(s => (
                    <option key={s.value} value={s.value} className="bg-zinc-900 text-white">
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Filters Button */}
            <div className="flex items-end">
              <button
                onClick={handleResetFilters}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#2997ff] animate-spin" />
          </div>
        ) : items.length > 0 ? (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
              {items.map(item => (
                <MediaCard
                  key={`${item.id}-${item.media_type || currentType}`}
                  item={{ ...item, media_type: item.media_type || (currentType === 'movie' ? 'movie' : 'tv') }}
                />
              ))}
            </div>

            {/* Load More Button */}
            {page < totalPages && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={loadingMore}
                  className="px-8 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-extrabold text-xs tracking-wider uppercase transition-all shadow-apple-button hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {loadingMore ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading More...</span>
                    </div>
                  ) : (
                    'Load More Titles'
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.02] border border-white/10 rounded-3xl">
            <Filter className="w-10 h-10 text-zinc-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white">No Titles Found</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              No movies or series match the selected filter combination. Try resetting filters!
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-white text-black text-xs font-bold rounded-full shadow-apple-button hover:bg-zinc-200 transition-all"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowsePage;
