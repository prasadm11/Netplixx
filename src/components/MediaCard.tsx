import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Star, Plus, Check, Film, Tv } from 'lucide-react';
import { MediaItem } from '../types';
import { getImageUrl } from '../services/tmdb';
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '../services/storage';

interface MediaCardProps {
  item: MediaItem;
  className?: string;
  showType?: boolean;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, className = '', showType = true }) => {
  const navigate = useNavigate();
  const isTv = item.media_type === 'tv' || (!item.title && !!item.name);
  const title = item.title || item.name || 'Untitled';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const rating = item.vote_average ? item.vote_average.toFixed(1) : null;
  const mediaType: 'movie' | 'tv' = isTv ? 'tv' : 'movie';

  const [inWatchlist, setInWatchlist] = useState(() => isInWatchlist(item.id, mediaType));

  const handleClick = () => {
    if (isTv) {
      navigate(`/series/${item.id}`);
    } else {
      navigate(`/movie/${item.id}`);
    }
  };

  const handleWatchlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(item.id, mediaType);
      setInWatchlist(false);
    } else {
      addToWatchlist({
        id: item.id,
        mediaType,
        title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: item.vote_average,
        release_date: item.release_date || item.first_air_date
      });
      setInWatchlist(true);
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isTv) {
      navigate(`/watch/tv/${item.id}/1/1`);
    } else {
      navigate(`/watch/movie/${item.id}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative rounded-2xl overflow-hidden bg-[#121215] border border-white/[0.08] hover:border-white/30 transition-all duration-300 ease-out cursor-pointer hover:shadow-apple-card-hover hover:scale-[1.03] hover:-translate-y-1 ${className}`}
    >
      {/* Aspect Ratio 2/3 Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-black">
        <img
          src={getImageUrl(item.poster_path, 'w500')}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
          }}
        />

        {/* Ambient Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Apple Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
          <span className="apple-badge text-[9px] px-1.5 py-0.5 rounded font-bold text-white/90">
            4K UHD
          </span>
          {rating && (
            <span className="bg-black/60 backdrop-blur-md text-amber-300 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {rating}
            </span>
          )}
        </div>

        {/* Apple TV Play Hover Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
          <button
            onClick={handlePlayClick}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-apple-button hover:scale-110 active:scale-95 transition-transform"
            title="Play Title"
          >
            <Play className="w-5 h-5 fill-black text-black ml-0.5" />
          </button>
        </div>

        {/* Floating Quick Action: Up Next (+) */}
        <button
          onClick={handleWatchlistClick}
          className={`absolute bottom-2.5 right-2.5 z-20 w-8 h-8 rounded-full backdrop-blur-xl flex items-center justify-center transition-all ${
            inWatchlist
              ? 'bg-white text-black shadow-apple-button'
              : 'bg-black/60 text-white hover:bg-white/20 border border-white/15'
          }`}
          title={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          {inWatchlist ? <Check className="w-4 h-4 stroke-[2.5]" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>

      {/* Info Details Underneath */}
      <div className="p-3 bg-[#121215]">
        <h3 className="text-sm font-semibold text-white group-hover:text-white transition-colors line-clamp-1">
          {title}
        </h3>
        <div className="flex items-center justify-between mt-1 text-xs text-zinc-400">
          <span>{year || '2024'}</span>
          {showType && (
            <span className="text-[11px] font-medium text-zinc-400 flex items-center gap-1">
              {isTv ? <Tv className="w-3 h-3 text-[#2997ff]" /> : <Film className="w-3 h-3 text-[#2997ff]" />}
              {isTv ? 'Series' : 'Feature'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaCard;

