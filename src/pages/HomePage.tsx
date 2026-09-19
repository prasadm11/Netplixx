import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Film, Tv, Star, Clock, Sparkles, Play, Trash2, ChevronRight, Compass } from 'lucide-react';
import HeroCarousel from '../components/HeroCarousel';
import MovieRow from '../components/MovieRow';
import Top10Row from '../components/Top10Row';
import ContinueWatchingCard from '../components/ContinueWatchingCard';
import {
  fetchTrending,
  fetchTopRated,
  fetchNowPlaying,
  fetchSouthIndianBlockbusters,
  getImageUrl
} from '../services/tmdb';
import { getContinueWatching, removeContinueWatching, getRegion } from '../services/storage';
import { MediaItem, ContinueWatchingItem } from '../types';
import { GENRES } from '../constants/genres';
import { HeroSkeleton, MovieRowSkeleton } from '../components/Skeletons';

const HomePage: React.FC = () => {
  const [currentRegion, setCurrentRegion] = useState(() => getRegion());
  const [trendingAll, setTrendingAll] = useState<MediaItem[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<MediaItem[]>([]);
  const [trendingTv, setTrendingTv] = useState<MediaItem[]>([]);
  const [southMovies, setSouthMovies] = useState<MediaItem[]>([]);
  const [nowPlaying, setNowPlaying] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [continueWatching, setContinueWatching] = useState<ContinueWatchingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async (reg: string = getRegion()) => {
    setLoading(true);
    try {
      const isIndia = reg === 'IN';
      const [all, movies, tv, southOrSpecial, inTheatres, top] = await Promise.allSettled([
        fetchTrending('all'),
        fetchTrending('movie'),
        fetchTrending('tv'),
        isIndia ? fetchSouthIndianBlockbusters() : fetchTrending('movie'),
        fetchNowPlaying(reg),
        fetchTopRated('movie')
      ]);

      setTrendingAll(all.status === 'fulfilled' ? all.value : []);
      setTrendingMovies(movies.status === 'fulfilled' ? movies.value : []);
      setTrendingTv(tv.status === 'fulfilled' ? tv.value : []);
      setSouthMovies(southOrSpecial.status === 'fulfilled' ? southOrSpecial.value : []);
      setNowPlaying(inTheatres.status === 'fulfilled' ? inTheatres.value : []);
      setTopRated(top.status === 'fulfilled' ? top.value : []);
      setContinueWatching(getContinueWatching());
    } catch (e) {
      console.warn('Error loading homepage content from TMDB:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(currentRegion);

    const handleRegionChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ region: string }>;
      const newRegion = customEvent.detail?.region || getRegion();
      setCurrentRegion(newRegion);
      loadData(newRegion);
    };

    window.addEventListener('region-changed', handleRegionChange);
    window.addEventListener('storage', handleRegionChange);

    return () => {
      window.removeEventListener('region-changed', handleRegionChange);
      window.removeEventListener('storage', handleRegionChange);
    };
  }, []);

  const handleRemoveContinueWatching = (e: React.MouseEvent, id: number, mediaType: 'movie' | 'tv') => {
    e.preventDefault();
    e.stopPropagation();
    removeContinueWatching(id, mediaType);
    setContinueWatching(getContinueWatching());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-[#f5f5f7]">
        <HeroSkeleton />
        <div className="py-4">
          <MovieRowSkeleton title={currentRegion === 'IN' ? "Trending in India" : "Trending Now"} />
          <MovieRowSkeleton title={currentRegion === 'IN' ? "Popular Indian Web Series" : "Popular TV Series"} />
          <MovieRowSkeleton title={currentRegion === 'IN' ? "South Indian Cinema" : "Critically Acclaimed Cinema"} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      {/* Apple TV Full Bleed Billboard Carousel (Indian & Pan-India Cinema Spotlight) */}
      <HeroCarousel items={trendingAll} />

      {/* "Up Next" / Continue Watching (Apple TV Style Landscape Shelf matching reference image) */}
      {continueWatching.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-3 relative z-30">
          <div className="flex items-center justify-between mb-3 px-0.5">
            <Link
              to="/continue-watching"
              className="group/title inline-flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                Continue Watching
              </h2>
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover/title:translate-x-0.5 group-hover/title:text-white transition-all" />
            </Link>
          </div>

          <div className="flex items-stretch gap-3.5 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-0.5 ios-scroll">
            {continueWatching.map(item => (
              <ContinueWatchingCard
                key={`${item.mediaType}-${item.id}`}
                item={item}
                onRemove={(id, mediaType) => {
                  removeContinueWatching(id, mediaType);
                  setContinueWatching(getContinueWatching());
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* Movy Signature TOP 10 Showcase */}
      {trendingAll.length > 0 && (
        <Top10Row items={trendingAll} title="TOP 10 on Netplix" subtitle="The most watched titles streaming right now" />
      )}

      {/* Trending Movies */}
      {trendingMovies.length > 0 && (
        <MovieRow
          title="Trending Blockbusters"
          subtitle="The most popular films and major cinematic releases"
          items={trendingMovies}
          seeAllLink="/movies?sort=popularity.desc"
        />
      )}

      {/* Popular Web Series */}
      {trendingTv.length > 0 && (
        <MovieRow
          title="Binge-Worthy Series"
          subtitle="Acclaimed original dramas, thrillers, and comedies"
          items={trendingTv}
          seeAllLink="/series?sort=popularity.desc"
        />
      )}

      {/* South Indian Cinema (India) / Regional Spotlight (Global) */}
      {southMovies.length > 0 && (
        <MovieRow
          title={currentRegion === 'IN' ? 'South Indian Cinema' : 'Critically Acclaimed Cinema'}
          subtitle={
            currentRegion === 'IN'
              ? 'Top action spectacles, thrillers, and acclaimed stories'
              : 'Award-winning international storytelling and cinematic gems'
          }
          items={southMovies}
          seeAllLink={currentRegion === 'IN' ? '/movies?lang=te' : '/movies?sort=popularity.desc'}
        />
      )}

      {/* Now Playing in Theatres */}
      {nowPlaying.length > 0 && (
        <MovieRow
          title={
            currentRegion === 'IN'
              ? 'Now Playing in Indian Theatres'
              : currentRegion === 'US'
              ? 'Now Playing in US Theatres'
              : currentRegion === 'GB'
              ? 'Now Playing in UK Theatres'
              : 'Now Playing in Theatres'
          }
          subtitle="Recent theatrical premieres and current cinema releases"
          items={nowPlaying}
          seeAllLink="/movies?sort=primary_release_date.desc"
        />
      )}

      {/* Top Rated Masterpieces */}
      {topRated.length > 0 && (
        <MovieRow
          title="Top Rated Masterpieces"
          subtitle="Critically acclaimed award winners and all-time audience favorites"
          items={topRated}
          seeAllLink="/movies?sort=vote_average.desc"
        />
      )}

      {/* Apple TV+ Style Feature Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-3xl p-8 sm:p-12 apple-glass border border-white/[0.12] relative overflow-hidden shadow-modal">
          <div className="max-w-xl relative z-10">
            <span className="apple-badge text-[10px] px-2.5 py-1 rounded-md">
              4K HDR • Spatial Audio • Multi-Server
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-white mt-3 mb-3 font-display tracking-tight leading-tight">
              All Your Favorites in One Place. In 4K HDR.
            </h3>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-normal">
              Stream thousands of cinema releases and acclaimed series with high-speed streaming servers, Up Next watch tracking, and zero subscription fees.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/movies"
                className="bg-white hover:bg-[#e5e5ea] text-black font-semibold px-7 py-3 rounded-full text-sm transition-all shadow-apple-button hover:scale-105"
              >
                Explore Movies
              </Link>
              <Link
                to="/series"
                className="bg-white/[0.12] hover:bg-white/[0.2] text-white font-medium px-6 py-3 rounded-full text-sm transition-all border border-white/[0.15] backdrop-blur-xl"
              >
                Browse Series
              </Link>
            </div>
          </div>

          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l from-white/[0.04] to-transparent pointer-events-none" />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
