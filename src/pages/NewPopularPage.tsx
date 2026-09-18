import React, { useState, useEffect } from 'react';
import { Flame, Sparkles, Film, Tv, Calendar, Radio } from 'lucide-react';
import { fetchNewAndPopular } from '../services/tmdb';
import { MediaItem } from '../types';
import MovieRow from '../components/MovieRow';
import HeroCarousel from '../components/HeroCarousel';
import { MovieRowSkeleton } from '../components/Skeletons';

const NewPopularPage: React.FC = () => {
  const [data, setData] = useState<{
    trendingWeekly: MediaItem[];
    nowPlayingMovies: MediaItem[];
    upcomingMovies: MediaItem[];
    airingTodayTv: MediaItem[];
    onTheAirTv: MediaItem[];
  }>({
    trendingWeekly: [],
    nowPlayingMovies: [],
    upcomingMovies: [],
    airingTodayTv: [],
    onTheAirTv: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    fetchNewAndPopular()
      .then(res => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error('Failed to load New & Popular data:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-black text-[#f5f5f7]">
      {/* Featured Spotlight Billboard */}
      {data.trendingWeekly.length > 0 && (
        <HeroCarousel items={data.trendingWeekly.slice(0, 6)} />
      )}

      <div className="pt-6 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
          <div className="flex items-center gap-2 text-[#2997ff] text-xs font-semibold uppercase tracking-widest mb-1">
            <Flame className="w-4 h-4 text-[#ff3b30]" />
            <span>Trending Fresh</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            New & Popular
          </h1>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            See what’s new and trending this week — fresh movies, upcoming releases, and on-air series.
          </p>
        </div>

        {loading ? (
          <div className="space-y-6">
            <MovieRowSkeleton />
            <MovieRowSkeleton />
            <MovieRowSkeleton />
          </div>
        ) : (
          <div className="space-y-2">
            {/* Trending This Week */}
            <MovieRow
              title="Trending This Week"
              subtitle="The most-watched titles across streaming networks"
              items={data.trendingWeekly}
              icon={<Flame className="w-5 h-5 text-[#ff3b30]" />}
              seeAllLink="/discover?sort=popularity.desc"
            />

            {/* New Movie Releases in Theaters / Streaming */}
            <MovieRow
              title="New Movie Releases"
              subtitle="Latest blockbusters now playing in cinemas and streaming"
              items={data.nowPlayingMovies}
              icon={<Film className="w-5 h-5 text-[#2997ff]" />}
              seeAllLink="/movies"
            />

            {/* Coming Soon */}
            <MovieRow
              title="Coming Soon"
              subtitle="Anticipated movie releases heading your way"
              items={data.upcomingMovies}
              icon={<Calendar className="w-5 h-5 text-[#ff9500]" />}
              seeAllLink="/discover?type=movie&sort=primary_release_date.desc"
            />

            {/* TV Airing Today */}
            <MovieRow
              title="TV Airing Today"
              subtitle="Brand new episodes dropping today"
              items={data.airingTodayTv}
              icon={<Radio className="w-5 h-5 text-[#34c759]" />}
              seeAllLink="/series"
            />

            {/* TV On The Air */}
            <MovieRow
              title="Currently On Air"
              subtitle="Ongoing television series broadcasting new seasons"
              items={data.onTheAirTv}
              icon={<Tv className="w-5 h-5 text-[#af52de]" />}
              seeAllLink="/series"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NewPopularPage;
