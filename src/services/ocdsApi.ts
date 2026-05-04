import { Release, Record as OcdsRecord, ProcessFilters, StatusRelease } from '../types/ocds';

const BASE_URL = 'https://ocds.guatecompras.gt';

import { TOP_ENTIDADES_BY_FAMILIA, TopFamilia } from '../const/guatecompras';

export class OCDSApi {
  /**
   * Búsqueda y lista de releases por ciertos criterios.
   * Recorrido secuencial (método Search alter) para explorar más de 10,000 resultados.
   *
   * Basado en la especificación OpenAPI `/release/search` (docs.json):
   *
   * | Parámetro API           | Filter prop   | Descripción                                         |
   * |-------------------------|---------------|-----------------------------------------------------|
   * | pagina                  | page          | Número de página de los releases                    |
   * | Anio                    | year          | Año de la publicación (obligatorio*)                |
   * | Mes                     | month         | Mes de la publicación                               |
   * | Entidad                 | entidad       | Entidad compradora (ID numérico, ver ejecutivo.json)|
   * | Modalidad_compradora    | modalidad     | Modalidad de compra (ver const/catalogo.ts)         |
   * | Sub_modalidad_compradora| subModalidad  | Sub-modalidad (solo aplica a modalidad 6)           |
   * | Estatus_concurso        | estatus       | Estado del concurso (default: 1=Vigente)            |
   *
   * *Nota API: al menos uno de Anio, Mes o Dia es obligatorio.
   * Cuando no se proveen year/month se usa la fecha actual.
   *
   * Parámetros NO soportados por la API (no se envían):
   * - Búsqueda por texto libre (q)
   * - Filtro por monto (minAmount / maxAmount)
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
      params.append('Estatus_concurso', (filters.estatus ?? StatusRelease.Vigente).toString());

      if (filters.entidad) {
        params.append('Entidad', filters.entidad);
      }

      let category: null | TopFamilia = null;
      // Check ProcessFilters.category description for more info.
      // We overwrite entity to match categories.
      if (filters.category) {
        category = TOP_ENTIDADES_BY_FAMILIA
          .find((family) => family.fam_code === filters.category) || null;
      }

      if (filters.modalidad) {
        params.append('Modalidad_compradora', filters.modalidad);
      }

      if (filters.subModalidad) {
        params.append('Sub_modalidad_compradora', filters.subModalidad);
      }

      if (category) {
        const data: Release[] = [];
        const entities = category.top_entidades.slice(0, 5);
        // Sum the pct of family only cover up 90%;
        let pct_family = 0;


        for (const entity of entities) {
          if (pct_family > 0.9) {
            break;
          }

          params.set('Entidad', entity.gcuc_entidad_id);

          const url = `${BASE_URL}/release/search?${params.toString()}`;
          const response = await fetch(url, { signal: abortController?.signal });

          if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
          }

          const result = await response.json();

          pct_family += entity.pct_familia;

          if (result.releases && result.releases.length > 0) {
            data.push(...result.releases);
          }
        }

        const filteredData = data.filter((release: Release) => {
          const items = release.tender?.items || [];

          if (items.length <= 0) {
            return false;
          }

          debugger;
          const hasCategory = items?.find(item => item.classification?.id.startsWith(category.fam_code));

          return hasCategory;
        });

        console.debug(`[BETA]: This is a optimistic search of tender that match de category.`);
        console.debug(`[BETA]: Found ${data.length || 0} from with ${filteredData.length} match de classification.`);

        return {
          data: filteredData,
          hasMore: false,
          total: (filteredData ?? []).length,
        };
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

  /**
   * Obtiene la release por id, ejemplo "GT-NOG-30129117-T639126757317034370", Usa el valor de `id` no `ocid`.
   *
   * @param id The "id" from the release
   * @param abortController 
   * @returns Release
   */
  static async getRelease(
    id: string,
    abortController: AbortController | null = null
  ): Promise<{ data: Release|null; }> {
    try {
      const url = `${BASE_URL}/release/${id}`;
      const response = await fetch(url, { signal: abortController?.signal });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      const releases = result.releases ?? [];

      if (releases.length <= 0) {
        throw new Error('Error release is empty');
      }

      return {
        data: releases[0]
      };
    } catch (error) {
      console.error('Error fetching releases:', error);
      return { data: null };
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
