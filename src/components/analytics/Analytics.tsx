import React, { useEffect, useState } from 'react';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, DollarSign, FileText, Award } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Loading } from '../ui/Loading';
import { HeroSlider } from '../ui/HeroSlider';
import { ApiStatusBar } from '../ui/ApiStatusBar';
import { OCDSApi } from '../../services/ocdsApi';
import { Release } from '../../types/ocds';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';

export const Analytics: React.FC = () => {
  const heroSlides = [
    {
      title: 'Analytics Avanzado',
      subtitle: 'Visualiza patrones y tendencias del mercado público',
      gradient: 'from-violet-600 to-purple-700',
    },
    {
      title: 'Análisis de Datos',
      subtitle: 'Información procesable para tomar mejores decisiones',
      gradient: 'from-fuchsia-600 to-pink-700',
    },
  ];
  const [loading, setLoading] = useState(true);
  const [topBuyers, setTopBuyers] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  const [methodDistribution, setMethodDistribution] = useState<any[]>([]);
  const [totalStats, setTotalStats] = useState({ total: 0, count: 0, avg: 0, withAwards: 0 });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await OCDSApi.searchReleases({}, 1, 200);

      const buyerAmounts: Record<string, number> = {};
      const statusCounts: Record<string, number> = {};
      const methodCounts: Record<string, number> = {};
      let totalAmount = 0;
      let withAwards = 0;

      data.forEach(r => {
        if (r.buyer?.name) {
          const amount = r.tender?.value?.amount || 0;
          buyerAmounts[r.buyer.name] = (buyerAmounts[r.buyer.name] || 0) + amount;
          totalAmount += amount;
        }

        if (r.tender?.status) {
          statusCounts[r.tender.status] = (statusCounts[r.tender.status] || 0) + 1;
        }

        if (r.tender?.procurementMethod) {
          const method = r.tender.procurementMethod;
          methodCounts[method] = (methodCounts[method] || 0) + 1;
        }

        if (r.awards && r.awards.length > 0) {
          withAwards++;
        }
      });

      const buyers = Object.entries(buyerAmounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([name, amount]) => ({
          name: name.length > 30 ? name.substring(0, 30) + '...' : name,
          amount,
        }));

      const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

      const statuses = Object.entries(statusCounts)
        .map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length],
        }));

      const methods = Object.entries(methodCounts)
        .map(([name, value], index) => ({
          name: name.length > 20 ? name.substring(0, 20) + '...' : name,
          value,
          color: COLORS[index % COLORS.length],
        }));

      setTopBuyers(buyers);
      setStatusDistribution(statuses);
      setMethodDistribution(methods);
      setTotalStats({
        total: totalAmount,
        count: data.length,
        avg: totalAmount / data.length,
        withAwards,
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading text="Cargando visualizaciones..." />;
  }

  return (
    <div className="space-y-6">
      <HeroSlider slides={heroSlides} />

      <ApiStatusBar />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card gradient className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Monto Total</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalStats.total)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Total Procesos</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatNumber(totalStats.count)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Monto Promedio</p>
                <p className="text-3xl font-bold text-gray-900">
                  {formatCurrency(totalStats.avg)}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-purple-50 to-white border-purple-100">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Con Adjudicación</p>
                <p className="text-3xl font-bold text-gray-900">
                  {totalStats.withAwards}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {((totalStats.withAwards / totalStats.count) * 100).toFixed(1)}% del total
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Top 10 Instituciones por Monto Contratado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topBuyers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" tickFormatter={(value) => `Q${(value / 1000000).toFixed(1)}M`} stroke="#6b7280" />
              <YAxis dataKey="name" type="category" width={200} stroke="#6b7280" />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="amount" fill="#3b82f6" name="Monto Total" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-6 h-6 text-blue-600" />
              Distribución por Estado
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChartIcon className="w-6 h-6 text-blue-600" />
              Métodos de Contratación
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={methodDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {methodDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
