import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Play, Star, Sparkles } from 'lucide-react';
import { MediaItem } from '../types';
import { getImageUrl } from '../services/tmdb';

interface Top10RowProps {
  items: MediaItem[];
  title?: string;
  subtitle?: string;
}

const Top10Row: React.FC<Top10RowProps> = ({
  items,
  title = 'TOP 10 on Netplix',
  subtitle = 'The most watched titles right now'
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!items || items.length === 0) return null;

  const top10 = items.slice(0, 10);

  return (
    <section className="relative my-6 sm:my-12">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-4 sm:mb-5 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-1.5 h-5 sm:h-6 rounded-full bg-gradient-to-b from-[#2997ff] to-blue-600 shadow-[0_0_12px_rgba(41,151,255,0.6)]" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white font-display">
                {title}
              </h2>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#2997ff]/15 border border-[#2997ff]/30 text-[#2997ff] text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3" />
                Live
              </span>
            </div>
            {subtitle && (
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 line-clamp-1">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Scroll Controls */}
        <div className="hidden sm:flex items-center gap-1.5">
          <button
            onClick={() => scroll('left')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors border border-white/10"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Top 10 Horizontal Scrollable Carousel */}
      <div
        ref={rowRef}
        className="flex items-stretch gap-3 sm:gap-6 overflow-x-auto no-scrollbar px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 scroll-smooth ios-scroll"
      >
        {top10.map((item, index) => {
          const rank = index + 1;
          const isMovie = item.media_type === 'movie' || !item.name;
          const watchUrl = isMovie ? `/watch/movie/${item.id}` : `/watch/tv/${item.id}/1/1`;
          const detailUrl = isMovie ? `/movie/${item.id}` : `/series/${item.id}`;
          const displayTitle = item.title || item.name || 'Untitled';
          const releaseYear = (item.release_date || item.first_air_date || '').slice(0, 4);

          return (
            <div
              key={item.id}
              className="flex items-center shrink-0 group relative select-none w-[200px] sm:w-[260px]"
            >
              {/* Giant Stylized Rank Number */}
              <div className="relative -mr-4 sm:-mr-8 z-0 pointer-events-none select-none">
                <span
                  className="font-black text-[80px] sm:text-[130px] leading-none tracking-tighter transition-transform duration-300 group-hover:scale-105"
                  style={{
                    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    color: '#05070a',
                    WebkitTextStroke: '2px rgba(255, 255, 255, 0.35)',
                    textShadow: '0 8px 30px rgba(0, 0, 0, 0.9)'
                  }}
                >
                  {rank}
                </span>
              </div>

              {/* Poster Card */}
              <Link
                to={watchUrl}
                className="relative z-10 w-[130px] sm:w-[185px] aspect-[2/3] rounded-xl sm:rounded-[22px] overflow-hidden bg-zinc-900 border border-white/10 shadow-[0_15px_35px_rgba(0,0,0,0.8)] transition-all duration-300 group-hover:scale-[1.04] group-hover:border-[#2997ff]/60 group-hover:shadow-[0_20px_45px_rgba(41,151,255,0.25)] block active:scale-95"
              >
                {/* Poster Image */}
                <img
                  src={getImageUrl(item.poster_path, 'w500')}
                  alt={displayTitle}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />

                {/* Subtle vignette gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-40 transition-opacity" />

                {/* Hover Play Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl transform scale-75 group-hover:scale-100 transition-transform">
                    <Play className="w-5 h-5 fill-black ml-0.5" />
                  </div>
                </div>

                {/* Top Badge: MediaType */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-[9px] font-bold text-white uppercase tracking-wider">
                    {isMovie ? 'Film' : 'Series'}
                  </span>
                </div>

                {/* Bottom Metadata Info */}
                <div className="absolute bottom-0 inset-x-0 p-2.5 sm:p-3">
                  <p className="text-xs sm:text-sm font-bold text-white truncate drop-shadow-md">
                    {displayTitle}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-300 mt-1">
                    <span>{releaseYear}</span>
                    {item.vote_average > 0 && (
                      <span className="flex items-center gap-0.5 font-bold text-amber-300">
                        <Star className="w-2.5 h-2.5 fill-amber-300 text-amber-300" />
                        {item.vote_average.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Top10Row;
