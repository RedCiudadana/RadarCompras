/**
 * Test suite para OCDSApi — valida la estructura de la respuesta contra docs.json
 * y el mapeo de parámetros contra el catálogo de /politica.
 *
 * Si la API cambia su contrato (HeaderRelease, Releases, Pagination schemas),
 * estos tests fallarán.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OCDSApi } from '../ocdsApi';

// ---------------------------------------------------------------------------
// Fixtures que reflejan exactamente los schemas de docs.json
// ---------------------------------------------------------------------------

/** HeaderRelease schema (docs.json) */
const mockHeaderRelease = {
  uri: 'https://ocds.guatecompras.gt/release/search',
  version: '1.1',
  publishedDate: '2024-04-01T00:00:00Z',
  publisher: { scheme: 'GT', uid: 'guatecompras', name: 'Guatecompras', uri: null },
  releases: [
    {
      id: 'GT-NOG-12345-T637979723532777654',
      ocid: 'ocds-xqjsxa-12345',
      date: '2024-04-01T10:00:00Z',
      publishedDate: '2024-04-01T10:00:00Z',
      language: 'es',
      tag: ['tender'],
      initiationType: 'tender',
      buyer: { id: '8', name: 'MINISTERIO DE EDUCACIÓN' },
      tender: {
        id: 'T-12345',
        title: 'Adquisición de material didáctico',
        status: 'active',
        statusDetails: 'Vigente',
        value: { amount: 500000, currency: 'GTQ' },
        procurementMethod: 'open',
        procurementMethodDetails: 'Licitación pública',
      },
      awards: [],
      contracts: [],
    },
  ],
  /** Pagination schema (docs.json) */
  links: {
    next: null,
    prev: null,
  },
};

function mockFetchSuccess(body: unknown) {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => body,
  } as Response);
}

function mockFetchError(status = 500) {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: false,
    status,
  } as Response);
}

// ---------------------------------------------------------------------------
// OCDSApi.searchReleases — validación de estructura (docs.json)
// ---------------------------------------------------------------------------

describe('OCDSApi.searchReleases', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  // --- Validación de estructura HeaderRelease ---

  it('HeaderRelease: devuelve objeto con releases[] y hasMore booleano', async () => {
    mockFetchSuccess(mockHeaderRelease);
    const result = await OCDSApi.searchReleases();

    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('hasMore');
    expect(result).toHaveProperty('total');
    expect(Array.isArray(result.data)).toBe(true);
    expect(typeof result.hasMore).toBe('boolean');
    expect(typeof result.total).toBe('number');
  });

  it('Releases schema: cada release tiene los campos obligatorios de docs.json', async () => {
    mockFetchSuccess(mockHeaderRelease);
    const { data } = await OCDSApi.searchReleases();
    const release = data[0];

    expect(release).toHaveProperty('id');
    expect(release).toHaveProperty('ocid');
    expect(release).toHaveProperty('date');
    expect(release).toHaveProperty('buyer');
    expect(typeof release.id).toBe('string');
    expect(typeof release.ocid).toBe('string');
    expect(typeof release.date).toBe('string');
  });

  it('Releases.buyer: tiene id y name (Estructura_Id_Nombre schema)', async () => {
    mockFetchSuccess(mockHeaderRelease);
    const { data } = await OCDSApi.searchReleases();
    const { buyer } = data[0];

    expect(buyer).toHaveProperty('id');
    expect(buyer).toHaveProperty('name');
    expect(typeof buyer.id).toBe('string');
    expect(typeof buyer.name).toBe('string');
  });

  it('Releases.tender: cuando existe, tiene id y title (Tender schema)', async () => {
    mockFetchSuccess(mockHeaderRelease);
    const { data } = await OCDSApi.searchReleases();
    const { tender } = data[0];

    expect(tender).toBeDefined();
    expect(tender).toHaveProperty('id');
    expect(tender).toHaveProperty('title');
  });

  it('Pagination: hasMore es false cuando links.next es null', async () => {
    mockFetchSuccess(mockHeaderRelease);
    const { hasMore } = await OCDSApi.searchReleases();
    expect(hasMore).toBe(false);
  });

  it('Pagination: hasMore es true cuando links.next no es null', async () => {
    mockFetchSuccess({
      ...mockHeaderRelease,
      links: { next: 'https://ocds.guatecompras.gt/release/search?pagina=2', prev: null },
    });
    const { hasMore } = await OCDSApi.searchReleases();
    expect(hasMore).toBe(true);
  });

  it('Releases.tag: es un array de strings', async () => {
    mockFetchSuccess(mockHeaderRelease);
    const { data } = await OCDSApi.searchReleases();
    expect(Array.isArray(data[0].tag)).toBe(true);
    data[0].tag.forEach(t => expect(typeof t).toBe('string'));
  });

  // --- Mapeo de parámetros al API (basado en docs.json + catálogo /politica) ---

  it('envía Anio y Mes con la fecha actual por defecto', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases();

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    const now = new Date();
    expect(calledUrl).toContain(`Anio=${now.getFullYear()}`);
    expect(calledUrl).toContain(`Mes=${now.getMonth() + 1}`);
  });

  it('usa filters.year → Anio y filters.month → Mes', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases({ year: 2023, month: 7 });

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('Anio=2023');
    expect(calledUrl).toContain('Mes=7');
  });

  it('envía Entidad cuando filters.entidad está definido', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases({ entidad: '8' });

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('Entidad=8');
  });

  it('no envía Entidad cuando filters.entidad está vacío', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases({ entidad: '' });

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('Entidad');
  });

  it('envía Modalidad_compradora cuando filters.modalidad está definido', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases({ modalidad: '4' }); // Licitación Pública

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('Modalidad_compradora=4');
  });

  it('no envía Modalidad_compradora cuando filters.modalidad está vacío', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases({ modalidad: '' });

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('Modalidad_compradora');
  });

  it('envía Sub_modalidad_compradora cuando filters.subModalidad está definido', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases({ modalidad: '6', subModalidad: '21' });

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('Sub_modalidad_compradora=21');
  });

  it('envía Estatus_concurso=1 (Vigente) por defecto', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases();

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('Estatus_concurso=1');
  });

  it('envía Estatus_concurso con el valor de filters.estatus', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases({ estatus: 3 }); // Adjudicado

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('Estatus_concurso=3');
  });

  it('usa el parámetro pagina correctamente', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases({}, 3);

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).toContain('pagina=3');
  });

  it('no envía parámetro q (búsqueda por texto no soportada por la API)', async () => {
    mockFetchSuccess(mockHeaderRelease);
    await OCDSApi.searchReleases();

    const calledUrl = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(calledUrl).not.toContain('q=');
  });

  // --- Manejo de errores ---

  it('retorna data vacía cuando la API responde con error HTTP', async () => {
    mockFetchError(500);
    const result = await OCDSApi.searchReleases();

    expect(result.data).toEqual([]);
    expect(result.hasMore).toBe(false);
    expect(result.total).toBe(0);
  });

  it('retorna data vacía cuando hay error de red', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    const result = await OCDSApi.searchReleases();

    expect(result.data).toEqual([]);
    expect(result.hasMore).toBe(false);
  });

  it('retorna data vacía cuando releases es undefined en la respuesta', async () => {
    mockFetchSuccess({ links: { next: null, prev: null } });
    const result = await OCDSApi.searchReleases();

    expect(result.data).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// OCDSApi.filterReleases
// ---------------------------------------------------------------------------

describe('OCDSApi.filterReleases', () => {
  const releases = mockHeaderRelease.releases as any[];

  it('retorna todos los releases cuando no hay filtros activos', () => {
    const result = OCDSApi.filterReleases(releases, {});
    expect(result).toHaveLength(releases.length);
  });

  it('filtra por buyer name (case insensitive)', () => {
    const match = OCDSApi.filterReleases(releases, { buyer: 'ministerio' });
    expect(match).toHaveLength(1);

    const noMatch = OCDSApi.filterReleases(releases, { buyer: 'INEXISTENTE_XYZ' });
    expect(noMatch).toHaveLength(0);
  });

  it('filtra por startDate', () => {
    const match = OCDSApi.filterReleases(releases, { startDate: '2024-01-01' });
    expect(match).toHaveLength(1);

    const noMatch = OCDSApi.filterReleases(releases, { startDate: '2025-01-01' });
    expect(noMatch).toHaveLength(0);
  });

  it('filtra por endDate', () => {
    const match = OCDSApi.filterReleases(releases, { endDate: '2025-01-01' });
    expect(match).toHaveLength(1);

    const noMatch = OCDSApi.filterReleases(releases, { endDate: '2023-01-01' });
    expect(noMatch).toHaveLength(0);
  });

  it('aplica múltiples filtros combinados (AND)', () => {
    const match = OCDSApi.filterReleases(releases, {
      buyer: 'educación',
      startDate: '2024-01-01',
      endDate: '2025-01-01',
    });
    expect(match).toHaveLength(1);

    const noMatch = OCDSApi.filterReleases(releases, {
      buyer: 'educación',
      startDate: '2025-01-01',
    });
    expect(noMatch).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// Catálogo — integridad de los valores definidos en /politica
// ---------------------------------------------------------------------------

describe('Catálogo const/catalogo.ts', async () => {
  const { MODALIDADES, SUB_MODALIDADES, ESTATUS_CONCURSO } = await import('../../const/catalogo');

  it('MODALIDADES: tiene 24 entradas con id y name', () => {
    expect(MODALIDADES).toHaveLength(24);
    MODALIDADES.forEach(m => {
      expect(typeof m.id).toBe('string');
      expect(typeof m.name).toBe('string');
      expect(m.id.length).toBeGreaterThan(0);
      expect(m.name.length).toBeGreaterThan(0);
    });
  });

  it('MODALIDADES: IDs son únicos', () => {
    const ids = MODALIDADES.map(m => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('SUB_MODALIDADES: solo la modalidad 6 tiene sub-modalidades', () => {
    expect(Object.keys(SUB_MODALIDADES)).toEqual(['6']);
    expect(SUB_MODALIDADES['6']).toHaveLength(7);
  });

  it('SUB_MODALIDADES[6]: cada sub-modalidad tiene id y name', () => {
    SUB_MODALIDADES['6'].forEach(s => {
      expect(typeof s.id).toBe('string');
      expect(typeof s.name).toBe('string');
    });
  });

  it('ESTATUS_CONCURSO: tiene 16 entradas que incluyen los 5 básicos', () => {
    expect(ESTATUS_CONCURSO).toHaveLength(16);
    const ids = ESTATUS_CONCURSO.map(e => e.id);
    expect(ids).toContain('1'); // Vigente
    expect(ids).toContain('2'); // Evaluación
    expect(ids).toContain('3'); // Adjudicado
    expect(ids).toContain('4'); // Prescindido
    expect(ids).toContain('5'); // Desierto
  });

  it('ESTATUS_CONCURSO: IDs son únicos', () => {
    const ids = ESTATUS_CONCURSO.map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
