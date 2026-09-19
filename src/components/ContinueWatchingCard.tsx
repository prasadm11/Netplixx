import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Play, Plus, Check, Info, Clock, Trash2 } from 'lucide-react';
import { ContinueWatchingItem } from '../types';
import { getImageUrl } from '../services/tmdb';
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '../services/storage';

interface ContinueWatchingCardProps {
  item: ContinueWatchingItem;
  onRemove?: (id: number, mediaType: 'movie' | 'tv') => void;
  className?: string;
}

export const ContinueWatchingCard: React.FC<ContinueWatchingCardProps> = ({ item, onRemove, className = '' }) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const inWatchlist = isInWatchlist(item.id, item.mediaType);

  const watchLink = item.mediaType === 'tv'
    ? `/watch/tv/${item.id}/${item.season || 1}/${item.episode || 1}`
    : `/watch/movie/${item.id}`;

  const detailLink = item.mediaType === 'tv'
    ? `/tv/${item.id}`
    : `/movie/${item.id}`;

  // Compute total minutes, current minutes, and remaining time
  const totalMinutes = item.duration
    ? Math.round(item.duration / 60)
    : (item.mediaType === 'tv' ? 45 : 148);

  const percentage = Math.min(Math.max(item.progress || 10, 5), 100);
  const currentMinutes = Math.min(Math.round((percentage / 100) * totalMinutes), totalMinutes);
  const minutesLeft = Math.max(totalMinutes - currentMinutes, 1);

  const formatTimeLeft = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h > 0) {
      return `${h}hr ${m > 0 ? `${m}m` : ''} left`;
    }
    return `${m}m left`;
  };

  const handleToggleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (inWatchlist) {
      removeFromWatchlist(item.id, item.mediaType);
    } else {
      addToWatchlist({
        id: item.id,
        mediaType: item.mediaType,
        title: item.title,
        poster_path: item.poster_path,
        backdrop_path: item.backdrop_path,
        vote_average: 8.0
      });
    }
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(detailLink);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none group transition-all ${
        isHovered ? 'z-50' : 'z-10'
      } ${className || 'w-[240px] sm:w-80 md:w-[340px] shrink-0'}`}
    >
      {/* Resting Card View */}
      <div className="flex flex-col gap-2">
        {/* 16:9 Backdrop Container */}
        <div
          onClick={() => navigate(watchLink)}
          className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#161618] border border-white/[0.12] shadow-lg cursor-pointer active:scale-[0.98] transition-transform group/card"
        >
          <img
            src={getImageUrl(item.backdrop_path || item.poster_path, 'w780')}
            alt={item.title}
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Subtle dark vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

          {/* Centered Apple TV Play Pill */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white shadow-lg group-hover/card:scale-110 group-hover/card:bg-white group-hover/card:text-black transition-all duration-300">
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current ml-0.5" />
            </div>
          </div>

          {/* Remove Button for Mobile Quick Access */}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                onRemove(item.id, item.mediaType);
              }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-black/80 text-zinc-300 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all z-20 active:scale-90"
              title="Remove from history"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Integrated Slim Progress Bar at Bottom of Image */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/25">
            <div
              className="h-full bg-white transition-all duration-300"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Title and Time Remaining Below Card */}
        <div className="px-0.5">
          <h4 className="text-sm font-semibold text-white truncate tracking-tight">
            {item.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-zinc-400 mt-0.5 font-normal">
            <Clock className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <span>{formatTimeLeft(minutesLeft)}</span>
            {item.mediaType === 'tv' && (
              <span className="text-zinc-500">• S{item.season || 1}:E{item.episode || 1}</span>
            )}
          </div>
        </div>
      </div>

      {/* Apple TV Expanded Hover Focus Overlay Card (Desktop Only) */}
      {isHovered && (
        <div
          className="hidden sm:block absolute -top-2.5 -left-3 -right-3 z-50 bg-[#161618] border border-white/30 rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
          style={{
            boxShadow: '0 24px 48px -12px rgba(0, 0, 0, 0.95), 0 0 0 1px rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Top Video Backdrop Preview */}
          <div
            onClick={() => navigate(watchLink)}
            className="relative aspect-video w-full bg-black overflow-hidden cursor-pointer rounded-t-2xl"
          >
            <img
              src={getImageUrl(item.backdrop_path || item.poster_path, 'w780')}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Bottom Action Glass Panel */}
          <div className="p-3.5 sm:p-4 pb-4 bg-gradient-to-b from-[#1c1c20] to-[#121214] flex flex-col gap-3 rounded-b-2xl">
            {/* Control Buttons Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Play Button */}
                <button
                  onClick={() => navigate(watchLink)}
                  className="w-11 h-11 rounded-full bg-white hover:bg-[#e5e5ea] text-black flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-apple-button"
                  title="Resume Playing"
                >
                  <Play className="w-5 h-5 fill-black ml-0.5 text-black" />
                </button>

                {/* Add to Watchlist / In Watchlist Button */}
                <button
                  onClick={handleToggleWatchlist}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 border ${
                    inWatchlist
                      ? 'bg-white text-black border-white'
                      : 'bg-white/[0.15] hover:bg-white/[0.25] text-white border-white/15'
                  }`}
                  title={inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                >
                  {inWatchlist ? (
                    <Check className="w-5 h-5 stroke-[2.5]" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </button>

                {onRemove && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      onRemove(item.id, item.mediaType);
                    }}
                    className="w-9 h-9 rounded-full bg-white/[0.08] hover:bg-red-500/20 text-zinc-400 hover:text-red-400 flex items-center justify-center transition-colors border border-white/10"
                    title="Remove from history"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Info Button */}
              <button
                onClick={handleInfoClick}
                className="w-11 h-11 rounded-full bg-white/[0.15] hover:bg-white/[0.25] text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 border border-white/15"
                title="View Details"
              >
                <Info className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Bar & Time text (e.g. 47 of 148m) */}
            <div className="flex items-center gap-3 pt-1">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="text-xs font-medium text-zinc-300 whitespace-nowrap shrink-0">
                {currentMinutes} of {totalMinutes}m
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContinueWatchingCard;
