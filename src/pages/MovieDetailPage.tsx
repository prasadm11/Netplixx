import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchMovieDetails, getImageUrl } from '../services/tmdb';
import { MovieDetail } from '../types';
import { isInWatchlist, addToWatchlist, removeFromWatchlist, getContinueWatching } from '../services/storage';
import AppleTvHero from '../components/AppleTvHero';
import TrailerModal from '../components/TrailerModal';
import MovieRow from '../components/MovieRow';
import { DetailSkeleton } from '../components/Skeletons';

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchMovieDetails(id);
        if (isMounted) {
          setMovie(data);
          setInWatchlist(isInWatchlist(data.id, 'movie'));
        }
      } catch (e) {
        console.warn('Failed to load movie details:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-white mb-2">Movie Not Found</h2>
        <p className="text-zinc-400 mb-6">The requested title could not be loaded.</p>
        <Link to="/" className="bg-white text-black font-semibold px-6 py-2.5 rounded-full shadow-apple-button">
          Back to Home
        </Link>
      </div>
    );
  }

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id, 'movie');
      setInWatchlist(false);
    } else {
      addToWatchlist({
        id: movie.id,
        mediaType: 'movie',
        title: movie.title || 'Movie',
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
      setInWatchlist(true);
    }
  };

  const handlePlay = () => {
    navigate(`/watch/movie/${movie.id}`);
  };

  const trailerKey = movie.trailers?.[0]?.key || null;
  const isContinueWatching = getContinueWatching().some(i => i.id === Number(id) && i.mediaType === 'movie');
  const playButtonText = isContinueWatching ? 'Resume Movie' : 'Play Movie';

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      {/* 1. CINEMATIC APPLE TV HERO WITH BACKGROUND TRAILER */}
      <AppleTvHero
        item={movie}
        mediaType="movie"
        trailerKey={trailerKey}
        inWatchlist={inWatchlist}
        onToggleWatchlist={handleWatchlist}
        onPlay={handlePlay}
        playButtonText={playButtonText}
        onOpenTrailerModal={() => setIsTrailerOpen(true)}
      />

      {/* 2. LOWER CONTENT SECTIONS */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-8 space-y-12">
        
        {/* Cast & Crew Carousel */}
        {movie.credits?.cast && movie.credits.cast.length > 0 && (
          <section className="pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-display">
                Cast & Crew
              </h3>
            </div>
            <div className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3">
              {movie.credits.cast.slice(0, 16).map(actor => (
                <Link
                  key={actor.id}
                  to={`/person/${actor.id}`}
                  className="w-28 sm:w-32 shrink-0 text-center group cursor-pointer block"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-full overflow-hidden bg-zinc-900 border border-white/10 mb-2.5 group-hover:border-white/40 transition-all shadow-apple-card group-hover:scale-105">
                    <img
                      src={getImageUrl(actor.profile_path, 'w200')}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <h5 className="text-xs font-semibold text-white truncate group-hover:text-[#2997ff] transition-colors">
                    {actor.name}
                  </h5>
                  <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                    {actor.character}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Real Movie Information & Details */}
        <section className="pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs text-zinc-400">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Genres
            </h4>
            <div className="flex flex-wrap gap-2">
              {movie.genres?.map((g: any) => (
                <Link
                  key={g.id || g}
                  to={`/movies?genre=${g.id || ''}`}
                  className="px-3 py-1 bg-white/[0.06] hover:bg-white/[0.14] text-zinc-300 hover:text-white border border-white/[0.08] rounded-full transition-colors"
                >
                  {g.name || g}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Release Date
            </h4>
            <p className="text-zinc-200 font-medium">
              {movie.release_date || 'N/A'}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Original Language
            </h4>
            <p className="text-zinc-200 font-medium uppercase">
              {movie.original_language || 'EN'}
            </p>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
              Audience Rating
            </h4>
            <p className="text-zinc-200 font-medium">
              {movie.vote_average ? `★ ${movie.vote_average.toFixed(1)} / 10` : 'Not Rated'} 
              {movie.vote_count ? ` (${movie.vote_count.toLocaleString()} votes)` : ''}
            </p>
          </div>
        </section>

        {/* Related / More Like This Shelf */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="pt-4 border-t border-white/[0.08]">
            <MovieRow
              title="More Like This"
              subtitle="Audience recommendations based on this title"
              items={movie.similar.results}
            />
          </div>
        )}
      </div>

      {/* Trailer Modal (for standalone fullscreen player) */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoKey={trailerKey}
        title={movie.title}
      />
    </div>
  );
};

export default MovieDetailPage;
