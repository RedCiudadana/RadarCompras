import { Release, Record, ProcessFilters, StatusRelease } from '../types/ocds';

const BASE_URL = 'https://ocds.guatecompras.gt';

export class OCDSApi {
  static async searchReleases(
    filters: ProcessFilters = {},
    page = 1,
    pageSize = 50,
    abortController: AbortController | null = null
  ): Promise<{ data: Release[]; hasMore: boolean; total: number }> {
    try {
      const params = new URLSearchParams();
      const now = new Date();
      params.append('pagina', page.toString());
      params.append('Anio', now.getFullYear().toString());
      params.append('Mes', (now.getMonth() + 1).toString());
      params.append('Estatus_concurso', StatusRelease.Vigente.toString());
      // params.append('Dia', now.getDate().toString());

      if (filters.keyword) {
        params.append('q', filters.keyword);
      }

      const url = `${BASE_URL}/release/search?${params.toString()}`;
      const response = await fetch(url, { signal: abortController?.signal});

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();

      return {
        data: result.releases,
        hasMore: !!result.links.next,
        total: result.releases.length
      };
    } catch (error) {
      console.error('Error fetching releases:', error);
      return { data: [], hasMore: false, total: 0 };
    }
  }

  static async getRecord(ocid: string): Promise<Record | null> {
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

    // Don't exist
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

    const buyerCounts: Record<string, number> = {};
    releases.forEach(r => {
      if (r.buyer?.name) {
        buyerCounts[r.buyer.name] = (buyerCounts[r.buyer.name] || 0) + 1;
      }
    });

    const topBuyers = Object.entries(buyerCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      totalProcesses,
      totalAmount,
      topBuyers,
    };
  }
}
