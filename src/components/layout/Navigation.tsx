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
  { path: '/estadisticas', label: 'Estadísticas', icon: BarChart3 },
  { path: '/tendencias', label: 'Tendencias', icon: TrendingUp },
];

export const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <>
      <div className="bg-[rgb(var(--md-sys-color-primary))] text-[rgb(var(--md-sys-color-on-primary))] py-2 sticky top-0 z-50 md-elevation-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4" />
              <span className="hidden sm:inline">Red Ciudadana - Promoviendo transparencia</span>
              <span className="sm:hidden">Red Ciudadana</span>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.facebook.com/RedxGuatemala"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/RedxGuatemala"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/company/red-ciudadana"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="mailto:info@redciudadana.org"
                className="hover:opacity-70 transition-opacity"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="https://redciudadana.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1 text-sm hover:opacity-70 transition-opacity"
              >
                <span>redciudadana.org</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      <nav className="bg-[rgb(var(--md-sys-color-surface))] md-elevation-2 sticky top-8 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <div className="bg-[rgb(var(--md-sys-color-primary))] rounded-2xl p-2.5 md-elevation-1">
                <Radar className="w-6 h-6 text-[rgb(var(--md-sys-color-on-primary))]" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-medium text-[rgb(var(--md-sys-color-on-surface))]">Radar de Compras Públicas</h1>
                <p className="text-xs text-[rgb(var(--md-sys-color-on-surface-variant))]">Inteligencia de mercado basada en datos abiertos</p>
              </div>
            </button>

            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                      active
                        ? 'bg-[rgb(var(--md-sys-color-secondary-container))] text-[rgb(var(--md-sys-color-on-secondary-container))] md-elevation-0'
                        : 'text-[rgb(var(--md-sys-color-on-surface))] hover:bg-[rgb(var(--md-sys-color-primary))]/8'
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
