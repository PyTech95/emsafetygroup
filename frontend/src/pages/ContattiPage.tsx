import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import PageHero from '../components/PageHero';
import ContactSection from '../components/ContactSection';

export default function ContattiPage() {
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  return (
    <>
      <PageHero
        label="Contatti"
        title="Contattaci per assistenza e"
        highlight="informazioni sui nostri servizi."
        subtitle="Hai bisogno di una consulenza o di un preventivo gratuito? Compila il modulo o contattaci direttamente: ti risponderemo entro 24-48 ore lavorative."
      />

      <ContactSection onSubmitted={showToast} />

      {toast && (
        <div
          data-testid="toast-message"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-[#0b2545] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-[#1e6fd9]/50 max-w-md text-center"
        >
          <CheckCircle2 className="w-5 h-5 text-[#1e6fd9] shrink-0" />
          <span className="font-sans text-[13px] font-medium text-slate-100">{toast}</span>
        </div>
      )}
    </>
  );
}
