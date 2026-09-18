import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import EmSafetyLogo from './EmSafetyLogo';
import LegalModal from './LegalModal';
import { COMPANY } from '../data/siteContent';
import { useText } from '../lib/content';

const NAV: { label: string; route: string }[] = [
  { label: 'Chi Siamo', route: '/informazioni' },
  { label: 'I Nostri Servizi', route: '/servizi' },
  { label: 'Storie di Successo', route: '/storie' },
  { label: 'Testimonianze', route: '/testimonianze' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Contatti & Preventivo', route: '/contatti' },
];

const LEGAL: Record<string, string> = {
  'Privacy Policy':
    'E.M Safety S.r.l. tutela la riservatezza dei dati personali conferiti ai sensi del Regolamento UE 2016/679 (GDPR). I dati raccolti tramite form o contatto diretto sono trattati unicamente per rispondere alle richieste commerciali e gestire l\u2019erogazione delle attività formative e consulenziali.',
  'Cookie Policy':
    'Il presente sito utilizza esclusivamente cookie tecnici essenziali per garantire la corretta navigazione. Non viene effettuata profilazione pubblicitaria senza esplicito consenso preventivo.',
  'Termini e Condizioni':
    'Le iscrizioni ai corsi e gli incarichi professionali sono regolati dalle condizioni di contratto siglate in sede di preventivo approvato. Gli attestati vengono emessi a seguito del superamento dei test e del rispetto della frequenza minima prevista.',
};

export default function Footer() {
  const navigate = useNavigate();
  const t = useText();
  const [legal, setLegal] = useState<{ open: boolean; title: string; content: string }>({ open: false, title: '', content: '' });

  const go = (route: string) => {
    navigate(route);
    window.scrollTo({ top: 0 });
  };

  return (
    <footer className="w-full bg-slate-50 text-slate-600 border-t-4 border-[#0b2545]" data-testid="footer">
      <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-24 sm:pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-200">
          <div className="lg:col-span-5 flex flex-col gap-4">
            <EmSafetyLogo variant="navy" size="lg" showTagline showSlogan sloganPlacement="below" />
            <p className="font-sans text-[13.5px] text-slate-500 max-w-md leading-relaxed" data-testid="footer-description">
              {t('footer.description')}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-2.5 select-text">
            <span className="font-sans text-[12px] font-bold text-[#1e6fd9] tracking-widest uppercase pb-1">Sedi &amp; Contatti</span>
            <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed"><strong className="text-neutral-900">Sede Legale:</strong> {t('company.legalOffice')}</p>
            <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed"><strong className="text-neutral-900">Sede Operativa:</strong> {t('company.operativeOffice')}</p>
            <p className="font-sans text-[13.5px] text-slate-300 pt-1">
              <strong className="text-neutral-900">Tel:</strong>{' '}
              <a href={COMPANY.phoneHref} className="text-sky-700 hover:text-neutral-900 transition-colors font-semibold">{t('company.phone')}</a>{' '}·{' '}
              <a href={COMPANY.mobileHref} className="text-sky-700 hover:text-neutral-900 transition-colors font-semibold">{t('company.mobile')}</a>
            </p>
            <p className="font-sans text-[13.5px] text-slate-300"><strong className="text-neutral-900">Email:</strong>{' '}
              <a href={`mailto:${t('company.email')}`} className="text-slate-600 hover:text-sky-700 transition-colors">{t('company.email')}</a></p>
            <p className="font-sans text-[13.5px] text-slate-300"><strong className="text-neutral-900">PEC:</strong>{' '}
              <a href={`mailto:${t('company.pec')}`} className="text-slate-600 hover:text-sky-700 transition-colors break-all">{t('company.pec')}</a></p>
          </div>

          <div className="lg:col-span-3 flex flex-col gap-2.5">
            <span className="font-sans text-[12px] font-bold text-[#1e6fd9] tracking-widest uppercase pb-1">Navigazione</span>
            <ul className="font-sans text-[13.5px] text-slate-600 flex flex-col gap-2.5">
              {NAV.map((n) => (
                <li key={n.route}>
                  <button onClick={() => go(n.route)} data-testid={`footer-nav-${n.route.replace('/', '') || 'home'}`} className="hover:text-sky-700 transition-colors text-left cursor-pointer">{n.label}</button>
                </li>
              ))}
              <li>
                <button onClick={() => navigate('/admin/login')} data-testid="footer-admin-link" className="hover:text-sky-700 transition-colors text-left cursor-pointer text-slate-400">Area Riservata</button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 font-sans text-[12px] text-slate-500 select-text">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-center md:text-left">
            <span>© {new Date().getFullYear()} E.M SAFETY S.R.L.</span><span>·</span>
            <span>P.IVA {t('company.vat')}</span><span>·</span><span>N° REA {t('company.rea')}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-sans text-[12.5px]">
            {Object.keys(LEGAL).map((title) => (
              <button key={title} onClick={() => setLegal({ open: true, title, content: LEGAL[title] })}
                data-testid={`footer-legal-${title.replace(/\s+/g, '-').toLowerCase()}`}
                className="hover:text-sky-700 transition-colors cursor-pointer">{title}</button>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-center">
          <p className="font-sans text-[12px] text-slate-400 tracking-wide" data-testid="footer-credit">
            {t('footer.credit')}{' '}
            <a href="https://pytechdigital.com" target="_blank" rel="noopener noreferrer"
              data-testid="footer-credit-pytech"
              className="font-semibold text-[#1e6fd9] hover:text-[#155bb0] underline-offset-2 hover:underline transition-colors">
              Pytech
            </a>
          </p>
        </div>
      </div>

      <LegalModal isOpen={legal.open} title={legal.title} content={legal.content} onClose={() => setLegal({ open: false, title: '', content: '' })} />
    </footer>
  );
}
