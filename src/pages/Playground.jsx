import { useState } from "react";

const BASE = "https://cotapi.onrender.com";

const SYMBOLS = {
  metals: ["GOLD", "SILVER"],
  currencies: ["EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "NZD", "MXN", "BRL", "ZAR", "DXY"],
};

const GROUPS = ["commercial", "noncommercial", "nonreportable"];
const FIELDS = {
  commercial: ["long", "short", "net", "changes"],
  noncommercial: ["long", "short", "net", "spreads", "changes"],
  nonreportable: ["long", "short", "net"],
};

function buildUrl(opts) {
  const { mode, category, symbol, group, field, history, weeks, fromDate, toDate } = opts;

  if (mode === "all") return `${BASE}/api/all`;
  if (mode === "last-updated") return `${BASE}/api/last-updated`;
  if (mode === "symbols") return `${BASE}/api/symbols`;

  if (mode === "history") {
    let path = `${BASE}/api/history/${symbol}`;
    if (group && field) path += `/${group}/${field}`;
    const params = new URLSearchParams();
    if (fromDate) { params.set("from_date", fromDate); }
    if (toDate) { params.set("to_date", toDate); }
    if (!fromDate && !toDate && weeks) params.set("weeks", weeks);
    const q = params.toString();
    return q ? `${path}?${q}` : path;
  }

  // latest mode
  let path = `${BASE}/api/${category}/${symbol}`;
  if (group) {
    path += `/${group}`;
    if (field) path += `/${field}`;
  }
  return path;
}

export default function Playground() {
  const [mode, setMode] = useState("latest");
  const [category, setCategory] = useState("metals");
  const [symbol, setSymbol] = useState("GOLD");
  const [group, setGroup] = useState("");
  const [field, setField] = useState("");
  const [weeks, setWeeks] = useState("12");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [elapsed, setElapsed] = useState(null);

  const url = buildUrl({ mode, category, symbol, group, field, weeks, fromDate, toDate });

  function handleCategoryChange(c) {
    setCategory(c);
    setSymbol(SYMBOLS[c][0]);
    setGroup("");
    setField("");
  }

  function handleGroupChange(g) {
    setGroup(g);
    setField("");
  }

  async function run() {
    setLoading(true);
    setResult(null);
    setError(null);
    const t0 = Date.now();
    try {
      const r = await fetch(url);
      const data = await r.json();
      setElapsed(Date.now() - t0);
      if (!r.ok) setError(data);
      else setResult(data);
    } catch (e) {
      setError({ message: e.message });
      setElapsed(Date.now() - t0);
    }
    setLoading(false);
  }

  return (
    <div className="page playground">
      <div className="docs-header">
        <h1 className="section-title">Playground</h1>
        <p className="section-sub">
          Build and test API requests against live data.
        </p>
      </div>

      <div className="divider" />

      <div className="playground-layout">
        <div className="playground-controls">

          <div className="control-group">
            <label className="control-label">Mode</label>
            <div className="radio-group">
              {["latest", "history", "all", "symbols", "last-updated"].map((m) => (
                <button
                  key={m}
                  className={`radio-btn${mode === m ? " active" : ""}`}
                  onClick={() => { setMode(m); setGroup(""); setField(""); }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {(mode === "latest" || mode === "history") && (
            <>
              <div className="control-group">
                <label className="control-label">Category</label>
                <div className="radio-group">
                  {["metals", "currencies"].map((c) => (
                    <button
                      key={c}
                      className={`radio-btn${category === c ? " active" : ""}`}
                      onClick={() => handleCategoryChange(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="control-group">
                <label className="control-label">Symbol</label>
                <div className="radio-group wrap">
                  {SYMBOLS[category].map((s) => (
                    <button
                      key={s}
                      className={`radio-btn mono${symbol === s ? " active" : ""}`}
                      onClick={() => setSymbol(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {mode === "latest" && (
            <>
              <div className="control-group">
                <label className="control-label">Group (optional)</label>
                <div className="radio-group">
                  <button
                    className={`radio-btn${group === "" ? " active" : ""}`}
                    onClick={() => handleGroupChange("")}
                  >
                    none
                  </button>
                  {GROUPS.map((g) => (
                    <button
                      key={g}
                      className={`radio-btn${group === g ? " active" : ""}`}
                      onClick={() => handleGroupChange(g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {group && (
                <div className="control-group">
                  <label className="control-label">Field (optional)</label>
                  <div className="radio-group">
                    <button
                      className={`radio-btn${field === "" ? " active" : ""}`}
                      onClick={() => setField("")}
                    >
                      none
                    </button>
                    {FIELDS[group]?.map((f) => (
                      <button
                        key={f}
                        className={`radio-btn${field === f ? " active" : ""}`}
                        onClick={() => setField(f)}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {mode === "history" && (
            <>
              <div className="control-group">
                <label className="control-label">Group (optional)</label>
                <div className="radio-group">
                  <button className={`radio-btn${group === "" ? " active" : ""}`} onClick={() => handleGroupChange("")}>none</button>
                  {GROUPS.map((g) => (
                    <button key={g} className={`radio-btn${group === g ? " active" : ""}`} onClick={() => handleGroupChange(g)}>{g}</button>
                  ))}
                </div>
              </div>

              {group && (
                <div className="control-group">
                  <label className="control-label">Field</label>
                  <div className="radio-group">
                    {FIELDS[group]?.filter(f => f !== "changes").map((f) => (
                      <button key={f} className={`radio-btn${field === f ? " active" : ""}`} onClick={() => setField(f)}>{f}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="control-group">
                <label className="control-label">Weeks</label>
                <input
                  className="text-input"
                  type="number"
                  value={weeks}
                  min={1}
                  max={260}
                  onChange={(e) => setWeeks(e.target.value)}
                  placeholder="12"
                />
              </div>

              <div className="control-group">
                <label className="control-label">From Date</label>
                <input
                  className="text-input"
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="control-group">
                <label className="control-label">To Date</label>
                <input
                  className="text-input"
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </>
          )}

          <div className="request-preview">
            <div className="control-label">Request</div>
            <div className="mono request-url">{url}</div>
          </div>

          <button className="btn-primary full" onClick={run} disabled={loading}>
            {loading ? "Fetching..." : "Send Request"}
          </button>
        </div>

        <div className="playground-result">
          {elapsed !== null && (
            <div className="result-meta">
              {error ? "Error" : "200 OK"} — {elapsed}ms
            </div>
          )}
          <div className="code-block result-block">
            <pre>
              {loading
                ? "Waiting for response..."
                : error
                ? JSON.stringify(error, null, 2)
                : result
                ? JSON.stringify(result, null, 2)
                : "Response will appear here"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}