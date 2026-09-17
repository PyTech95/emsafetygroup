import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import EditorialMarquee from '../components/EditorialMarquee';
import SectionChapter from '../components/SectionChapter';
import SgiSection from '../components/SgiSection';
import ServicesSection from '../components/ServicesSection';
import { SafetyTools } from '../components/SafetyTools';
import CoursesSection from '../components/CoursesSection';
import WhyChooseSection from '../components/WhyChooseSection';
import AffiliazioniSection from '../components/AffiliazioniSection';
import FaqSection from '../components/FaqSection';
import ContactSection from '../components/ContactSection';
import FounderSection from '../components/FounderSection';
import GruppoSection from '../components/GruppoSection';
import ClientiSection from '../components/ClientiSection';
import { CheckCircle2 } from 'lucide-react';
import { scrollToId } from '../lib/scroll';

export default function HomePage() {
  const location = useLocation();
  const [toast, setToast] = useState<string | null>(null);
  const [contactPrefill, setContactPrefill] = useState<{ message: string } | null>(null);
  const requestCheckup = (message: string) => {
    setContactPrefill({ message });
    scrollToId('contatti');
  };

  useEffect(() => {
    const target = (location.state as { scrollTo?: string } | null)?.scrollTo;
    if (target) {
      setTimeout(() => scrollToId(target), 80);
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  return (
    <>
      <HeroSection onNavigate={scrollToId} />
      <EditorialMarquee />
      <SectionChapter number="01" title="Sistemi di Gestione" />
      <SgiSection />
      <SectionChapter number="02" title="I Nostri Servizi" />
      <ServicesSection onNavigate={scrollToId} />
      <SafetyTools onRequest={requestCheckup} />
      <SectionChapter number="04" title="Formazione" />
      <CoursesSection onNavigate={scrollToId} />
      <SectionChapter number="05" title="Perché Sceglierci" />
      <WhyChooseSection onNavigate={scrollToId} />
      <SectionChapter number="06" title="Affiliazioni" />
      <AffiliazioniSection />
      <SectionChapter number="07" title="Il Gruppo" />
      <GruppoSection />
      <SectionChapter number="08" title="Hanno Creduto in Noi" />
      <ClientiSection />
      <SectionChapter number="09" title="Domande Frequenti" />
      <FaqSection />
      <SectionChapter number="10" title="Contatti" />
      <ContactSection onSubmitted={showToast} prefill={contactPrefill} />
      <SectionChapter number="11" title="Il Fondatore" />
      <FounderSection />

      {toast && (
        <div data-testid="toast-message" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#0b2545] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#1e6fd9]/50 max-w-md text-center">
          <CheckCircle2 className="w-5 h-5 text-[#1e6fd9] shrink-0" />
          <span className="font-sans text-[13px] font-medium text-slate-100">{toast}</span>
        </div>
      )}
    </>
  );
}
