export function scrollToId(id: string) {
  if (id === 'hero') {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    const headerHeight = document.querySelector('[data-testid="site-header"]')?.getBoundingClientRect().height || 0;
    const y = el.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true });
      else window.scrollTo({ top: y });
    } else if (window.__lenis) {
      window.__lenis.scrollTo(y, { duration: 1.2 });
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }
}
