import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/layout/Navigation';
import { Home } from './components/home/Home';
import { ProcessSearch } from './components/search/ProcessSearch';
import { ProcessDetail } from './components/detail/ProcessDetail';
import { OpportunitiesRadar } from './components/opportunities/OpportunitiesRadar';
import { Analytics } from './components/analytics/Analytics';
import { Trends } from './components/trends/Trends';
import { Documentation } from './components/docs/Documentation';

function AppShell() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/busqueda" element={<ProcessSearch />} />
          <Route path="/busqueda/:releaseId" element={<ProcessDetail />} />
          <Route path="/oportunidades" element={<OpportunitiesRadar />} />
          <Route path="/estadisticas" element={<Analytics />} />
          <Route path="/tendencias" element={<Trends />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
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
                <li><a href="/oportunidades" className="text-gray-300 hover:text-white transition-colors">Oportunidades</a></li>
                <li><a href="/estadisticas" className="text-gray-300 hover:text-white transition-colors">Analytics</a></li>
                <li><a href="/tendencias" className="text-gray-300 hover:text-white transition-colors">Tendencias</a></li>
                <li><a href="/docs" className="text-gray-300 hover:text-white transition-colors">Documentación API</a></li>
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

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
