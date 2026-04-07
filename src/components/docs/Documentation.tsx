import React, { useState } from 'react';
import { Book, Code, Database, Globe, CheckCircle, Copy, ExternalLink, Server, Zap, Shield } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { HeroSlider } from '../ui/HeroSlider';

export const Documentation: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const heroSlides = [
    {
      title: 'Documentación Técnica',
      subtitle: 'Aprende cómo nos conectamos al API de OCDS del MINFIN',
      gradient: 'from-slate-700 to-gray-900',
    },
    {
      title: 'Integración OCDS',
      subtitle: 'Datos abiertos de compras públicas en tiempo real',
      gradient: 'from-gray-700 to-slate-800',
    },
  ];

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    apiEndpoint: `const OCDS_API_BASE = 'https://www.guatecompras.gt/ocds/api';
const RELEASES_ENDPOINT = '/releases';`,

    fetchReleases: `async searchReleases(
  filters: ProcessFilters = {},
  page: number = 1,
  limit: number = 50
) {
  const offset = (page - 1) * limit;

  const params = new URLSearchParams({
    offset: offset.toString(),
    limit: limit.toString(),
  });

  if (filters.keyword) {
    params.append('q', filters.keyword);
  }

  const response = await fetch(
    \`\${OCDS_API_BASE}\${RELEASES_ENDPOINT}?\${params}\`,
    {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  return {
    data: data.releases || [],
    hasMore: data.releases?.length === limit,
  };
}`,

    dataStructure: `interface Release {
  ocid: string;
  id: string;
  date: string;
  tag: string[];
  initiationType: string;
  buyer?: {
    name: string;
    id: string;
  };
  tender?: {
    id: string;
    title: string;
    description: string;
    status: string;
    value: {
      amount: number;
      currency: string;
    };
    procurementMethod: string;
    tenderPeriod?: {
      startDate: string;
      endDate: string;
    };
  };
  awards?: Array<{
    id: string;
    title: string;
    status: string;
    value: {
      amount: number;
      currency: string;
    };
    suppliers: Array<{
      name: string;
      id: string;
    }>;
    date: string;
  }>;
}`,

    filterExample: `filterReleases(
  releases: Release[],
  filters: ProcessFilters
): Release[] {
  return releases.filter(release => {
    if (filters.buyer && release.buyer?.name) {
      if (!release.buyer.name
        .toLowerCase()
        .includes(filters.buyer.toLowerCase())) {
        return false;
      }
    }

    if (filters.minAmount !== undefined) {
      const amount = release.tender?.value?.amount || 0;
      if (amount < filters.minAmount) return false;
    }

    if (filters.maxAmount !== undefined) {
      const amount = release.tender?.value?.amount || 0;
      if (amount > filters.maxAmount) return false;
    }

    return true;
  });
}`,
  };

  const CodeBlock: React.FC<{ code: string; id: string; language?: string }> = ({ code, id, language = 'typescript' }) => (
    <div className="relative">
      <div className="absolute top-3 right-3 z-10">
        <Button
          size="sm"
          variant="outline"
          onClick={() => copyToClipboard(code, id)}
          className="bg-gray-800/50 backdrop-blur-sm border-gray-600 hover:bg-gray-700"
        >
          {copiedCode === id ? (
            <>
              <CheckCircle className="w-4 h-4 mr-1 text-green-400" />
              <span className="text-green-400">Copiado</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copiar
            </>
          )}
        </Button>
      </div>
      <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto border border-gray-700">
        <code className={`language-${language} text-sm`}>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="space-y-6">
      <HeroSlider slides={heroSlides} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Globe className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900">API REST</h3>
            </div>
            <p className="text-sm text-gray-600">
              Conexión directa al API público de Guatecompras usando el estándar OCDS
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900">Tiempo Real</h3>
            </div>
            <p className="text-sm text-gray-600">
              Datos actualizados directamente desde el MINFIN sin intermediarios
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-white border-amber-100">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900">Estándar OCDS</h3>
            </div>
            <p className="text-sm text-gray-600">
              Open Contracting Data Standard para transparencia en compras públicas
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="w-6 h-6 text-blue-600" />
            ¿Qué es OCDS?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            El <strong>Open Contracting Data Standard (OCDS)</strong> es un estándar internacional de datos abiertos
            para la publicación de información sobre contrataciones públicas. Permite que los datos sobre planificación,
            licitación, adjudicación, contratación e implementación de contratos públicos sean compartidos de manera
            consistente y accesible.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
              <Database className="w-5 h-5" />
              Beneficios del Estándar OCDS
            </h4>
            <ul className="space-y-2 text-sm text-blue-900">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>Transparencia y rendición de cuentas en el gasto público</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>Detección de irregularidades y prevención de la corrupción</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>Mejor acceso al mercado para proveedores</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span>Datos interoperables entre diferentes sistemas</span>
              </li>
            </ul>
          </div>

          <a
            href="https://standard.open-contracting.org/latest/es/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            Documentación oficial OCDS
            <ExternalLink className="w-4 h-4" />
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Server className="w-6 h-6 text-blue-600" />
            Endpoint del API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Nuestra plataforma se conecta directamente al API público de Guatecompras del MINFIN:
          </p>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="blue">URL Base</Badge>
            </div>
            <code className="text-blue-600 font-mono text-sm break-all">
              https://www.guatecompras.gt/ocds/api
            </code>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="green">Endpoint Principal</Badge>
            </div>
            <code className="text-green-600 font-mono text-sm break-all">
              GET /releases
            </code>
          </div>

          <CodeBlock code={codeExamples.apiEndpoint} id="apiEndpoint" />

          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-lg">
            <p className="text-sm text-amber-900">
              <strong>Nota:</strong> El API es de acceso público y no requiere autenticación. Los datos son
              proporcionados directamente por el Ministerio de Finanzas Públicas de Guatemala.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600" />
            Implementación: Búsqueda de Releases
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            La función principal de nuestra plataforma realiza búsquedas paginadas en el API de OCDS:
          </p>

          <CodeBlock code={codeExamples.fetchReleases} id="fetchReleases" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-semibold text-gray-900 mb-3">Parámetros de Búsqueda</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-blue-100 px-2 py-0.5 rounded text-blue-800">offset</code> - Punto de inicio para paginación</li>
                <li><code className="bg-blue-100 px-2 py-0.5 rounded text-blue-800">limit</code> - Número máximo de resultados</li>
                <li><code className="bg-blue-100 px-2 py-0.5 rounded text-blue-800">q</code> - Palabra clave de búsqueda</li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
              <h4 className="font-semibold text-gray-900 mb-3">Respuesta del API</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li><code className="bg-green-100 px-2 py-0.5 rounded text-green-800">releases[]</code> - Array de procesos</li>
                <li><code className="bg-green-100 px-2 py-0.5 rounded text-green-800">hasMore</code> - Indicador de más datos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-6 h-6 text-blue-600" />
            Estructura de Datos OCDS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Cada <strong>Release</strong> (lanzamiento) en OCDS representa información sobre un proceso de contratación
            en un momento específico. La estructura incluye:
          </p>

          <CodeBlock code={codeExamples.dataStructure} id="dataStructure" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100">
              <h5 className="font-semibold text-blue-900 mb-2 text-sm">Identificación</h5>
              <p className="text-xs text-gray-700"><code>ocid</code> - ID único del proceso de contratación</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white p-4 rounded-lg border border-green-100">
              <h5 className="font-semibold text-green-900 mb-2 text-sm">Comprador</h5>
              <p className="text-xs text-gray-700"><code>buyer</code> - Institución que realiza la compra</p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-white p-4 rounded-lg border border-amber-100">
              <h5 className="font-semibold text-amber-900 mb-2 text-sm">Licitación</h5>
              <p className="text-xs text-gray-700"><code>tender</code> - Detalles del proceso de licitación</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white p-4 rounded-lg border border-purple-100">
              <h5 className="font-semibold text-purple-900 mb-2 text-sm">Adjudicaciones</h5>
              <p className="text-xs text-gray-700"><code>awards</code> - Contratos adjudicados</p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-white p-4 rounded-lg border border-pink-100">
              <h5 className="font-semibold text-pink-900 mb-2 text-sm">Estado</h5>
              <p className="text-xs text-gray-700"><code>status</code> - Etapa actual del proceso</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-50 to-white p-4 rounded-lg border border-cyan-100">
              <h5 className="font-semibold text-cyan-900 mb-2 text-sm">Valor</h5>
              <p className="text-xs text-gray-700"><code>value</code> - Monto y moneda del contrato</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-6 h-6 text-blue-600" />
            Filtrado de Datos en el Cliente
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Además de los filtros del API, implementamos filtrado local para una experiencia más refinada:
          </p>

          <CodeBlock code={codeExamples.filterExample} id="filterExample" />

          <div className="bg-gradient-to-br from-blue-50 to-white p-4 rounded-lg border border-blue-100 mt-4">
            <h4 className="font-semibold text-blue-900 mb-3">Criterios de Filtrado</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <Badge variant="blue" className="mb-2">Institución</Badge>
                <p className="text-gray-700">Filtra por nombre del comprador</p>
              </div>
              <div>
                <Badge variant="green" className="mb-2">Monto Mínimo</Badge>
                <p className="text-gray-700">Excluye procesos menores</p>
              </div>
              <div>
                <Badge variant="amber" className="mb-2">Monto Máximo</Badge>
                <p className="text-gray-700">Excluye procesos mayores</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ExternalLink className="w-6 h-6 text-blue-600" />
            Recursos Adicionales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <a
            href="https://www.guatecompras.gt/ocds/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-white rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold text-gray-900">Portal OCDS Guatecompras</h4>
              <p className="text-sm text-gray-600">Documentación oficial del API</p>
            </div>
            <ExternalLink className="w-5 h-5 text-blue-600" />
          </a>

          <a
            href="https://standard.open-contracting.org/latest/es/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-white rounded-lg border border-green-100 hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold text-gray-900">Documentación OCDS</h4>
              <p className="text-sm text-gray-600">Estándar completo en español</p>
            </div>
            <ExternalLink className="w-5 h-5 text-green-600" />
          </a>

          <a
            href="https://www.minfin.gob.gt/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-4 bg-gradient-to-r from-amber-50 to-white rounded-lg border border-amber-100 hover:shadow-md transition-shadow"
          >
            <div>
              <h4 className="font-semibold text-gray-900">Ministerio de Finanzas</h4>
              <p className="text-sm text-gray-600">Sitio oficial del MINFIN</p>
            </div>
            <ExternalLink className="w-5 h-5 text-amber-600" />
          </a>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">¿Necesitas más información?</h3>
              <p className="text-blue-100 mb-4">
                Esta documentación cubre la integración principal con el API de OCDS. Para consultas
                específicas sobre implementación o datos, revisa el código fuente en{' '}
                <code className="bg-white/20 px-2 py-1 rounded">src/services/ocdsApi.ts</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
