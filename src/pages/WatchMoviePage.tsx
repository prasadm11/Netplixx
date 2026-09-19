import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Film,
  Star,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Info,
  Plus,
  Check,
  Heart,
  Share2,
  Play,
  Sparkles,
  Volume2,
  Tv,
  Award,
  Globe,
  Clock,
  Shield,
  Eye,
  MessageSquare
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import MovieRow from '../components/MovieRow';
import TrailerModal from '../components/TrailerModal';
import { fetchMovieDetails, getImageUrl, getBackdropUrl } from '../services/tmdb';
import { isInWatchlist, addToWatchlist, removeFromWatchlist, isInFavorites, addToFavorites, removeFromFavorites } from '../services/storage';
import { MovieDetail, CastMember } from '../types';

const WatchMoviePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const load = async () => {
      setLoading(true);
      const data = await fetchMovieDetails(id);
      setMovie(data);
      if (data) {
        setInWatchlist(isInWatchlist(data.id, 'movie'));
        setInFavorites(isInFavorites(data.id, 'movie'));
      }
      setLoading(false);
    };

    load();
  }, [id]);

  const handleToggleWatchlist = () => {
    if (!movie) return;
    if (inWatchlist) {
      removeFromWatchlist(movie.id, 'movie');
      setInWatchlist(false);
    } else {
      addToWatchlist({
        id: movie.id,
        mediaType: 'movie',
        title: movie.title || 'Untitled',
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
      setInWatchlist(true);
    }
  };

  const handleToggleFavorites = () => {
    if (!movie) return;
    if (inFavorites) {
      removeFromFavorites(movie.id, 'movie');
      setInFavorites(false);
    } else {
      addToFavorites({
        id: movie.id,
        mediaType: 'movie',
        title: movie.title || 'Untitled',
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        vote_average: movie.vote_average,
        release_date: movie.release_date
      });
      setInFavorites(true);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Movie link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <Loader2 className="w-9 h-9 text-[#2997ff] animate-spin" />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-white mb-2 font-display">Movie Not Found</h2>
        <Link to="/movies" className="text-[#2997ff] hover:underline text-sm font-semibold">
          Browse All Movies
        </Link>
      </div>
    );
  }

  const primaryTrailer = movie.trailers && movie.trailers.length > 0 ? movie.trailers[0] : null;
  const castList = movie.credits?.cast || [];
  const directors = movie.credits?.crew?.filter((c: any) => c.job === 'Director') || [];
  const writers = movie.credits?.crew?.filter((c: any) => ['Screenplay', 'Writer'].includes(c.job)) || [];

  return (
    <div className="min-h-screen bg-[#05070a] text-[#f5f5f7] pt-2 sm:pt-20 pb-16 sm:pb-24 w-full max-w-full overflow-x-clip">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 w-full max-w-full">

        {/* Apple TV Minimalist Breadcrumb Navigation */}
        <nav className="flex items-center justify-between gap-3 mb-2 sm:mb-5 px-3.5 sm:px-0">
          {/* Mobile: Native Apple Pill Back & Playing Badge */}
          <div className="flex sm:hidden items-center justify-between w-full h-8">
            <Link
              to={`/movie/${movie.id}`}
              className="h-7 px-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/[0.12] backdrop-blur-xl text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-sm truncate max-w-[210px] transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5 -ml-1 text-zinc-400 shrink-0" />
              <span className="truncate">{movie.title}</span>
            </Link>
            <span className="px-2 py-0.5 rounded-full bg-[#0071e3]/20 border border-[#0071e3]/35 text-[#2997ff] text-[10px] font-bold tracking-wide shrink-0">
              Now Playing
            </span>
          </div>

          {/* Desktop: Full path breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 truncate text-xs text-zinc-400 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Discover</Link>
            <span className="text-zinc-600">›</span>
            <Link to="/movies" className="hover:text-white transition-colors">Movies</Link>
            <span className="text-zinc-600">›</span>
            <span className="text-zinc-300 truncate max-w-[260px]">{movie.title}</span>
            <span className="text-zinc-600">›</span>
            <span className="text-[#2997ff] font-semibold">Now Playing</span>
          </div>
        </nav>

        {/* Apple Cinema Video Player (Sticky on Mobile, Full-bleed Edge-to-Edge) */}
        <div className="sticky top-0 z-40 bg-[#05070a] pb-2 sm:pb-0 sm:static sm:z-auto sm:bg-transparent transition-all shadow-[0_12px_28px_rgba(0,0,0,0.9)] sm:shadow-none">
          <VideoPlayer
            tmdbId={movie.id}
            mediaType="movie"
            title={movie.title || 'Movie'}
            poster_path={movie.poster_path}
            backdrop_path={movie.backdrop_path}
            relatedItems={movie.similar?.results || movie.recommendations?.results || []}
          />
        </div>

        {/* Content chassis container with comfortable mobile padding */}
        <div className="px-3.5 sm:px-0">

        {/* Apple TV+ Movie Hero Presentation Chassis */}
        <div className="mt-2.5 sm:mt-8 rounded-2xl sm:rounded-3xl bg-[#121215]/75 sm:bg-[#121215]/85 backdrop-blur-3xl border border-white/[0.08] shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-3.5 sm:p-10 relative z-10 overflow-hidden">

          {/* Subtle Ambient Background Hue */}
          {movie.backdrop_path && (
            <div
              className="absolute -right-20 -top-20 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none"
              style={{
                backgroundImage: `url(${getBackdropUrl(movie.backdrop_path, 'w780')})`,
                backgroundSize: 'cover'
              }}
            />
          )}

          <div className="relative z-10">
            {/* Spec Bar Badges */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">
                Full HD
              </span>
              {movie.certification && (
                <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white/[0.08] border border-white/[0.12] text-[9px] sm:text-[10px] font-bold text-white uppercase">
                  {movie.certification}
                </span>
              )}
            </div>

            {/* Title, Year, Duration, Score */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-6 pb-4 sm:pb-6 border-b border-white/[0.08]">
              <div className="space-y-1 sm:space-y-2 max-w-3xl">
                <h1 className="text-lg sm:text-4xl lg:text-5xl font-bold sm:font-black text-white font-display tracking-tight leading-snug">
                  {movie.title}
                </h1>

                {movie.tagline && (
                  <p className="text-xs sm:text-base text-zinc-400 italic font-medium">
                    "{movie.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-zinc-400 font-medium pt-0.5 sm:pt-1">
                  {movie.release_date && (
                    <span>{movie.release_date.slice(0, 4)}</span>
                  )}
                  {movie.runtime ? (
                    <>
                      <span>•</span>
                      <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                    </>
                  ) : null}
                  {movie.vote_average > 0 && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-amber-300 font-bold bg-amber-400/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-400/20">
                        <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-amber-300" />
                        <span>{movie.vote_average.toFixed(1)} / 10</span>
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Apple TV Action Capsule Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-0">
                <button
                  onClick={handleToggleWatchlist}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-3 rounded-full text-xs font-semibold sm:font-bold active:scale-95 transition-all ${inWatchlist
                      ? 'bg-white text-black shadow-apple-button hover:bg-zinc-200'
                      : 'bg-white text-black hover:bg-zinc-200 shadow-apple-button'
                    }`}
                >
                  {inWatchlist ? <Check className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[3]" /> : <Plus className="w-3.5 sm:w-4 h-3.5 sm:h-4 stroke-[3]" />}
                  <span>{inWatchlist ? 'In Up Next' : 'Add to Up Next'}</span>
                </button>

                {primaryTrailer && (
                  <button
                    onClick={() => setTrailerKey(primaryTrailer.key)}
                    className="flex items-center gap-1.5 px-3 sm:px-5 py-2 sm:py-3 rounded-full text-xs font-medium sm:font-semibold bg-white/[0.08] hover:bg-white/[0.16] active:scale-95 text-white border border-white/[0.14] transition-all backdrop-blur-xl"
                  >
                    <Play className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-white" />
                    <span>Trailer</span>
                  </button>
                )}

                <button
                  onClick={handleToggleFavorites}
                  className={`p-2 sm:p-3 rounded-full border active:scale-95 transition-all text-xs ${inFavorites
                      ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-sm'
                      : 'bg-white/[0.08] hover:bg-white/[0.16] text-white border-white/[0.14]'
                    }`}
                  title="Favorite"
                >
                  <Heart className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${inFavorites ? 'fill-red-400' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 sm:p-3 bg-white/[0.08] hover:bg-white/[0.16] active:scale-95 text-white rounded-full border border-white/[0.14] transition-all"
                  title="Share link"
                >
                  <Share2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Storyline & Overview */}
            <div className="pt-3 sm:pt-6 max-w-4xl space-y-2 sm:space-y-4">
              <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
                Storyline
              </h3>
              <p className="text-xs sm:text-base text-zinc-300 leading-relaxed font-normal">
                {movie.overview || 'Experience this feature presentation in cinema quality 4K resolution on Netplix+.'}
              </p>

              {/* Genre Chips */}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {movie.genres.map((g: any) => (
                    <Link
                      key={g.id || g}
                      to={`/browse/movie?genre=${g.id || ''}`}
                      className="px-3.5 py-1 bg-white/[0.06] hover:bg-white/[0.12] rounded-full text-xs text-zinc-300 hover:text-white transition-colors border border-white/[0.08]"
                    >
                      {g.name || g}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Apple TV "Cast & Crew" Section */}
        {castList.length > 0 && (
          <div className="mt-10 sm:mt-14">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-display tracking-tight">
                  Cast & Crew
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  The talent behind this Apple TV presentation
                </p>
              </div>
            </div>

            <div className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3 scroll-smooth">
              {castList.slice(0, 14).map((actor: CastMember) => (
                <Link
                  key={actor.id}
                  to={`/person/${actor.id}`}
                  className="flex flex-col items-center text-center shrink-0 group w-24 sm:w-28"
                >
                  {/* Circular Portrait */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-zinc-800 border-2 border-white/10 group-hover:border-[#2997ff] transition-all shadow-md group-hover:scale-105 duration-300">
                    {actor.profile_path ? (
                      <img
                        src={getImageUrl(actor.profile_path, 'w200')}
                        alt={actor.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-500 font-bold text-base">
                        {actor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-white mt-2.5 truncate w-full group-hover:text-[#2997ff] transition-colors">
                    {actor.name}
                  </h4>
                  <p className="text-[11px] text-zinc-400 truncate w-full mt-0.5">
                    {actor.character || 'Cast'}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Apple TV "Information & Technical Specs" Card */}
        <div className="mt-10 sm:mt-14 rounded-3xl bg-[#101014]/60 backdrop-blur-2xl border border-white/[0.08] p-6 sm:p-8">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 mb-6 flex items-center gap-2">
            <Info className="w-4 h-4 text-[#2997ff]" />
            <span>Information & Specifications</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 text-xs">
            {directors.length > 0 && (
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Director</span>
                <span className="text-white font-semibold text-sm">
                  {directors.map((d: any) => d.name).join(', ')}
                </span>
              </div>
            )}

            {writers.length > 0 && (
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Screenplay</span>
                <span className="text-white font-semibold text-sm">
                  {writers.map((w: any) => w.name).slice(0, 2).join(', ')}
                </span>
              </div>
            )}

            <div>
              <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Audio</span>
              <span className="text-white font-semibold text-sm">
                Stereo / Multi-channel
              </span>
            </div>

            <div>
              <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Stream Quality</span>
              <span className="text-white font-semibold text-sm">
                Full HD 1080p
              </span>
            </div>

            {movie.status && (
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Status</span>
                <span className="text-white font-semibold text-sm">
                  {movie.status}
                </span>
              </div>
            )}

            {movie.revenue && movie.revenue > 0 ? (
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Box Office</span>
                <span className="text-white font-semibold text-sm">
                  ${(movie.revenue / 1000000).toFixed(1)}M USD
                </span>
              </div>
            ) : null}

            <div>
              <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Platform</span>
              <span className="text-white font-semibold text-sm">
                Netplix+ Apple Cinema Engine
              </span>
            </div>
          </div>
        </div>

        {/* Apple TV+ Included Experience Banner */}
        <div className="mt-8 rounded-2xl p-5 sm:p-6 bg-gradient-to-r from-blue-900/20 via-black/40 to-transparent border border-[#2997ff]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#2997ff]" />
              <span>Watch on all your Apple and Smart TV devices</span>
            </h4>
            <p className="text-xs text-zinc-400">
              Stream seamlessly on Apple TV, iPhone, iPad, Mac, and web browsers with synced watch progress.
            </p>
          </div>
          <Link
            to="/discover"
            className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors shrink-0 self-start sm:self-auto"
          >
            Explore Netplix+
          </Link>
        </div>

        {/* Similar Titles ("More to Watch") */}
        {movie.similar?.results && movie.similar.results.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <MovieRow
              title="More to Watch"
              subtitle="Films similar to this presentation"
              items={movie.similar.results}
            />
          </div>
        )}

        </div>
      </div>

      {trailerKey && (
        <TrailerModal
          isOpen={!!trailerKey}
          videoKey={trailerKey}
          title={movie.title}
          onClose={() => setTrailerKey(null)}
        />
      )}
    </div>
  );
};

export default WatchMoviePage;
