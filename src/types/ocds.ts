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
  keyword?: string;
  buyer?: string;
  sector?: string;
  minAmount?: number;
  maxAmount?: number;
  startDate?: string;
  endDate?: string;
}
