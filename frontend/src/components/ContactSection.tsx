import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Smartphone, Mail, MapPin, Clock, Building2, Send, ShieldCheck, Loader2 } from 'lucide-react';
import SectionLabel from './SectionLabel';
import { COMPANY, SERVICES } from '../data/siteContent';
import API from '../lib/api';

interface ContactProps {
  onSubmitted: (msg: string) => void;
  prefill?: { message: string } | null;
}

export default function ContactSection({ onSubmitted, prefill }: ContactProps) {
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', service: '', message: '' });
  const [sending, setSending] = useState(false);
  const [profileAdded, setProfileAdded] = useState(false);
  const lastPrefill = useRef('');

  useEffect(() => {
    if (!prefill) return;
    const previous = lastPrefill.current;
    setForm(current => ({
      ...current,
      service: current.service || 'Check-up Sicurezza',
      message: previous && current.message.includes(previous)
        ? current.message.replace(previous, prefill.message)
        : [current.message, prefill.message].filter(Boolean).join('\n\n'),
    }));
    lastPrefill.current = prefill.message;
    setProfileAdded(true);
  }, [prefill]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      await API.post('/inquiries', form);
      onSubmitted('Richiesta inviata correttamente: il team E.M Safety ti risponder\u00e0 entro 24-48 ore lavorative.');
      setForm({ name: '', company: '', email: '', phone: '', service: '', message: '' });
      setProfileAdded(false);
      lastPrefill.current = '';
    } catch {
      onSubmitted('Errore durante l\u2019invio. Riprova o scrivici a ' + COMPANY.email);
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/10 outline-none font-sans text-[14px] text-slate-800 transition-all';

  return (
    <section id="contatti" className="bg-slate-50 py-24 lg:py-28 border-t border-slate-200" data-testid="contact-section">
      <div className="max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <SectionLabel>Contattaci</SectionLabel>
          <h2 className="font-display text-[34px] sm:text-[44px] font-extrabold text-[#0b2545] tracking-tight leading-[1.08] mt-5">
            Parliamo della vostra sicurezza.
          </h2>
          <p className="font-sans text-[16.5px] text-slate-600 leading-relaxed mt-5">
            Hai bisogno di una consulenza o di un preventivo gratuito? Compila il modulo o contattaci direttamente:
            ti risponderemo entro 24-48 ore lavorative.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Contact info */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#f0f9ff] text-neutral-900 rounded-3xl p-7 shadow-xl border border-sky-100">
              <div className="flex items-center gap-2 font-display text-[19px] font-bold">
                <Building2 className="w-5 h-5 text-amber-400" /> {COMPANY.name}
              </div>

              <div className="mt-6 space-y-5">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <div className="font-sans text-[13.5px] text-slate-600 leading-relaxed">
                    <div className="font-semibold text-neutral-900">Sede Legale</div>
                    {COMPANY.legalOffice}
                    <div className="font-semibold text-neutral-900 mt-2">Sede Operativa</div>
                    {COMPANY.operativeOffice}
                  </div>
                </div>

                <div className="h-px bg-sky-200" />

                <a href={COMPANY.phoneHref} data-testid="contact-phone" className="flex items-center gap-3.5 group">
                  <Phone className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="font-sans text-[14px] text-slate-600 group-hover:text-sky-700 transition-colors">{COMPANY.phone}</span>
                </a>
                <a href={COMPANY.mobileHref} data-testid="contact-mobile" className="flex items-center gap-3.5 group">
                  <Smartphone className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="font-sans text-[14px] text-slate-600 group-hover:text-sky-700 transition-colors">{COMPANY.mobile}</span>
                </a>
                <a href={`mailto:${COMPANY.email}`} data-testid="contact-email" className="flex items-center gap-3.5 group">
                  <Mail className="w-5 h-5 text-amber-400 shrink-0" />
                  <span className="font-sans text-[14px] text-slate-600 group-hover:text-sky-700 transition-colors break-all">{COMPANY.email}</span>
                </a>

                <div className="h-px bg-sky-200" />

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
                  <span className="font-sans text-[13.5px] text-slate-600 leading-relaxed">{COMPANY.hours}</span>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-sky-200 flex items-center gap-2 font-sans text-[12px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                P.IVA {COMPANY.vat} &middot; REA {COMPANY.rea}
              </div>
            </div>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            data-testid="contact-form"
            className="lg:col-span-7 bg-white rounded-3xl p-7 sm:p-8 shadow-xl border border-slate-100"
          >
            {profileAdded && <div role="status" data-testid="contact-prefill-notice" className="mb-5 rounded-xl border border-[#b3cde8] bg-[#f0f7fd] px-4 py-3 text-[12px] leading-relaxed text-[#0b2545]">Il profilo del simulatore è stato aggiunto al messaggio. Rivedilo e completa i tuoi recapiti prima dell’invio.</div>}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Nome e Cognome *</label>
                <input required value={form.name} onChange={set('name')} className={inputCls} data-testid="input-name" placeholder="Mario Rossi" />
              </div>
              <div>
                <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Azienda</label>
                <input value={form.company} onChange={set('company')} className={inputCls} data-testid="input-company" placeholder="Nome azienda" />
              </div>
              <div>
                <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Email *</label>
                <input required type="email" value={form.email} onChange={set('email')} className={inputCls} data-testid="input-email" placeholder="email@azienda.it" />
              </div>
              <div>
                <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Telefono</label>
                <input value={form.phone} onChange={set('phone')} className={inputCls} data-testid="input-phone" placeholder="+39 ..." />
              </div>
            </div>

            <div className="mt-4">
              <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Servizio di interesse</label>
              <select value={form.service} onChange={set('service')} className={inputCls} data-testid="select-service">
                <option value="">Seleziona un servizio…</option>
                {SERVICES.map((s) => (
                  <option key={s.id} value={s.title}>{s.title}</option>
                ))}
                <option value="Check-up Sicurezza">Check-up Sicurezza</option>
                <option value="Altro">Altro / Non so ancora</option>
              </select>
            </div>

            <div className="mt-4">
              <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Messaggio *</label>
              <textarea required value={form.message} onChange={set('message')} rows={4} className={inputCls} data-testid="input-message" placeholder="Descrivi la tua esigenza…" />
            </div>

            <button
              type="submit"
              disabled={sending}
              data-testid="contact-submit"
              className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#1e6fd9] hover:bg-[#155bb0] disabled:opacity-60 text-white font-sans text-[14.5px] font-bold rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              {sending ? (<><Loader2 className="w-4 h-4 animate-spin" /> Invio in corso…</>) : (<>Invia richiesta<Send className="w-4 h-4" /></>)}
            </button>
            <p className="mt-3 font-sans text-[11.5px] text-slate-400">
              Inviando accetti il trattamento dei dati secondo il Regolamento UE 2016/679 (GDPR).
            </p>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
