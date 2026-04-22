export interface Money {
  amount: number;
  currency: string;
}

export interface Organization {
  id: string;
  name: string;
  identifier?: {
    id: string;
    scheme: string;
    legalName: string;
  };
}

export interface Period {
  startDate?: string;
  endDate?: string;
}

export interface Tender {
  id: string;
  title: string;
  description?: string;
  status?: string;
  value?: Money;
  procurementMethod?: string;
  procurementMethodDetails?: string;
  tenderPeriod?: Period;
  numberOfTenderers?: number;
}

export interface Award {
  id: string;
  title?: string;
  status: string;
  date?: string;
  value?: Money;
  suppliers: Organization[];
  contractPeriod?: Period;
}

export interface Contract {
  id: string;
  awardID: string;
  title?: string;
  status?: string;
  period?: Period;
  value?: Money;
  dateSigned?: string;
}

export interface CompiledRelease {
  ocid: string;
  id: string;
  date: string;
  tag: string[];
  initiationType: string;
  buyer: Organization;
  tender?: Tender;
  awards?: Award[];
  contracts?: Contract[];
}

export interface Release {
  ocid: string;
  id: string;
  date: string;
  tag: string[];
  initiationType: string;
  buyer: Organization;
  tender?: Tender;
  awards?: Award[];
  contracts?: Contract[];
}

export interface Record {
  ocid: string;
  releases: Release[];
  compiledRelease: CompiledRelease;
}

export interface SearchResponse {
  data: Release[];
  pagination?: {
    total: number;
    page: number;
    pageSize: number;
  };
}

export interface ProcessFilters {
  buyer?: string;
  startDate?: string;
  endDate?: string;
  /** Año de la publicación → parámetro Anio de la API */
  year?: number;
  /** Mes de la publicación → parámetro Mes de la API */
  month?: number;
  /** ID numérico de entidad compradora → parámetro Entidad de la API (ver const/ejecutivo.json) */
  entidad?: string;
  /** Modalidad de compra → parámetro Modalidad_compradora (ver const/catalogo.ts) */
  modalidad?: string;
  /** Sub-modalidad de compra → parámetro Sub_modalidad_compradora (solo aplica a modalidad 6) */
  subModalidad?: string;
  /** Estado del concurso → parámetro Estatus_concurso (ver const/catalogo.ts, default: 1=Vigente) */
  estatus?: number;
}

/** 2.3.9 Estatus del concurso — catálogo completo según /politica */
export enum StatusRelease {
  Vigente = 1,
  Evaluacion = 2,
  Adjudicado = 3,
  Prescindido = 4,
  Desierto = 5,
  FinalizadoAdjudicadoCedido = 10,
  Anulado = 11,
  FinalizadoRematado = 12,
  TerminadoPrecalificado = 13,
  Subastando = 14,
  Improbado = 15,
  TerminadoCancelado = 16,
  FinalizadoSeleccionado = 17,
  Suspendido = 18,
  EnEsperaDeProrroga = 19,
  NoAdjudicado = 20,
}