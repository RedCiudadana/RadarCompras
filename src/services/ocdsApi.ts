import { Release, Record as OcdsRecord, ProcessFilters, StatusRelease } from '../types/ocds';

const BASE_URL = 'https://ocds.guatecompras.gt';

export class OCDSApi {
  /**
   * Búsqueda y lista de releases por ciertos criterios.
   * Recorrido secuencial (método Search alter) para explorar más de 10,000 resultados.
   *
   * Basado en la especificación OpenAPI `/release/search` (docs.json):
   *
   * | Parámetro API       | Filter prop  | Descripción                                     |
   * |---------------------|--------------|-------------------------------------------------|
   * | pagina              | page         | Número de página de los releases                |
   * | Anio                | year         | Año de la publicación (obligatorio*)            |
   * | Mes                 | month        | Mes de la publicación (2 dígitos)               |
   * | Entidad             | entidad      | Entidad compradora (ID numérico)                |
   * | Estatus_concurso    | —            | Estado del concurso (1=Vigente por defecto)     |
   * | q                   | keyword      | Búsqueda por palabra clave                      |
   *
   * *Nota API: al menos uno de Anio, Mes o Dia es obligatorio.
   * Cuando no se proveen year/month se usa la fecha actual.
   *
   * Respuesta (HeaderRelease schema):
   * - releases[]: array de Release
   * - links.next / links.prev: paginación (null si no hay más páginas)
   *
   * @see /release/search en docs.json
   */
  static async searchReleases(
    filters: ProcessFilters = {},
    page = 1,
    _pageSize = 50,
    abortController: AbortController | null = null
  ): Promise<{ data: Release[]; hasMore: boolean; total: number }> {
    try {
      const now = new Date();
      const params = new URLSearchParams();

      params.append('pagina', page.toString());
      params.append('Anio', (filters.year ?? now.getFullYear()).toString());
      params.append('Mes', (filters.month ?? now.getMonth() + 1).toString());
      params.append('Estatus_concurso', StatusRelease.Vigente.toString());

      if (filters.entidad) {
        params.append('Entidad', filters.entidad);
      }

      if (filters.keyword) {
        params.append('q', filters.keyword);
      }

      const url = `${BASE_URL}/release/search?${params.toString()}`;
      const response = await fetch(url, { signal: abortController?.signal });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      return {
        data: result.releases ?? [],
        hasMore: !!result.links?.next,
        total: (result.releases ?? []).length,
      };
    } catch (error) {
      console.error('Error fetching releases:', error);
      return { data: [], hasMore: false, total: 0 };
    }
  }

  static async getRecord(ocid: string): Promise<OcdsRecord | null> {
    try {
      const url = `${BASE_URL}/record/${encodeURIComponent(ocid)}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching record:', error);
      return null;
    }
  }

  static filterReleases(releases: Release[], filters: ProcessFilters): Release[] {
    let filtered = [...releases];

    if (filters.buyer) {
      filtered = filtered.filter(r =>
        r.buyer?.name?.toLowerCase().includes(filters.buyer!.toLowerCase())
      );
    }

    // Don't exist as API params — applied client-side
    if (filters.minAmount !== undefined) {
      filtered = filtered.filter(r =>
        (r.tender?.value?.amount || 0) >= filters.minAmount!
      );
    }

    if (filters.maxAmount !== undefined) {
      filtered = filtered.filter(r =>
        (r.tender?.value?.amount || 0) <= filters.maxAmount!
      );
    }

    if (filters.startDate) {
      filtered = filtered.filter(r =>
        new Date(r.date) >= new Date(filters.startDate!)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(r =>
        new Date(r.date) <= new Date(filters.endDate!)
      );
    }

    return filtered;
  }

  static calculateStats(releases: Release[]) {
    const totalProcesses = releases.length;
    const totalAmount = releases.reduce((sum, r) =>
      sum + (r.tender?.value?.amount || 0), 0
    );

    const buyerCounts: { [key: string]: number } = {};
    releases.forEach(r => {
      if (r.buyer?.name) {
        buyerCounts[r.buyer.name] = (buyerCounts[r.buyer.name] || 0) + 1;
      }
    });

    const topBuyers = Object.entries(buyerCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return { totalProcesses, totalAmount, topBuyers };
  }
}
