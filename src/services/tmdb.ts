import { MediaItem, MovieDetail, TvDetail, Season, ShortItem, PersonDetail, MediaType } from '../types';
import { getRegion } from './storage';

const DEFAULT_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

export function getTmdbApiKey(): string {
  try {
    const customKey = localStorage.getItem('netplix_tmdb_api_key') || localStorage.getItem('cinejoy_tmdb_api_key');
    if (customKey && customKey.trim()) {
      return customKey.trim();
    }
  } catch (e) {
    // Ignore localStorage access errors
  }
  return import.meta.env.VITE_TMDB_API_KEY || DEFAULT_API_KEY;
}

export function setTmdbApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem('netplix_tmdb_api_key', key.trim());
    } else {
      localStorage.removeItem('netplix_tmdb_api_key');
      localStorage.removeItem('cinejoy_tmdb_api_key');
    }
  } catch (e) {
    console.error('Failed to set TMDB API Key in storage:', e);
  }
}

export async function testTmdbConnection(customKey?: string): Promise<{ success: boolean; message: string }> {
  const key = customKey !== undefined ? customKey.trim() : getTmdbApiKey();
  if (!key) {
    return { success: false, message: 'API key cannot be empty.' };
  }

  const isBearer = key.startsWith('eyJ') || key.length > 50;
  const url = isBearer
    ? `${BASE_URL}/authentication`
    : `${BASE_URL}/trending/movie/day?api_key=${key}`;

  const headers: HeadersInit = {
    accept: 'application/json'
  };

  if (isBearer) {
    headers['Authorization'] = `Bearer ${key}`;
  }

  try {
    const res = await fetch(url, { headers });
    if (res.ok) {
      return { success: true, message: 'Connected successfully to TMDB API.' };
    }
    const errorData = await res.json().catch(() => ({}));
    return {
      success: false,
      message: errorData.status_message || `HTTP ${res.status}: ${res.statusText}`
    };
  } catch (e: any) {
    return { success: false, message: e.message || 'Network connection failed.' };
  }
}

export function getImageUrl(path: string | null | undefined, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path: string | null | undefined, size: 'w780' | 'w1280' | 'original' = 'original'): string {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${IMAGE_BASE_URL}/${size}${path}`;
}

const WECOLLEGE_MIRROR = 'https://db.wecollege.net/3';

async function tmdbFetch<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const key = getTmdbApiKey();
  const isBearer = key.startsWith('eyJ') || key.length > 50;

  const urlParams: Record<string, string> = Object.fromEntries(
    Object.entries(params).map(([k, v]) => [k, String(v)])
  );

  const headers: HeadersInit = {
    accept: 'application/json'
  };

  if (isBearer) {
    headers['Authorization'] = `Bearer ${key}`;
  } else {
    urlParams['api_key'] = key;
  }

  const query = new URLSearchParams(urlParams).toString();
  const primaryUrl = `${BASE_URL}${endpoint}${query ? `?${query}` : ''}`;

  try {
    const res = await fetch(primaryUrl, { headers });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fall back to WeCollege mirror
  }

  // Fallback: Movy's high-speed TMDB mirror (no key required)
  const mirrorParams = { ...urlParams };
  delete mirrorParams['api_key'];
  const mirrorQuery = new URLSearchParams(mirrorParams).toString();
  const mirrorUrl = `${WECOLLEGE_MIRROR}${endpoint}${mirrorQuery ? `?${mirrorQuery}` : ''}`;
  const mirrorRes = await fetch(mirrorUrl);
  if (!mirrorRes.ok) {
    throw new Error(`TMDB error ${mirrorRes.status}: ${mirrorRes.statusText}`);
  }
  return mirrorRes.json();
}

export const INDIAN_LANGUAGES = [
  { code: 'all', name: 'All Indian' },
  { code: 'hi', name: 'Hindi (Bollywood)' },
  { code: 'te', name: 'Telugu (Tollywood)' },
  { code: 'ta', name: 'Tamil (Kollywood)' },
  { code: 'ml', name: 'Malayalam (Mollywood)' },
  { code: 'kn', name: 'Kannada (Sandalwood)' },
  { code: 'en', name: 'Hollywood / English' }
];

export async function fetchTrending(mediaType: 'all' | 'movie' | 'tv' = 'all'): Promise<MediaItem[]> {
  const currentRegion = getRegion();

  if (currentRegion === 'IN') {
    if (mediaType === 'movie') {
      const data = await tmdbFetch<{ results: MediaItem[] }>('/discover/movie', {
        with_origin_country: 'IN',
        region: 'IN',
        sort_by: 'popularity.desc',
        include_adult: 'false'
      });
      return (data.results || []).map(item => ({ ...item, media_type: 'movie' }));
    } else if (mediaType === 'tv') {
      const data = await tmdbFetch<{ results: MediaItem[] }>('/discover/tv', {
        with_origin_country: 'IN',
        region: 'IN',
        sort_by: 'popularity.desc',
        include_adult: 'false'
      });
      return (data.results || []).map(item => ({ ...item, media_type: 'tv' }));
    } else {
      // 'all'
      const [moviesData, tvData] = await Promise.allSettled([
        tmdbFetch<{ results: MediaItem[] }>('/discover/movie', {
          with_origin_country: 'IN',
          region: 'IN',
          sort_by: 'popularity.desc',
          include_adult: 'false'
        }),
        tmdbFetch<{ results: MediaItem[] }>('/discover/tv', {
          with_origin_country: 'IN',
          region: 'IN',
          sort_by: 'popularity.desc',
          include_adult: 'false'
        })
      ]);

      const combined: MediaItem[] = [];
      const movies = (moviesData.status === 'fulfilled' ? moviesData.value.results : []).map(m => ({ ...m, media_type: 'movie' as const }));
      const tv = (tvData.status === 'fulfilled' ? tvData.value.results : []).map(t => ({ ...t, media_type: 'tv' as const }));

      for (let i = 0; i < Math.max(movies.length, tv.length); i++) {
        if (movies[i]) combined.push(movies[i]);
        if (tv[i]) combined.push(tv[i]);
      }
      return combined;
    }
  }

  // Global trending
  const data = await tmdbFetch<{ results: MediaItem[] }>(`/trending/${mediaType}/day`);
  return (data.results || []).map(item => ({
    ...item,
    media_type: item.media_type || (mediaType === 'all' ? (item.title ? 'movie' : 'tv') : mediaType)
  }));
}

export async function fetchMovies(
  page: number = 1,
  genreId?: number,
  sortBy: string = 'popularity.desc',
  year?: string,
  language?: string
): Promise<{ results: MediaItem[]; totalPages: number }> {
  const currentRegion = getRegion();
  const params: Record<string, string | number> = {
    page,
    sort_by: sortBy,
    include_adult: 'false'
  };

  if (genreId) params.with_genres = genreId;
  if (year) params.primary_release_year = year;

  if (language && language !== 'all') {
    params.with_original_language = language;
  } else if (currentRegion === 'IN') {
    params.with_origin_country = 'IN';
    params.region = 'IN';
    params.watch_region = 'IN';
  }

  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>('/discover/movie', params);
  return {
    results: (data.results || []).map(item => ({ ...item, media_type: 'movie' })),
    totalPages: Math.min(data.total_pages || 1, 500)
  };
}

export async function fetchTvShows(
  page: number = 1,
  genreId?: number,
  sortBy: string = 'popularity.desc',
  year?: string,
  language?: string
): Promise<{ results: MediaItem[]; totalPages: number }> {
  const currentRegion = getRegion();
  const params: Record<string, string | number> = {
    page,
    sort_by: sortBy,
    include_adult: 'false'
  };

  if (genreId) params.with_genres = genreId;
  if (year) params.first_air_date_year = year;

  if (language && language !== 'all') {
    params.with_original_language = language;
  } else if (currentRegion === 'IN') {
    params.with_origin_country = 'IN';
    params.region = 'IN';
    params.watch_region = 'IN';
  }

  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>('/discover/tv', params);
  return {
    results: (data.results || []).map(item => ({ ...item, media_type: 'tv' })),
    totalPages: Math.min(data.total_pages || 1, 500)
  };
}

export async function fetchTopRated(mediaType: 'movie' | 'tv' = 'movie'): Promise<MediaItem[]> {
  const currentRegion = getRegion();
  if (currentRegion === 'IN') {
    const data = await tmdbFetch<{ results: MediaItem[] }>(`/discover/${mediaType}`, {
      with_origin_country: 'IN',
      region: 'IN',
      'vote_count.gte': 30,
      sort_by: 'vote_average.desc',
      page: 1
    });
    return (data.results || []).map(item => ({ ...item, media_type: mediaType }));
  }

  const data = await tmdbFetch<{ results: MediaItem[] }>(`/${mediaType}/top_rated`, { page: 1 });
  return (data.results || []).map(item => ({ ...item, media_type: mediaType }));
}

export async function fetchNowPlayingIndia(): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>('/movie/now_playing', {
    region: 'IN',
    page: 1
  });
  return (data.results || []).map(item => ({ ...item, media_type: 'movie' }));
}

export async function fetchIndianMoviesByLanguage(lang: string = 'hi', page: number = 1): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>('/discover/movie', {
    with_original_language: lang,
    with_origin_country: 'IN',
    region: 'IN',
    sort_by: 'popularity.desc',
    page
  });
  return (data.results || []).map(item => ({ ...item, media_type: 'movie' }));
}

export async function fetchSouthIndianBlockbusters(): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>('/discover/movie', {
    with_original_language: 'te|ta|ml|kn',
    with_origin_country: 'IN',
    region: 'IN',
    sort_by: 'popularity.desc',
    page: 1
  });
  return (data.results || []).map(item => ({ ...item, media_type: 'movie' }));
}

export async function fetchMovieDetails(id: number | string): Promise<MovieDetail> {
  const data = await tmdbFetch<any>(`/movie/${id}`, {
    append_to_response: 'credits,similar,recommendations,videos,release_dates'
  });

  const trailers = (data.videos?.results || [])
    .filter((v: any) => v.site === 'YouTube')
    .map((v: any) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      site: v.site,
      type: v.type,
      official: v.official
    }));

  let cert = '';
  const usReleases = data.release_dates?.results?.find((r: any) => r.iso_3166_1 === 'US');
  if (usReleases && usReleases.release_dates?.length > 0) {
    cert = usReleases.release_dates[0].certification || '';
  }

  return {
    ...data,
    media_type: 'movie',
    certification: cert,
    trailers
  };
}

export async function fetchTvDetails(id: number | string): Promise<TvDetail> {
  const data = await tmdbFetch<any>(`/tv/${id}`, {
    append_to_response: 'credits,similar,recommendations,videos,content_ratings'
  });

  const trailers = (data.videos?.results || [])
    .filter((v: any) => v.site === 'YouTube')
    .map((v: any) => ({
      id: v.id,
      key: v.key,
      name: v.name,
      site: v.site,
      type: v.type,
      official: v.official
    }));

  let cert = '';
  const usRating = data.content_ratings?.results?.find((r: any) => r.iso_3166_1 === 'US');
  if (usRating) {
    cert = usRating.rating;
  }

  return {
    ...data,
    media_type: 'tv',
    certification: cert,
    trailers
  };
}

export async function fetchSeasonDetails(tvId: number | string, seasonNumber: number): Promise<Season | null> {
  const data = await tmdbFetch<Season>(`/tv/${tvId}/season/${seasonNumber}`);
  return data || null;
}

export async function searchMulti(query: string, page: number = 1): Promise<MediaItem[]> {
  if (!query.trim()) return [];
  const data = await tmdbFetch<{ results: MediaItem[] }>('/search/multi', {
    query: encodeURIComponent(query),
    page,
    include_adult: 'false'
  });
  return (data.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv');
}

export async function fetchShortsVideos(page: number = 1): Promise<ShortItem[]> {
  const currentRegion = getRegion();
  let mediaList: MediaItem[] = [];

  if (currentRegion === 'IN') {
    const [moviesRes, tvRes] = await Promise.allSettled([
      tmdbFetch<{ results: MediaItem[] }>('/discover/movie', {
        with_origin_country: 'IN',
        region: 'IN',
        sort_by: 'popularity.desc',
        page,
        include_adult: 'false'
      }),
      tmdbFetch<{ results: MediaItem[] }>('/discover/tv', {
        with_origin_country: 'IN',
        region: 'IN',
        sort_by: 'popularity.desc',
        page,
        include_adult: 'false'
      })
    ]);

    const movies = (moviesRes.status === 'fulfilled' ? moviesRes.value.results : []) || [];
    const tv = (tvRes.status === 'fulfilled' ? tvRes.value.results : []) || [];

    for (let i = 0; i < Math.max(movies.length, tv.length); i++) {
      if (movies[i]) mediaList.push({ ...movies[i], media_type: 'movie' });
      if (tv[i]) mediaList.push({ ...tv[i], media_type: 'tv' });
    }
  } else {
    const data = await tmdbFetch<{ results: MediaItem[] }>('/trending/all/day', { page });
    mediaList = (data.results || []).filter(item => item.media_type === 'movie' || item.media_type === 'tv');
  }

  // Fetch trailers for batch
  const itemsToFetch = mediaList.slice(0, 14);
  const shorts: ShortItem[] = [];

  const videoResults = await Promise.allSettled(
    itemsToFetch.map(item => {
      const type = item.media_type || (item.title ? 'movie' : 'tv');
      return tmdbFetch<{ results: any[] }>(`/${type}/${item.id}/videos`).then(vData => ({
        item,
        type,
        videos: vData.results || []
      }));
    })
  );

  for (const res of videoResults) {
    if (res.status === 'fulfilled' && res.value.videos.length > 0) {
      const { item, type, videos } = res.value;
      const youtubeTrailer =
        videos.find(v => v.site === 'YouTube' && v.type === 'Trailer' && v.official) ||
        videos.find(v => v.site === 'YouTube' && v.type === 'Trailer') ||
        videos.find(v => v.site === 'YouTube' && (v.type === 'Teaser' || v.type === 'Clip')) ||
        videos.find(v => v.site === 'YouTube');

      if (youtubeTrailer && youtubeTrailer.key) {
        const title = item.title || item.name || 'Featured Title';
        const randomLikesCount = Math.floor(Math.random() * 500 + 100);
        const tags = [
          `#${(title || '').replace(/[^a-zA-Z0-9]/g, '')}`,
          type === 'tv' ? '#WebSeries' : '#Blockbuster',
          item.original_language === 'hi' ? '#Bollywood' :
            item.original_language === 'te' ? '#Tollywood' :
              item.original_language === 'ta' ? '#Kollywood' :
                item.original_language === 'ml' ? '#Mollywood' :
                  item.original_language === 'kn' ? '#Sandalwood' : '#Cinema'
        ].filter(Boolean);

        shorts.push({
          id: `tmdb-${type}-${item.id}`,
          tmdbId: item.id,
          mediaType: type as 'movie' | 'tv',
          title: `${title} - ${youtubeTrailer.name || 'Official Trailer'}`,
          overview: item.overview || 'Experience the official preview in high definition on Netplix.',
          videoKey: youtubeTrailer.key,
          poster: getImageUrl(item.poster_path, 'w780'),
          backdrop: getBackdropUrl(item.backdrop_path, 'w1280'),
          releaseDate: item.release_date || item.first_air_date,
          voteAverage: Number((item.vote_average || 7.5).toFixed(1)),
          likes: `${randomLikesCount}K`,
          tags
        });
      }
    }
  }

  return shorts;
}

export async function fetchPersonDetails(id: number | string): Promise<PersonDetail> {
  return tmdbFetch<PersonDetail>(`/person/${id}`, {
    append_to_response: 'combined_credits,external_ids,images'
  });
}

export interface DiscoverFilters {
  mediaType?: 'movie' | 'tv';
  genre?: string;
  year?: string;
  rating?: string;
  runtime?: string;
  language?: string;
  sortBy?: string;
  mood?: string;
  page?: number;
}

export async function fetchDiscoverMedia(filters: DiscoverFilters = {}): Promise<{ results: MediaItem[]; total_pages: number; total_results: number }> {
  const mediaType = filters.mediaType === 'tv' ? 'tv' : 'movie';
  const params: Record<string, string | number> = {
    page: filters.page || 1,
    include_adult: 'false',
    sort_by: filters.sortBy || 'popularity.desc'
  };

  // Genre filter
  if (filters.genre && filters.genre !== 'all') {
    params['with_genres'] = filters.genre;
  }

  // Mood shortcuts (inspired by Movify)
  if (filters.mood) {
    switch (filters.mood) {
      case 'quick':
        // Quick watch (<= 90 min)
        params['with_runtime.lte'] = 90;
        params['with_runtime.gte'] = 1;
        break;
      case 'mystery':
        // Mind-bending (Mysteries & Sci-Fi rated 7+)
        params['with_genres'] = filters.genre || (mediaType === 'movie' ? '9648,878' : '9648,10765');
        params['vote_average.gte'] = 7.0;
        params['vote_count.gte'] = 50;
        break;
      case 'romance':
        // Romance / Pampakilig
        params['with_genres'] = filters.genre || '10749';
        break;
      case 'comedy':
        // Good vibes / Comedy
        params['with_genres'] = filters.genre || '35';
        break;
      case 'scary':
        // Scary night / Horror
        params['with_genres'] = filters.genre || (mediaType === 'movie' ? '27,53' : '9648');
        break;
    }
  }

  // Runtime filter for movies
  if (filters.runtime && mediaType === 'movie') {
    params['with_runtime.lte'] = Number(filters.runtime);
    params['with_runtime.gte'] = 1;
  }

  // Release year filter
  if (filters.year) {
    if (mediaType === 'tv') {
      params['first_air_date_year'] = filters.year;
    } else {
      params['primary_release_year'] = filters.year;
    }
  }

  // Rating filter (minimum vote_average)
  if (filters.rating) {
    params['vote_average.gte'] = Number(filters.rating);
    params['vote_count.gte'] = 40;
  }

  // Language filter
  if (filters.language && filters.language !== 'all') {
    params['with_original_language'] = filters.language;
  }

  const res = await tmdbFetch<{ results: MediaItem[]; total_pages: number; total_results: number }>(
    `/discover/${mediaType}`,
    params
  );

  const formattedResults = (res.results || []).map(item => ({
    ...item,
    media_type: mediaType as MediaType
  }));

  return {
    results: formattedResults,
    total_pages: Math.min(res.total_pages || 1, 500),
    total_results: res.total_results || 0
  };
}

export async function fetchNewAndPopular(): Promise<{
  trendingWeekly: MediaItem[];
  nowPlayingMovies: MediaItem[];
  upcomingMovies: MediaItem[];
  airingTodayTv: MediaItem[];
  onTheAirTv: MediaItem[];
}> {
  const [trending, nowPlaying, upcoming, airingToday, onTheAir] = await Promise.allSettled([
    tmdbFetch<{ results: MediaItem[] }>('/trending/all/week'),
    tmdbFetch<{ results: MediaItem[] }>('/movie/now_playing'),
    tmdbFetch<{ results: MediaItem[] }>('/movie/upcoming'),
    tmdbFetch<{ results: MediaItem[] }>('/tv/airing_today'),
    tmdbFetch<{ results: MediaItem[] }>('/tv/on_the_air')
  ]);

  return {
    trendingWeekly: (trending.status === 'fulfilled' ? trending.value.results : []).map(i => ({ ...i, media_type: (i.media_type || (i.title ? 'movie' : 'tv')) as MediaType })),
    nowPlayingMovies: (nowPlaying.status === 'fulfilled' ? nowPlaying.value.results : []).map(i => ({ ...i, media_type: 'movie' as MediaType })),
    upcomingMovies: (upcoming.status === 'fulfilled' ? upcoming.value.results : []).map(i => ({ ...i, media_type: 'movie' as MediaType })),
    airingTodayTv: (airingToday.status === 'fulfilled' ? airingToday.value.results : []).map(i => ({ ...i, media_type: 'tv' as MediaType })),
    onTheAirTv: (onTheAir.status === 'fulfilled' ? onTheAir.value.results : []).map(i => ({ ...i, media_type: 'tv' as MediaType }))
  };
}

// Movy-style TOP 10 Showcase Fetcher
export async function fetchTop10(type: 'all' | 'movie' | 'tv' = 'all'): Promise<MediaItem[]> {
  const items = await fetchTrending(type);
  return items.slice(0, 10);
}

// Dedicated Anime Discovery APIs (Cloned from Movy / Vidy anime system)
export async function fetchAnimeTrending(page: number = 1): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>('/discover/tv', {
    with_genres: 16, // Animation
    with_original_language: 'ja',
    sort_by: 'popularity.desc',
    page
  });
  return (data.results || []).map(item => ({ ...item, media_type: 'tv' as MediaType }));
}

export async function fetchAnimePopular(page: number = 1): Promise<{ results: MediaItem[]; totalPages: number }> {
  const data = await tmdbFetch<{ results: MediaItem[]; total_pages: number }>('/discover/tv', {
    with_genres: 16,
    with_original_language: 'ja',
    sort_by: 'vote_count.desc',
    page
  });
  return {
    results: (data.results || []).map(item => ({ ...item, media_type: 'tv' as MediaType })),
    totalPages: Math.min(data.total_pages || 1, 500)
  };
}

export async function fetchAnimeTopRated(page: number = 1): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>('/discover/tv', {
    with_genres: 16,
    with_original_language: 'ja',
    'vote_count.gte': 50,
    sort_by: 'vote_average.desc',
    page
  });
  return (data.results || []).map(item => ({ ...item, media_type: 'tv' as MediaType }));
}

export async function fetchAnimeMovies(page: number = 1): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>('/discover/movie', {
    with_genres: 16,
    with_original_language: 'ja',
    sort_by: 'popularity.desc',
    page
  });
  return (data.results || []).map(item => ({ ...item, media_type: 'movie' as MediaType }));
}

export async function fetchAnimeAiring(page: number = 1): Promise<MediaItem[]> {
  const data = await tmdbFetch<{ results: MediaItem[] }>('/discover/tv', {
    with_genres: 16,
    with_original_language: 'ja',
    air_date_gte: new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0],
    sort_by: 'popularity.desc',
    page
  });
  return (data.results || []).map(item => ({ ...item, media_type: 'tv' as MediaType }));
}

