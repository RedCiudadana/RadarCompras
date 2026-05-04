import { OCDSApi } from "./ocdsApi";
import { Release } from "../types/ocds";

export type CompanySize = 'small' | 'medium' | 'large';

export const COMPANY_SIZES: CompanySize[] = ['small', 'medium', 'large'];

export interface OpportunitiesParams {
    categories: string[];
    keywords: string[];
    companySize: CompanySize;
}

export interface OpportunitiesResponse {
    data: Release[];
    keywords: string[];
}

/**
 * Cada modalidad aplica para rangos de precios específicos:
 *  '1'  Compra Directa con Oferta Electrónica
 *  '33' Compra de Baja Cuantía
 *  '3'  Cotización
 *  '4'  Licitación Pública
 * Ver `src/const/catalogo.ts` para el catálogo completo.
 */
const MODALIDAD_BY_SIZE: Record<CompanySize, string[]> = {
    small: ['1', '33'],
    medium: ['3'],
    large: ['4'],
};

const LOOKBACK_MONTHS = 3;

function lastMonths(count: number, today: Date = new Date()): Array<{ year: number; month: number }> {
    const out: Array<{ year: number; month: number }> = [];
    for (let i = 0; i < count; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        out.push({ year: d.getFullYear(), month: d.getMonth() + 1 });
    }
    return out;
}

export class RecommenderAPI {
    /**
     * Busca oportunidades para el proveedor combinando:
     *  - modalidades que aplican a su tamaño de empresa
     *  - los últimos 3 meses
     *  - cada categoría UNSPCS seleccionada
     *
     * El OCDS API no soporta búsqueda por texto libre, por lo que las keywords
     * se devuelven sin filtrar para resaltarlas client-side.
     */
    static async findOpportunities(
        filters: OpportunitiesParams,
        abortController: AbortController | null = null
    ): Promise<OpportunitiesResponse> {
        const modalidades = MODALIDAD_BY_SIZE[filters.companySize] ?? [];
        const months = lastMonths(LOOKBACK_MONTHS);

        const tuples: Array<{ modalidad: string; year: number; month: number; category: string }> = [];
        for (const modalidad of modalidades) {
            for (const { year, month } of months) {
                for (const category of filters.categories) {
                    tuples.push({ modalidad, year, month, category });
                }
            }
        }

        const settled = await Promise.allSettled(
            tuples.map(t =>
                OCDSApi.searchReleases(
                    { modalidad: t.modalidad, year: t.year, month: t.month, category: t.category },
                    1,
                    50,
                    abortController
                )
            )
        );

        if (abortController?.signal.aborted) {
            const err = new Error('Aborted');
            err.name = 'AbortError';
            throw err;
        }

        const seen = new Set<string>();
        const merged: Release[] = [];
        for (const r of settled) {
            if (r.status !== 'fulfilled') continue;
            for (const release of r.value.data) {
                const key = release.ocid ?? release.id;
                if (!key || seen.has(key)) continue;
                seen.add(key);
                merged.push(release);
            }
        }

        merged.sort((a, b) => {
            const da = a.date ? new Date(a.date).getTime() : 0;
            const db = b.date ? new Date(b.date).getTime() : 0;
            return db - da;
        });

        return { data: merged, keywords: filters.keywords };
    }
}

export function opportunitiesParamsToSearchParams(p: OpportunitiesParams): Record<string, string> {
    const out: Record<string, string> = {
        categories: p.categories.join(','),
        size: p.companySize,
    };
    if (p.keywords.length > 0) {
        out.keywords = p.keywords.join(',');
    }
    return out;
}

export function opportunitiesParamsFromSearchParams(sp: URLSearchParams): OpportunitiesParams | null {
    const rawCategories = sp.get('categories') ?? '';
    const rawSize = sp.get('size') ?? '';
    const rawKeywords = sp.get('keywords') ?? '';

    const categories = rawCategories.split(',').map(s => s.trim()).filter(Boolean);
    if (categories.length === 0) return null;

    if (!COMPANY_SIZES.includes(rawSize as CompanySize)) return null;

    const keywords = rawKeywords.split(',').map(s => s.trim()).filter(Boolean);

    return {
        categories,
        keywords,
        companySize: rawSize as CompanySize,
    };
}
