import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import FloatingCall from './FloatingCall';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900" data-testid="layout-root">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <FloatingCall />
    </div>
  );
}
