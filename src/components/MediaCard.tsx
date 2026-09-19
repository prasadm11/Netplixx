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
      className={`group flex flex-col cursor-pointer select-none ${className}`}
    >
      {/* Apple TV Squircle Poster with Parallax Focus State */}
      <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden bg-[#121215] border border-white/[0.08] transition-all duration-300 ease-out group-hover:scale-[1.04] group-hover:border-white/40 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)] group-hover:ring-1 group-hover:ring-white/20 active:scale-[0.98]">
        <img
          src={getImageUrl(item.poster_path, 'w500')}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60';
          }}
        />

        {/* Ambient Top & Bottom Shadow Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Top Left: Apple Frosted Star Rating Badge */}
        {rating && (
          <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
            <span className="bg-black/65 backdrop-blur-md text-amber-300 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10 shadow-sm">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-amber-400 text-amber-400" />
              {rating}
            </span>
          </div>
        )}

        {/* Center: Apple TV Play Button Overlay on Focus/Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/35 backdrop-blur-[1px]">
          <button
            onClick={handlePlayClick}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white text-black flex items-center justify-center shadow-apple-button hover:scale-110 active:scale-95 transition-transform"
            title="Stream Now"
            aria-label={`Play ${title}`}
          >
            <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black text-black ml-0.5" />
          </button>
        </div>

        {/* Bottom Right: Up Next (+) Action Button */}
        <button
          onClick={handleWatchlistClick}
          className={`absolute bottom-2.5 right-2.5 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full backdrop-blur-xl flex items-center justify-center transition-all active:scale-90 shadow-sm ${
            inWatchlist
              ? 'bg-white text-black shadow-apple-button'
              : 'bg-black/65 text-white hover:bg-white/25 border border-white/15'
          }`}
          title={inWatchlist ? 'In Up Next' : 'Add to Up Next'}
          aria-label={inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
        >
          {inWatchlist ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : <Plus className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Apple TV Clean Metadata (Outside the card, just like tvOS) */}
      <div className="mt-2.5 px-0.5">
        <h3 className="text-xs sm:text-sm font-semibold text-white/95 group-hover:text-white transition-colors truncate tracking-tight">
          {title}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] font-medium text-[#86868b] tracking-normal">
          <span>{year || '2024'}</span>
          <span>•</span>
          <span className="truncate">
            {isTv ? 'Series' : 'Feature'}
          </span>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline text-[9px] uppercase tracking-wider text-zinc-400 font-semibold px-1 py-0.2 rounded bg-white/[0.06] border border-white/10">
            4K HDR
          </span>
        </div>
      </div>
    </div>
  );
};

export default MediaCard;

