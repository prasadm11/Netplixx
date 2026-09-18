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
    <div className="min-h-screen bg-black text-[#f5f5f7] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
              My Library
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm mt-1">
              Your saved watchlist, favorite titles, and in-progress playback history.
            </p>
          </div>

          {/* Apple Segmented Tab Switcher */}
          <div className="flex items-center gap-1 bg-white/[0.06] p-1.5 rounded-full border border-white/[0.08] backdrop-blur-2xl self-start sm:self-auto shadow-apple-glass">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${activeTab === 'watchlist'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Watchlist ({watchlist.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${activeTab === 'favorites'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Favorites ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('continueWatching')}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${activeTab === 'continueWatching'
                  ? 'bg-white text-black shadow-sm'
                  : 'text-zinc-400 hover:text-white'
                }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Continue Watching ({continueWatching.length})</span>
            </button>
          </div>
        </div>

        {/* Continue Watching Tab Content */}
        {activeTab === 'continueWatching' ? (
          continueWatching.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-white/[0.08] rounded-3xl apple-glass shadow-apple-glass p-8">
              <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center text-zinc-400 mb-4 border border-white/10">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">No In-Progress Titles</h3>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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
            <div className="flex flex-col items-center justify-center py-24 text-center border border-white/[0.08] rounded-3xl apple-glass shadow-apple-glass p-8">
              <div className="w-16 h-16 rounded-full bg-white/[0.08] flex items-center justify-center text-zinc-400 mb-4 border border-white/10">
                {activeTab === 'watchlist' ? <Bookmark className="w-7 h-7" /> : <Heart className="w-7 h-7" />}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">
                Your {activeTab === 'watchlist' ? 'Watchlist' : 'Favorites list'} is empty
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-sm mb-6 leading-relaxed">
                Explore movies and series on Netplix and click "Add to Watchlist" or the heart icon to save them to your library.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/movies"
                  className="bg-white hover:bg-[#e5e5ea] text-black font-semibold px-6 py-2.5 rounded-full text-xs sm:text-sm shadow-apple-button transition-all"
                >
                  Browse Movies
                </Link>
                <Link
                  to="/series"
                  className="bg-white/[0.12] hover:bg-white/[0.2] text-white font-medium px-6 py-2.5 rounded-full text-xs sm:text-sm border border-white/[0.15] backdrop-blur-xl transition-all"
                >
                  Browse TV Shows
                </Link>
              </div>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
              {currentList.map(item => {
                const watchLink = item.mediaType === 'tv'
                  ? `/watch/tv/${item.id}/1/1`
                  : `/watch/movie/${item.id}`;
                const detailLink = item.mediaType === 'tv'
                  ? `/series/${item.id}`
                  : `/movie/${item.id}`;

                return (
                  <div
                    key={`${item.mediaType}-${item.id}`}
                    className="group relative rounded-2xl overflow-hidden bg-[#121215] border border-white/[0.08] hover:border-white/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-apple-card-hover"
                  >
                    <Link to={detailLink} className="block relative aspect-[2/3] bg-black overflow-hidden">
                      <img
                        src={getImageUrl(item.poster_path, 'w500')}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      />

                      {/* Quick Play Hover Button */}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            window.location.href = watchLink;
                          }}
                          className="w-11 h-11 rounded-full bg-white text-black flex items-center justify-center shadow-apple-button hover:scale-110 transition-transform"
                        >
                          <Play className="w-5 h-5 fill-black ml-0.5" />
                        </button>
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemove(item.id, item.mediaType);
                        }}
                        className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-black/70 hover:bg-red-500 text-white backdrop-blur-md transition-colors"
                        title="Remove from list"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </Link>

                    <div className="p-3">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-white transition-colors">
                        {item.title}
                      </h4>
                      <div className="flex items-center justify-between text-xs text-zinc-400 mt-1">
                        <span>{item.mediaType === 'tv' ? 'TV Series' : 'Movie'}</span>
                        {item.release_date && <span>{item.release_date.slice(0, 4)}</span>}
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

