/** Catálogo oficial de la API OCDS Guatecompras — extraído de /politica */

export interface CatalogItem {
  id: string;
  name: string;
}

/** 2.3.7 Identificadores del Catálogo de Modalidades (Modalidad_compradora) */
export const MODALIDADES: CatalogItem[] = [
  { id: '1',  name: 'Compra Directa con Oferta Electrónica (Art. 43 LCE Inciso b)' },
  { id: '2',  name: 'Adquisición Directa por Ausencia de Oferta' },
  { id: '3',  name: 'Cotización (Art. 38 LCE)' },
  { id: '4',  name: 'Licitación Pública (Art. 17 LCE)' },
  { id: '5',  name: 'Contrato Abierto (Art. 46 LCE)' },
  { id: '6',  name: 'Casos de Excepción (Art. 44 LCE)' },
  { id: '7',  name: 'Procedimientos regulados por el artículo 54 LCE' },
  { id: '15', name: 'Convenios y Tratados Internacionales (Art. 1 LCE)' },
  { id: '17', name: 'Subasta Pública (Art. 89 LCE)' },
  { id: '19', name: 'Precalificación de Proyectos APP (Art. 60 Decreto 16-2010)' },
  { id: '21', name: 'Vinculaciones Acuerdo Ministerial 65-2011 A' },
  { id: '23', name: 'Bienes y Suministros Importados (Art. 5 LCE)' },
  { id: '25', name: 'Donaciones (Art. 1 LCE)' },
  { id: '27', name: 'Negociaciones entre Entidades Públicas (Art. 2 LCE)' },
  { id: '33', name: 'Compra de Baja Cuantía (Art. 43 inciso a)' },
  { id: '34', name: 'Licitación de proyectos APP (Art. 40 Decreto 16-2010)' },
  { id: '36', name: 'Arrendamientos por Cotización (Art. 43 inciso d)' },
  { id: '38', name: 'Arrendamientos por Licitación Pública (Art. 43 inciso d)' },
  { id: '40', name: 'Dragados (Art. 43 inciso f)' },
  { id: '42', name: 'Arrendamiento o Adquisición de Bienes Inmuebles (Art. 43 inciso e)' },
  { id: '44', name: 'Adquisiciones con proveedor único (Art. 43 inciso c)' },
  { id: '46', name: 'Subasta Electrónica Inversa (Art. 54Bis)' },
  { id: '48', name: 'Concesiones (Art. 95 LCE)' },
  { id: '60', name: 'Enajenación, Transferencia y Arrendamiento de Bienes Inmuebles (Art. 54)' },
];

/**
 * 2.3.8 Identificadores de las Sub Modalidades (Sub_modalidad_compradora).
 * Solo la modalidad 6 (Casos de Excepción) tiene sub-modalidades.
 */
export const SUB_MODALIDADES: Record<string, CatalogItem[]> = {
  '6': [
    { id: '21', name: 'Servicios Técnicos y Profesionales individuales (Art. 44 inciso e)' },
    { id: '22', name: 'Contratación de Servicios Básicos (Art. 44 inciso g)' },
    { id: '23', name: 'Ley Constitucional de Orden Público (Art. 44 inciso a)' },
    { id: '24', name: 'Adquisición por convenios del MSPAS o IGSS (Art. 44 inciso b)' },
    { id: '25', name: 'Adquisiciones en el Extranjero (Art. 44 inciso c)' },
    { id: '26', name: 'Billetes, monedas y afines (Art. 44 inciso d)' },
    { id: '27', name: 'Adquisiciones para Eventos Electorales (Art. 44 inciso f)' },
  ],
};

/** 2.3.9 Identificadores del Estatus del Concurso (Estatus_concurso) */
export const ESTATUS_CONCURSO: CatalogItem[] = [
  { id: '1',  name: 'Vigente' },
  { id: '2',  name: 'Evaluación' },
  { id: '3',  name: 'Adjudicado' },
  { id: '4',  name: 'Prescindido' },
  { id: '5',  name: 'Desierto' },
  { id: '10', name: 'Finalizado adjudicado cedido' },
  { id: '11', name: 'Anulado (sin concurso)' },
  { id: '12', name: 'Finalizado Rematado' },
  { id: '13', name: 'Terminado Precalificado' },
  { id: '14', name: 'Subastando' },
  { id: '15', name: 'Improbado' },
  { id: '16', name: 'Terminado Cancelado' },
  { id: '17', name: 'Finalizado Seleccionado' },
  { id: '18', name: 'Suspendido' },
  { id: '19', name: 'En espera de prórroga' },
  { id: '20', name: 'No adjudicado' },
];
