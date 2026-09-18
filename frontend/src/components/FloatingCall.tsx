import { Phone } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { COMPANY } from '../data/siteContent';
import { useText } from '../lib/content';

export default function FloatingCall() {
  const t = useText();
  const { pathname } = useLocation();
  if (pathname.startsWith('/admin')) return null;
  const phone = t('company.phone');
  const href = `tel:${phone.replace(/\s+/g, '')}` || COMPANY.phoneHref;
  return (
    <a
      href={href}
      data-testid="floating-call-button"
      aria-label={`${t('floating.call.label')} ${phone}`}
      className="floating-call group fixed z-[55] bottom-5 right-4 sm:bottom-7 sm:right-7 inline-flex items-center gap-3 pl-1.5 pr-5 py-1.5 rounded-full bg-[#1e6fd9] text-white shadow-[0_14px_40px_rgba(30,111,217,0.45)] hover:bg-[#155bb0] transition-[background-color,transform] hover:-translate-y-0.5 active:scale-95"
    >
      <span className="relative w-11 h-11 rounded-full bg-white text-[#1e6fd9] flex items-center justify-center shrink-0">
        <span className="floating-call-ring absolute inset-0 rounded-full border-2 border-white/70" aria-hidden="true" />
        <Phone className="w-5 h-5 relative" strokeWidth={2.4} />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-sans text-[10px] font-bold uppercase tracking-[0.18em] text-white/80">{t('floating.call.label')}</span>
        <span className="font-sans text-[14.5px] font-extrabold whitespace-nowrap mt-1" data-testid="floating-call-number">{phone}</span>
      </span>
    </a>
  );
}
