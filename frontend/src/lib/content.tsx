import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import API from './api';
import { TEXT_DEFAULTS } from '../data/textRegistry';

type ContentMap = Record<string, string>;

interface ContentCtx {
  map: ContentMap;
  refresh: () => void;
}

const Ctx = createContext<ContentCtx>({ map: {}, refresh: () => {} });

export function ContentProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<ContentMap>({});
  const refresh = useCallback(() => {
    API.get('/site-content').then((r) => setMap(r.data || {})).catch(() => setMap({}));
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return <Ctx.Provider value={{ map, refresh }}>{children}</Ctx.Provider>;
}

/** Returns t(key): admin override → registry default → key. */
export function useText() {
  const { map } = useContext(Ctx);
  return useCallback((key: string) => map[key] ?? TEXT_DEFAULTS[key] ?? key, [map]);
}

export function useContentContext() {
  return useContext(Ctx);
}
