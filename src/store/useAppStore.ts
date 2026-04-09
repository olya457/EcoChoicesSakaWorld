import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect, useCallback, useRef } from 'react';

interface StoreData {
  ecoPoints: number;
  readArticles: string[];
  savedArticles: string[];
  musicEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface AppState extends StoreData {
  addPoints: (pts: number) => void;
  markArticleRead: (id: string) => void;
  toggleSaveArticle: (id: string) => void;
  setMusic: (val: boolean) => void;
  setVibration: (val: boolean) => void;
  resetProgress: () => void;
  clearSaved: () => void;
}

const KEY = 'eco_app_state';

const DEFAULT: StoreData = {
  ecoPoints: 0,
  readArticles: [],
  savedArticles: [],
  musicEnabled: true,
  vibrationEnabled: true,
};

let globalData: StoreData = { ...DEFAULT };
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

function updateData(next: Partial<StoreData>) {
  globalData = { ...globalData, ...next };
  notify();
  AsyncStorage.setItem(KEY, JSON.stringify(globalData)).catch(() => {});
}

const actions = {
  addPoints(pts: number) {
    updateData({ ecoPoints: Math.min(100, globalData.ecoPoints + pts) });
  },
  markArticleRead(id: string) {
    if (globalData.readArticles.includes(id)) return;
    updateData({
      readArticles: [...globalData.readArticles, id],
      ecoPoints: Math.min(100, globalData.ecoPoints + 2),
    });
  },
  toggleSaveArticle(id: string) {
    const already = globalData.savedArticles.includes(id);
    updateData({
      savedArticles: already
        ? globalData.savedArticles.filter((a) => a !== id)
        : [...globalData.savedArticles, id],
    });
  },
  setMusic(val: boolean) {
    updateData({ musicEnabled: val });
  },
  setVibration(val: boolean) {
    updateData({ vibrationEnabled: val });
  },
  resetProgress() {
    updateData({ ecoPoints: 0, readArticles: [] });
  },
  clearSaved() {
    updateData({ savedArticles: [] });
  },
};

let initialized = false;

async function init() {
  if (initialized) return;
  initialized = true;
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreData;
      globalData = { ...DEFAULT, ...parsed };
      notify();
    }
  } catch (_) {}
}

export function useAppStore(): AppState {
  const [, rerender] = useState(0);

  useEffect(() => {
    const fn = () => rerender((n) => n + 1);
    listeners.add(fn);
    init();
    return () => { listeners.delete(fn); };
  }, []);

  return {
    ...globalData,
    ...actions,
  };
}