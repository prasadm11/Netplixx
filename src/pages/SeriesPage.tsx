import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Tv, Loader2, ChevronDown } from 'lucide-react';
import MediaCard from '../components/MediaCard';
import { fetchTvShows, INDIAN_LANGUAGES } from '../services/tmdb';
import { MediaItem } from '../types';
import { GENRES } from '../constants/genres';
import { MediaGridSkeleton } from '../components/Skeletons';

const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017'];
const SORTS = [
  { label: 'Most Popular', value: 'popularity.desc' },
  { label: 'Highest Rated', value: 'vote_average.desc' },
  { label: 'Newest Air Date', value: 'first_air_date.desc' },
  { label: 'Most Voted', value: 'vote_count.desc' }
];

const SeriesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const genreParam = searchParams.get('genre') ? Number(searchParams.get('genre')) : undefined;
  const sortParam = searchParams.get('sort') || 'popularity.desc';
  const yearParam = searchParams.get('year') || '';
  const langParam = searchParams.get('lang') || 'all';

  const [series, setSeries] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [genreParam, sortParam, yearParam, langParam]);

  useEffect(() => {
    let isMounted = true;
    const loadSeries = async () => {
      setLoading(true);
      try {
        const data = await fetchTvShows(page, genreParam, sortParam, yearParam, langParam);
        if (isMounted) {
          if (page === 1) {
            setSeries(data.results);
          } else {
            setSeries(prev => [...prev, ...data.results]);
          }
          setTotalPages(data.totalPages);
        }
      } catch (e) {
        console.warn('Error loading series from TMDB:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadSeries();
    return () => {
      isMounted = false;
    };
  }, [page, genreParam, sortParam, yearParam, langParam]);

  const handleLanguageChange = (code: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (code && code !== 'all') {
      newParams.set('lang', code);
    } else {
      newParams.delete('lang');
    }
    setSearchParams(newParams);
  };

  const handleGenreChange = (gId: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (gId) {
      newParams.set('genre', gId);
    } else {
      newParams.delete('genre');
    }
    setSearchParams(newParams);
  };

  const handleSortChange = (sort: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('sort', sort);
    setSearchParams(newParams);
  };

  const handleYearChange = (year: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (year) {
      newParams.set('year', year);
    } else {
      newParams.delete('year');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🇮🇳</span>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
                Indian & Global TV Series
              </h1>
            </div>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Stream Indian original web series, acclaimed crime thrillers, and television dramas in 4K HDR.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Genre Filter */}
            <div className="relative">
              <select
                value={genreParam || ''}
                onChange={(e) => handleGenreChange(e.target.value)}
                className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
              >
                <option value="" className="bg-zinc-900 text-white">All Genres</option>
                {GENRES.map(g => (
                  <option key={g.id} value={g.id} className="bg-zinc-900 text-white">{g.name}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Year Filter */}
            <div className="relative">
              <select
                value={yearParam}
                onChange={(e) => handleYearChange(e.target.value)}
                className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
              >
                <option value="" className="bg-zinc-900 text-white">All Years</option>
                {YEARS.map(y => (
                  <option key={y} value={y} className="bg-zinc-900 text-white">{y}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Sort Order */}
            <div className="relative">
              <select
                value={sortParam}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] hover:border-white/30 rounded-2xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-zinc-200 focus:outline-none cursor-pointer backdrop-blur-xl transition-all"
              >
                {SORTS.map(s => (
                  <option key={s.value} value={s.value} className="bg-zinc-900 text-white">{s.label}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Indian Languages Selector Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-8">
          {INDIAN_LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                langParam === lang.code
                  ? 'bg-white text-black shadow-apple-button scale-105'
                  : 'bg-white/[0.06] hover:bg-white/[0.12] text-zinc-300 hover:text-white border border-white/[0.08]'
              }`}
            >
              {lang.name}
            </button>
          ))}
        </div>

        {/* Series Grid / Skeleton */}
        {loading && page === 1 ? (
          <MediaGridSkeleton count={18} />
        ) : series.length === 0 && !loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full bg-white/[0.06] flex items-center justify-center mb-4">
              <Tv className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No Series Found</h3>
            <p className="text-zinc-400 text-xs max-w-sm">
              Try changing the language, genre, or release year filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
            {series.map(item => (
              <MediaCard key={item.id} item={item} showType={false} />
            ))}
          </div>
        )}

        {/* Loading Spinner for Load More */}
        {loading && page > 1 && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 bg-black/60 px-5 py-3 rounded-full border border-white/10 backdrop-blur-xl shadow-lg">
              <Loader2 className="w-5 h-5 text-[#2997ff] animate-spin" />
              <span className="text-xs font-semibold text-zinc-300 tracking-wide">Loading more series...</span>
            </div>
          </div>
        )}

        {/* Load More Button */}
        {!loading && page < totalPages && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setPage(p => p + 1)}
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 px-8 py-3.5 rounded-full text-xs sm:text-sm font-semibold transition-all backdrop-blur-xl hover:scale-105 shadow-apple-glass"
            >
              Load More Series
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeriesPage;
