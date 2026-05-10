const BASE = "https://cotapi.onrender.com";

const METALS = ["GOLD", "SILVER"];
const CURRENCIES = ["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD", "MXN", "BRL", "ZAR", "DXY"];

const ENDPOINTS = [
  {
    group: "General",
    items: [
      {
        method: "GET",
        path: "/api/symbols",
        desc: "Returns all supported symbols with their CFTC codes, names, categories and contract descriptions.",
        example: `{
  "metals": {
    "GOLD": {
      "code": "088691",
      "name": "GOLD - COMMODITY EXCHANGE INC.",
      "category": "metals",
      "description": "CONTRACTS OF 100 TROY OUNCES"
    }
  },
  "currencies": { ... }
}`,
      },
      {
        method: "GET",
        path: "/api/last-updated",
        desc: "Returns the date of the most recent data in the database.",
        example: `{
  "last_updated": "2026-05-05",
  "next_update": "Every Friday after 3:30 PM EST (CFTC release schedule)"
}`,
      },
      {
        method: "GET",
        path: "/api/all",
        desc: "Returns the latest full COT data for all 13 instruments in a single response.",
        example: `{
  "GOLD": { ... },
  "SILVER": { ... },
  "EUR": { ... }
}`,
      },
    ],
  },
  {
    group: "Metals",
    note: `Available symbols: ${METALS.join(", ")}`,
    items: [
      {
        method: "GET",
        path: "/api/metals/{symbol}",
        desc: "Full latest COT data for a metal including all groups, net positions and weekly changes.",
        example: `{
  "symbol": "GOLD",
  "name": "GOLD - COMMODITY EXCHANGE INC.",
  "description": "CONTRACTS OF 100 TROY OUNCES",
  "as_of": "2026-05-05",
  "open_interest": 367932,
  "noncommercial": {
    "long": 211814,
    "short": 48511,
    "spreads": 47879,
    "net": 163303
  },
  "commercial": {
    "long": 58230,
    "short": 257165,
    "net": -198935
  },
  "nonreportable": {
    "long": 49252,
    "short": 13620,
    "net": 35632
  },
  "total": {
    "long": 318680,
    "short": 354312
  },
  "changes": {
    "open_interest": -1598,
    "noncomm_long": -4,
    "noncomm_short": -3736,
    "comm_long": -2323,
    "comm_short": 1799
  }
}`,
      },
      { method: "GET", path: "/api/metals/{symbol}/commercial", desc: "Commercial long, short and net positions." },
      { method: "GET", path: "/api/metals/{symbol}/commercial/long", desc: "Commercial long position only." },
      { method: "GET", path: "/api/metals/{symbol}/commercial/short", desc: "Commercial short position only." },
      { method: "GET", path: "/api/metals/{symbol}/commercial/net", desc: "Commercial net position (long minus short)." },
      { method: "GET", path: "/api/metals/{symbol}/commercial/changes", desc: "Weekly changes in commercial long and short." },
      { method: "GET", path: "/api/metals/{symbol}/noncommercial", desc: "Non-commercial long, short, spreads and net." },
      { method: "GET", path: "/api/metals/{symbol}/noncommercial/long", desc: "Non-commercial long position only." },
      { method: "GET", path: "/api/metals/{symbol}/noncommercial/short", desc: "Non-commercial short position only." },
      { method: "GET", path: "/api/metals/{symbol}/noncommercial/net", desc: "Non-commercial net position." },
      { method: "GET", path: "/api/metals/{symbol}/noncommercial/spreads", desc: "Non-commercial spread positions." },
      { method: "GET", path: "/api/metals/{symbol}/noncommercial/changes", desc: "Weekly changes in non-commercial positions." },
      { method: "GET", path: "/api/metals/{symbol}/nonreportable", desc: "Non-reportable long, short and net." },
      { method: "GET", path: "/api/metals/{symbol}/nonreportable/long", desc: "Non-reportable long only." },
      { method: "GET", path: "/api/metals/{symbol}/nonreportable/short", desc: "Non-reportable short only." },
      { method: "GET", path: "/api/metals/{symbol}/nonreportable/net", desc: "Non-reportable net position." },
      { method: "GET", path: "/api/metals/{symbol}/openinterest", desc: "Open interest and weekly change." },
      { method: "GET", path: "/api/metals/{symbol}/changes", desc: "All weekly changes across all groups." },
    ],
  },
  {
    group: "Currencies",
    note: `Available symbols: ${CURRENCIES.join(", ")}`,
    items: [
      { method: "GET", path: "/api/currencies/{symbol}", desc: "Full latest COT data for a currency." },
      { method: "GET", path: "/api/currencies/{symbol}/commercial", desc: "Commercial long, short and net." },
      { method: "GET", path: "/api/currencies/{symbol}/commercial/long", desc: "Commercial long only." },
      { method: "GET", path: "/api/currencies/{symbol}/commercial/short", desc: "Commercial short only." },
      { method: "GET", path: "/api/currencies/{symbol}/commercial/net", desc: "Commercial net position." },
      { method: "GET", path: "/api/currencies/{symbol}/commercial/changes", desc: "Weekly changes in commercial positions." },
      { method: "GET", path: "/api/currencies/{symbol}/noncommercial", desc: "Non-commercial long, short, spreads and net." },
      { method: "GET", path: "/api/currencies/{symbol}/noncommercial/long", desc: "Non-commercial long only." },
      { method: "GET", path: "/api/currencies/{symbol}/noncommercial/short", desc: "Non-commercial short only." },
      { method: "GET", path: "/api/currencies/{symbol}/noncommercial/net", desc: "Non-commercial net position." },
      { method: "GET", path: "/api/currencies/{symbol}/noncommercial/spreads", desc: "Non-commercial spread positions." },
      { method: "GET", path: "/api/currencies/{symbol}/noncommercial/changes", desc: "Weekly changes in non-commercial positions." },
      { method: "GET", path: "/api/currencies/{symbol}/nonreportable", desc: "Non-reportable long, short and net." },
      { method: "GET", path: "/api/currencies/{symbol}/nonreportable/long", desc: "Non-reportable long only." },
      { method: "GET", path: "/api/currencies/{symbol}/nonreportable/short", desc: "Non-reportable short only." },
      { method: "GET", path: "/api/currencies/{symbol}/nonreportable/net", desc: "Non-reportable net position." },
      { method: "GET", path: "/api/currencies/{symbol}/openinterest", desc: "Open interest and weekly change." },
      { method: "GET", path: "/api/currencies/{symbol}/changes", desc: "All weekly changes across all groups." },
    ],
  },
  {
    group: "History",
    items: [
      {
        method: "GET",
        path: "/api/history/{symbol}",
        desc: "Full historical COT data for a symbol. Supports weeks, from_date and to_date query parameters.",
        params: [
          { name: "weeks", type: "integer", default: "12", desc: "Number of recent weeks to return. Max 260 (5 years)." },
          { name: "from_date", type: "date", default: "—", desc: "Start date in YYYY-MM-DD format. Overrides weeks." },
          { name: "to_date", type: "date", default: "—", desc: "End date in YYYY-MM-DD format." },
        ],
        example: `GET /api/history/GOLD?weeks=4
GET /api/history/GOLD?from_date=2026-01-01&to_date=2026-05-01`,
      },
      {
        method: "GET",
        path: "/api/history/{symbol}/{group}/{field}",
        desc: "Historical data for a specific field. Same date parameters apply.",
        params: [
          { name: "group", type: "string", default: "—", desc: "One of: commercial, noncommercial, nonreportable" },
          { name: "field", type: "string", default: "—", desc: "One of: long, short, net, spreads (spreads only for noncommercial)" },
          { name: "weeks", type: "integer", default: "12", desc: "Number of recent weeks. Max 260." },
          { name: "from_date", type: "date", default: "—", desc: "Start date YYYY-MM-DD." },
          { name: "to_date", type: "date", default: "—", desc: "End date YYYY-MM-DD." },
        ],
        example: `GET /api/history/GOLD/commercial/net?weeks=12
GET /api/history/EUR/noncommercial/long?from_date=2025-01-01`,
      },
    ],
  },
];

export default function Docs() {
  return (
    <div className="page docs">
      <div className="docs-header">
        <h1 className="section-title">API Reference</h1>
        <p className="section-sub">
          Base URL:{" "}
          <span className="mono">{BASE}</span>
        </p>
        <p className="section-sub">
          All endpoints return JSON. Rate limit is 60 requests per minute
          per IP. No authentication required.
        </p>
      </div>

      <div className="divider" />

      <div className="docs-note">
        <span className="mono">{"{"} symbol {"}"}</span> is case-insensitive.{" "}
        <span className="mono">GOLD</span>,{" "}
        <span className="mono">gold</span> and{" "}
        <span className="mono">Gold</span> all work.
      </div>

      {ENDPOINTS.map((group) => (
        <section className="docs-group" key={group.group}>
          <h2 className="docs-group-title">{group.group}</h2>
          {group.note && (
            <div className="docs-group-note mono">{group.note}</div>
          )}
          <div className="endpoint-list">
            {group.items.map((ep) => (
              <div className="endpoint-card" key={ep.path}>
                <div className="endpoint-header">
                  <span className="method">{ep.method}</span>
                  <span className="mono endpoint-path">{ep.path}</span>
                </div>
                <p className="endpoint-desc">{ep.desc}</p>

                {ep.params && (
                  <div className="param-table">
                    <div className="param-header">
                      <span>Parameter</span>
                      <span>Type</span>
                      <span>Default</span>
                      <span>Description</span>
                    </div>
                    {ep.params.map((p) => (
                      <div className="param-row" key={p.name}>
                        <span className="mono">{p.name}</span>
                        <span className="mono param-type">{p.type}</span>
                        <span className="mono">{p.default}</span>
                        <span>{p.desc}</span>
                      </div>
                    ))}
                  </div>
                )}

                {ep.example && (
                  <div className="code-block sm">
                    <pre>{ep.example}</pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}