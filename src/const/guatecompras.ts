/**
 * Calculo realizado con las compras de enero a marzo
 */
import data from './top_familias_entidades_2026.json';

// Ejemplo de objeto
// {
//     "fam_code": "8512",
//     "fam_nombre": "Práctica médica",
//     "total_items": 16799,
//     "pct_total": 6.42,
//     "top_entidades": [
//       {
//         "entidad_nombre": "INSTITUTO GUATEMALTECO DE SEGURIDAD SOCIAL -IGSS-",
//         "gcuc_entidad_id": "52",
//         "nombre_hash": "9cfbb01432",
//         "items_familia": 16752,
//         "pct_familia": 99.7,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "56",
//             "nombre": "CENTRO DE ATENCION INTEGRAL DE SALUD MENTAL",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=56&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "154",
//             "nombre": "CENTRO DE ATENCIÓN MÉDICA INTEGRAL PARA PENSIONADOS \"CAMIP 3 ZUNIL\"",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=154&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "32",
//             "nombre": "CENTRO DE ATENCION MEDICA INTEGRAL PARA PENSIONADOS (CAMIP)",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=32&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "84",
//             "nombre": "CENTRO DE ATENCION MEDICA INTEGRAL PARA PENSIONADOS, CAMIP 2 BARRANQUILLA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=84&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "55",
//             "nombre": "COMUNICACION SOCIAL Y RELACIONES PUBLICAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=55&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "203",
//             "nombre": "CONSEJO TÉCNICO",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=203&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "104",
//             "nombre": "CONSULTORIO CHIQUIMULA, CHIQUIMULA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=104&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "166",
//             "nombre": "CONSULTORIO DE FINCA SANTA LEONARDA DE VILLA CANALES",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=166&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "131",
//             "nombre": "CONSULTORIO DE GUAZACAPÁN",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=131&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "147",
//             "nombre": "CONSULTORIO DE SAN MARCOS, SAN MARCOS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=147&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "14",
//             "nombre": "ANA VERÓNICA RODRÍGUEZ MORALES",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=14&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "182",
//             "nombre": "CAJA DEPARTAMENTAL DE PATULUL",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=182&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "177",
//             "nombre": "CAJA DEPARTAMENTAL DE SALAMA, BAJA VERAPAZ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=177&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "179",
//             "nombre": "CAJA DEPARTAMENTAL DE SANTA LUCIA COTZUMALGUAPA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=179&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "184",
//             "nombre": "CAJA DEPARTAMENTAL DE TOTONICAPAN",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=184&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "133",
//             "nombre": "CAJA DEPARTAMENTAL EL TUMBADOR SAN MARCOS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=133&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "157",
//             "nombre": "CAJA DEPARTAMENTAL IGSS JUTIAPA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=157&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "196",
//             "nombre": "CAJA DEPARTAMENTAL LA GOMERA, ESCUINTLA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=196&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "94",
//             "nombre": "CENTRO DE ATENCION INTEGRAL DE SALUD MENTAL 2",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=94&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "190",
//             "nombre": "CENTRO DE ATENCION INTEGRAL DE SALUD MENTAL3",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=52&iUnt2=190&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MINISTERIO DE SALUD PÚBLICA",
//         "gcuc_entidad_id": "9",
//         "nombre_hash": "000ff0ef01",
//         "items_familia": 32,
//         "pct_familia": 0.2,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "83",
//             "nombre": "CEMENTERIO NACIONAL",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=83&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "56",
//             "nombre": "DEPARTAMENTO ADMINISTRATIVO",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=56&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "128",
//             "nombre": "DIRECCIÓN DE REGULACIÓN, VIGILANCIA Y CONTROL DE LA SALUD",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=128&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "41",
//             "nombre": "DIRECCIÓN DEL LABORATORIO NACIONAL DE SALUD",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=41&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "10",
//             "nombre": "DIRECCION DEPARTAMENTAL DE REDES INTEGRADAS DE SERVICIOS DE SALUD DE ALTA VERAPAZ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=10&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "11",
//             "nombre": "DIRECCIÓN DEPARTAMENTAL DE REDES INTEGRADAS DE SERVICIOS DE SALUD DE BAJA VERAPAZ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=11&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "12",
//             "nombre": "DIRECCIÓN DEPARTAMENTAL DE REDES INTEGRADAS DE SERVICIOS DE SALUD DE CHIMALTENANGO",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=12&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "13",
//             "nombre": "DIRECCIÓN DEPARTAMENTAL DE REDES INTEGRADAS DE SERVICIOS DE SALUD DE CHIQUIMULA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=13&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "14",
//             "nombre": "DIRECCIÓN DEPARTAMENTAL DE REDES INTEGRADAS DE SERVICIOS DE SALUD DE EL PROGRESO",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=14&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "16",
//             "nombre": "DIRECCIÓN DEPARTAMENTAL DE REDES INTEGRADAS DE SERVICIOS DE SALUD DE ESCUINTLA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=16&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "115",
//             "nombre": "APOYO AL ABORDAJE DE LA DESNUTRICION AGUDA EN GUATEMALA ATN/OC 12260/GU",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=115&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "114",
//             "nombre": "AREA DE SALUD DE BAJA VERAPAZ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=114&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "24",
//             "nombre": "AREA DE SALUD PETEN SUR OCCIDENTE",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=24&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "74",
//             "nombre": "CENTRO DE SALUD DE POPTUN PETEN",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=74&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "81",
//             "nombre": "DEPARTAMENTO DE REGULACION ACREDITACION Y CONTROL DE ESTAB. DE SALUD",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=81&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "82",
//             "nombre": "DEPTO. DE REGULACION Y CONTROL DE PROD. FARM. Y AFINES",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=82&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "DIRECCION DE ADQUISICIONES Y MANTENIMIENTO",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=1&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "87",
//             "nombre": "DIRECCION GENERAL DE REGULACION VIGILANCIA Y CONTROL DE LA SALUD",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=87&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "79",
//             "nombre": "DIRECCION GENERAL DEL SIAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=79&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "55",
//             "nombre": "FUNDEMI SIAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=9&iUnt2=55&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MUNICIPALIDAD DE SENAHU, ALTA VERAPAZ",
//         "gcuc_entidad_id": "408",
//         "nombre_hash": "fdcecc237e",
//         "items_familia": 3,
//         "pct_familia": 0.0,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "5",
//             "nombre": "MUNICIPALIDAD DE SENAHU",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=408&iUnt2=5&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "3",
//             "nombre": "MUNICIPALIDAD DE SENAHU ALTA VERAPAZ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=408&iUnt2=3&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "4",
//             "nombre": "TESORERIA MUNICIPAL DE SENAHU",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=408&iUnt2=4&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "TESORERIA MUNICIPAL DE SENAHU, A.V.",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=408&iUnt2=1&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "2",
//             "nombre": "RECONSTRUCCION ADOQUINADO DE CALLES",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=408&iUnt2=2&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MUNICIPALIDAD DE BARBERENA, SANTA ROSA",
//         "gcuc_entidad_id": "219",
//         "nombre_hash": "955847bab4",
//         "items_familia": 2,
//         "pct_familia": 0.0,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "3",
//             "nombre": "MUNICIPALIDAD DE BARBERENA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=219&iUnt2=3&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "4",
//             "nombre": "DULCE MARIA CABRERA SANCHEZ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=219&iUnt2=4&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "PAVIMENTACION CALLE 4TA AVE ENTRE 2DA Y 3RA CALLE ZONA 1 BARBERENA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=219&iUnt2=1&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "2",
//             "nombre": "TESORERIA MUNICIPAL DE BARBERENA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=219&iUnt2=2&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MUNICIPALIDAD DE SAN FRANCISCO LA UNIÓN, QUETZALTENANGO",
//         "gcuc_entidad_id": "276",
//         "nombre_hash": "d17501dd2f",
//         "items_familia": 1,
//         "pct_familia": 0.0,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "6",
//             "nombre": "DEPARTAMENTO DE COMPRA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=276&iUnt2=6&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "7",
//             "nombre": "DEPARTAMENTO DE COMPRAS 1",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=276&iUnt2=7&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "5",
//             "nombre": "UNIDAD DE COMPRAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=276&iUnt2=5&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "3",
//             "nombre": "APROBADOR DE BASES",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=276&iUnt2=3&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "4",
//             "nombre": "DEP. COMPRAS 2013",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=276&iUnt2=4&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "2",
//             "nombre": "UNIDAD DE COMPRAS I",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=276&iUnt2=2&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "XXX",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=276&iUnt2=1&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MUNICIPALIDAD DE TOTONICAPÁN, TOTONICAPÁN",
//         "gcuc_entidad_id": "251",
//         "nombre_hash": "3e3546d6c1",
//         "items_familia": 1,
//         "pct_familia": 0.0,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "3",
//             "nombre": "DIRECCION MUNICIPAL DE PLANIFICACION",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=251&iUnt2=3&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "2",
//             "nombre": "UNIDAD DE COMPRAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=251&iUnt2=2&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "MUNICIPALIDAD DE TOTONICAPAN",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=251&iUnt2=1&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MUNICIPALIDAD DE ATESCATEMPA, JUTIAPA",
//         "gcuc_entidad_id": "166",
//         "nombre_hash": "c9655b87f3",
//         "items_familia": 1,
//         "pct_familia": 0.0,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "4",
//             "nombre": "CONSEJO MUNICIPAL",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=4&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "14",
//             "nombre": "DIRECCION FINANCIERA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=14&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "15",
//             "nombre": "DIRECCION MUNICIPAL PLANIFICACION DMP",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=15&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "10",
//             "nombre": "DMPATESCATEMPA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=10&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "12",
//             "nombre": "ENCARGADA DE COMPRAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=12&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "5",
//             "nombre": "MUNICIPALIDAD DE ATESCATEMPA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=5&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "2",
//             "nombre": "PAVIMENTACION RIGIDA CALLE ALTERNA SAN CRISTOBAL FRONTERA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=2&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "9",
//             "nombre": "RENÉ ARMANDO BARRERA VÁSQUEZ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=9&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "6",
//             "nombre": "SECRETARIA MUNICIPAL",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=6&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "3",
//             "nombre": "TESORERIA MUNICIPAL",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=3&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "JKHK",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=1&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "11",
//             "nombre": "JMARROQUIN",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=11&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "13",
//             "nombre": "LESLIE ISABEL GUDIEL PÉREZ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=13&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "7",
//             "nombre": "MUNICIPALIDAD DE ATESCATEMPA.",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=7&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "8",
//             "nombre": "SALVADOR EDGARDO PADILLA HERRERA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=166&iUnt2=8&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MUNICIPALIDAD DE SANTA EULALIA, HUEHUETENANGO",
//         "gcuc_entidad_id": "382",
//         "nombre_hash": "f529ba4645",
//         "items_familia": 1,
//         "pct_familia": 0.0,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "6",
//             "nombre": "EMPRESA ELECTRICA SANTA EULALIA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=382&iUnt2=6&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "3",
//             "nombre": "MUNICIPALIDAD DE SANTA EULALIA, HUEHUETENANGO",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=382&iUnt2=3&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "2",
//             "nombre": "UNIDAD TECNICA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=382&iUnt2=2&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "5",
//             "nombre": "EMPRESA ELECTRICA MUNICIPAL SANTA EULALIA.",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=382&iUnt2=5&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "4",
//             "nombre": "FRANCISCO PEDRO MATEO",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=382&iUnt2=4&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "SISTEMA DE ALCANTARILLADO SANITARIO DE ALDEA IXTENAM",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=382&iUnt2=1&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MUNICIPALIDAD DE SANTA CATARINA PINULA, GUATEMALA",
//         "gcuc_entidad_id": "73",
//         "nombre_hash": "0482dc17f2",
//         "items_familia": 1,
//         "pct_familia": 0.0,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "2",
//             "nombre": "COMPRAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=2&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "7",
//             "nombre": "CONTRATACIONES",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=7&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "DF-COMPRAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=1&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "8",
//             "nombre": "RECURSOS HUMANOS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=8&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "11",
//             "nombre": "TESORERIA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=11&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "9",
//             "nombre": "AUDITORIA INTERNA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=9&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "3",
//             "nombre": "DF COMPRAS2",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=3&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "10",
//             "nombre": "DIRECCIÓN DE COMPRAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=10&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "6",
//             "nombre": "FINANZAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=6&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "5",
//             "nombre": "OBRAS2",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=5&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "4",
//             "nombre": "OBRASCOMPRAS",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=73&iUnt2=4&iUnt=0&iTipo=4"
//           }
//         ]
//       },
//       {
//         "entidad_nombre": "MINISTERIO DE EDUCACIÓN",
//         "gcuc_entidad_id": "8",
//         "nombre_hash": "5a36342178",
//         "items_familia": 1,
//         "pct_familia": 0.0,
//         "unidades_compradoras": [
//           {
//             "unidad_id": "73",
//             "nombre": "CONSEJO NACIONAL DE EDUCACIÓN",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=73&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "69",
//             "nombre": "DIRECCIÓN DE ADMINISTRACIÓN FINANCIERA -DAFI-",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=69&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "25",
//             "nombre": "DIRECCIÓN DE ADQUISICIONES Y CONTRATACIONES -DIDECO-",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=25&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "72",
//             "nombre": "DIRECCIÓN DE ASESORÍA JURÍDICA -DIAJ",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=72&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "70",
//             "nombre": "DIRECCIÓN DE AUDITORIA INTERNA -DIDAI-",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=70&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "49",
//             "nombre": "DIRECCIÓN DE COMUNICACIÓN SOCIAL -DICOMS-",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=49&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "50",
//             "nombre": "DIRECCIÓN DE COOPERACIÓN NACIONAL E INTERNACIONAL -DICONIME-",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=50&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "71",
//             "nombre": "DIRECCIÓN DE DESARROLLO MAGISTERIAL -DIDEMAG-",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=71&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "51",
//             "nombre": "DIRECCIÓN DE DESARROLLO Y FORTALECIMIENTO INSTITUCIONAL  -DIDEFI-",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=51&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "67",
//             "nombre": "DIRECCIÓN DE INFORMÁTICA -DINFO-",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=67&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "11",
//             "nombre": "CONALFA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=11&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "18",
//             "nombre": "DEPARTAMENTO DE COMPRAS MAYORES DIGEF",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=18&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "13",
//             "nombre": "DICADE",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=13&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "1",
//             "nombre": "DIGEPA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=1&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "10",
//             "nombre": "DIRECCION DE CALIDAD Y DESARROLLO EDUCATIVO",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=10&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "2",
//             "nombre": "DIRECCION DE CALIDAD Y DESARROLLO EDUCATIVO (DICADE)",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=2&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "3",
//             "nombre": "DIRECCIÓN DE INFORMÁTICA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=3&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "19",
//             "nombre": "DIRECCIÓN DE PERSONAL",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=19&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "52",
//             "nombre": "DIRECCIÓN DE PLANIFICACIÓN EDUCATIVA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=52&iUnt=0&iTipo=4"
//           },
//           {
//             "unidad_id": "38",
//             "nombre": "DIRECCION DEPARTAMENTAL DE EDUCACION DE SANTA ROSA",
//             "url": "https://www.guatecompras.gt/compradores/consultaDetUni.aspx?iEnt=8&iUnt2=38&iUnt=0&iTipo=4"
//           }
//         ]
//       }
//     ]
//   }

export interface TopFamilia {
    fam_code: string;
    fam_nombre: string;
    total_items: number;
    // Porcentaje de distribucion de esta familia respecto a todos las licitaciones (Ej. 9% de las compras son Servicios medicos)
    pct_total: number;
    top_entidades: TopEntidad[];
}

export interface TopEntidad {
        entidad_nombre: string;
        gcuc_entidad_id: string;
        nombre_hash: string;
        items_familia: number;
        // Porcentaje de distribucion de esta entidad respecto a su familia (Ej. 20% de compras de la familia Comida)
        pct_familia: number;
        unidades_compradoras: TopUnidades[];
}

export interface TopUnidades {
    unidad_id: string;
    nombre: string;
    url: string;
}

export const TOP_ENTIDADES_BY_FAMILIA: TopFamilia[] = data;

/**
 * Estas son las TOP familias en 2026
 */

// "fam_code": "8512",
// "fam_nombre": "Práctica médica",
// "fam_code": "4111",
// "fam_nombre": "Instrumentos de medida, observación y ensayo",
// "fam_code": "4229",
// "fam_nombre": "Productos quirúrgicos",
// "fam_code": "5114",
// "fam_nombre": "Medicamentos para el sistema nervioso central",
// "fam_code": "7214",
// "fam_nombre": "Servicios de construcción pesada",
// "fam_code": "5110",
// "fam_nombre": "Medicamentos antiinfecciosos",
// "fam_code": "5111",
// "fam_nombre": "Agentes antitumorales",
// "fam_code": "5010",
// "fam_nombre": "Frutos secos",
// "fam_code": "5118",
// "fam_nombre": "Hormonas y antagonistas hormonales",
// "fam_code": "5019",
// "fam_nombre": "Alimentos preparados y conservados",
// "fam_code": "8110",
// "fam_nombre": "Servicios profesionales de ingeniería",
// "fam_code": "5113",
// "fam_nombre": "Medicamentos hematólogos",
// "fam_code": "6010",
// "fam_nombre": "Materiales didácticos profesionales y de desarrollo y accesorios y suministros",
// "fam_code": "8510",
// "fam_nombre": "Servicios integrales de salud",
// "fam_code": "5112",
// "fam_nombre": "Medicamentos cardiovasculares",
// "fam_code": "5119",
// "fam_nombre": "Agentes que afectan el agua y los electrolitos",
// "fam_code": "8612",
// "fam_nombre": "Instituciones educativas",
// "fam_code": "5117",
// "fam_nombre": "Medicamentos que afectan al sistema gastrointestinal",
// "fam_code": "4214",
// "fam_nombre": "Suministros, productos de tratamiento y cuidado del enfermo",
// "fam_code": "4232",
// "fam_nombre": "Implantes ortopédicos quirúrgicos",
// "fam_code": "4410",
// "fam_nombre": "Maquinaria, suministros y accesorios de oficina",
// "fam_code": "5017",
// "fam_nombre": "Condimentos y conservantes",
// "fam_code": "5020",
// "fam_nombre": "Bebidas",
// "fam_code": "5022",
// "fam_nombre": "Productos de cereales y legumbres",
// "fam_code": "4231",
// "fam_nombre": "Productos para el cuidado de heridas",
