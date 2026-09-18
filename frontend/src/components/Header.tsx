import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, Phone } from 'lucide-react';
import EmSafetyLogo from './EmSafetyLogo';
import { COMPANY } from '../data/siteContent';

const NAV: { label: string; route: string }[] = [
  { label: 'Home', route: '/' },
  { label: 'Chi Siamo', route: '/informazioni' },
  { label: 'Servizi', route: '/servizi' },
  { label: 'Storie', route: '/storie' },
  { label: 'Testimonianze', route: '/testimonianze' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Contatti', route: '/contatti' },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (route: string) => {
    setOpen(false);
    navigate(route);
    window.scrollTo({ top: 0 });
  };

  const isActive = (route: string) =>
    route === '/' ? location.pathname === '/' : location.pathname.startsWith(route);

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white ${
        scrolled ? 'shadow-[0_2px_20px_rgba(11,37,69,0.08)]' : ''
      } border-b border-slate-200/80`}
    >
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 h-[80px] sm:h-[104px] lg:h-[120px] flex items-center justify-between gap-3">
        <button onClick={() => go('/')} className="text-left flex items-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity" aria-label="E.M Safety Home" data-testid="logo-home-button">
          <EmSafetyLogo variant="navy" size="sm" showTagline showSlogan sloganPlacement="right" />
        </button>

        <nav className="hidden xl:flex items-center gap-0.5 shrink-0 whitespace-nowrap" aria-label="Navigazione principale" data-testid="desktop-navigation">
          {NAV.map((item) => {
            const active = isActive(item.route);
            return (
              <button key={item.route} onClick={() => go(item.route)} data-testid={`nav-${item.route.replace('/', '') || 'home'}`}
                className={`relative px-2.5 py-2 font-sans text-[13px] font-semibold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  active ? 'text-[#0b2545]' : 'text-slate-600 hover:text-[#0b2545]'
                }`}>
                {item.label}
                <span className={`absolute left-3 right-3 -bottom-0.5 h-0.5 rounded-full bg-[#1e6fd9] transition-transform origin-left ${active ? 'scale-x-100' : 'scale-x-0'}`} />
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5 shrink-0">
          <a href={COMPANY.phoneHref} data-testid="header-phone" className="hidden md:inline-flex items-center gap-2 font-sans text-[13px] font-semibold whitespace-nowrap shrink-0 text-slate-700 hover:text-[#0b2545] transition-colors">
            <Phone className="w-4 h-4 text-[#1e6fd9]" />
            <span>{COMPANY.phone}</span>
          </a>
          <button onClick={() => setOpen(!open)} className="xl:hidden p-2.5 text-[#1e6fd9] hover:bg-[#e8f1fc] rounded-xl border border-[#cfe3f8] cursor-pointer" aria-label="Menu" aria-expanded={open} aria-controls="mobile-navigation" data-testid="mobile-menu-toggle">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" data-testid="mobile-navigation" className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 shadow-xl">
          <div className="space-y-1">
            {NAV.map((item) => (
              <button key={item.route} onClick={() => go(item.route)} data-testid={`mobile-nav-${item.route.replace('/', '') || 'home'}`}
                className={`w-full text-left px-4 py-3.5 font-sans text-[15.5px] font-semibold rounded-xl transition-colors flex items-center justify-between cursor-pointer ${
                  isActive(item.route) ? 'text-[#155bb0] bg-[#e8f1fc]' : 'text-slate-700 hover:text-[#155bb0] hover:bg-[#f0f7fd]'
                }`}>
                <span>{item.label}</span>
                <ArrowRight className="w-[18px] h-[18px] text-[#1e6fd9]" />
              </button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
            <a href={COMPANY.phoneHref} data-testid="mobile-menu-call"
              className="inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#e8f1fc] text-[#155bb0] font-sans text-[14px] font-bold">
              <Phone className="w-4 h-4" /> Chiama ora
            </a>
            <button onClick={() => go('/contatti')} data-testid="mobile-menu-quote"
              className="inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#1e6fd9] text-white font-sans text-[14px] font-bold cursor-pointer">
              Preventivo
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
