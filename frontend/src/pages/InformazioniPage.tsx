import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import PageHero from '../components/PageHero';
import WhyChooseSection from '../components/WhyChooseSection';
import AffiliazioniSection from '../components/AffiliazioniSection';
import { VALUES, IMAGES } from '../data/siteContent';
import { useAsset } from '../lib/assets';
import { useText } from '../lib/content';

export default function InformazioniPage() {
  const navigate = useNavigate();
  const asset = useAsset();
  const t = useText();
  return (
    <>
      <PageHero
        label={t('page.chi.label')}
        title={t('page.chi.title')}
        highlight={t('page.chi.highlight')}
        subtitle={t('page.chi.subtitle')}
        image={asset(IMAGES.hero)}
      />

      {/* Mission / Il Gruppo */}
      <section className="bg-white py-20 lg:py-24" data-testid="informazioni-mission">
        <div className="max-w-[1320px] 2xl:max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6 }}
              className="relative rounded-[28px] overflow-hidden shadow-2xl ring-1 ring-slate-200"
            >
              <img
                src={asset('/assets/images/safety_audit_engineer_1789049638858.jpg')}
                alt="Il gruppo E.M Safety al lavoro"
                className="w-full h-[240px] sm:h-[340px] lg:h-[440px] object-cover"
                loading="lazy"
              />
            </motion.div>
            <div>
              <h2 className="font-display text-[30px] sm:text-[40px] font-extrabold text-[#0b2545] tracking-tight leading-[1.1]">
                {t('page.chi.missionTitle')}
              </h2>
              <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-5">
                {t('page.chi.missionP1')}
              </p>
              <p className="font-sans text-[16px] text-slate-600 leading-relaxed mt-4">
                {t('page.chi.missionP2')}
              </p>
              <button
                onClick={() => navigate('/contatti')}
                data-testid="informazioni-cta"
                className="mt-8 inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b2545] hover:bg-[#07192e] text-white font-sans text-[14px] font-bold rounded-full shadow-md transition-all active:scale-95 cursor-pointer"
              >
                {t('page.chi.cta')}
                <ArrowRight className="w-4 h-4 text-[#1e6fd9]" />
              </button>
            </div>
          </div>

          {/* Values */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-16">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-[0_10px_30px_rgba(11,37,69,0.06)]"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#e8f1fc] border border-[#cfe3f8] flex items-center justify-center text-[#0b2545] mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-[17px] font-bold text-[#0b2545]">{t(`values.${i}.title`)}</h3>
                  <p className="font-sans text-[13.5px] text-slate-600 leading-relaxed mt-1.5">{t(`values.${i}.text`)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <WhyChooseSection onNavigate={() => navigate('/contatti')} />
      <AffiliazioniSection />
    </>
  );
}
