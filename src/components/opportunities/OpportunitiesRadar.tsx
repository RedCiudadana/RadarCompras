import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radar, Calendar, TrendingUp, Filter, Bell, Sparkles, ArrowUpRight, Building2 } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Loading } from '../ui/Loading';
import { HeroSlider } from '../ui/HeroSlider';
import { ApiStatusBar } from '../ui/ApiStatusBar';
import { Button } from '../ui/Button';
import { OCDSApi } from '../../services/ocdsApi';
import { Release } from '../../types/ocds';
import { formatCurrency, formatDate, truncateText, getStatusColor } from '../../utils/formatters';

export const OpportunitiesRadar: React.FC = () => {
  const navigate = useNavigate();
  const heroSlides = [
    {
      title: 'Radar de Oportunidades',
      subtitle: 'Descubre nuevas licitaciones y oportunidades de negocio',
      gradient: 'from-emerald-600 to-teal-700',
    },
    {
      title: 'Oportunidades en Tiempo Real',
      subtitle: 'Mantente actualizado con las últimas convocatorias',
      gradient: 'from-green-600 to-emerald-700',
    },
  ];
  const [loading, setLoading] = useState(true);
  const [recentOpportunities, setRecentOpportunities] = useState<Release[]>([]);
  const [highValueOpportunities, setHighValueOpportunities] = useState<Release[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'recent' | 'high-value'>('all');

  useEffect(() => {
    loadOpportunities();
  }, []);

  const loadOpportunities = async () => {
    setLoading(true);
    try {
      const { data } = await OCDSApi.searchReleases({}, 1, 100);

      const recent = data.slice(0, 30);
      setRecentOpportunities(recent);

      const avgAmount = data.reduce((sum, r) => sum + (r.tender?.value?.amount || 0), 0) / data.length;
      const highValue = data
        .filter(r => (r.tender?.value?.amount || 0) > avgAmount * 1.5)
        .slice(0, 20);
      setHighValueOpportunities(highValue);
    } catch (error) {
      console.error('Error loading opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayedOpportunities = () => {
    if (selectedCategory === 'recent') return recentOpportunities;
    if (selectedCategory === 'high-value') return highValueOpportunities;
    return recentOpportunities;
  };

  if (loading) {
    return <Loading text="Cargando oportunidades..." />;
  }

  const displayedOpportunities = getDisplayedOpportunities();

  return (
    <div className="space-y-6">
      <HeroSlider slides={heroSlides} />

      <ApiStatusBar />

      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-8 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Nunca pierdas una oportunidad</h2>
          </div>
          <p className="text-emerald-100 text-lg mb-6">
            Recibe alertas inteligentes directamente a tu correo para estar siempre al tanto de las mejores oportunidades de negocio.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button className="bg-white text-emerald-700 hover:bg-emerald-50">
              <Bell className="w-5 h-5 mr-2" />
              Configurar Alertas
            </Button>
            <Button variant="outlined" className="border-white text-white hover:bg-white hover:text-emerald-700">
              <Filter className="w-5 h-5 mr-2" />
              Filtros Personalizados
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-emerald-500/30">
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">{recentOpportunities.length}</p>
              <p className="text-emerald-100 text-sm">Nuevas oportunidades</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">{highValueOpportunities.length}</p>
              <p className="text-emerald-100 text-sm">Alto valor</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold mb-1">24/7</p>
              <p className="text-emerald-100 text-sm">Monitoreo continuo</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          variant={selectedCategory === 'all' ? 'filled' : 'outlined'}
          onClick={() => setSelectedCategory('all')}
        >
          <Radar className="w-4 h-4 mr-2" />
          Todas las Oportunidades
        </Button>
        <Button
          variant={selectedCategory === 'recent' ? 'filled' : 'outlined'}
          onClick={() => setSelectedCategory('recent')}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Más Recientes
        </Button>
        <Button
          variant={selectedCategory === 'high-value' ? 'filled' : 'outlined'}
          onClick={() => setSelectedCategory('high-value')}
        >
          <TrendingUp className="w-4 h-4 mr-2" />
          Alto Valor
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {displayedOpportunities.map((opp, index) => (
          <Card
            key={opp.id || index}
            hover
            onClick={() => navigate(`/busqueda/${encodeURIComponent(opp.id)}`)}
            className="group"
          >
            <CardContent>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  {opp.tender?.status && (
                    <Badge variant={getStatusColor(opp.tender.status) as any}>
                      {opp.tender.status}
                    </Badge>
                  )}
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
              </div>

              <h4 className="font-bold text-gray-900 mb-2 group-hover:text-emerald-700 transition-colors">
                {truncateText(opp.tender?.title || 'Sin título', 100)}
              </h4>

              <div className="flex items-center gap-2 mb-3">
                <Building2 className="w-4 h-4 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {truncateText(opp.buyer?.name || 'Institución no especificada', 60)}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Monto</p>
                  <p className="font-bold text-emerald-600 text-lg">
                    {formatCurrency(opp.tender?.value?.amount || 0)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Publicado</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatDate(opp.date)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {displayedOpportunities.length === 0 && !loading && (
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Radar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No se encontraron oportunidades en esta categoría</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
