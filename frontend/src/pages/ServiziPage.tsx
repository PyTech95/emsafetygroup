import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ServicesSection from '../components/ServicesSection';
import MethodSection from '../components/MethodSection';
import { IMAGES } from '../data/siteContent';
import { useAsset } from '../lib/assets';

export default function ServiziPage() {
  const navigate = useNavigate();
  const asset = useAsset();
  return (
    <>
      <PageHero
        label="I Nostri Servizi"
        title="I nostri servizi per la"
        highlight="sicurezza sul lavoro."
        subtitle="Garantiamo conformità normativa e soluzioni su misura per ogni azienda: consulenza, sistemi di gestione, valutazioni tecniche e formazione accreditata."
        image={asset(IMAGES.training)}
      />
      <ServicesSection onNavigate={() => navigate('/contatti')} />
      <MethodSection />
    </>
  );
}
