import { useNavigate } from 'react-router-dom';
import PageHero from '../components/PageHero';
import ServicesSection from '../components/ServicesSection';
import MethodSection from '../components/MethodSection';
import { IMAGES } from '../data/siteContent';
import { useAsset } from '../lib/assets';
import { useText } from '../lib/content';

export default function ServiziPage() {
  const navigate = useNavigate();
  const asset = useAsset();
  const t = useText();
  return (
    <>
      <PageHero
        label={t('page.servizi.label')}
        title={t('page.servizi.title')}
        highlight={t('page.servizi.highlight')}
        subtitle={t('page.servizi.subtitle')}
        image={asset(IMAGES.training)}
      />
      <ServicesSection onNavigate={() => navigate('/contatti')} />
      <MethodSection />
    </>
  );
}
