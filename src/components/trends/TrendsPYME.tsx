import React from 'react';
import {
  Banknote,
  Building2,
  Calendar,
  DoorOpen,
  Lightbulb,
  Rocket,
  Store,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatCurrency, formatNumber, formatAbbreviatedCurrency, truncateText } from '../../utils/formatters';
import summaryData from '../../data/outputs/summary.json';
import topBuyersData from '../../data/outputs/top_buyers.json';
import competitionData from '../../data/outputs/competition.json';
import opportunitiesData from '../../data/outputs/opportunities.json';
import ticketSizesData from '../../data/outputs/ticket_sizes.json';
import newSuppliersData from '../../data/outputs/new_suppliers.json';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

interface TicketBucket {
  bucket: string;
  count: number;
  pct: number;
  total_amount_gtq: number;
}

interface TicketFamilia {
  familia_code: string;
  familia_name: string;
  compra_directa: number;
  cotizacion: number;
  licitacion: number;
  median_ticket_gtq: number;
}

interface CompetitionFamilia {
  familia_code: string;
  familia_name: string;
  n_processes: number;
  single_bidder_pct: number;
  desiertos: number;
}

interface MonthCount {
  month: string;
  count: number;
}

interface OpportunityEntry {
  familia_code: string;
  familia_name: string;
  n_processes: number;
  single_bidder_pct: number;
  desiertos: number;
  median_ticket_gtq: number;
  opportunity_score: number;
}

interface NewSupplierMonth {
  month: string;
  new_suppliers: number;
}

interface NewSupplierFamilia {
  familia_code: string;
  familia_name: string;
  entry_ticket_median_gtq: number;
  n_new_suppliers: number;
}

interface BuyerEntry {
  rank: number;
  name: string;
  total_processes: number;
  pct_of_total: number;
  monthly_series: { month: string; processes: number }[];
}

const BUCKET_LABELS: Record<string, string> = {
  compra_directa: 'Compra directa (≤Q90k)',
  cotizacion: 'Cotización (Q90k–Q900k)',
  licitacion: 'Licitación (>Q900k)',
};

const BRAND_BLUE = '#1a3d52';
const BRAND_ORANGE = '#c47d1a';

const PARTIAL_APRIL_NOTE = 'Nota: abril 2026 es parcial (datos hasta el 2026-04-08).';

const gridColor = '#e5e7eb';

export const TrendsPYME: React.FC = () => {
  const { totals, period } = summaryData;
  const buckets = ticketSizesData.global_distribution as TicketBucket[];
  const ticketFamilias = ticketSizesData.by_familia as TicketFamilia[];
  const competitionFamilias = competitionData.by_familia as CompetitionFamilia[];
  const desiertosMonthly = competitionData.desiertos_monthly as MonthCount[];
  const tenderersDistribution = competitionData.tenderers_distribution as Record<string, number>;
  const opportunities = (opportunitiesData.opportunities as OpportunityEntry[]).slice(0, 10);
  const newSuppliersMonthly = newSuppliersData.monthly_series as NewSupplierMonth[];
  const entryFamilias = (newSuppliersData.by_familia as NewSupplierFamilia[]).slice(0, 10);
  const buyers = topBuyersData.rank as BuyerEntry[];

  const totalAmount = buckets.reduce((sum, b) => sum + b.total_amount_gtq, 0);

  const bucketChartData = {
    labels: buckets.map(b => BUCKET_LABELS[b.bucket] ?? b.bucket),
    datasets: [
      {
        label: '% de adjudicaciones',
        data: buckets.map(b => b.pct),
        backgroundColor: BRAND_BLUE,
        borderRadius: 6,
      },
      {
        label: '% del monto total',
        data: buckets.map(b => (b.total_amount_gtq / totalAmount) * 100),
        backgroundColor: BRAND_ORANGE,
        borderRadius: 6,
      },
    ],
  };

  const bucketChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${(context.parsed.y ?? 0).toFixed(1)}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: value => `${value}%` },
        grid: { color: gridColor },
      },
      x: { grid: { display: false } },
    },
  };

  const medianTicketFamilias = [...ticketFamilias].slice(0, 10);
  const medianTicketChartData = {
    labels: medianTicketFamilias.map(f => truncateText(f.familia_name, 40)),
    datasets: [
      {
        label: 'Ticket mediano (Q)',
        data: medianTicketFamilias.map(f => f.median_ticket_gtq),
        backgroundColor: BRAND_BLUE,
        borderRadius: 6,
      },
    ],
  };

  const horizontalCurrencyOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => formatCurrency(context.parsed.x ?? 0),
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { callback: value => formatAbbreviatedCurrency(Number(value)) },
        grid: { color: gridColor },
      },
      y: { grid: { display: false } },
    },
  };

  const tenderersChartData = {
    labels: Object.keys(tenderersDistribution).map(k =>
      k === '1' ? '1 oferente' : `${k} oferentes`
    ),
    datasets: [
      {
        data: Object.values(tenderersDistribution),
        backgroundColor: [
          '#1a3d52', '#2c5670', '#3e6f8e', '#5088ac', '#62a1ca',
          '#c47d1a', '#d0913d', '#dca560', '#e8b983', '#f4cda6',
        ],
        borderWidth: 1,
      },
    ],
  };

  const tenderersChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.parsed.toFixed(1)}% de los procesos`,
        },
      },
    },
  };

  const openFamilias = [...competitionFamilias]
    .sort((a, b) => b.single_bidder_pct - a.single_bidder_pct)
    .slice(0, 10);

  const openFamiliasChartData = {
    labels: openFamilias.map(f => truncateText(f.familia_name, 40)),
    datasets: [
      {
        label: '% procesos con 1 solo oferente',
        data: openFamilias.map(f => f.single_bidder_pct),
        backgroundColor: BRAND_ORANGE,
        borderRadius: 6,
      },
    ],
  };

  const openFamiliasChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => {
            const familia = openFamilias[context.dataIndex];
            return [
              `${(context.parsed.x ?? 0).toFixed(1)}% con 1 solo oferente`,
              `${formatNumber(familia.n_processes)} procesos · ${formatNumber(familia.desiertos)} desiertos`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: 100,
        ticks: { callback: value => `${value}%` },
        grid: { color: gridColor },
      },
      y: { grid: { display: false } },
    },
  };

  const desiertosChartData = {
    labels: desiertosMonthly.map(m => m.month),
    datasets: [
      {
        label: 'Procesos desiertos',
        data: desiertosMonthly.map(m => m.count),
        borderColor: BRAND_ORANGE,
        backgroundColor: 'rgba(196, 125, 26, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const monthlyProcesses = buyers[0].monthly_series.map(monthData => ({
    month: monthData.month,
    total: buyers.reduce(
      (sum, buyer) =>
        sum + (buyer.monthly_series.find(m => m.month === monthData.month)?.processes ?? 0),
      0
    ),
  }));

  const monthlyProcessesChartData = {
    labels: monthlyProcesses.map(m => m.month),
    datasets: [
      {
        label: 'Procesos publicados (top 10 compradores)',
        data: monthlyProcesses.map(m => m.total),
        borderColor: BRAND_BLUE,
        backgroundColor: 'rgba(26, 61, 82, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const lineCountOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: context => `${context.dataset.label}: ${formatNumber(context.parsed.y ?? 0)}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: value => formatNumber(Number(value)) },
        grid: { color: gridColor },
      },
      x: { grid: { display: false } },
    },
  };

  const newSuppliersChartData = {
    labels: newSuppliersMonthly.map(m => m.month),
    datasets: [
      {
        label: 'Proveedores que ganaron su primer contrato',
        data: newSuppliersMonthly.map(m => m.new_suppliers),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const entryTicketChartData = {
    labels: entryFamilias.map(f => truncateText(f.familia_name, 40)),
    datasets: [
      {
        label: 'Ticket mediano de entrada (Q)',
        data: entryFamilias.map(f => f.entry_ticket_median_gtq),
        backgroundColor: '#10b981',
        borderRadius: 6,
      },
    ],
  };

  const entryTicketChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => {
            const familia = entryFamilias[context.dataIndex];
            return [
              `Primer contrato típico: ${formatCurrency(context.parsed.x ?? 0)}`,
              `${formatNumber(familia.n_new_suppliers)} proveedores nuevos en el período`,
            ];
          },
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { callback: value => formatAbbreviatedCurrency(Number(value)) },
        grid: { color: gridColor },
      },
      y: { grid: { display: false } },
    },
  };

  const singleBidderPct = competitionData.single_bidder_pct_global as number;
  const desiertosTotal = competitionData.desiertos_total as number;
  const compraDirecta = buckets.find(b => b.bucket === 'compra_directa');
  const licitacion = buckets.find(b => b.bucket === 'licitacion');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Oportunidades para PYMES</h1>
        <p className="text-sm text-gray-600">
          El Estado compró {formatAbbreviatedCurrency(totals.total_amount_gtq)} entre {period.start} y {period.end}.
          Estos datos muestran dónde hay demanda, poca competencia y el monto de los tickets promedios.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card gradient className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Gasto Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">
                  {formatAbbreviatedCurrency(totals.total_amount_gtq)}
                </p>
              </div>
              <div className="bg-blue-100 rounded-xl p-4 shadow-sm">
                <TrendingUp className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-green-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Procesos</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">
                  {formatNumber(totals.processes)}
                </p>
              </div>
              <div className="bg-green-100 rounded-xl p-4 shadow-sm">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Entidades Compradoras</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">
                  {formatNumber(totals.unique_buyers)}
                </p>
              </div>
              <div className="bg-amber-100 rounded-xl p-4 shadow-sm">
                <Building2 className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-purple-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Ticket Mediano</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">
                  {formatCurrency(totals.median_ticket_gtq)}
                </p>
              </div>
              <div className="bg-purple-100 rounded-xl p-4 shadow-sm">
                <Banknote className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">1. ¿Dónde está el dinero?</h2>
        <p className="text-sm text-gray-600">
          El {compraDirecta?.pct.toFixed(1)}% de las adjudicaciones son compras directas de
          ticket pequeño (≤Q90k) — oportunidad para nuevas empresas.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-6 h-6 text-blue-600" />
            Adjudicaciones vs. monto por modalidad (LCE)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <Bar data={bucketChartData} options={bucketChartOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Las licitaciones son solo el {licitacion?.pct.toFixed(1)}% de las adjudicaciones pero concentran{' '}
            {licitacion ? ((licitacion.total_amount_gtq / totalAmount) * 100).toFixed(0) : '—'}% del dinero.
            Para empezar, las compras directas son el mercado más accesible.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-6 h-6 text-blue-600" />
            Ticket típico por categoría
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-96">
            <Bar data={medianTicketChartData} options={horizontalCurrencyOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Monto mediano adjudicado en las categorías con más procesos. Útil para identificar categorías por su rango de montos. 
          </p>
        </CardContent>
      </Card>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">2. ¿Dónde hay poca competencia?</h2>
        <p className="text-sm text-gray-600">
          En más de la mitad de las compras públicas solo se presenta 1 oferente.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card gradient className="bg-gradient-to-br from-orange-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Procesos con 1 solo oferente</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">{singleBidderPct.toFixed(1)}%</p>
                <p className="text-xs text-gray-500 mt-1">Mercados con espacio: si ofertas, compites contra uno o nadie</p>
              </div>
              <div className="bg-orange-100 rounded-xl p-4 shadow-sm">
                <Target className="w-10 h-10 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-red-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Procesos desiertos</p>
                <p className="text-4xl font-bold text-gray-900 mt-3">{formatNumber(desiertosTotal)}</p>
                <p className="text-xs text-gray-500 mt-1">El Estado quiso comprar y nadie ofertó — demanda insatisfecha</p>
              </div>
              <div className="bg-red-100 rounded-xl p-4 shadow-sm">
                <DoorOpen className="w-10 h-10 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600" />
              ¿Contra cuántos compites?
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <Doughnut data={tenderersChartData} options={tenderersChartOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Distribución de oferentes por proceso competitivo.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Categorías que necesitan más oferentes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <Bar data={openFamiliasChartData} options={openFamiliasChartOptions} />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              % de procesos con un solo oferente, entre las categorías con más volumen.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DoorOpen className="w-6 h-6 text-blue-600" />
            Demanda insatisfecha mes a mes (procesos desiertos)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <Line data={desiertosChartData} options={lineCountOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Compras que se quedaron sin proveedor. Los montos estimados de procesos desiertos no están
            disponibles en la fuente de datos, por eso se muestran conteos. {PARTIAL_APRIL_NOTE}
          </p>
        </CardContent>
      </Card>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">3. ¿Qué está cambiando?</h2>
        <p className="text-sm text-gray-600">
          El volumen de compras tiene picos claros (marzo y cierre de año). Prepárate y registra tu oferta antes de los picos.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-blue-600" />
            Estacionalidad de las compras públicas
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <Line data={monthlyProcessesChartData} options={lineCountOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Procesos mensuales de los 10 mayores compradores (conteos; los montos mensuales no están
            disponibles en los datos actuales). {PARTIAL_APRIL_NOTE}
          </p>
        </CardContent>
      </Card>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">4. ¿Puedo entrar yo?</h2>
        <p className="text-sm text-gray-600">
          Cada mes cientos de empresas ganan su primer contrato con el Estado. Ya hay{' '}
          {formatNumber(newSuppliersData.total_unique_suppliers)} proveedores vendiéndole al Estado.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="w-6 h-6 text-blue-600" />
            Proveedores nuevos por mes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-80">
            <Line data={newSuppliersChartData} options={lineCountOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Empresas que ganaron su primera adjudicación ese mes. {PARTIAL_APRIL_NOTE}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Banknote className="w-6 h-6 text-blue-600" />
            Ticket de entrada por categoría
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-96">
            <Bar data={entryTicketChartData} options={entryTicketChartOptions} />
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Monto mediano del primer contrato ganado por proveedores nuevos, en las categorías donde más empresas entraron.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-600" />
            Top 10 categorías con mayor oportunidad
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3">
            {opportunities.map((opp, index) => (
              <div
                key={opp.familia_code}
                className="flex items-center justify-between p-5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <h4 className="font-bold text-gray-900">{opp.familia_name}</h4>
                  </div>
                  <div className="ml-11 text-sm text-gray-600">
                    {formatNumber(opp.n_processes)} procesos · ticket mediano {formatCurrency(opp.median_ticket_gtq)} ·{' '}
                    {formatNumber(opp.desiertos)} desiertos
                  </div>
                </div>
                <Badge variant="info">{opp.single_bidder_pct.toFixed(1)}% con 1 oferente</Badge>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            Puntaje de oportunidad = volumen de procesos × tasa de un solo oferente. Mercados grandes y poco
            disputados. {opportunitiesData.note}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
