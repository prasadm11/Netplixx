import { VideoServer } from '../types';

export const VIDEO_SERVERS: VideoServer[] = [
  {
    id: 'movy-boise',
    name: 'Boise (Cinejoy 4K UHD)',
    badge: '4K UHD',
    isDirect: true,
    endpoint: 'boise',
    getMovieUrl: (tmdbId) => `https://zxcstream.xyz/player/movie/${tmdbId}?color=2997ff&autoplay=true`,
    getTvUrl: (tmdbId, s, e) => `https://zxcstream.xyz/player/tv/${tmdbId}/${s}/${e}?color=2997ff&autoplay=true`
  },
  {
    id: 'movy-miami',
    name: 'Miami (Cinejoy 4K Direct)',
    badge: '4K Direct',
    isDirect: true,
    endpoint: 'miami',
    getMovieUrl: (tmdbId) => `https://vidlink.pro/movie/${tmdbId}?primaryColor=2997ff&secondaryColor=000000`,
    getTvUrl: (tmdbId, s, e) => `https://vidlink.pro/tv/${tmdbId}/${s}/${e}?primaryColor=2997ff&secondaryColor=000000`
  },
  {
    id: 'movy-denver',
    name: 'Denver (Cinejoy Fast HD)',
    badge: 'Direct HD',
    isDirect: true,
    endpoint: 'denver',
    getMovieUrl: (tmdbId) => `https://vidsrc.to/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, s, e) => `https://vidsrc.to/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 'movy-delhi',
    name: 'Delhi (Cinejoy Hindi HD)',
    badge: 'Hindi HD',
    isDirect: true,
    endpoint: 'delhi',
    getMovieUrl: (tmdbId) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    getTvUrl: (tmdbId, s, e) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`
  },
  {
    id: 'vidlink',
    name: 'VidLink (Fast HD Stream)',
    badge: 'Recommended',
    getMovieUrl: (tmdbId) => `https://vidlink.pro/movie/${tmdbId}?primaryColor=2997ff&secondaryColor=000000&icons=apple`,
    getTvUrl: (tmdbId, s, e) => `https://vidlink.pro/tv/${tmdbId}/${s}/${e}?primaryColor=2997ff&secondaryColor=000000&icons=apple`
  },
  {
    id: 'zxc',
    name: 'ZXC Player (Auto-Sync HD)',
    badge: 'Auto-Sync',
    getMovieUrl: (tmdbId) => `https://zxcstream.xyz/player/movie/${tmdbId}?color=2997ff&autoplay=true`,
    getTvUrl: (tmdbId, s, e) => `https://zxcstream.xyz/player/tv/${tmdbId}/${s}/${e}?color=2997ff&autoplay=true`
  },
  {
    id: 'vidsrc-to',
    name: 'VidSrc Pro (High Speed)',
    badge: 'Multi-Sub',
    getMovieUrl: (tmdbId) => `https://vidsrc.to/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, s, e) => `https://vidsrc.to/embed/tv/${tmdbId}/${s}/${e}`
  },
  {
    id: 'vidsrc-xyz',
    name: 'VidSrc XYZ',
    badge: 'Backup',
    getMovieUrl: (tmdbId) => `https://vidsrc.xyz/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, s, e) => `https://vidsrc.xyz/embed/tv/${tmdbId}/${s}-${e}`
  },
  {
    id: 'superembed',
    name: 'SuperEmbed (Multi-Source)',
    badge: 'Universal',
    getMovieUrl: (tmdbId) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`,
    getTvUrl: (tmdbId, s, e) => `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${s}&e=${e}`
  },
  {
    id: 'autoembed',
    name: 'AutoEmbed CC',
    badge: 'Auto',
    getMovieUrl: (tmdbId) => `https://player.autoembed.cc/embed/movie/${tmdbId}`,
    getTvUrl: (tmdbId, s, e) => `https://player.autoembed.cc/embed/tv/${tmdbId}/${s}/${e}`
  }
];

export function getServerById(id: string): VideoServer {
  return VIDEO_SERVERS.find(s => s.id === id) || VIDEO_SERVERS.find(s => s.id === 'movy-boise') || VIDEO_SERVERS[0];
}
