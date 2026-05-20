import React from 'react';
import { TrendingUp, AlertCircle, Calendar, Building2, Users } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatNumber, truncateText, formatAbbreviatedCurrency } from '../../utils/formatters';
import summaryData from '../../data/outputs/summary.json';
import topBuyersData from '../../data/outputs/top_buyers.json';
import topSuppliersData from '../../data/outputs/top_suppliers.json';
import topCategoriesData from '../../data/outputs/top_categories.json';
import topItemsData from '../../data/outputs/top_items_amount.json';
import itemDescData from '../../data/outputs/item_descriptions.json';

interface BuyerEntry {
  rank: number;
  name: string;
  total_processes: number;
  pct_of_total: number;
  monthly_series: { month: string; processes: number }[];
}

interface SupplierEntry {
  rank: number;
  name: string;
  total_adjudicaciones: number;
  pct_of_total: number;
  monthly_series: { month: string; adjudicaciones: number }[];
}

interface CategoryEntry {
  rank: number;
  segment_code: string;
  segment_name: string;
  total_amount_gtq: number;
  pct_of_total: number;
  item_count: number;
}

interface ItemEntry {
  rank: number;
  unspsc_id: string;
  description: string;
  total_amount_gtq: number;
  pct_of_total: number;
  item_count: number;
}

interface ItemDescEntry {
  rank: number;
  description: string;
  count: number;
  pct_of_total: number;
}

export const Trends: React.FC = () => {
  const { totals, period } = summaryData;
  const buyers = topBuyersData.rank as BuyerEntry[];
  const suppliers = topSuppliersData.rank as SupplierEntry[];
  const categories = topCategoriesData.categories as CategoryEntry[];
  const items = topItemsData.items as ItemEntry[];
  const descriptions = itemDescData.items as ItemDescEntry[];

  const monthlyChartData = buyers.slice(0, 3).length > 0
    ? buyers[0].monthly_series.map(monthData => ({
        month: monthData.month,
        ...Object.fromEntries(
          buyers.slice(0, 3).map(buyer => [
            buyer.name.substring(0, 25),
            buyer.monthly_series.find(m => m.month === monthData.month)?.processes || 0
          ])
        )
      }))
    : [];

  const categoryChartData = categories.slice(0, 10).map(cat => ({
    name: cat.segment_name,
    amount: cat.total_amount_gtq,
    pct: cat.pct_of_total
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Tendencias del Mercado</h1>
        <p className="text-sm text-gray-600">
          Período: {period.start} a {period.end}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card gradient className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Procesos Totales</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {formatNumber(totals.processes)}
                </p>
              </div>
              <div className="bg-blue-100 rounded-xl p-4 shadow-sm">
                <Calendar className="w-10 h-10 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-green-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Gasto Total</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {formatAbbreviatedCurrency(totals.total_amount_gtq)}
                </p>
              </div>
              <div className="bg-green-100 rounded-xl p-4 shadow-sm">
                <TrendingUp className="w-10 h-10 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Entidades Compradoras</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {formatNumber(totals.unique_buyers)}
                </p>
              </div>
              <div className="bg-amber-100 rounded-xl p-4 shadow-sm">
                <Building2 className="w-10 h-10 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-purple-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Proveedores Únicos</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">
                  {formatNumber(totals.unique_suppliers)}
                </p>
              </div>
              <div className="bg-purple-100 rounded-xl p-4 shadow-sm">
                <Users className="w-10 h-10 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Evolución Mensual (Top 3 Compradores)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {monthlyChartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#3b82f6" tickFormatter={(value) => formatNumber(value)} />
                  <Tooltip
                    formatter={(value) => typeof value === 'number' ? formatNumber(value) : value}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Legend />
                  {buyers.slice(0, 3).map((buyer, idx) => (
                    <Line
                      key={idx}
                      type="monotone"
                      dataKey={buyer.name.substring(0, 25)}
                      stroke={['#3b82f6', '#10b981', '#f59e0b'][idx]}
                      strokeWidth={3}
                      dot={{ r: 4 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-gray-500 mt-3">Nota: Abril 2026 contiene solo 8 días de datos</p>
            </>
          ) : (
            <p className="text-gray-500">No hay datos disponibles</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Top 10 Compradores
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {buyers.map((buyer, index) => (
              <div key={index} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                      {buyer.rank}
                    </span>
                    <h4 className="font-bold text-gray-900">{buyer.name}</h4>
                  </div>
                  <div className="ml-11 text-sm text-gray-600">
                    {formatNumber(buyer.total_processes)} procesos
                  </div>
                </div>
                <Badge variant="info">{buyer.pct_of_total.toFixed(1)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Top 10 Proveedores
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {suppliers.map((supplier, index) => (
              <div key={index} className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center text-sm font-bold">
                      {supplier.rank}
                    </span>
                    <h4 className="font-bold text-gray-900">{supplier.name}</h4>
                  </div>
                  <div className="ml-11 text-sm text-gray-600">
                    {formatNumber(supplier.total_adjudicaciones)} adjudicaciones
                  </div>
                </div>
                <Badge variant="info">{supplier.pct_of_total.toFixed(1)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Gasto por Categoría (Top 10)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart
              data={categoryChartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 200, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                type="number"
                stroke="#6b7280"
                tickFormatter={(value) => `Q${(value / 1e9).toFixed(1)}B`}
              />
              <YAxis dataKey="name" type="category" stroke="#6b7280" width={195} />
              <Tooltip
                formatter={(value) => typeof value === 'number' ? formatCurrency(value) : value}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
              />
              <Bar dataKey="amount" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-blue-600" />
            Top 15 Ítems por Monto
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {items.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-600 rounded flex items-center justify-center text-xs font-bold">
                      {item.rank}
                    </span>
                    <h4 className="font-semibold text-gray-900">
                      {truncateText(item.description, 80)}
                    </h4>
                  </div>
                  <div className="ml-9 text-sm text-gray-600">
                    {formatCurrency(item.total_amount_gtq)}
                  </div>
                </div>
                <Badge variant="info">{item.pct_of_total.toFixed(2)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Ítems Más Comprados por Volumen
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {descriptions.map((desc, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-100 text-red-600 rounded flex items-center justify-center text-xs font-bold">
                      {desc.rank}
                    </span>
                    <h4 className="font-semibold text-gray-900">
                      {truncateText(desc.description, 80)}
                    </h4>
                  </div>
                  <div className="ml-9 text-sm text-gray-600">
                    {formatNumber(desc.count)} unidades
                  </div>
                </div>
                <Badge variant="info">{desc.pct_of_total.toFixed(2)}%</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
