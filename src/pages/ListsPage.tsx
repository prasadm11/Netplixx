import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, Clock, Trash2, Play, ArrowRight } from 'lucide-react';
import {
  getWatchlist,
  removeFromWatchlist,
  getFavorites,
  removeFromFavorites,
  getContinueWatching,
  removeContinueWatching
} from '../services/storage';
import { WatchlistItem, ContinueWatchingItem } from '../types';
import { getImageUrl } from '../services/tmdb';

import ContinueWatchingCard from '../components/ContinueWatchingCard';

const ListsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'favorites' | 'continueWatching'>('watchlist');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(() => getWatchlist());
  const [favorites, setFavorites] = useState<WatchlistItem[]>(() => getFavorites());
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>(() => getContinueWatching());

  const handleRemove = (id: number, mediaType: 'movie' | 'tv') => {
    if (activeTab === 'watchlist') {
      removeFromWatchlist(id, mediaType);
      setWatchlist(getWatchlist());
    } else if (activeTab === 'favorites') {
      removeFromFavorites(id, mediaType);
      setFavorites(getFavorites());
    } else {
      removeContinueWatching(id, mediaType);
      setContinueWatching(getContinueWatching());
    }
  };

  const currentList = activeTab === 'watchlist' ? watchlist : favorites;

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-20 sm:pt-28 pb-32 sm:pb-24">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              My Library
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Your saved watchlist, favorite titles, and in-progress playback history.
            </p>
          </div>

          {/* Apple Segmented Tab Switcher (Full Width Grid on Mobile, Flex on Desktop) */}
          <div className="w-full sm:w-auto grid grid-cols-3 sm:flex sm:items-center gap-1 bg-white/[0.06] p-1 sm:p-1.5 rounded-full border border-white/[0.08] backdrop-blur-2xl shadow-apple-glass">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide transition-all active:scale-95 text-center ${activeTab === 'watchlist'
                  ? 'bg-white text-black shadow-apple-button'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <Bookmark className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide transition-all active:scale-95 text-center ${activeTab === 'favorites'
                  ? 'bg-white text-black shadow-apple-button'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <Heart className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Favorites ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('continueWatching')}
              className={`flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-wide transition-all active:scale-95 text-center ${activeTab === 'continueWatching'
                  ? 'bg-white text-black shadow-apple-button'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate sm:hidden">Watching ({continueWatching.length})</span>
              <span className="truncate hidden sm:inline">Continue Watching ({continueWatching.length})</span>
            </button>
          </div>
        </div>

        {/* Continue Watching Tab Content */}
        {activeTab === 'continueWatching' ? (
          continueWatching.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center border border-white/[0.08] rounded-3xl apple-glass shadow-apple-glass p-6 sm:p-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/[0.08] flex items-center justify-center text-zinc-400 mb-4 border border-white/10">
                <Clock className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">No In-Progress Titles</h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
                When you play a movie or TV episode, your watch progress will be saved here automatically.
              </p>
              <Link
                to="/movies"
                className="bg-white hover:bg-[#e5e5ea] text-black font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-apple-button transition-all"
              >
                Browse Movies
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {continueWatching.map(item => (
                <div key={`${item.mediaType}-${item.id}`} className="w-full">
                  <ContinueWatchingCard
                    item={item}
                    onRemove={handleRemove}
                    className="w-full"
                  />
                </div>
              ))}
            </div>
          )
        ) : (
          /* Watchlist & Favorites Tabs */
          currentList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 sm:py-24 text-center border border-white/[0.08] rounded-3xl apple-glass shadow-apple-glass p-6 sm:p-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/[0.08] flex items-center justify-center text-zinc-400 mb-4 border border-white/10">
                {activeTab === 'watchlist' ? <Bookmark className="w-6 h-6 sm:w-7 sm:h-7" /> : <Heart className="w-6 h-6 sm:w-7 sm:h-7" />}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">
                Your {activeTab === 'watchlist' ? 'Watchlist' : 'Favorites list'} is empty
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
                Explore movies and series on Netplix and click "Add to Watchlist" or the heart icon to save them to your library.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/movies"
                  className="bg-white hover:bg-[#e5e5ea] text-black font-semibold px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm shadow-apple-button transition-all"
                >
                  Browse Movies
                </Link>
                <Link
                  to="/series"
                  className="bg-white/[0.12] hover:bg-white/[0.2] text-white font-medium px-5 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm border border-white/[0.15] backdrop-blur-xl transition-all"
                >
                  Browse TV Shows
                </Link>
              </div>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-5">
              {currentList.map(item => {
                const watchLink = item.mediaType === 'tv'
                  ? `/watch/tv/${item.id}/1/1`
                  : `/watch/movie/${item.id}`;
                const detailLink = item.mediaType === 'tv'
                  ? `/tv/${item.id}`
                  : `/movie/${item.id}`;

                return (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    className="group relative flex flex-col active:scale-[0.98] transition-transform duration-150"
                  >
                    {/* Poster Frame */}
                    <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#161618] border border-white/[0.10] shadow-md group-hover:border-white/30 group-hover:shadow-[0_12px_30px_rgba(0,0,0,0.8)] transition-all duration-300">
                      <Link to={detailLink} className="block w-full h-full">
                        <img
                          src={getImageUrl(item.poster_path, 'w500')}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                        {/* Subtle bottom gradient for badge legibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                      </Link>

                      {/* Media Type Badge (Top-Left) */}
                      <div className="absolute top-2 left-2 z-10 pointer-events-none">
                        <span className="px-1.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-bold text-white uppercase tracking-wider">
                          {item.mediaType === 'tv' ? 'TV' : 'Movie'}
                        </span>
                      </div>

                      {/* Remove Button (Top-Right) */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleRemove(item.id, item.mediaType);
                        }}
                        className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/65 hover:bg-red-500/90 text-white/80 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all active:scale-90 shadow-md"
                        title="Remove from list"
                        aria-label="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Quick Play Action Button (Center Hover on Desktop) */}
                      <div className="absolute inset-0 hidden sm:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 pointer-events-none">
                        <Link
                          to={watchLink}
                          className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-apple-button hover:scale-110 transition-transform pointer-events-auto"
                        >
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </Link>
                      </div>

                      {/* Mobile Quick Play Action Pill */}
                      <Link
                        to={watchLink}
                        className="sm:hidden absolute bottom-2 right-2 z-10 w-7 h-7 rounded-full bg-white text-black flex items-center justify-center shadow-md active:scale-90 transition-transform"
                        title="Play now"
                        aria-label="Play now"
                      >
                        <Play className="w-3.5 h-3.5 fill-black ml-0.5" />
                      </Link>
                    </div>

                    {/* Metadata Underneath Poster (Clean Apple TV Layout) */}
                    <div className="mt-2 px-0.5">
                      <Link to={detailLink} className="block">
                        <h4 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-[#2997ff] transition-colors leading-tight">
                          {item.title}
                        </h4>
                      </Link>
                      <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-1">
                        <span>{item.mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
                        {item.release_date && (
                          <span>{item.release_date.slice(0, 4)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ListsPage;

