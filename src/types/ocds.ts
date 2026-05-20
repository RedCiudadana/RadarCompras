export const OCDS_PREFIX = 'ocds-xqjsxa';

export interface CompiledRelease {
  ocid: string;
  id: string;
  date: string;
  tag: string[];
  initiationType: string;
  buyer: Buyer;
  tender?: Tender;
  awards?: Award[];
  contracts?: Contract[];
}

export interface Record {
  ocid: string;
  releases: Release[];
  compiledRelease: CompiledRelease;
}

export interface Release {
  id: string
  ocid: string
  date: string
  publishedDate: string
  language: string
  tag: string[]
  initiationType: string
  parties: Party[]
  buyer: Buyer
  bids: Bids
  tender: Tender
  awards: Award[]
  contracts: Contract[]
  sources: Source[]
  dataSegmentation: DataSegmentation
}

export interface Party {
  name: string
  id: string
  identifier: Identifier
  address: Address
  contactPoint: ContactPoint
  roles: string[]
  additionalContactPoints: AdditionalContactPoint[]
  memberOf: MemberOf[]
  details: Details
}

export interface Identifier {
  id: string
  scheme: string
}

export interface Address {
  streetAddress: string
  locality: string
  region: string
  countryName: string
}

export interface ContactPoint {
  name: string
  email: string
  telephone: string
  faxNumber: string
  url: string
}

export interface AdditionalContactPoint {
  name: string
  email: string
  telephone: string
  availableLanguage: string[]
}

export interface MemberOf {
  name: string
  id: string
}

export interface Details {
  level: Level
  legalEntityTypeDetail: LegalEntityTypeDetail
  entityType: EntityType
  type: Type
}

export interface Level {
  id: string
  description: string
}

export interface LegalEntityTypeDetail {
  id: string
  description: string
}

export interface EntityType {
  id: string
  description: string
}

export interface Type {
  id: string
  description: string
}

export interface Buyer {
  name: string
  id: string
}

export interface Bids {
  details: Detail[]
}

export interface Detail {
  id: string
  date: string
  status: string
  value: Value
  tenderers: Tenderer[]
}

export interface Value {
  amount: number
  currency: string
}

export interface Tenderer {
  name: string
  id: string
}

export interface Tender {
  id: string
  title: string
  status: string
  statusDetails: string
  datePublished: string
  procuringEntity: ProcuringEntity
  items: Item[]
  procurementMethod: string
  procurementMethodDetails: string
  mainProcurementCategory: string
  additionalProcurementCategories: string[]
  submissionMethod: string[]
  submissionMethodDetails: string
  tenderPeriod: TenderPeriod
  numberOfTenderers: number
  tenderers: TenderParty[]
  documents: Document[]
}

export interface ProcuringEntity {
  name: string
  id: string
}

export interface Item {
  id: string
  description: string
  classification: Classification
  quantity: number
  unit: Unit
  attributes: Attribute[]
}

export interface Classification {
  id: string
  scheme: string
}

export interface Unit {
  name: string
}

export interface Attribute {
  name: string
  id: string
  value: string
}

export interface TenderPeriod {
  startDate: string
  endDate: string
}

export interface TenderParty {
  name: string
  id: string
}

export interface Document {
  id: string
  documentType: string
  title: string
  url: string
  format: string
  language: string
  description: string
  datePublished: string
  documentTypeDetails: string
}

export interface Award {
  id: string
  title: string
  status: string
  statusDetails: string
  date: string
  value: ValueWithCurrency
  suppliers: Supplier[]
}

export interface ValueWithCurrency {
  amount: number
  currency: string
}

export interface Supplier {
  name: string
  id: string
}

export interface Contract {
  id: string
  awardID: string
  title: string
  contractNumber: string
  status: string
  statusDetails: string
  dateSigned: string
  period: Period
  value: ValueWithCurrency
  documents: Document2[]
  implementation: Implementation
}

export interface Period {
  startDate: string
  endDate: string
}

export interface Document2 {
  id: string
  documentType: string
  title: string
  url: string
  format: string
  language: string
  description: string
  datePublished: string
  documentTypeDetails: string
}

export interface Implementation {
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  value: ValueWithCurrency
  payer: Payer
  payee: Payee
}

export interface Payer {
  name: string
  id: string
}

export interface Payee {
  name: string
  id: string
}

export interface Source {
  name: string
  id: string
  url: string
}

export interface DataSegmentation {
  id: string
  criteria: string[]
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
  /** MOCK: This filter doesn't exist in the OCDS API from MINFIN,
   * instead with a category is selected we manually filter entities
   *  that commonly buys this categories. Check const/guatecompras.ts for more info. */
  category?: string;
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