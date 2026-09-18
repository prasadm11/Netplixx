// Movy & Vidy Streaming Service
// Reverse-engineered from https://www.movy.sx architecture

export interface StreamSource {
  quality: string;
  url: string;
}

export interface StreamSubtitle {
  lang: string;
  language: string;
  url: string;
}

export interface DecryptedStreamResult {
  sources: StreamSource[];
  subtitles: StreamSubtitle[];
  thumbnail?: string;
  playlist?: string;
}

export interface MovyServerProvider {
  id: string;
  name: string;
  endpoint: string;
  note: string;
  flag: string;
  has4K?: boolean;
}

export const MOVY_SERVERS: MovyServerProvider[] = [
  { id: 'movy-miami', name: 'Miami (Movy 4K)', endpoint: 'miami', note: 'Original audio • Direct 4K UHD', flag: '🇺🇸', has4K: true },
  { id: 'movy-boise', name: 'Boise (Movy 4K)', endpoint: 'boise', note: 'Original audio • Direct 4K UHD', flag: '🇺🇸', has4K: true },
  { id: 'movy-atlanta', name: 'Atlanta (Movy HD)', endpoint: 'atlanta', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-seattle', name: 'Seattle (Movy HD)', endpoint: 'seattle', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-denver', name: 'Denver (Movy HD)', endpoint: 'denver', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-phoenix', name: 'Phoenix (Movy HD)', endpoint: 'phoenix', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-portland', name: 'Portland (Movy HD)', endpoint: 'portland', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-austin', name: 'Austin (Movy HD)', endpoint: 'austin', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-dallas', name: 'Dallas (Movy HD)', endpoint: 'dallas', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-tampa', name: 'Tampa (Movy HD)', endpoint: 'tampa', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-orlando', name: 'Orlando (Movy HD)', endpoint: 'orlando', note: 'Original audio • Direct HD', flag: '🇺🇸' },
  { id: 'movy-munich', name: 'Munich (Movy DE)', endpoint: 'munich', note: 'German audio • Direct HD', flag: '🇩🇪' },
  { id: 'movy-berlin', name: 'Berlin (Movy DE)', endpoint: 'berlin', note: 'German audio • Direct HD', flag: '🇩🇪' },
  { id: 'movy-paris', name: 'Paris (Movy FR)', endpoint: 'paris', note: 'French audio • Direct HD', flag: '🇫🇷' },
  { id: 'movy-delhi', name: 'Delhi (Movy IN)', endpoint: 'delhi', note: 'Hindi audio • Direct HD', flag: '🇮🇳' },
  { id: 'movy-cancun', name: 'Cancun (Movy ES)', endpoint: 'cancun', note: 'Spanish audio • Direct HD', flag: '🇲🇽' },
];

const WECOLLEGE_API = 'https://api.wecollege.net';

// StreamCrypto constants
const D_CONST = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
  0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174
];
const MAGIC_BYTES = [109, 118, 109, 49]; // "mvm1"

function mix(e: number): number {
  e >>>= 0;
  e ^= e >>> 16;
  e = Math.imul(e, 0x85ebca6b) >>> 0;
  e ^= e >>> 13;
  e = Math.imul(e, 0xc2b2ae35) >>> 0;
  return (e ^= e >>> 16) >>> 0;
}

function rotl(e: number, a: number): number {
  return (e >>>= 0, 0 === (a &= 31)) ? e >>> 0 : (e << a | e >>> 32 - a) >>> 0;
}

function base64ToUint8(str: string): Uint8Array {
  const clean = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = clean.padEnd(4 * Math.ceil(clean.length / 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export function decryptStreamPayload(encPayload: string, seed: string, mediaId: number): DecryptedStreamResult {
  const cipherBytes = base64ToUint8(encPayload);
  const totalLen = cipherBytes.length;

  // Key schedule
  const S: number[] = Array(61);
  let n = mix(
    function (seedStr: string) {
      let a = 0x811c9dc5;
      for (let t = 0; t < seedStr.length; t++) {
        a = Math.imul(a ^ seedStr.charCodeAt(t), 0x1000193) >>> 0;
      }
      return mix(a);
    }(seed) ^ mix((mediaId >>> 0) ^ 0x9e3779b9)
  ) >>> 0;

  for (let e = 0; e < 8; e++) {
    if (((e * (e + 1)) & 1) === 0) {
      const a = n % 61;
      n = rotl(n + 0x9e3779b9 >>> 0, 7 + (7 & e));
      S[a] = (n ^ mix(n)) >>> 0;
      n = mix(n + a >>> 0);
    } else {
      S[e] = D_CONST[15 & e];
    }
  }

  const state = { S, acc: mix(0xa5a5a5a5 ^ n) >>> 0 };

  // Keystream generator
  const keystream = new Uint8Array(totalLen);
  let l = 0;
  for (let e = 0; e < totalLen;) {
    const a = function (st: typeof state, idx: number) {
      const sArr = st.S;
      let acc = st.acc;
      const dVal = acc % 61;
      const iVal = 0 - Number(dVal in sArr);
      const rVal = sArr[dVal] >>> 0;
      const cVal = Math.imul(0x9e3779b9, idx + 1) >>> 0;
      let bVal = (((acc ^ ((rVal ^ cVal) >>> 0)) >>> 0) | (acc & (rVal ^ cVal) & iVal) >>> 0) >>> 0;
      acc = mix((bVal = (rotl(bVal + acc >>> 0, 31 & dVal) ^ rotl(acc, 31 & Math.imul(dVal, 7))) >>> 0) + 0x9e3779b9 >>> 0);
      sArr[dVal] = acc >>> 0;
      st.acc = acc;
      return acc >>> 0;
    }(state, l++);

    keystream[e++] = 255 & a;
    if (e < totalLen) keystream[e++] = (a >>> 8) & 255;
    if (e < totalLen) keystream[e++] = (a >>> 16) & 255;
    if (e < totalLen) keystream[e++] = (a >>> 24) & 255;
  }

  // XOR cipher with keystream
  for (let e = 0; e < totalLen; e++) {
    cipherBytes[e] ^= keystream[e];
  }

  // Check magic bytes
  for (let e = 0; e < MAGIC_BYTES.length; e++) {
    if (cipherBytes[e] !== MAGIC_BYTES[e]) {
      throw new Error('Movy stream decrypt failed: signature mismatch');
    }
  }

  const payloadBytes = cipherBytes.subarray(MAGIC_BYTES.length);
  const decodedStr = new TextDecoder('utf-8').decode(payloadBytes);

  return JSON.parse(decodedStr);
}

// Memory cache for seeds
const seedCache = new Map<string, { seed: string; expiresAt: number }>();

export async function fetchMovySeed(mediaId: number): Promise<string> {
  const cacheKey = `seed_${mediaId}`;
  const now = Date.now();
  const cached = seedCache.get(cacheKey);
  if (cached && cached.expiresAt - 5000 > now) {
    return cached.seed;
  }

  const res = await fetch(`${WECOLLEGE_API}/seed?mediaId=${mediaId}`, {
    headers: {
      'Referer': 'https://www.movy.sx/',
      'Origin': 'https://www.movy.sx'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch seed for mediaId ${mediaId}: status ${res.status}`);
  }

  const data = await res.json();
  const ttl = data.ttlMs || 30000;
  seedCache.set(cacheKey, { seed: data.seed, expiresAt: now + ttl });
  return data.seed;
}

export interface FetchStreamOptions {
  tmdbId: number;
  imdbId?: string;
  mediaType: 'movie' | 'tv';
  title: string;
  year?: string | number;
  season?: number;
  episode?: number;
  serverEndpoint?: string; // 'miami' | 'boise' | etc.
}

export async function fetchDirectStream(options: FetchStreamOptions): Promise<DecryptedStreamResult | null> {
  const {
    tmdbId,
    imdbId,
    mediaType,
    title,
    year,
    season = 1,
    episode = 1,
    serverEndpoint = 'miami'
  } = options;

  try {
    const seed = await fetchMovySeed(tmdbId);

    const queryParams = new URLSearchParams({
      title: title,
      mediaType: mediaType === 'movie' ? 'movie' : 'tv',
      tmdbId: String(tmdbId),
      enc: '2',
      seed: seed
    });

    if (year) queryParams.set('year', String(year));
    if (imdbId) queryParams.set('imdbId', imdbId);

    if (mediaType === 'tv') {
      queryParams.set('seasonId', String(season));
      queryParams.set('episodeId', String(episode));
    }

    const url = `${WECOLLEGE_API}/${serverEndpoint}/sources?${queryParams.toString()}`;
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://www.movy.sx/',
        'Origin': 'https://www.movy.sx'
      }
    });

    if (!res.ok) {
      return null;
    }

    const encryptedText = await res.text();
    if (!encryptedText || encryptedText.startsWith('{') && encryptedText.includes('error')) {
      return null;
    }

    const decrypted = decryptStreamPayload(encryptedText, seed, tmdbId);
    return decrypted;
  } catch (error) {
    console.warn(`[MovyStream] Direct stream extraction failed for ${serverEndpoint}:`, error);
    return null;
  }
}

// Vidy Subtitles API search
export async function fetchVidySubtitles(tmdbId: number, mediaType: 'movie' | 'tv', season?: number, episode?: number): Promise<StreamSubtitle[]> {
  try {
    let url = `https://subtitles.vidy.st/search?id=${tmdbId}`;
    if (mediaType === 'tv' && season && episode) {
      url += `&season=${season}&episode=${episode}`;
    }

    const res = await fetch(url);
    if (!res.ok) return [];
    const list = await res.json();
    return (list || []).map((item: any) => ({
      lang: item.language || item.display || 'en',
      language: item.display || item.language || 'English',
      url: item.url
    }));
  } catch (e) {
    return [];
  }
}

// WeCollege Trailer direct streams API
export async function fetchWeCollegeTrailer(imdbId?: string): Promise<string | null> {
  if (!imdbId || !imdbId.startsWith('tt')) return null;
  try {
    const res = await fetch(`https://trailers.wecollege.net/getOldestTrailer?id=${imdbId}`);
    if (!res.ok) return null;
    const data = await res.json();
    const streams = data?.trailer?.streams;
    if (Array.isArray(streams) && streams.length > 0) {
      const best = streams.find((s: any) => s.quality === '1080p') || streams[0];
      return best?.url || null;
    }
    return null;
  } catch (e) {
    return null;
  }
}
