import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Trash2 } from 'lucide-react';
import { getContinueWatching, removeContinueWatching } from '../services/storage';
import { ContinueWatchingItem } from '../types';
import ContinueWatchingCard from '../components/ContinueWatchingCard';

const ContinueWatchingPage: React.FC = () => {
  const [items, setItems] = useState<ContinueWatchingItem[]>(() => getContinueWatching());

  const handleRemove = (id: number, mediaType: 'movie' | 'tv') => {
    removeContinueWatching(id, mediaType);
    setItems(getContinueWatching());
  };

  const handleClearAll = () => {
    if (window.confirm('Clear all Continue Watching progress?')) {
      localStorage.removeItem('netplix_continue_watching');
      localStorage.removeItem('cinejoy_continue_watching');
      setItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              Continue Watching
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Resume your unfinished movies and television episodes.
            </p>
          </div>

          {items.length > 0 && (
            <button
              onClick={handleClearAll}
              className="text-xs text-zinc-400 hover:text-red-400 border border-white/[0.12] hover:border-red-500/30 px-3.5 py-1.5 rounded-full transition-colors self-start sm:self-auto bg-white/[0.04]"
            >
              Clear History
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center border border-white/[0.08] rounded-3xl apple-glass shadow-apple-glass p-8">
            <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center text-zinc-400 mb-4 border border-white/10">
              <Clock className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No In-Progress Titles</h3>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
              When you start watching a movie or series, your playback progress will automatically appear here.
            </p>
            <Link
              to="/"
              className="bg-white hover:bg-[#e5e5ea] text-black font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-apple-button transition-all"
            >
              Discover Something to Watch
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
            {items.map(item => (
              <div key={`${item.mediaType}-${item.id}`} className="w-full">
                <ContinueWatchingCard
                  item={item}
                  onRemove={handleRemove}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContinueWatchingPage;
