import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AssetsProvider } from './lib/assets';
import { ContentProvider } from './lib/content';
import API from './lib/api';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import InformazioniPage from './pages/InformazioniPage';
import ServiziPage from './pages/ServiziPage';
import TestimonianzePage from './pages/TestimonianzePage';
import FaqPage from './pages/FaqPage';
import ContattiPage from './pages/ContattiPage';
import StoriePage from './pages/StoriePage';
import StoriaDetailPage from './pages/StoriaDetailPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
}

function VisitTracker() {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;
    API.post('/track/visit', { path: location.pathname }).catch(() => {});
  }, [location.pathname]);
  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50" data-testid="auth-loading">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-[#0b2545] rounded-full animate-spin" />
      </div>
    );
  }
  if (user === false) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
}

export default function App() {
  useLenis();
  return (
    <BrowserRouter>
      <AuthProvider>
        <AssetsProvider>
          <ContentProvider>
          <VisitTracker />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/informazioni" element={<InformazioniPage />} />
              <Route path="/servizi" element={<ServiziPage />} />
              <Route path="/testimonianze" element={<TestimonianzePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/contatti" element={<ContattiPage />} />
              <Route path="/storie" element={<StoriePage />} />
              <Route path="/storie/:id" element={<StoriaDetailPage />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          </ContentProvider>
        </AssetsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
