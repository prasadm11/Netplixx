import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Tv,
  Star,
  Loader2,
  Info,
  ChevronDown,
  ChevronLeft,
  Play,
  Plus,
  Check,
  Heart,
  Share2,
  Sparkles,
  Layers,
  Award,
  Globe,
  Clock,
  Shield,
  Volume2
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import MovieRow from '../components/MovieRow';
import TrailerModal from '../components/TrailerModal';
import { fetchTvDetails, fetchSeasonDetails, getImageUrl, getBackdropUrl } from '../services/tmdb';
import { isInWatchlist, addToWatchlist, removeFromWatchlist, isInFavorites, addToFavorites, removeFromFavorites } from '../services/storage';
import { TvDetail, Season, CastMember } from '../types';

const WatchTvPage: React.FC = () => {
  const { id, season, episode } = useParams<{ id: string; season: string; episode: string }>();
  const navigate = useNavigate();

  const seasonNum = Number(season) || 1;
  const episodeNum = Number(episode) || 1;

  const [series, setSeries] = useState<TvDetail | null>(null);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [loading, setLoading] = useState(true);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [inFavorites, setInFavorites] = useState(false);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const loadSeries = async () => {
      setLoading(true);
      const data = await fetchTvDetails(id);
      setSeries(data);
      if (data) {
        setInWatchlist(isInWatchlist(data.id, 'tv'));
        setInFavorites(isInFavorites(data.id, 'tv'));
      }

      const sData = await fetchSeasonDetails(id, seasonNum);
      setSeasonData(sData);
      setLoading(false);
    };

    loadSeries();
  }, [id, seasonNum]);

  const handleToggleWatchlist = () => {
    if (!series) return;
    if (inWatchlist) {
      removeFromWatchlist(series.id, 'tv');
      setInWatchlist(false);
    } else {
      addToWatchlist({
        id: series.id,
        mediaType: 'tv',
        title: series.name || series.title || 'Untitled',
        poster_path: series.poster_path,
        backdrop_path: series.backdrop_path,
        vote_average: series.vote_average,
        release_date: series.first_air_date
      });
      setInWatchlist(true);
    }
  };

  const handleToggleFavorites = () => {
    if (!series) return;
    if (inFavorites) {
      removeFromFavorites(series.id, 'tv');
      setInFavorites(false);
    } else {
      addToFavorites({
        id: series.id,
        mediaType: 'tv',
        title: series.name || series.title || 'Untitled',
        poster_path: series.poster_path,
        backdrop_path: series.backdrop_path,
        vote_average: series.vote_average,
        release_date: series.first_air_date
      });
      setInFavorites(true);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert('Episode stream link copied to clipboard!');
    }
  };

  const handleSeasonSelect = async (s: number) => {
    navigate(`/watch/tv/${id}/${s}/1`);
  };

  const handleEpisodeSelect = (ep: number) => {
    navigate(`/watch/tv/${id}/${seasonNum}/${ep}`);
  };

  const episodes = seasonData?.episodes || [];
  const currentEpisodeObj = episodes.find(e => e.episode_number === episodeNum);

  const hasNextEpisode = episodeNum < episodes.length;
  const hasPrevEpisode = episodeNum > 1;

  const handleNextEpisode = () => {
    if (hasNextEpisode) {
      navigate(`/watch/tv/${id}/${seasonNum}/${episodeNum + 1}`);
    }
  };

  const handlePrevEpisode = () => {
    if (hasPrevEpisode) {
      navigate(`/watch/tv/${id}/${seasonNum}/${episodeNum - 1}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05070a] flex items-center justify-center">
        <Loader2 className="w-9 h-9 text-[#2997ff] animate-spin" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-[#05070a] flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-white mb-2 font-display">Series Not Found</h2>
        <Link to="/series" className="text-[#2997ff] hover:underline text-sm font-semibold">
          Browse All TV Shows
        </Link>
      </div>
    );
  }

  const title = series.name || series.title || 'TV Series';
  const primaryTrailer = series.trailers && series.trailers.length > 0 ? series.trailers[0] : null;
  const castList = series.credits?.cast || [];
  const creators = series.created_by || [];
  const networks = series.networks || [];

  return (
    <div className="min-h-screen bg-[#05070a] text-[#f5f5f7] pt-2 sm:pt-20 pb-16 sm:pb-24">
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">

        {/* Apple TV Minimalist Breadcrumb / Header Navigation */}
        <nav className="flex items-center justify-between gap-3 mb-2 sm:mb-5 px-3.5 sm:px-0">
          {/* Mobile: Native Apple Pill Back & Episode Badge */}
          <div className="flex sm:hidden items-center justify-between w-full h-8">
            <Link
              to={`/series/${series.id}`}
              className="h-7 px-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/[0.12] backdrop-blur-xl text-white text-[11px] font-semibold inline-flex items-center gap-1 shadow-sm truncate max-w-[210px] transition-all"
            >
              <ChevronLeft className="w-3.5 h-3.5 -ml-1 text-zinc-400 shrink-0" />
              <span className="truncate">{title}</span>
            </Link>
            <span className="px-2 py-0.5 rounded-full bg-[#0071e3]/20 border border-[#0071e3]/35 text-[#2997ff] text-[10px] font-bold tracking-wide shrink-0">
              S{seasonNum} • E{episodeNum}
            </span>
          </div>

          {/* Desktop: Full path breadcrumbs */}
          <div className="hidden sm:flex items-center gap-2 truncate text-xs text-zinc-400 font-medium">
            <Link to="/" className="hover:text-white transition-colors">Discover</Link>
            <span className="text-zinc-600">›</span>
            <Link to="/series" className="hover:text-white transition-colors">TV Shows</Link>
            <span className="text-zinc-600">›</span>
            <Link to={`/series/${series.id}`} className="text-zinc-300 hover:text-white transition-colors truncate max-w-[220px]">
              {title}
            </Link>
            <span className="text-zinc-600">›</span>
            <span className="text-[#2997ff] font-semibold">
              Season {seasonNum} • Episode {episodeNum}
            </span>
          </div>
        </nav>

        {/* Apple Cinema Video Player (Full-bleed Edge-to-Edge on Mobile) */}
        <VideoPlayer
          tmdbId={series.id}
          mediaType="tv"
          season={seasonNum}
          episode={episodeNum}
          title={title}
          poster_path={series.poster_path}
          backdrop_path={series.backdrop_path}
          episodeName={currentEpisodeObj?.name}
          hasNextEpisode={hasNextEpisode}
          hasPrevEpisode={hasPrevEpisode}
          onNextEpisode={handleNextEpisode}
          onPrevEpisode={handlePrevEpisode}
          episodes={episodes}
          seasons={series.seasons}
          onSelectEpisode={(s, ep) => navigate(`/watch/tv/${id}/${s}/${ep}`)}
          relatedItems={series.similar?.results || series.recommendations?.results || []}
        />

        {/* Content chassis container with comfortable mobile padding */}
        <div className="px-3.5 sm:px-0">

        {/* Main Episode Presentation Chassis & Episode Drawer */}
        <div className="mt-2.5 sm:mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 relative z-10">

          {/* Apple TV Hero Presentation Card (2 Cols) */}
          <div className="lg:col-span-2 rounded-2xl sm:rounded-3xl bg-[#121215]/75 sm:bg-[#121215]/85 backdrop-blur-3xl border border-white/[0.08] shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-3.5 sm:p-8 relative z-10 overflow-hidden flex flex-col justify-between">

            {/* Subtle Ambient Glow */}
            {series.backdrop_path && (
              <div
                className="absolute -right-20 -top-20 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none"
                style={{
                  backgroundImage: `url(${getBackdropUrl(series.backdrop_path, 'w780')})`,
                  backgroundSize: 'cover'
                }}
              />
            )}

            <div className="relative z-10">
              {/* Spec Badges */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5">
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-[#0071e3] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  S{seasonNum} • E{episodeNum}
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-white/[0.08] text-zinc-300 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider">
                  Full HD
                </span>
                {series.certification && (
                  <span className="px-1.5 sm:px-2 py-0.5 rounded-md bg-white/[0.12] text-[9px] sm:text-[10px] font-extrabold text-white">
                    {series.certification}
                  </span>
                )}
                {currentEpisodeObj?.vote_average ? (
                  <span className="flex items-center gap-1 text-[11px] sm:text-xs text-amber-300 font-bold bg-amber-400/10 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-400/20">
                    <Star className="w-2.5 sm:w-3 h-2.5 sm:h-3 fill-amber-300" />
                    <span>{currentEpisodeObj.vote_average.toFixed(1)}</span>
                  </span>
                ) : null}
              </div>

              {/* Title & Episode Headline */}
              <h1 className="text-lg sm:text-3xl font-bold sm:font-black text-white font-display tracking-tight leading-snug mt-1">
                {currentEpisodeObj?.name ? `${episodeNum}. ${currentEpisodeObj.name}` : `${title} — Episode ${episodeNum}`}
              </h1>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] sm:text-xs text-zinc-400 font-medium pt-1 sm:pt-2">
                <span className="text-white font-bold">{title}</span>
                {currentEpisodeObj?.air_date && (
                  <>
                    <span>•</span>
                    <span>{currentEpisodeObj.air_date}</span>
                  </>
                )}
                {currentEpisodeObj?.runtime ? (
                  <>
                    <span>•</span>
                    <span>{currentEpisodeObj.runtime} min</span>
                  </>
                ) : null}
              </div>

              {/* Storyline */}
              <div className="mt-3 sm:mt-5 space-y-1 sm:space-y-2">
                <h3 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Episode Synopsis
                </h3>
                <p className="text-xs sm:text-base text-zinc-300 leading-relaxed font-normal">
                  {currentEpisodeObj?.overview || series.overview || 'Enjoy watching this episode in pristine cinema quality on Netplix+.'}
                </p>
              </div>

              {/* Genre Chips */}
              {series.genres && series.genres.length > 0 && (
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-2.5 sm:pt-4">
                  {series.genres.map((g: any) => (
                    <Link
                      key={g.id || g}
                      to={`/browse/tv?genre=${g.id || ''}`}
                      className="px-2.5 sm:px-3.5 py-0.5 sm:py-1 bg-white/[0.06] hover:bg-white/[0.12] rounded-full text-[11px] sm:text-xs text-zinc-300 hover:text-white transition-colors border border-white/[0.08]"
                    >
                      {g.name || g}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Apple Actions Capsule Row */}
            <div className="mt-4 sm:mt-8 pt-3 sm:pt-6 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 sm:gap-4 relative z-10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleWatchlist}
                  className={`flex items-center gap-1.5 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs font-semibold sm:font-bold active:scale-95 transition-all ${inWatchlist
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
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs font-medium sm:font-semibold bg-white/[0.08] hover:bg-white/[0.16] active:scale-95 text-white border border-white/[0.14] transition-all backdrop-blur-xl"
                  >
                    <Play className="w-3 sm:w-3.5 h-3 sm:h-3.5 fill-white" />
                    <span>Trailer</span>
                  </button>
                )}

                <button
                  onClick={handleToggleFavorites}
                  className={`p-2 sm:p-2.5 rounded-full border active:scale-95 transition-all text-xs ${inFavorites
                      ? 'bg-red-500/20 text-red-400 border-red-500/40 shadow-sm'
                      : 'bg-white/[0.08] hover:bg-white/[0.16] text-white border-white/[0.14]'
                    }`}
                  title="Favorite"
                >
                  <Heart className={`w-3.5 sm:w-4 h-3.5 sm:h-4 ${inFavorites ? 'fill-red-400' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 sm:p-2.5 bg-white/[0.08] hover:bg-white/[0.16] active:scale-95 text-white rounded-full border border-white/[0.14] transition-all"
                  title="Share link"
                >
                  <Share2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </button>
              </div>

              <Link
                to={`/series/${series.id}`}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full text-xs font-semibold bg-white/[0.08] hover:bg-white/[0.16] active:scale-95 text-zinc-300 hover:text-white border border-white/[0.12] transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-[#2997ff]" />
                <span>Show Details</span>
              </Link>
            </div>
          </div>

          {/* Apple TV Episode Selector Drawer Sidebar */}
          <div className="rounded-3xl bg-[#101014]/80 backdrop-blur-3xl border border-white/[0.08] shadow-[0_25px_60px_rgba(0,0,0,0.85)] p-5 flex flex-col h-[560px]">
            <div className="flex items-center justify-between pb-3.5 mb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#2997ff]" />
                <span className="text-sm font-bold text-white tracking-wide">Episodes ({episodes.length})</span>
              </div>

              {/* Apple TV Season Selector */}
              <div className="relative">
                <select
                  value={seasonNum}
                  onChange={(e) => handleSeasonSelect(Number(e.target.value))}
                  className="appearance-none bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.14] rounded-xl px-3 py-1.5 pr-8 text-xs font-semibold text-white focus:outline-none cursor-pointer backdrop-blur-xl transition-colors"
                >
                  {(series.seasons || [])
                    .filter(s => s.season_number > 0)
                    .map(s => (
                      <option key={s.id} value={s.season_number} className="bg-zinc-950 text-white">
                        {s.name || `Season ${s.season_number}`}
                      </option>
                    ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Scrollable Episodes List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1.5 custom-scrollbar">
              {episodes.map(ep => {
                const isCurrent = ep.episode_number === episodeNum;
                return (
                  <button
                    key={ep.id}
                    onClick={() => handleEpisodeSelect(ep.episode_number)}
                    className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 border ${isCurrent
                        ? 'bg-white text-black border-white shadow-apple-button'
                        : 'bg-white/[0.03] hover:bg-white/[0.08] border-white/[0.05] text-zinc-300'
                      }`}
                  >
                    <div className="relative w-20 h-12 rounded-xl overflow-hidden bg-black shrink-0 shadow-sm">
                      <img
                        src={getImageUrl(ep.still_path || series.backdrop_path, 'w200')}
                        alt={ep.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {isCurrent && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-4 h-4 fill-white text-white" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className={`text-xs font-bold truncate ${isCurrent ? 'text-black' : 'text-white'}`}>
                          {ep.episode_number}. {ep.name || `Episode ${ep.episode_number}`}
                        </span>
                      </div>
                      <span className={`text-[11px] block truncate mt-0.5 ${isCurrent ? 'text-zinc-700 font-medium' : 'text-zinc-500'}`}>
                        {ep.runtime ? `${ep.runtime} min` : 'HD'} {ep.air_date ? `• ${ep.air_date.slice(0, 4)}` : ''}
                      </span>
                    </div>
                  </button>
                );
              })}
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
                  The ensemble cast of this Apple TV series
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
            {creators.length > 0 && (
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Created By</span>
                <span className="text-white font-semibold text-sm">
                  {creators.map((c: any) => c.name).join(', ')}
                </span>
              </div>
            )}

            {networks.length > 0 && (
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Original Network</span>
                <span className="text-white font-semibold text-sm">
                  {networks.map((n: any) => n.name).join(', ')}
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

            {series.status && (
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Status</span>
                <span className="text-white font-semibold text-sm">
                  {series.status}
                </span>
              </div>
            )}

            {series.number_of_seasons && (
              <div>
                <span className="text-zinc-500 block uppercase font-bold text-[10px] tracking-wider mb-1">Total Seasons</span>
                <span className="text-white font-semibold text-sm">
                  {series.number_of_seasons} Seasons ({series.number_of_episodes || 0} Episodes)
                </span>
              </div>
            )}

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

        {/* Similar TV Shows ("More to Watch") */}
        {series.similar?.results && series.similar.results.length > 0 && (
          <div className="mt-12 sm:mt-16">
            <MovieRow
              title="More Series to Watch"
              subtitle="Audience recommendations based on this show"
              items={series.similar.results}
            />
          </div>
        )}

        </div>
      </div>

      {trailerKey && (
        <TrailerModal
          isOpen={!!trailerKey}
          videoKey={trailerKey}
          title={title}
          onClose={() => setTrailerKey(null)}
        />
      )}
    </div>
  );
};

export default WatchTvPage;



