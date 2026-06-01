import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Radar,
  BarChart3,
  TrendingUp,
  Menu,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Globe,
} from 'lucide-react';

const navItems = [
  { path: '/busqueda', label: 'Buscar', icon: Search },
  { path: '/oportunidades', label: 'Oportunidades', icon: Radar },
  // { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  { path: '/tendencias', label: 'Tendencias', icon: TrendingUp },
];

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      <div className="bg-sky text-white py-2 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Esta es una web oficial de La Sociedad Civil Red Ciudadana</span>
            </div>
          </div>
        </div>
      </div>

      <nav className="bg-white sticky top-8 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <button
              onClick={() => navigate('/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <img src='/logo_red_ciudadana_2.png' className='max-h-12 w-auto block' />
            </button>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-base text-rc-text-base font-medium transition-all duration-200 ${
                      active
                        ? 'font-extrabold'
                        : ''
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-full text-[rgb(var(--md-sys-color-on-surface))] hover:bg-[rgb(var(--md-sys-color-primary))]/8"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="md:hidden bg-[rgb(var(--md-sys-color-surface))] md-elevation-1">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-full text-base font-medium transition-colors ${
                    active
                      ? 'bg-[rgb(var(--md-sys-color-secondary-container))] text-[rgb(var(--md-sys-color-on-secondary-container))]'
                      : 'text-[rgb(var(--md-sys-color-on-surface))] hover:bg-[rgb(var(--md-sys-color-primary))]/8'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};
