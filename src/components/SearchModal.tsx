import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Film, Tv, Star, Loader2, ArrowUpRight } from 'lucide-react';
import { searchMulti, getImageUrl } from '../services/tmdb';
import { MediaItem } from '../types';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv'>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const timeout = setTimeout(async () => {
      const items = await searchMulti(query);
      setResults(items);
      setLoading(false);
    }, 250);

    return () => clearTimeout(timeout);
  }, [query]);

  if (!isOpen) return null;

  const filteredResults = results.filter(item => {
    if (filterType === 'all') return true;
    return item.media_type === filterType;
  });

  const handleSelect = (item: MediaItem) => {
    onClose();
    if (item.media_type === 'tv') {
      navigate(`/series/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 px-4 bg-black/75 backdrop-blur-xl animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-2xl bg-[#16161a]/95 border border-white/[0.14] rounded-3xl shadow-modal overflow-hidden z-10 backdrop-blur-3xl animate-scale-in">
        {/* Apple Spotlight Search Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.08] bg-white/[0.03]">
          <Search className="w-5 h-5 text-zinc-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Apple Originals, Movies, TV Shows..."
            className="flex-1 bg-transparent text-white placeholder-zinc-500 text-base font-medium focus:outline-none tracking-normal"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-[11px] bg-white/10 hover:bg-white/20 text-zinc-300 font-mono px-2 py-1 rounded-md border border-white/10 transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Filter Type Segmented Control */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-white/[0.06] bg-black/40">
          <span className="text-xs text-zinc-500 mr-1 font-medium">Category:</span>
          {(['all', 'movie', 'tv'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-all ${filterType === type
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
            >
              {type === 'all' ? 'All Titles' : type === 'movie' ? 'Movies' : 'TV Shows'}
            </button>
          ))}
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-14 text-zinc-400 gap-3">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-xs text-zinc-400 font-medium">Searching Netplix catalog...</span>
            </div>
          ) : query && filteredResults.length === 0 ? (
            <div className="text-center py-14 text-zinc-400">
              <p className="text-base font-semibold text-zinc-200">No results found for "{query}"</p>
              <p className="text-xs text-zinc-500 mt-1">Try checking for typos or searching by another title.</p>
            </div>
          ) : filteredResults.length > 0 ? (
            filteredResults.map(item => {
              const title = item.title || item.name;
              const year = (item.release_date || item.first_air_date || '').slice(0, 4);
              const isTv = item.media_type === 'tv';

              return (
                <div
                  key={`${item.media_type}-${item.id}`}
                  onClick={() => handleSelect(item)}
                  className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-white/[0.08] cursor-pointer group transition-all"
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={getImageUrl(item.poster_path, 'w200')}
                      alt={title}
                      className="w-12 h-16 object-cover rounded-xl bg-zinc-900 border border-white/10 shrink-0 group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-white transition-colors line-clamp-1">
                        {title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
                        <span className="apple-badge text-[9px] px-1.5 py-0.2 rounded font-medium">
                          {isTv ? 'Series' : 'Movie'}
                        </span>
                        {year && <span>{year}</span>}
                        {item.vote_average > 0 && (
                          <span className="flex items-center gap-1 text-amber-300 font-medium">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {item.vote_average.toFixed(1)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white text-zinc-400 group-hover:text-black flex items-center justify-center transition-all mr-2">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 px-4 text-center">
              <p className="text-[11px] text-zinc-500 uppercase tracking-widest font-semibold mb-3">
                Trending Now
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {['Severance', 'Ted Lasso', 'The Morning Show', 'Dune: Part Two', 'Slow Horses', 'Foundation'].map(s => (
                  <button
                    key={s}
                    onClick={() => setQuery(s)}
                    className="px-3.5 py-1.5 bg-white/[0.06] hover:bg-white/[0.14] border border-white/[0.08] hover:border-white/20 rounded-full text-xs font-medium text-zinc-300 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;

