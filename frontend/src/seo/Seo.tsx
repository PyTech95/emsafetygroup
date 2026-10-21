import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useText } from '../lib/content';
import { NOINDEX_PREFIXES, ResolvedSeo, SITE, absUrl, canonicalUrl, staticPageSeo } from './config';

// Aggiorna <head> (title, description, canonical, robots, Open Graph, Twitter, JSON-LD) a ogni cambio pagina.
// I tag hanno selettori stabili: sostituiscono quelli pre-renderizzati da scripts/seo-build.js invece di duplicarli.

function upsertMeta(attr: 'name' | 'property', key: string, content: string | undefined) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) { el?.remove(); return; }
  if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) { el = document.createElement('link'); el.setAttribute('rel', rel); document.head.appendChild(el); }
  el.setAttribute('href', href);
}

export function applySeo(seo: ResolvedSeo) {
  const robots = seo.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const image = absUrl(seo.image || SITE.image);
  document.title = seo.title;
  upsertMeta('name', 'description', seo.description);
  upsertMeta('name', 'robots', robots);
  upsertLink('canonical', seo.canonical);
  upsertMeta('property', 'og:type', seo.ogType || 'website');
  upsertMeta('property', 'og:site_name', SITE.name);
  upsertMeta('property', 'og:locale', SITE.locale);
  upsertMeta('property', 'og:title', seo.title);
  upsertMeta('property', 'og:description', seo.description);
  upsertMeta('property', 'og:url', seo.canonical);
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:image:alt', seo.title);
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', seo.title);
  upsertMeta('name', 'twitter:description', seo.description);
  upsertMeta('name', 'twitter:image', image);

  document.head.querySelectorAll('script[data-seo="jsonld"]').forEach((s) => s.remove());
  if (seo.jsonLd.length) {
    const s = document.createElement('script');
    s.type = 'application/ld+json';
    s.setAttribute('data-seo', 'jsonld');
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': seo.jsonLd });
    document.head.appendChild(s);
  }
}

/** Per le pagine dinamiche (corso, storia, 404…): applica i tag finché il componente è montato. */
export function useSeo(seo: ResolvedSeo | null) {
  const key = seo ? JSON.stringify(seo) : '';
  useEffect(() => {
    if (seo) applySeo(seo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

/** Montato nel Layout: gestisce automaticamente tutte le pagine statiche elencate in PAGES. */
export function RouteSeo() {
  const { pathname } = useLocation();
  const t = useText();
  const path = pathname !== '/' ? pathname.replace(/\/+$/, '') : '/';
  const seo = staticPageSeo(path, t);
  const noindex = NOINDEX_PREFIXES.some((p) => path.startsWith(p));
  useSeo(seo || (noindex ? { path, title: 'Verifica attestato | E.M Safety', description: SITE.description, canonical: canonicalUrl(path), noindex: true, jsonLd: [] } : null));
  return null;
}

/** Pagine da escludere dall'indice (area riservata, 404). */
export function NoIndex({ title }: { title: string }) {
  const { pathname } = useLocation();
  useSeo({ path: pathname, title, description: SITE.description, canonical: canonicalUrl(pathname), noindex: true, jsonLd: [] });
  return null;
}
