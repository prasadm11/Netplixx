import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ChevronRight as ChevronIcon } from 'lucide-react';
import { MediaItem } from '../types';
import MediaCard from './MediaCard';

interface MovieRowProps {
  title: string;
  items: MediaItem[];
  seeAllLink?: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

const MovieRow: React.FC<MovieRowProps> = ({ title, items, seeAllLink, subtitle, icon }) => {
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

  return (
    <section className="py-5 sm:py-7 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto group/row relative">
      {/* Shelf Header */}
      <div className="flex items-baseline justify-between mb-3 sm:mb-4">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-lg sm:text-2xl font-bold text-white tracking-tight font-display">
              {title}
            </h2>
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-zinc-400 mt-0.5 line-clamp-1">
              {subtitle}
            </p>
          )}
        </div>

        {seeAllLink && (
          <Link
            to={seeAllLink}
            className="flex items-center gap-1 text-xs sm:text-sm text-[#2997ff] hover:text-white font-medium transition-colors group/link shrink-0 ml-2"
          >
            <span>See All</span>
            <ChevronIcon className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Horizontal Scroll Shelf with Apple Glass Buttons */}
      <div className="relative -mx-2 px-2">
        {/* Scroll Left Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/15 hover:border-white items-center justify-center backdrop-blur-2xl opacity-0 group-hover/row:opacity-100 transition-all duration-300 shadow-apple-glass"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Card Scroll Track with Apple Padding */}
        <div
          ref={rowRef}
          className="flex items-stretch gap-3 sm:gap-4 lg:gap-5 overflow-x-auto no-scrollbar scroll-smooth py-2 sm:py-3 px-1 sm:px-2 ios-scroll"
        >
          {items.map(item => (
            <div
              key={`${item.media_type || 'item'}-${item.id}`}
              className="w-[130px] sm:w-44 md:w-48 lg:w-52 shrink-0"
            >
              <MediaCard item={item} />
            </div>
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-white text-white hover:text-black border border-white/15 hover:border-white items-center justify-center backdrop-blur-2xl opacity-0 group-hover/row:opacity-100 transition-all duration-300 shadow-apple-glass"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
};

export default MovieRow;

