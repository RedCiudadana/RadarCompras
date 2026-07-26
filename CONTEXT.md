# Radar de Compras Públicas

Public procurement intelligence for Guatemala. Reads OCDS data published by Guatecompras and surfaces it to two audiences: citizens watching how public money is spent, and suppliers looking for contracts they can win.

The domain speaks two languages: OCDS (English, the data standard) and Guatecompras (Spanish, the national system). Where both have a word, the glossary picks one.

## Language

### The procurement process

**Release**:
A single public procurement process, from publication to award or cancellation. Identified by its `ocid`. This is the unit a citizen searches for and a Proveedor bids on. Concurso is the Spanish name for the same thing and is what the UI says; Release is the OCDS name and is what the code says.
_Avoid_: Proceso, tender, licitación (licitación is one Modalidad, not the general case)

**Record**:
Every Release published for one `ocid`, together with the merged view of them. The full history of a process rather than the process itself.

**Estatus**:
Where a Release stands in its lifecycle — Vigente, Adjudicado, Desierto, Anulado, and so on. Distinct from whether a supplier can still bid.
_Avoid_: Status, estado

**Modalidad**:
The procurement mechanism that governs a Release — Compra Directa, Cotización, Licitación Pública, Casos de Excepción. Determines the legal process and, in practice, the size of the contract.
_Avoid_: Procurement method, method

**Sub-modalidad**:
A refinement of Modalidad that only exists for Casos de Excepción.

### The parties

**Entidad**:
A public institution that buys — a ministry, a municipality, an autonomous body. The state side of a Release, and the level at which the data source lets you search.
_Avoid_: Buyer, procuring entity, comprador, institución (buyer and procuringEntity carry the same Entidad in MINFIN data)

**Unidad de compra**:
An office inside an Entidad that runs its own purchases — a hospital within IGSS, a planning department within a municipality. It belongs to exactly one Entidad and appears alongside its parent in the same Release, so "who is buying" has two valid answers at two levels.
_Avoid_: Sub-entidad, dependencia, unit

**Proveedor**:
A company or person that bids on or wins a Release.
_Avoid_: Supplier, tenderer, oferente, contratista

### What suppliers see

**Oportunidad**:
A Release a specific Proveedor could realistically bid on — still open, and matched to that Proveedor's categories, keywords, and size. Not an OCDS concept; it is this project's product.
_Avoid_: Recommendation, match, lead

**Tamaño de empresa**:
The size band a Proveedor declares — pequeña, mediana, grande. Used to pick which Modalidades are worth showing, since each Modalidad clusters around a contract-value range.
_Avoid_: Company size

**PYME**:
The audience this product is built for: small and medium Guatemalan businesses. A label for who we serve, not a size band a Proveedor selects — a Release marked "apto para PYME" is one whose Modalidad and value put it within reach of that audience.
_Avoid_: Mipyme, Mypyme (both appear in UI copy; pick one)

**Familia**:
A UNSPSC family — the four-digit prefix of an item classification code. The true, published statement of what is being bought, recorded on each item of a Release.
_Avoid_: Rubro

**Categoría**:
A plain-language grouping a Proveedor picks when searching. Not the same as Familia: the data source cannot filter by what is being bought, so a Categoría resolves to the Entidades that typically buy it. A Familia is a fact about a Release; a Categoría is a guess about who buys. See [ADR-0001](./docs/adr/0001-category-filter-via-entidad-proxy.md).
