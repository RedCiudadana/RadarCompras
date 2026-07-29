import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Banknote,
  Building2,
  Calendar,
  Code2,
  Cpu,
  Network,
  Rocket,
  Target,
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
import { Loading } from '../ui/Loading';
import { ReleaseRow } from '../search/ReleaseRow';
import { OCDSApi } from '../../services/ocdsApi';
import type { Release } from '../../types/ocds';
import { formatCurrency, formatNumber, formatAbbreviatedCurrency } from '../../utils/formatters';
import nicheItData from '../../data/outputs/niche_it.json';

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

interface TicketHistogramEntry {
  bucket_label: string;
  bucket_min: number;
  bucket_max: number | null;
  n_processes: number;
  pct_of_total: number;
}

interface CategoryEntry {
  category: string;
  n_processes: number;
  pct_of_total: number;
}

interface FamiliaEntry {
  familia_code: string;
  familia_name: string;
  n_processes: number;
  total_amount_gtq: number;
  median_ticket_gtq: number;
}

interface ProductEntry {
  unspsc_id: string;
  description: string;
  total_amount_gtq: number;
  pct_of_total: number;
  item_count: number;
}

export interface MonthEntry {
  month: string;
  processes: number;
}

interface BuyerEntry {
  name: string;
  n_processes: number;
  entidad_id?: string | null;
}

const CATEGORY_LABELS: Record<string, string> = {
  goods: 'Bienes',
  services: 'Servicios',
  works: 'Obras',
};

interface FamiliaMeta {
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  iconBg: string;
  iconText: string;
}

const DEFAULT_FAMILIA_META: FamiliaMeta = {
  icon: Cpu,
  gradient: 'bg-gradient-to-br from-blue-50 to-white',
  iconBg: 'bg-blue-100',
  iconText: 'text-blue-600',
};

const FAMILIA_META: Record<string, FamiliaMeta> = {
  '4321': {
    icon: Cpu,
    gradient: 'bg-gradient-to-br from-blue-50 to-white',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
  },
  '4322': {
    icon: Network,
    gradient: 'bg-gradient-to-br from-green-50 to-white',
    iconBg: 'bg-green-100',
    iconText: 'text-green-600',
  },
  '4323': {
    icon: Code2,
    gradient: 'bg-gradient-to-br from-amber-50 to-white',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
  },
};

const BRAND_BLUE = '#1a3d52';
const BRAND_ORANGE = '#c47d1a';
const gridColor = '#e5e7eb';

/**
 * Whether there is enough history to draw a real line chart, instead of
 * fabricating points. Kept as a pure, exported function so it's testable
 * without rendering the component (no jsdom in this repo's test setup).
 */
export const shouldShowMonthlyChart = (series: MonthEntry[]): boolean => series.length >= 3;

/**
 * Whether a release has at least one item classified under the IT niche's
 * UNSPSC prefix (e.g. "43"). Pure and exported for the same testability
 * reason as shouldShowMonthlyChart above.
 */
export const hasItItem = (release: Release, unspscPrefix: string): boolean =>
  (release.tender?.items ?? []).some(item => item.classification?.id?.startsWith(unspscPrefix));

export const NicheIt: React.FC = () => {
  const { totals, competition, ticket_histogram, main_procurement_category, by_familia, by_product, monthly_series, buyers, filter, notes, period } =
    nicheItData as {
      totals: typeof nicheItData.totals;
      competition: typeof nicheItData.competition;
      ticket_histogram: TicketHistogramEntry[];
      main_procurement_category: CategoryEntry[];
      by_familia: FamiliaEntry[];
      by_product: ProductEntry[];
      monthly_series: MonthEntry[];
      buyers: { top: BuyerEntry[] };
      filter: typeof nicheItData.filter;
      notes: string[];
      period: typeof nicheItData.period;
    };

  const navigate = useNavigate();
  const [entryMatches, setEntryMatches] = useState<Release[]>([]);
  const [entryLoading, setEntryLoading] = useState(true);
  const [entryError, setEntryError] = useState<string | undefined>();

  useEffect(() => {
    const abortController = new AbortController();
    const topBuyers = buyers.top.slice(0, 5).filter((b): b is BuyerEntry & { entidad_id: string } => Boolean(b.entidad_id));

    (async () => {
      setEntryLoading(true);
      setEntryError(undefined);
      const settled = await Promise.allSettled(
        topBuyers.map(b => OCDSApi.searchReleases({ entidad: b.entidad_id }, 1, 50, abortController))
      );
      if (abortController.signal.aborted) return;

      const seen = new Set<string>();
      const merged: Release[] = [];
      for (const result of settled) {
        if (result.status !== 'fulfilled') continue;
        for (const release of result.value.data) {
          const key = release.ocid ?? release.id;
          if (!key || seen.has(key)) continue;
          if (!hasItItem(release, filter.unspsc_prefix)) continue;
          seen.add(key);
          merged.push(release);
        }
      }
      setEntryMatches(merged);
      setEntryLoading(false);
    })().catch(() => {
      if (abortController.signal.aborted) return;
      setEntryError('No se pudieron cargar los concursos vigentes.');
      setEntryLoading(false);
    });

    return () => abortController.abort();
  }, [buyers.top, filter.unspsc_prefix]);

  const ticketHistogramChartData = {
    labels: ticket_histogram.map(b => b.bucket_label),
    datasets: [
      {
        label: '% de procesos',
        data: ticket_histogram.map(b => b.pct_of_total),
        backgroundColor: BRAND_BLUE,
        borderRadius: 6,
      },
    ],
  };

  const ticketHistogramChartOptions: ChartOptions<'bar'> = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${(context.parsed.x ?? 0).toFixed(1)}%`,
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

  const categoryChartData = {
    labels: main_procurement_category.map(c => CATEGORY_LABELS[c.category] ?? c.category),
    datasets: [
      {
        data: main_procurement_category.map(c => c.pct_of_total),
        backgroundColor: [BRAND_BLUE, BRAND_ORANGE, '#10b981'],
        borderWidth: 1,
      },
    ],
  };

  const categoryChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right' },
      tooltip: {
        callbacks: {
          label: context => `${context.label}: ${context.parsed.toFixed(1)}%`,
        },
      },
    },
  };

  const monthlyChartData = {
    labels: monthly_series.map(m => m.month),
    datasets: [
      {
        label: 'Procesos publicados',
        data: monthly_series.map(m => m.processes),
        borderColor: BRAND_BLUE,
        backgroundColor: 'rgba(26, 61, 82, 0.15)',
        fill: true,
        tension: 0.3,
        pointRadius: 3,
      },
    ],
  };

  const monthlyChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: context => `${formatNumber(context.parsed.y ?? 0)} procesos`,
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

  const familiaOrder = ['4321', '4322', '4323'];
  const familiaCards = familiaOrder
    .map(code => by_familia.find(f => f.familia_code === code))
    .filter((f): f is FamiliaEntry => Boolean(f));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Nicho TI para PYMES</h1>
        <p className="text-sm text-gray-600">
          Hardware, redes y software concentran {formatAbbreviatedCurrency(totals.total_amount_gtq)} en compras
          públicas entre {period.start} y {period.end}, repartidos entre {formatNumber(totals.unique_buyers)}{' '}
          Entidades — no una sola. Así es la demanda y cuándo se mueve.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card gradient className="bg-gradient-to-br from-green-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Procesos</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">{formatNumber(totals.processes)}</p>
              </div>
              <div className="bg-green-100 rounded-xl p-4 shadow-sm">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-blue-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Monto Total</p>
                <p className="text-3xl font-bold text-gray-900 mt-3">
                  {formatAbbreviatedCurrency(totals.total_amount_gtq)}
                </p>
              </div>
              <div className="bg-blue-100 rounded-xl p-4 shadow-sm">
                <Banknote className="w-8 h-8 text-blue-600" />
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
                <Target className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card gradient className="bg-gradient-to-br from-amber-50 to-white">
          <CardContent>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                  Procesos con ≥3 oferentes
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-3">{competition.pct_ge3.toFixed(1)}%</p>
              </div>
              <div className="bg-amber-100 rounded-xl p-4 shadow-sm">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">1. ¿Dónde está la demanda?</h2>
        <p className="text-sm text-gray-600">
          El {totals.pct_le_90k.toFixed(1)}% de los procesos tiene un ticket ≤Q90k — dentro del
          alcance de Compra Directa para una PYME.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Banknote className="w-6 h-6 text-blue-600" />
              Distribución de tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <Bar data={ticketHistogramChartData} options={ticketHistogramChartOptions} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Bienes, Servicios u Obras
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-72">
              <Doughnut data={categoryChartData} options={categoryChartOptions} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">2. ¿Quién compra?</h2>
        <p className="text-sm text-gray-600">
          La demanda de TI no depende de una sola Entidad — {formatNumber(totals.unique_buyers)} Entidades
          distintas compraron en este nicho.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" />
            Top Entidades compradoras
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {buyers.top.map((buyer, index) => {
              const rowContent = (
                <>
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <span className="flex-1 font-medium text-gray-900">{buyer.name}</span>
                  <Badge variant="info">{formatNumber(buyer.n_processes)} procesos</Badge>
                </>
              );

              return buyer.entidad_id ? (
                <Link
                  key={buyer.name}
                  to={`/busqueda?entidad=${buyer.entidad_id}`}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all"
                >
                  {rowContent}
                </Link>
              ) : (
                <div
                  key={buyer.name}
                  className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl"
                >
                  {rowContent}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">3. ¿Qué compran?</h2>
        <p className="text-sm text-gray-600">
          Las instituciones concentran su compra de TI en tres frentes: equipo informático, redes
          y software.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {familiaCards.map(familia => {
          const meta = FAMILIA_META[familia.familia_code] ?? DEFAULT_FAMILIA_META;
          const Icon = meta.icon;
          return (
            <Card key={familia.familia_code} gradient className={meta.gradient}>
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                    {familia.familia_name}
                  </p>
                  <div className={`${meta.iconBg} rounded-xl p-3 shadow-sm`}>
                    <Icon className={`w-6 h-6 ${meta.iconText}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatAbbreviatedCurrency(familia.total_amount_gtq)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {formatNumber(familia.n_processes)} procesos · ticket mediano{' '}
                  {formatCurrency(familia.median_ticket_gtq)}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-6 h-6 text-blue-600" />
            Productos más comprados (UNSPSC)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {by_product.map(product => (
              <div
                key={product.unspsc_id}
                className="flex items-center justify-between p-3 border border-gray-100 rounded-xl"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {product.unspsc_id} — {product.description}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatNumber(product.item_count)} ítems · {product.pct_of_total.toFixed(1)}% del monto
                  </p>
                </div>
                <Badge variant="default">{formatAbbreviatedCurrency(product.total_amount_gtq)}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">4. ¿Cuándo?</h2>
        <p className="text-sm text-gray-600">Estacionalidad de la demanda en el nicho de TI.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Procesos por mes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {shouldShowMonthlyChart(monthly_series) ? (
            <div className="h-80">
              <Line data={monthlyChartData} options={monthlyChartOptions} />
            </div>
          ) : (
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-900">
              Todavía no hay suficientes meses de datos para graficar una tendencia confiable.
            </div>
          )}
          <p className="text-xs text-gray-500 mt-3">
            El cierre de año (noviembre–diciembre) y marzo concentran los picos de compra — buen momento para
            tener tu oferta lista con anticipación.
          </p>
        </CardContent>
      </Card>

      <div className="pt-2">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">5. ¿Cómo entrar?</h2>
        <p className="text-sm text-gray-600">
          Especialízate: busca oportunidades con palabras como "equipo informático", "licencias de software" o
          "redes" y sigue de cerca a las Entidades que más compran en este nicho.
        </p>
      </div>

      {entryLoading ? (
        <Card>
          <CardContent>
            <Loading text="Buscando concursos vigentes..." />
          </CardContent>
        </Card>
      ) : entryError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {entryError}
        </div>
      ) : entryMatches.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-600" />
              Concursos vigentes de TI en las Top 5 Entidades
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              {entryMatches.map(release => (
                <ReleaseRow
                  key={release.ocid ?? release.id}
                  release={release}
                  onClick={() => navigate(`/busqueda/${encodeURIComponent(release.id)}`)}
                  highlightKeywords={['equipo informático', 'licencias de software', 'redes']}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <Rocket className="w-6 h-6 text-rc-orange" />
              <p className="text-gray-700">
                Ninguna de las Top 5 Entidades tiene un concurso de TI vigente este mes. Explora
                los Concursos activos del nicho de TI y prepara tu oferta.
              </p>
            </div>
            <Link
              to="/oportunidades"
              className="inline-flex items-center px-6 py-3 rounded-xl bg-rc-orange text-white font-semibold shadow-sm hover:opacity-90 transition-opacity"
            >
              Ver oportunidades
            </Link>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-gray-500">
        Incluye Modalidades {filter.core_modalities.join(', ')}, con clasificación UNSPSC prefijo{' '}
        {filter.unspsc_prefix}* (coincidencia por cualquier ítem del proceso). {notes[1]}
      </p>
    </div>
  );
};
