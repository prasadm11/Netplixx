export type MediaType = 'movie' | 'tv' | 'person';

export interface Genre {
  id: number;
  name: string;
}

export interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  media_type?: MediaType;
  genre_ids?: number[];
  genres?: Genre[] | string[];
  popularity?: number;
  adult?: boolean;
  original_language?: string;
  vote_count?: number;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  known_for_department?: string;
}

export interface VideoTrailer {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official?: boolean;
}

export interface MovieDetail extends MediaItem {
  tagline?: string;
  runtime?: number;
  status?: string;
  budget?: number;
  revenue?: number;
  imdb_id?: string;
  certification?: string;
  credits?: {
    cast: CastMember[];
    crew?: any[];
  };
  similar?: {
    results: MediaItem[];
  };
  recommendations?: {
    results: MediaItem[];
  };
  trailers?: VideoTrailer[];
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  episode_number: number;
  season_number: number;
  air_date?: string;
  vote_average?: number;
  runtime?: number;
}

export interface Season {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date?: string;
  overview?: string;
  episodes?: Episode[];
}

export interface TvDetail extends MediaItem {
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  seasons?: Season[];
  status?: string;
  tagline?: string;
  imdb_id?: string;
  certification?: string;
  last_air_date?: string;
  credits?: {
    cast: CastMember[];
    crew?: Array<{ id: number; name: string; job: string }>;
  };
  created_by?: Array<{ id: number; name: string; profile_path?: string | null }>;
  networks?: Array<{ id: number; name: string; logo_path?: string | null }>;
  similar?: {
    results: MediaItem[];
  };
  recommendations?: {
    results: MediaItem[];
  };
  trailers?: VideoTrailer[];
}

export interface ContinueWatchingItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  season?: number;
  episode?: number;
  episodeName?: string;
  progress: number; // percentage (0 - 100) or current seconds
  duration?: number;
  updatedAt: number;
}

export interface WatchlistItem {
  id: number;
  mediaType: 'movie' | 'tv';
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  addedAt: number;
}

export interface VideoServer {
  id: string;
  name: string;
  getMovieUrl: (tmdbId: number | string, imdbId?: string) => string;
  getTvUrl: (tmdbId: number | string, season: number, episode: number, imdbId?: string) => string;
  badge?: string;
  isDirect?: boolean;
  endpoint?: string;
}

export interface PlayerSettings {
  defaultServer: string;
  autoPlayNext: boolean;
  autoSkipIntro: boolean;
  accentColor: string;
  subtitleLang: string;
  region?: string;
  indianLanguage?: string;
}

export interface ShortItem {
  id: string;
  tmdbId: number;
  mediaType: 'movie' | 'tv';
  title: string;
  overview: string;
  videoKey: string;
  poster: string;
  backdrop: string;
  releaseDate?: string;
  firstAirDate?: string;
  voteAverage: number;
  likes: string;
  tags: string[];
}

export interface PersonDetail {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity?: number;
  combined_credits?: {
    cast: MediaItem[];
    crew: MediaItem[];
  };
  external_ids?: {
    imdb_id?: string;
    instagram_id?: string;
    twitter_id?: string;
    facebook_id?: string;
  };
}
