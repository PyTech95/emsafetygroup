import { useEffect, useState, useCallback } from 'react';
import API, { BACKEND } from './api';

export type LogoSection = 'clients' | 'group' | 'affiliations';

export interface Logo {
  id: string;
  section: LogoSection;
  name: string;
  description: string;
  image_url: string;
  dark: boolean;
  order: number;
}

export const logoSrc = (url: string) => (url.startsWith('/api') ? `${BACKEND}${url}` : url);

export function useLogos(section: LogoSection) {
  const [logos, setLogos] = useState<Logo[] | null>(null);
  const refresh = useCallback(() => {
    API.get('/logos', { params: { section } }).then((r) => setLogos(r.data)).catch(() => setLogos([]));
  }, [section]);
  useEffect(() => { refresh(); }, [refresh]);
  return { logos: logos ?? [], loaded: logos !== null, refresh };
}
