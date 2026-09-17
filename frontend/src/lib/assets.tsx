import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import API, { BACKEND } from './api';

type AssetMap = Record<string, string>;

interface AssetsCtx {
  map: AssetMap;
  refresh: () => void;
  loading: boolean;
}

const Ctx = createContext<AssetsCtx>({ map: {}, refresh: () => {}, loading: true });

export function resolveAsset(map: AssetMap, path?: string | null): string {
  if (!path) return path || '';
  const override = map[path];
  if (!override) return path;
  return override.startsWith('/api') ? `${BACKEND}${override}` : override;
}

export function AssetsProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<AssetMap>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    API.get('/site-assets')
      .then((r) => setMap(r.data || {}))
      .catch(() => setMap({}))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <Ctx.Provider value={{ map, refresh, loading }}>{children}</Ctx.Provider>;
}

/** Returns a resolver: asset('/assets/images/x.jpg') -> override URL or original path. */
export function useAsset() {
  const { map } = useContext(Ctx);
  return useCallback((p?: string | null) => resolveAsset(map, p), [map]);
}

export function useAssetsContext() {
  return useContext(Ctx);
}
