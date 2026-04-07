import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Activity, AlertCircle, Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Loading } from '../ui/Loading';
import { HeroSlider } from '../ui/HeroSlider';
import { ApiStatusBar } from '../ui/ApiStatusBar';
import { OCDSApi } from '../../services/ocdsApi';
import { Release } from '../../types/ocds';
import { formatCurrency, formatNumber } from '../../utils/formatters';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendData {
  label: string;
  current: number;
  previous: number;
  change: number;
  changePercent: number;
}

export const Trends: React.FC = () => {
  const heroSlides = [
    {
      title: 'Tendencias del Mercado',
      subtitle: 'Analiza la evolución del gasto público y comportamiento institucional',
      gradient: 'from-amber-600 to-orange-700',
    },
    {
      title: 'Insights de Mercado',
      subtitle: 'Identifica patrones y oportunidades emergentes',
      gradient: 'from-yellow-600 to-amber-700',
    },
  ];
  const [loading, setLoading] = useState(true);
  const [releases, setReleases] = useState<Release[]>([]);
  const [insights, setInsights] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data } = await OCDSApi.searchReleases({}, 1, 200);
      setReleases(data);
      generateInsights(data);
    } catch (error) {
      console.error('Error loading trends data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInsights = (data: Release[]) => {
    const insights: string[] = [];

    const buyerCounts: Record<string, number> = {};
    const buyerAmounts: Record<string, number> = {};

    data.forEach(r => {
      if (r.buyer?.name) {
        buyerCounts[r.buyer.name] = (buyerCounts[r.buyer.name] || 0) + 1;
        buyerAmounts[r.buyer.name] = (buyerAmounts[r.buyer.name] || 0) + (r.tender?.value?.amount || 0);
      }
    });

    const topBuyer = Object.entries(buyerCounts).sort(([, a], [, b]) => b - a)[0];
    if (topBuyer) {
      insights.push(`${topBuyer[0]} lidera con ${topBuyer[1]} procesos de compra`);
    }

    const avgAmount = data.reduce((sum, r) => sum + (r.tender?.value?.amount || 0), 0) / data.length;
    insights.push(`El monto promedio por proceso es ${formatCurrency(avgAmount)}`);

    const highValueCount = data.filter(r => (r.tender?.value?.amount || 0) > avgAmount * 2).length;
    if (highValueCount > 0) {
      insights.push(`${highValueCount} procesos superan el doble del monto promedio`);
    }

    const recentCount = data.filter(r => {
      const date = new Date(r.date);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return date >= thirtyDaysAgo;
    }).length;

    if (recentCount > 0) {
      insights.push(`${recentCount} procesos fueron publicados en los últimos 30 días`);
    }

    const withAwards = data.filter(r => r.awards && r.awards.length > 0).length;
    const awardRate = (withAwards / data.length) * 100;
    insights.push(`${awardRate.toFixed(1)}% de los procesos tienen adjudicaciones`);

    setInsights(insights);
  };

  const getBuyerTrends = (): TrendData[] => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const buyerCurrentCounts: Record<string, number> = {};
    const buyerPreviousCounts: Record<string, number> = {};

    releases.forEach(r => {
      const date = new Date(r.date);
      if (r.buyer?.name) {
        if (date >= thirtyDaysAgo) {
          buyerCurrentCounts[r.buyer.name] = (buyerCurrentCounts[r.buyer.name] || 0) + 1;
        } else if (date >= sixtyDaysAgo) {
          buyerPreviousCounts[r.buyer.name] = (buyerPreviousCounts[r.buyer.name] || 0) + 1;
        }
      }
    });

    const allBuyers = new Set([...Object.keys(buyerCurrentCounts), ...Object.keys(buyerPreviousCounts)]);

    const trends: TrendData[] = [];
    allBuyers.forEach(buyer => {
      const current = buyerCurrentCounts[buyer] || 0;
      const previous = buyerPreviousCounts[buyer] || 0;
      const change = current - previous;
      const changePercent = previous > 0 ? (change / previous) * 100 : current > 0 ? 100 : 0;

      if (current > 0 || previous > 0) {
        trends.push({
          label: buyer,
          current,
          previous,
          change,
          changePercent,
        });
      }
    });

    return trends.sort((a, b) => Math.abs(b.changePercent) - Math.abs(a.changePercent)).slice(0, 10);
  };

  const getAmountTrends = () => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const currentPeriod = releases.filter(r => new Date(r.date) >= thirtyDaysAgo);
    const previousPeriod = releases.filter(r => {
      const date = new Date(r.date);
      return date < thirtyDaysAgo && date >= new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    });

    const currentTotal = currentPeriod.reduce((sum, r) => sum + (r.tender?.value?.amount || 0), 0);
    const previousTotal = previousPeriod.reduce((sum, r) => sum + (r.tender?.value?.amount || 0), 0);

    const change = currentTotal - previousTotal;
    const changePercent = previousTotal > 0 ? (change / previousTotal) * 100 : 0;

    return {
      current: currentTotal,
      previous: previousTotal,
      change,
      changePercent,
      currentCount: currentPeriod.length,
      previousCount: previousPeriod.length,
    };
  };

  const getMonthlyData = () => {
    const monthlyMap: Record<string, { month: string; amount: number; count: number }> = {};

    releases.forEach(r => {
      const date = new Date(r.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = { month: monthKey, amount: 0, count: 0 };
      }

      monthlyMap[monthKey].amount += r.tender?.value?.amount || 0;
      monthlyMap[monthKey].count += 1;
    });

    return Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-12);
  };

  if (loading) {
    return <Loading text="Cargando tendencias..." />;
  }

  const buyerTrends = getBuyerTrends();
  const amountTrends = getAmountTrends();
  const monthlyData = getMonthlyData();

  return (
    <div className="space-y-6">
      <HeroSlider slides={heroSlides} />

      <ApiStatusBar />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card gradient className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Gasto Últimos 30 Días</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {formatCurrency(amountTrends.current)}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {amountTrends.changePercent >= 0 ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={`font-semibold text-lg ${
                      amountTrends.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {Math.abs(amountTrends.changePercent).toFixed(1)}%
                  </span>
                  <span className="text-sm text-gray-600">vs período anterior</span>
                </div>
              </div>
              <div className="bg-blue-100 rounded-xl p-4 shadow-sm">
                <Activity className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-green-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Procesos Últimos 30 Días</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {formatNumber(amountTrends.currentCount)}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {amountTrends.currentCount >= amountTrends.previousCount ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                  <span
                    className={`font-semibold text-lg ${
                      amountTrends.currentCount >= amountTrends.previousCount ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {amountTrends.currentCount - amountTrends.previousCount > 0 ? '+' : ''}
                    {amountTrends.currentCount - amountTrends.previousCount}
                  </span>
                  <span className="text-sm text-gray-600">procesos</span>
                </div>
              </div>
              <div className="bg-green-100 rounded-xl p-4 shadow-sm">
                <Calendar className="w-10 h-10 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            Insights Clave del Mercado
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-100">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                <p className="text-sm text-gray-900 font-medium">{insight}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Evolución Mensual
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis yAxisId="left" stroke="#3b82f6" tickFormatter={(value) => `Q${(value / 1000000).toFixed(1)}M`} />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip
                formatter={(value: number, name: string) =>
                  name === 'amount' ? formatCurrency(value) : value
                }
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Monto Total"
                dot={{ fill: '#3b82f6', r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="count"
                stroke="#10b981"
                strokeWidth={3}
                name="Cantidad de Procesos"
                dot={{ fill: '#10b981', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Instituciones con Mayor Cambio (30 días)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {buyerTrends.map((trend, index) => (
              <div key={index} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-gray-50 hover:shadow-md transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-gray-900">{trend.label}</h4>
                  </div>
                  <div className="flex items-center gap-6 ml-11 text-sm">
                    <div>
                      <span className="text-gray-600">Actual: </span>
                      <span className="font-semibold text-gray-900">{trend.current}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Anterior: </span>
                      <span className="text-gray-700">{trend.previous}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  {trend.change >= 0 ? (
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  ) : (
                    <TrendingDown className="w-6 h-6 text-red-600" />
                  )}
                  <Badge variant={trend.change >= 0 ? 'green' : 'red'} className="text-base px-3 py-1">
                    {trend.change >= 0 ? '+' : ''}
                    {trend.changePercent.toFixed(1)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
