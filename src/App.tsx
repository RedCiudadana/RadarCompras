import React, { useState } from 'react';
import { Navigation } from './components/layout/Navigation';
import { Home } from './components/home/Home';
import { ProcessSearch } from './components/search/ProcessSearch';
import { ProcessDetail } from './components/detail/ProcessDetail';
import { OpportunitiesRadar } from './components/opportunities/OpportunitiesRadar';
import { Analytics } from './components/analytics/Analytics';
import { Trends } from './components/trends/Trends';
import { Documentation } from './components/docs/Documentation';
import { Release } from './types/ocds';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedRelease, setSelectedRelease] = useState<Release | null>(null);

  const handleSelectProcess = (release: Release) => {
    setSelectedRelease(release);
    setCurrentView('detail');
  };

  const handleBackFromDetail = () => {
    setSelectedRelease(null);
    setCurrentView('search');
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home onNavigate={setCurrentView} />;
      case 'search':
        return <ProcessSearch onSelectProcess={handleSelectProcess} />;
      case 'detail':
        return <ProcessDetail release={selectedRelease || undefined} onBack={handleBackFromDetail} />;
      case 'opportunities':
        return <OpportunitiesRadar onSelectProcess={handleSelectProcess} />;
      case 'analytics':
        return <Analytics />;
      case 'trends':
        return <Trends />;
      case 'docs':
        return <Documentation />;
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navigation currentView={currentView} onNavigate={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-bold mb-3">Radar de Compras Públicas</h3>
              <p className="text-gray-300 text-sm">
                Plataforma de inteligencia de mercado que transforma datos abiertos
                en información útil para empresas y ciudadanía.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Enlaces Rápidos</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <button onClick={() => setCurrentView('opportunities')} className="text-gray-300 hover:text-white transition-colors">
                    Oportunidades
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('analytics')} className="text-gray-300 hover:text-white transition-colors">
                    Analytics
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('trends')} className="text-gray-300 hover:text-white transition-colors">
                    Tendencias
                  </button>
                </li>
                <li>
                  <button onClick={() => setCurrentView('docs')} className="text-gray-300 hover:text-white transition-colors">
                    Documentación API
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-3">Datos Abiertos</h3>
              <p className="text-gray-300 text-sm mb-2">Fuente oficial de datos:</p>
              <a
                href="https://ocds.guatecompras.gt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                OCDS Guatemala (MINFIN / Guatecompras)
              </a>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              Desarrollado por Red Ciudadana - Promoviendo transparencia y participación ciudadana
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
