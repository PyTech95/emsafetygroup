import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Lock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import EmSafetyLogo from '../components/EmSafetyLogo';

export default function AdminLogin() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && user !== null) navigate('/admin', { replace: true });
  }, [user, navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      navigate('/admin', { replace: true });
    } catch (err: any) {
      const d = err?.response?.data?.detail;
      setError(typeof d === 'string' ? d : 'Accesso non riuscito. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-[#0b2545] focus:ring-2 focus:ring-[#0b2545]/10 outline-none font-sans text-[14px] text-slate-800 transition-all';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 px-4" data-testid="admin-login-page">
      <button onClick={() => navigate('/')} data-testid="admin-login-back" className="absolute top-6 left-6 inline-flex items-center gap-2 font-sans text-[13px] font-semibold text-slate-500 hover:text-[#0b2545] cursor-pointer">
        <ArrowLeft className="w-4 h-4" /> Torna al sito
      </button>
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
        <div className="flex justify-center mb-6"><EmSafetyLogo variant="navy" size="sm" showTagline showSlogan={false} /></div>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#0b2545] text-amber-400 flex items-center justify-center mx-auto mb-3"><Lock className="w-5 h-5" /></div>
          <h1 className="font-display text-[22px] font-bold text-[#0b2545]">Area Riservata</h1>
          <p className="font-sans text-[13px] text-slate-500 mt-1">Accedi per gestire le storie di successo</p>
        </div>
        <form onSubmit={submit} className="space-y-4" data-testid="admin-login-form">
          <div>
            <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} data-testid="login-email" placeholder="admin@emsafetygroup.it" />
          </div>
          <div>
            <label className="block font-sans text-[12.5px] font-semibold text-slate-600 mb-1.5">Password</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className={inputCls} data-testid="login-password" placeholder="••••••••" />
          </div>
          {error && <p className="font-sans text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2" data-testid="login-error">{error}</p>}
          <button type="submit" disabled={loading} data-testid="login-submit" className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#0b2545] hover:bg-[#07192e] disabled:opacity-60 text-white font-sans text-[14.5px] font-bold rounded-xl shadow-lg transition-all active:scale-95 border-b-2 border-amber-400 cursor-pointer">
            {loading ? 'Accesso…' : (<><LogIn className="w-4 h-4" /> Accedi</>)}
          </button>
        </form>
      </div>
    </div>
  );
}
