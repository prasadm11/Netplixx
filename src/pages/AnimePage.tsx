import React, { useState, useEffect } from 'react';
import { Sparkles, Flame, Star, Play, Film, Tv, Compass, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import MovieRow from '../components/MovieRow';
import MediaCard from '../components/MediaCard';
import { 
  fetchAnimeTrending, 
  fetchAnimePopular, 
  fetchAnimeTopRated, 
  fetchAnimeMovies, 
  fetchAnimeAiring,
  getBackdropUrl 
} from '../services/tmdb';
import { MediaItem } from '../types';

const AnimePage: React.FC = () => {
  const [trending, setTrending] = useState<MediaItem[]>([]);
  const [airing, setAiring] = useState<MediaItem[]>([]);
  const [topRated, setTopRated] = useState<MediaItem[]>([]);
  const [movies, setMovies] = useState<MediaItem[]>([]);
  const [popularGrid, setPopularGrid] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroAnime, setHeroAnime] = useState<MediaItem | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadAnimeData = async () => {
      setLoading(true);
      try {
        const [trendRes, airRes, topRes, movRes, popRes] = await Promise.all([
          fetchAnimeTrending(1),
          fetchAnimeAiring(1),
          fetchAnimeTopRated(1),
          fetchAnimeMovies(1),
          fetchAnimePopular(1)
        ]);

        setTrending(trendRes);
        setAiring(airRes);
        setTopRated(topRes);
        setMovies(movRes);
        setPopularGrid(popRes.results);

        if (trendRes.length > 0) {
          setHeroAnime(trendRes[0]);
        }
      } catch (err) {
        console.error('Failed to load anime data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnimeData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-9 h-9 text-[#2997ff] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070a] text-white pb-24">
      {/* 1. Cinematic Hero Billboard for Featured Anime (Movy style) */}
      {heroAnime && (
        <div className="relative min-h-[65vh] sm:min-h-[75vh] w-full overflow-hidden flex items-end">
          {/* Backdrop Image */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 scale-105 transform-gpu"
            style={{
              backgroundImage: `url(${getBackdropUrl(heroAnime.backdrop_path || heroAnime.poster_path, 'original')})`
            }}
          />

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070a] via-[#05070a]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#05070a] via-[#05070a]/40 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16 w-full">
            <div className="max-w-2xl space-y-3">
              {/* Badge Strip */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#2997ff] text-black text-xs font-black uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Featured Anime
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-black/60 border border-white/20 text-white text-xs font-bold backdrop-blur-md">
                  Sub & Dub
                </span>
                {heroAnime.vote_average > 0 && (
                  <span className="flex items-center gap-1 text-xs text-amber-300 font-bold px-2 py-0.5 bg-black/60 rounded-full border border-white/10 backdrop-blur-md">
                    <Star className="w-3.5 h-3.5 fill-amber-300" />
                    {heroAnime.vote_average.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl font-black text-white font-display tracking-tight leading-none drop-shadow-lg">
                {heroAnime.name || heroAnime.title}
              </h1>

              {/* Overview */}
              <p className="text-xs sm:text-sm text-zinc-300 line-clamp-3 leading-relaxed drop-shadow-md">
                {heroAnime.overview || 'Explore the world of Japanese anime streaming in cinema-grade high definition.'}
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3 pt-2">
                <Link
                  to={heroAnime.media_type === 'movie' ? `/watch/movie/${heroAnime.id}` : `/watch/tv/${heroAnime.id}/1/1`}
                  className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-sm flex items-center gap-2 shadow-apple-button hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-black ml-0.5" />
                  <span>Watch Now</span>
                </Link>

                <Link
                  to={heroAnime.media_type === 'movie' ? `/movie/${heroAnime.id}` : `/series/${heroAnime.id}`}
                  className="px-5 py-3 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-sm backdrop-blur-xl border border-white/20 transition-all"
                >
                  More Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Content Shelves */}
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-14 px-4 sm:px-6 lg:px-8 mt-6">
        {/* Top Airing Anime */}
        {airing.length > 0 && (
          <MovieRow
            title="Now Airing Anime"
            subtitle="Current broadcast episodes fresh from Japan"
            items={airing}
          />
        )}

        {/* Trending Anime */}
        {trending.length > 0 && (
          <MovieRow
            title="Trending Anime"
            subtitle="Most watched series across the community"
            items={trending}
          />
        )}

        {/* Anime Feature Films */}
        {movies.length > 0 && (
          <MovieRow
            title="Anime Feature Films"
            subtitle="Blockbuster animated cinematic masterpieces"
            items={movies}
          />
        )}

        {/* Top Rated All-Time */}
        {topRated.length > 0 && (
          <MovieRow
            title="Legendary & Top-Rated"
            subtitle="Highest rated anime of all time"
            items={topRated}
          />
        )}

        {/* 3. Popular Anime Catalog Grid */}
        <section className="pt-6 border-t border-white/10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">
                All Popular Anime
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                Browse our complete anime catalog
              </p>
            </div>
            <Link
              to="/browse/anime"
              className="text-xs font-semibold text-[#2997ff] hover:underline flex items-center gap-1"
            >
              <span>Advanced Filter</span>
              <Compass className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5">
            {popularGrid.map(item => (
              <MediaCard
                key={item.id}
                item={{ ...item, media_type: item.media_type || 'tv' }}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnimePage;
