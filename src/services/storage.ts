import { ContinueWatchingItem, WatchlistItem, PlayerSettings } from '../types';

const STORAGE_KEYS = {
  CONTINUE_WATCHING: 'netplix_continue_watching',
  WATCHLIST: 'netplix_watchlist',
  FAVORITES: 'netplix_favorites',
  SETTINGS: 'netplix_player_settings'
};

const LEGACY_KEYS = {
  CONTINUE_WATCHING: 'cinejoy_continue_watching',
  WATCHLIST: 'cinejoy_watchlist',
  FAVORITES: 'cinejoy_favorites',
  SETTINGS: 'cinejoy_player_settings'
};

export const DEFAULT_SETTINGS: PlayerSettings = {
  defaultServer: 'movy-boise',
  autoPlayNext: true,
  autoSkipIntro: true,
  accentColor: '#2997ff',
  subtitleLang: 'en',
  region: 'IN',
  indianLanguage: 'all'
};

export function getRegion(): string {
  try {
    const settings = getPlayerSettings();
    return settings.region || 'IN';
  } catch (e) {
    return 'IN';
  }
}

export function setRegion(region: string): void {
  try {
    const settings = getPlayerSettings();
    savePlayerSettings({ ...settings, region });
  } catch (e) {
    console.error('Failed to set region:', e);
  }
}

// Continue Watching
export function getContinueWatching(): ContinueWatchingItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.CONTINUE_WATCHING) || localStorage.getItem(LEGACY_KEYS.CONTINUE_WATCHING);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get continue watching:', e);
    return [];
  }
}

export function saveContinueWatching(item: Omit<ContinueWatchingItem, 'updatedAt'>): void {
  try {
    const list = getContinueWatching();
    const existingIndex = list.findIndex(
      i => i.id === item.id && i.mediaType === item.mediaType
    );

    const updatedItem: ContinueWatchingItem = {
      ...item,
      updatedAt: Date.now()
    };

    if (existingIndex > -1) {
      list[existingIndex] = updatedItem;
    } else {
      list.unshift(updatedItem);
    }

    // Keep maximum 30 items
    localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(list.slice(0, 30)));
  } catch (e) {
    console.error('Failed to save continue watching:', e);
  }
}

export function removeContinueWatching(id: number, mediaType: 'movie' | 'tv'): void {
  try {
    const list = getContinueWatching().filter(
      i => !(i.id === id && i.mediaType === mediaType)
    );
    localStorage.setItem(STORAGE_KEYS.CONTINUE_WATCHING, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to remove continue watching:', e);
  }
}

// Watchlist
export function getWatchlist(): WatchlistItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST) || localStorage.getItem(LEGACY_KEYS.WATCHLIST);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get watchlist:', e);
    return [];
  }
}

export function addToWatchlist(item: Omit<WatchlistItem, 'addedAt'>): void {
  try {
    const list = getWatchlist();
    if (!list.some(i => i.id === item.id && i.mediaType === item.mediaType)) {
      list.unshift({ ...item, addedAt: Date.now() });
      localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Failed to add to watchlist:', e);
  }
}

export function removeFromWatchlist(id: number, mediaType: 'movie' | 'tv'): void {
  try {
    const list = getWatchlist().filter(
      i => !(i.id === id && i.mediaType === mediaType)
    );
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to remove from watchlist:', e);
  }
}

export function isInWatchlist(id: number, mediaType: 'movie' | 'tv'): boolean {
  return getWatchlist().some(i => i.id === id && i.mediaType === mediaType);
}

// Favorites
export function getFavorites(): WatchlistItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.FAVORITES) || localStorage.getItem(LEGACY_KEYS.FAVORITES);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to get favorites:', e);
    return [];
  }
}

export function addToFavorites(item: Omit<WatchlistItem, 'addedAt'>): void {
  try {
    const list = getFavorites();
    if (!list.some(i => i.id === item.id && i.mediaType === item.mediaType)) {
      list.unshift({ ...item, addedAt: Date.now() });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(list));
    }
  } catch (e) {
    console.error('Failed to add to favorites:', e);
  }
}

export function removeFromFavorites(id: number, mediaType: 'movie' | 'tv'): void {
  try {
    const list = getFavorites().filter(
      i => !(i.id === id && i.mediaType === mediaType)
    );
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(list));
  } catch (e) {
    console.error('Failed to remove from favorites:', e);
  }
}

export function isInFavorites(id: number, mediaType: 'movie' | 'tv'): boolean {
  return getFavorites().some(i => i.id === id && i.mediaType === mediaType);
}

// Player Settings
export function getPlayerSettings(): PlayerSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS) || localStorage.getItem(LEGACY_KEYS.SETTINGS);
    return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
  } catch (e) {
    return DEFAULT_SETTINGS;
  }
}

export function savePlayerSettings(settings: Partial<PlayerSettings>): void {
  try {
    const current = getPlayerSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    localStorage.setItem(LEGACY_KEYS.SETTINGS, JSON.stringify(updated));

    if (settings.region) {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('region-changed', { detail: { region: settings.region } }));
      }
    }
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

