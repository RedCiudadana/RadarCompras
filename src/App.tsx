import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { Home } from './components/home/Home';
import { ProcessSearch } from './components/search/ProcessSearch';
import { ProcessDetail } from './components/detail/ProcessDetail';
import { OpportunitiesRadar } from './components/opportunities/OpportunitiesRadar';
import { Analytics } from './components/analytics/Analytics';
import { Trends } from './components/trends/Trends';
import { Documentation } from './components/docs/Documentation';
import Footer from './Footer';
import { HeroSlider } from './components/ui/HeroSlider';

const SLIDERS_CONFIG: Record<string, { title: string; slider: string; }> = {
  '/': {
    title: 'Radar de Compras',
    slider: '/slider_27.png'
  }
};

const DEFAULT_SLIDER_CONFIG = {
  title: 'Radar de Compras',
  slider: '/slider_27.png'
};

function AppShell() {
  const location = useLocation();

  const isHOME = location.pathname === '/';

  console.log(isHOME, location)

  const banner = SLIDERS_CONFIG[location.pathname] || DEFAULT_SLIDER_CONFIG;

  return (
    <div className="min-h-screen bg-neutral">
      <Navigation />
      {!isHOME && <HeroSlider title={banner.title} backgroundImage={banner.slider} />}
      {isHOME ? <Home /> : (<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 pt-20 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/busqueda" element={<ProcessSearch />} />
          <Route path="/busqueda/:releaseId" element={<ProcessDetail />} />
          <Route path="/oportunidades" element={<OpportunitiesRadar />} />
          {/* <Route path="/estadisticas" element={<Analytics />} /> */}
          <Route path="/tendencias" element={<Trends />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>)}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
