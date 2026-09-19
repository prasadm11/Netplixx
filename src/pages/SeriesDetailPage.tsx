import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Star, ChevronDown, Loader2, ChevronsUpDown } from 'lucide-react';
import { fetchTvDetails, fetchSeasonDetails, getImageUrl } from '../services/tmdb';
import { TvDetail, Season } from '../types';
import { isInWatchlist, addToWatchlist, removeFromWatchlist, getContinueWatching } from '../services/storage';
import AppleTvHero from '../components/AppleTvHero';
import TrailerModal from '../components/TrailerModal';
import MovieRow from '../components/MovieRow';
import { DetailSkeleton } from '../components/Skeletons';

const SeriesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [series, setSeries] = useState<TvDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [seasonData, setSeasonData] = useState<Season | null>(null);
  const [loadingSeason, setLoadingSeason] = useState(false);
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (!id) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    let isMounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchTvDetails(id);
        if (isMounted) {
          setSeries(data);
          setInWatchlist(isInWatchlist(data.id, 'tv'));

          const firstSeason = data.seasons?.find(s => s.season_number > 0)?.season_number || 1;
          setSelectedSeason(firstSeason);
        }
      } catch (e) {
        console.warn('Failed to load series details:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id || !selectedSeason) return;

    let isMounted = true;
    const loadSeason = async () => {
      setLoadingSeason(true);
      try {
        const data = await fetchSeasonDetails(id, selectedSeason);
        if (isMounted) setSeasonData(data);
      } catch (e) {
        console.warn('Failed to load season details:', e);
      } finally {
        if (isMounted) setLoadingSeason(false);
      }
    };

    loadSeason();
    return () => {
      isMounted = false;
    };
  }, [id, selectedSeason]);

  if (loading) {
    return <DetailSkeleton />;
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-2xl font-bold text-white mb-2">Series Not Found</h2>
        <p className="text-zinc-400 mb-6">The requested TV show could not be loaded.</p>
        <Link to="/" className="bg-white text-black font-semibold px-6 py-2.5 rounded-full shadow-apple-button">
          Back to Home
        </Link>
      </div>
    );
  }

  const title = series.name || series.title || 'TV Series';
  const trailerKey = series.trailers?.[0]?.key || null;

  const handleWatchlist = () => {
    if (inWatchlist) {
      removeFromWatchlist(series.id, 'tv');
      setInWatchlist(false);
    } else {
      addToWatchlist({
        id: series.id,
        mediaType: 'tv',
        title,
        poster_path: series.poster_path,
        backdrop_path: series.backdrop_path,
        vote_average: series.vote_average,
        release_date: series.first_air_date
      });
      setInWatchlist(true);
    }
  };

  const savedProgress = getContinueWatching().find(i => i.id === Number(id) && i.mediaType === 'tv');
  const startSeason = savedProgress?.season || 1;
  const startEpisode = savedProgress?.episode || 1;
  const playButtonText = savedProgress 
    ? `Resume S${startSeason}:E${startEpisode}` 
    : 'Play Episode 1';

  const handlePlay = () => {
    navigate(`/watch/tv/${series.id}/${startSeason}/${startEpisode}`);
  };

  const seasonsList = (series.seasons || []).filter(s => s.season_number > 0);

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      {/* 1. CINEMATIC APPLE TV HERO WITH BACKGROUND TRAILER */}
      <AppleTvHero
        item={series}
        mediaType="tv"
        trailerKey={trailerKey}
        inWatchlist={inWatchlist}
        onToggleWatchlist={handleWatchlist}
        onPlay={handlePlay}
        playButtonText={playButtonText}
        onOpenTrailerModal={() => setIsTrailerOpen(true)}
        isTrailerModalOpen={isTrailerOpen}
        badgeText={series.status}
      />

      {/* 2. LOWER CONTENT: SEASON SELECTOR & EPISODES SHELF (TED LASSO SCREENSHOT MATCH) */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 py-8 space-y-12">
        
        {/* Season Selector & Episode Cards */}
        <section>
          {/* Apple TV Season Selector Header (matches "Season 1 ⬍" in screenshot) */}
          <div className="flex items-center justify-between mb-6">
            <div className="relative inline-block">
              <select
                id="season-selector"
                value={selectedSeason}
                onChange={(e) => setSelectedSeason(Number(e.target.value))}
                className="appearance-none bg-transparent hover:bg-white/10 text-xl sm:text-2xl font-bold text-white pr-9 py-1 rounded-xl cursor-pointer focus:outline-none transition-colors font-display"
                aria-label="Select Season"
              >
                {seasonsList.map(s => (
                  <option key={s.id} value={s.season_number} className="bg-zinc-900 text-white text-base font-normal">
                    {s.name || `Season ${s.season_number}`}
                  </option>
                ))}
              </select>
              <ChevronsUpDown className="w-5 h-5 text-zinc-400 absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <span className="text-xs font-medium text-zinc-400">
              {seasonData?.episodes ? `${seasonData.episodes.length} Episodes` : ''}
            </span>
          </div>

          {/* Episode Cards Carousel / Horizontal Shelf */}
          {loadingSeason ? (
            <div className="flex items-center justify-center py-16 text-zinc-400 gap-2.5">
              <Loader2 className="w-6 h-6 text-white animate-spin" />
              <span className="text-xs font-medium">Loading episodes for Season {selectedSeason}...</span>
            </div>
          ) : seasonData?.episodes && seasonData.episodes.length > 0 ? (
            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x">
              {seasonData.episodes.map(ep => (
                <div
                  key={ep.id}
                  onClick={() => navigate(`/watch/tv/${series.id}/${selectedSeason}/${ep.episode_number}`)}
                  className="w-72 sm:w-80 lg:w-96 shrink-0 bg-[#121215] border border-white/[0.08] hover:border-white/30 rounded-2xl overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-apple-card-hover hover:scale-[1.02] flex flex-col snap-start"
                >
                  {/* 16:9 Episode Thumbnail with Apple TV Play Hover */}
                  <div className="relative aspect-video w-full bg-black overflow-hidden">
                    <img
                      src={getImageUrl(ep.still_path || series.backdrop_path, 'w500')}
                      alt={ep.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-apple-button">
                        <Play className="w-5 h-5 fill-black ml-0.5" />
                      </div>
                    </div>
                    {/* Episode number tag */}
                    <span className="absolute bottom-2.5 left-2.5 bg-black/75 backdrop-blur-md text-white text-[11px] font-semibold px-2 py-0.5 rounded-md border border-white/10">
                      Episode {ep.episode_number}
                    </span>
                  </div>

                  {/* Episode Metadata */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-sm font-semibold text-white group-hover:text-white transition-colors line-clamp-1">
                          {ep.episode_number}. {ep.name || `Episode ${ep.episode_number}`}
                        </h4>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                        {ep.overview || 'Stream this episode in full HD on Cinejoy.'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-[11px] text-zinc-500">
                      <span>{ep.air_date || 'Aired'}</span>
                      {ep.vote_average && ep.vote_average > 0 && (
                        <span className="flex items-center gap-1 text-amber-300 font-medium">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          {ep.vote_average.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm py-8 text-center">
              No episodes available for this season.
            </p>
          )}
        </section>

        {/* Cast & Crew Section (Clickable Actor Links) */}
        {series.credits?.cast && series.credits.cast.length > 0 && (
          <section className="pt-8 border-t border-white/[0.08]">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-6 font-display">
              Series Cast & Crew
            </h3>
            <div className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-3">
              {series.credits.cast.slice(0, 16).map(actor => (
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

        {/* Similar Series Shelf */}
        {series.similar?.results && series.similar.results.length > 0 && (
          <div className="pt-8 border-t border-white/[0.08]">
            <MovieRow
              title="More Series Like This"
              subtitle="Audience recommendations based on this series"
              items={series.similar.results}
            />
          </div>
        )}
      </div>

      {/* Trailer Modal (for standalone fullscreen player) */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={() => setIsTrailerOpen(false)}
        videoKey={trailerKey}
        title={title}
      />
    </div>
  );
};

export default SeriesDetailPage;
