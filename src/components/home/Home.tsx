import React from 'react';
import {
  Radar,
  TrendingUp,
  Search,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Clock,
  Database,
  Zap,
  Shield,
  Filter,
  Bell,
  FileSearch,
  LineChart,
  Target,
} from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { HeroSlider } from '../ui/HeroSlider';

interface HomeProps {
  onNavigate: (view: string) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const heroSlides = [
    {
      title: 'Radar de Compras Públicas',
      subtitle: 'Plataforma de inteligencia de mercado que transforma datos abiertos de compras públicas en información útil para empresas y ciudadanía',
      gradient: 'from-blue-600 to-blue-800',
    },
    {
      title: 'Encuentra Oportunidades de Negocio',
      subtitle: 'Accede a miles de licitaciones y procesos de contratación del Estado de Guatemala en un solo lugar',
      gradient: 'from-teal-600 to-cyan-700',
    },
    {
      title: 'Ahorra Tiempo y Recursos',
      subtitle: 'Deja de revisar múltiples portales manualmente. Toda la información centralizada y actualizada en tiempo real',
      gradient: 'from-green-600 to-emerald-700',
    },
    {
      title: 'Toma Decisiones Informadas',
      subtitle: 'Analiza tendencias, patrones de compra y comportamiento del mercado público con herramientas avanzadas',
      gradient: 'from-orange-600 to-red-700',
    },
  ];

  const platformBenefits = [
    {
      icon: Clock,
      title: 'Ahorra Tiempo',
      description: 'Centraliza toda la información de compras públicas en un solo lugar. No más revisión manual de múltiples portales.',
    },
    {
      icon: Target,
      title: 'Encuentra Oportunidades',
      description: 'Identifica licitaciones relevantes para tu negocio con búsquedas avanzadas y filtros inteligentes.',
    },
    {
      icon: LineChart,
      title: 'Analiza el Mercado',
      description: 'Comprende tendencias, patrones de compra y comportamiento institucional para tomar mejores decisiones.',
    },
    {
      icon: Shield,
      title: 'Datos Confiables',
      description: 'Información oficial del MINFIN/Guatecompras bajo estándar internacional OCDS (Open Contracting Data Standard).',
    },
    {
      icon: Bell,
      title: 'Mantente Informado',
      description: 'Recibe actualizaciones en tiempo real sobre nuevas oportunidades de negocio y cambios en procesos.',
    },
    {
      icon: Zap,
      title: 'Acceso Instantáneo',
      description: 'Búsqueda rápida entre miles de procesos con resultados inmediatos. Sin demoras ni tiempos de espera.',
    },
  ];

  const features = [
    {
      icon: Search,
      title: 'Buscador Avanzado',
      description: 'Encuentra procesos específicos filtrando por institución, monto, fecha, estado y tipo de contratación.',
      demo: 'Busca por palabras clave, filtra por rangos de monto, y encuentra exactamente lo que necesitas.',
      action: () => onNavigate('search'),
    },
    {
      icon: Radar,
      title: 'Radar de Oportunidades',
      description: 'Visualiza en tiempo real las nuevas licitaciones y convocatorias del Estado.',
      demo: 'Identifica oportunidades de negocio antes que tu competencia con alertas automáticas.',
      action: () => onNavigate('opportunities'),
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Analiza el comportamiento del mercado público con gráficos y visualizaciones interactivas.',
      demo: 'Descubre qué instituciones compran más, cuáles son los montos promedio y las tendencias del sector.',
      action: () => onNavigate('analytics'),
    },
    {
      icon: TrendingUp,
      title: 'Tendencias',
      description: 'Identifica patrones históricos y proyecciones del gasto público por sector e institución.',
      demo: 'Comprende la evolución del mercado y planifica tu estrategia comercial basada en datos.',
      action: () => onNavigate('trends'),
    },
  ];


  return (
    <div className="space-y-16">
      <HeroSlider slides={heroSlides} />

      <section>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[rgb(var(--md-sys-color-on-surface))] mb-4">
            Por qué usar Radar de Compras Públicas
          </h2>
          <p className="text-[rgb(var(--md-sys-color-on-surface-variant))] text-lg max-w-3xl mx-auto">
            Transforma la forma en que accedes y analizas la información de compras públicas en Guatemala
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformBenefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} variant="elevated" className="hover:md-elevation-3 transition-shadow">
                <CardContent>
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-[rgb(var(--md-sys-color-primary-container))] rounded-2xl mb-4">
                    <Icon className="w-7 h-7 text-[rgb(var(--md-sys-color-on-primary-container))]" />
                  </div>
                  <h3 className="text-xl font-medium text-[rgb(var(--md-sys-color-on-surface))] mb-3">
                    {benefit.title}
                  </h3>
                  <p className="text-[rgb(var(--md-sys-color-on-surface-variant))] leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-[rgb(var(--md-sys-color-primary-container))]/30 rounded-3xl p-8 md:p-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-medium text-[rgb(var(--md-sys-color-on-surface))] mb-4">
            Funcionalidades de la Plataforma
          </h2>
          <p className="text-[rgb(var(--md-sys-color-on-surface-variant))] text-lg max-w-3xl mx-auto">
            Herramientas diseñadas para que encuentres oportunidades y tomes decisiones basadas en datos
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                hover
                onClick={feature.action}
                variant="elevated"
                className="group cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[rgb(var(--md-sys-color-primary-container))] rounded-3xl md-elevation-1 group-hover:md-elevation-2 transition-all flex-shrink-0">
                      <Icon className="w-8 h-8 text-[rgb(var(--md-sys-color-on-primary-container))]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-medium text-[rgb(var(--md-sys-color-on-surface))] mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[rgb(var(--md-sys-color-on-surface-variant))] leading-relaxed mb-3">{feature.description}</p>
                    </div>
                  </div>
                  <div className="bg-[rgb(var(--md-sys-color-surface-variant))] rounded-2xl p-4 mb-4">
                    <div className="flex items-start gap-2">
                      <FileSearch className="w-5 h-5 text-[rgb(var(--md-sys-color-primary))] flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-[rgb(var(--md-sys-color-on-surface-variant))] italic">{feature.demo}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-[rgb(var(--md-sys-color-primary))] font-medium group-hover:text-[rgb(var(--md-sys-color-primary))]">
                    <span>Explorar herramienta</span>
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="bg-[rgb(var(--md-sys-color-primary))] rounded-3xl p-8 md:p-12 text-[rgb(var(--md-sys-color-on-primary))] md-elevation-2">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium mb-4">Datos Oficiales en Tiempo Real</h2>
          <p className="opacity-90 text-lg mb-10">
            Información actualizada directamente desde el API OCDS de Guatemala
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card variant="outlined" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="text-center">
                <div className="text-5xl font-medium mb-2">100%</div>
                <div className="opacity-90 text-lg">Datos Abiertos OCDS</div>
              </CardContent>
            </Card>
            <Card variant="outlined" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="text-center">
                <div className="text-5xl font-medium mb-2">24/7</div>
                <div className="opacity-90 text-lg">Actualización Continua</div>
              </CardContent>
            </Card>
            <Card variant="outlined" className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all">
              <CardContent className="text-center">
                <div className="text-5xl font-medium mb-2">+1000</div>
                <div className="opacity-90 text-lg">Procesos Disponibles</div>
              </CardContent>
            </Card>
          </div>
          <div className="border-t border-white/20 pt-8">
            <p className="opacity-90 text-lg mb-2">Fuente oficial de datos</p>
            <p className="text-2xl font-medium mb-6">
              MINFIN / Guatecompras - Gobierno de Guatemala
            </p>
            <a
              href="https://ocds.guatecompras.gt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[rgb(var(--md-sys-color-on-primary))] text-[rgb(var(--md-sys-color-primary))] px-6 py-3 rounded-full font-medium hover:md-elevation-1 transition-all md-elevation-0"
            >
              Visitar Portal OCDS
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[rgb(var(--md-sys-color-surface))] rounded-3xl p-8 md:p-12 md-elevation-2">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-medium text-[rgb(var(--md-sys-color-on-surface))] mb-4">
            Comienza a Usar la Plataforma
          </h2>
          <p className="text-[rgb(var(--md-sys-color-on-surface-variant))] text-lg mb-8">
            Acceso gratuito a toda la información de compras públicas de Guatemala. Sin registro ni tarjeta de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button
              size="lg"
              variant="filled"
              onClick={() => onNavigate('search')}
            >
              <Search className="w-5 h-5" />
              Buscar Procesos
            </Button>
            <Button
              size="lg"
              variant="tonal"
              onClick={() => onNavigate('opportunities')}
            >
              <Radar className="w-5 h-5" />
              Ver Oportunidades
            </Button>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-[rgb(var(--md-sys-color-on-surface-variant))]">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Sin registro</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Acceso inmediato</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Totalmente gratis</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
