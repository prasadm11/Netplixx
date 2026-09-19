export interface WatchProviderItem {
  id: number;
  name: string;
  logo: string;
  networkId?: number;
  brandColor: string;
  bgGradient: string;
  description: string;
  regionalProviderIds?: Record<string, string | number>;
  regions?: string[];
}

export const WATCH_PROVIDERS: WatchProviderItem[] = [
  {
    id: 8,
    name: 'Netflix',
    logo: 'https://image.tmdb.org/t/p/w200/rK1KljqmbvO9HQa1PBFLILWah72.png',
    networkId: 213,
    brandColor: '#E50914',
    bgGradient: 'from-[#E50914]/25 via-[#E50914]/5 to-transparent',
    description: 'Global blockbusters, award-winning dramas & Netflix Originals',
    regions: ['ALL']
  },
  {
    id: 9,
    name: 'Prime Video',
    logo: 'https://image.tmdb.org/t/p/w200/gMZdpavHmxFNnLpMHwVxfqeux2g.png',
    networkId: 1024,
    brandColor: '#00A8E1',
    bgGradient: 'from-[#00A8E1]/25 via-[#00A8E1]/5 to-transparent',
    description: 'Amazon Originals, hit action movies & acclaimed international series',
    regionalProviderIds: { IN: '119|9', US: '9', GB: '9', CA: '9', AU: '9' },
    regions: ['ALL']
  },
  {
    id: 350,
    name: 'Apple TV+',
    logo: 'https://image.tmdb.org/t/p/w200/9icYBfYFcwgCbky5VdGUIKJ4C5i.png',
    networkId: 2552,
    brandColor: '#FFFFFF',
    bgGradient: 'from-white/20 via-white/5 to-transparent',
    description: 'Star-studded Apple Original series, cinematic thrillers & features',
    regions: ['ALL']
  },
  {
    id: 337,
    name: 'Disney+',
    logo: 'https://image.tmdb.org/t/p/w200/5eZ872CghnHFLB1j8grszbrx0dx.png',
    networkId: 2739,
    brandColor: '#113CCF',
    bgGradient: 'from-[#113CCF]/25 via-[#113CCF]/5 to-transparent',
    description: 'Marvel Cinematic Universe, Star Wars, Pixar & Disney Classics',
    regionalProviderIds: { IN: '2336|122|337', US: '337', GB: '337', CA: '337', AU: '337' },
    regions: ['ALL']
  },
  {
    id: 2336,
    name: 'JioHotstar',
    logo: 'https://image.tmdb.org/t/p/w200/ledoS6EgdjTNq8F1e6wubUQer18.png',
    networkId: 3919,
    brandColor: '#0C20D6',
    bgGradient: 'from-[#0C20D6]/25 via-[#0C20D6]/5 to-transparent',
    description: 'Indian blockbusters, Hotstar Specials, regional cinema & live sports',
    regionalProviderIds: { IN: '2336|122|220' },
    regions: ['IN', 'GLOBAL']
  },
  {
    id: 237,
    name: 'Sony LIV',
    logo: 'https://image.tmdb.org/t/p/w200/coM4QWbmIOa0xJ5cGR9BRmoV25B.png',
    brandColor: '#2772DB',
    bgGradient: 'from-[#2772DB]/25 via-[#2772DB]/5 to-transparent',
    description: 'Critically acclaimed Indian thriller series, drama & Sony originals',
    regionalProviderIds: { IN: '237' },
    regions: ['IN', 'GLOBAL']
  },
  {
    id: 232,
    name: 'Zee5',
    logo: 'https://image.tmdb.org/t/p/w200/uQvhdtB8skccsGHmvKi3y5bqBsX.png',
    brandColor: '#8B24D4',
    bgGradient: 'from-[#8B24D4]/25 via-[#8B24D4]/5 to-transparent',
    description: 'Zee5 Originals, direct-to-digital films & multi-language series',
    regionalProviderIds: { IN: '232' },
    regions: ['IN', 'GLOBAL']
  },
  {
    id: 1899,
    name: 'Max',
    logo: 'https://image.tmdb.org/t/p/w200/skypuy7SXuugIQeYg0IglmzoKaS.png',
    networkId: 49,
    brandColor: '#002BE7',
    bgGradient: 'from-[#002BE7]/25 via-[#002BE7]/5 to-transparent',
    description: 'Prestige HBO series, Warner Bros. blockbusters & DC Universe',
    regions: ['US', 'GLOBAL', 'GB', 'CA', 'AU', 'IN']
  },
  {
    id: 531,
    name: 'Paramount+',
    logo: 'https://image.tmdb.org/t/p/w200/4N4BMd0Mm0kHAmF7RZgL5lW3cwc.png',
    networkId: 4330,
    brandColor: '#0064FF',
    bgGradient: 'from-[#0064FF]/25 via-[#0064FF]/5 to-transparent',
    description: 'Star Trek franchise, Yellowstone universe & cinematic classics',
    regions: ['US', 'GLOBAL', 'GB', 'CA', 'AU']
  },
  {
    id: 15,
    name: 'Hulu',
    logo: 'https://image.tmdb.org/t/p/w200/44uAnmSqvA4yBOdbPWN8YgQHjWm.png',
    networkId: 453,
    brandColor: '#1CE783',
    bgGradient: 'from-[#1CE783]/25 via-[#1CE783]/5 to-transparent',
    description: 'Next-day TV episodes, FX on Hulu & original award winners',
    regions: ['US', 'GLOBAL']
  },
  {
    id: 386,
    name: 'Peacock',
    logo: 'https://image.tmdb.org/t/p/w200/a1UIdq5BrkcAxnxcUhFsNbXnxeu.png',
    networkId: 3353,
    brandColor: '#F9C000',
    bgGradient: 'from-[#F9C000]/25 via-[#F9C000]/5 to-transparent',
    description: 'Universal Pictures cinema premieres, NBC hits & Peacock originals',
    regions: ['US', 'GLOBAL', 'GB']
  }
];

export interface RegionOption {
  code: string;
  name: string;
  flag: string;
  badge: string;
  description: string;
  catalogSubtitle: string;
  popularProviders: string[];
}

export const SUPPORTED_REGIONS: RegionOption[] = [
  {
    code: 'IN',
    name: 'India',
    flag: '🇮🇳',
    badge: 'Popular',
    description: 'Bollywood, South Indian & Regional Cinema, Indian OTT Web Series',
    catalogSubtitle: 'Netflix IN, Prime Video IN, JioHotstar, Sony LIV, Zee5',
    popularProviders: ['Netflix', 'JioHotstar', 'Prime Video', 'Sony LIV', 'Zee5']
  },
  {
    code: 'US',
    name: 'United States',
    flag: '🇺🇸',
    badge: 'Hollywood',
    description: 'Hollywood Blockbusters, Emmy Dramas & Major US Streamers',
    catalogSubtitle: 'Netflix US, Max (HBO), Disney+, Prime Video, Paramount+, Hulu, Peacock',
    popularProviders: ['Netflix', 'Max', 'Disney+', 'Prime Video', 'Hulu', 'Paramount+']
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    flag: '🇬🇧',
    badge: 'UK Catalog',
    description: 'British Cinema, Acclaimed BBC & UK Network Streaming Releases',
    catalogSubtitle: 'Netflix UK, Prime Video UK, Disney+, Apple TV+, Paramount+',
    popularProviders: ['Netflix', 'Prime Video', 'Disney+', 'Apple TV+', 'Paramount+']
  },
  {
    code: 'CA',
    name: 'Canada',
    flag: '🇨🇦',
    badge: 'Canada',
    description: 'North American Releases, Canadian Premieres & Global Streamers',
    catalogSubtitle: 'Netflix CA, Disney+, Prime Video CA, Apple TV+, Paramount+',
    popularProviders: ['Netflix', 'Disney+', 'Prime Video', 'Apple TV+', 'Paramount+']
  },
  {
    code: 'AU',
    name: 'Australia',
    flag: '🇦🇺',
    badge: 'Australia',
    description: 'Oceanic Premieres, Australian Cinema & Global Streaming Catalogs',
    catalogSubtitle: 'Netflix AU, Disney+, Prime Video AU, Apple TV+, Max',
    popularProviders: ['Netflix', 'Disney+', 'Prime Video', 'Apple TV+', 'Max']
  },
  {
    code: 'GLOBAL',
    name: 'Global / Worldwide',
    flag: '🌐',
    badge: 'Universal',
    description: 'Worldwide Popular Releases & Universal International Catalogs',
    catalogSubtitle: 'All International Streaming Providers & Worldwide Top Releases',
    popularProviders: ['All Providers', 'Netflix', 'Prime Video', 'Disney+', 'Apple TV+']
  }
];

export function getProvidersForRegion(region: string): WatchProviderItem[] {
  const normRegion = (region || 'IN').toUpperCase();

  if (normRegion === 'IN') {
    // In India: Put Indian OTT platforms and India-relevant channels front and center
    const order = [8, 2336, 9, 237, 232, 350, 337, 1899, 531];
    return order
      .map(id => WATCH_PROVIDERS.find(p => p.id === id))
      .filter((p): p is WatchProviderItem => Boolean(p));
  }

  if (normRegion === 'US') {
    // In US: Netflix, Max, Disney+, Prime, Apple TV+, Paramount+, Hulu, Peacock
    const order = [8, 1899, 337, 9, 350, 531, 15, 386];
    return order
      .map(id => WATCH_PROVIDERS.find(p => p.id === id))
      .filter((p): p is WatchProviderItem => Boolean(p));
  }

  if (normRegion === 'GB') {
    // In UK: Netflix, Prime Video, Disney+, Apple TV+, Paramount+, Peacock, Max
    const order = [8, 9, 337, 350, 531, 386, 1899];
    return order
      .map(id => WATCH_PROVIDERS.find(p => p.id === id))
      .filter((p): p is WatchProviderItem => Boolean(p));
  }

  if (normRegion === 'CA') {
    // In Canada: Netflix, Disney+, Prime Video, Apple TV+, Paramount+, Max
    const order = [8, 337, 9, 350, 531, 1899];
    return order
      .map(id => WATCH_PROVIDERS.find(p => p.id === id))
      .filter((p): p is WatchProviderItem => Boolean(p));
  }

  if (normRegion === 'AU') {
    // In Australia: Netflix, Disney+, Prime Video, Apple TV+, Paramount+, Max
    const order = [8, 337, 9, 350, 531, 1899];
    return order
      .map(id => WATCH_PROVIDERS.find(p => p.id === id))
      .filter((p): p is WatchProviderItem => Boolean(p));
  }

  // Global / Worldwide
  return WATCH_PROVIDERS.filter(p => {
    if (!p.regions || p.regions.includes('ALL')) return true;
    return p.regions.includes(normRegion) || p.regions.includes('GLOBAL');
  });
}

export interface RegionContentInfo {
  seriesTitle: string;
  seriesSubtitle: string;
  moviesTitle: string;
  moviesSubtitle: string;
}

export function getRegionContentInfo(regionCode: string): RegionContentInfo {
  const norm = (regionCode || 'IN').toUpperCase();
  switch (norm) {
    case 'IN':
      return {
        seriesTitle: 'Indian & Global TV Series',
        seriesSubtitle: 'Stream Indian original web series, acclaimed crime thrillers, and television dramas in 4K HDR.',
        moviesTitle: 'Indian & Global Cinema',
        moviesSubtitle: 'Explore Bollywood, Tollywood, Kollywood, Malayalam cinema, and international releases in 4K HDR.',
      };
    case 'US':
      return {
        seriesTitle: 'US & Global TV Series',
        seriesSubtitle: 'Stream acclaimed US network series, Emmy-winning dramas, and global hits in 4K HDR.',
        moviesTitle: 'US & Global Cinema',
        moviesSubtitle: 'Explore Hollywood blockbusters, indie festival gems, and international releases in 4K HDR.',
      };
    case 'GB':
      return {
        seriesTitle: 'British & Global TV Series',
        seriesSubtitle: 'Stream acclaimed BBC & UK television, award-winning dramas, and global hits in 4K HDR.',
        moviesTitle: 'British & Global Cinema',
        moviesSubtitle: 'Explore acclaimed British cinema, BAFTA winners, and international releases in 4K HDR.',
      };
    case 'CA':
      return {
        seriesTitle: 'Canada & Global TV Series',
        seriesSubtitle: 'Stream acclaimed Canadian & North American series, hit dramas, and releases in 4K HDR.',
        moviesTitle: 'Canada & Global Cinema',
        moviesSubtitle: 'Explore North American blockbusters, Canadian festival selections, and international cinema in 4K HDR.',
      };
    case 'AU':
      return {
        seriesTitle: 'Australia & Global TV Series',
        seriesSubtitle: 'Stream acclaimed Australian originals, international hit series, and releases in 4K HDR.',
        moviesTitle: 'Australia & Global Cinema',
        moviesSubtitle: 'Explore Australian releases, Oceanic cinema, and international favorites in 4K HDR.',
      };
    case 'GLOBAL':
    default:
      return {
        seriesTitle: 'TV Series & Shows',
        seriesSubtitle: 'Stream worldwide television series, award-winning dramas, and global hits in 4K HDR.',
        moviesTitle: 'Movies & Cinema',
        moviesSubtitle: 'Explore international blockbusters, award-winning masterpieces, and universal releases in 4K HDR.',
      };
  }
}

