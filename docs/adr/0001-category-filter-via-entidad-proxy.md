# Category filtering approximated by Entidad, not by item

Filtering a search by what is being bought is a feature the MINFIN OCDS API does not support: `/release/search` accepts Año, Mes, Día, Entidad, Modalidad, Sub-modalidad and Estatus, but nothing about the items inside a Release. The real category lives on `tender.items[].classification` as a UNSPSC code, which is only visible after a Release has already been fetched.

So the category filter is a proxy: picking a Categoría resolves to the set of Entidades that historically buy that Familia, and those Entidades are what gets sent to the API. This is why `ProcessFilters.category` is marked MOCK and why the mapping lives in `src/const/guatecompras.ts` rather than in the API layer.

## Consequences

Results are approximate in both directions — an Entidad that buys across many Familias returns Releases outside the requested Categoría, and an unusual purchase by an Entidad not on the list is missed entirely. The error is widest for large Entidades, because the proxy can only aim at the Entidad and not at the Unidad de compra that actually buys the Familia: asking for medical supplies pulls everything IGSS buys, not just what its hospitals buy. Precision depends on how current the Entidad→Familia mapping is, so it decays as buying patterns shift and needs periodic regeneration from published data.

If the API ever exposes item classification as a search parameter, the proxy should be deleted rather than kept as a fallback; two different meanings of "category" in the UI is the cost being paid here.
