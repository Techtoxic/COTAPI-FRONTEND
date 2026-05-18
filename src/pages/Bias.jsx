import { useEffect, useState } from "react";

const BASE = "https://cotapi.onrender.com";

function fmt(n) {
  if (n === null || n === undefined) return "—";
  return (n >= 0 ? "+" : "") + n.toLocaleString();
}

function IconArrowUp() {
  return (
    <svg width="11" height="11" viewBox="0 0 20 20" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M10 3.5a.75.75 0 0 1 .75.75v9.94l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V4.25A.75.75 0 0 1 10 3.5Z"
        fill="currentColor" transform="rotate(180 10 10)" />
    </svg>
  );
}

function IconArrowDown() {
  return (
    <svg width="11" height="11" viewBox="0 0 20 20" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M10 3.5a.75.75 0 0 1 .75.75v9.94l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 1 1 1.06-1.06l3.22 3.22V4.25A.75.75 0 0 1 10 3.5Z"
        fill="currentColor" />
    </svg>
  );
}

function IconMinus() {
  return (
    <svg width="11" height="11" viewBox="0 0 20 20" fill="none" style={{ display: "inline-block", verticalAlign: "middle" }}>
      <path d="M4 10a.75.75 0 0 1 .75-.75h10.5a.75.75 0 0 1 0 1.5H4.75A.75.75 0 0 1 4 10Z" fill="currentColor" />
    </svg>
  );
}

function BiasTag({ bias }) {
  const cfg = {
    BUY:       { color: "var(--green)",  icon: <IconArrowUp />,   label: "BUY"  },
    SELL:      { color: "var(--red)",    icon: <IconArrowDown />, label: "SELL" },
    UNCERTAIN: { color: "var(--text-3)", icon: <IconMinus />,     label: ""     },
  };
  const c = cfg[bias] || cfg.UNCERTAIN;
  return (
    <span style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "3px",
      fontFamily: "var(--font-mono)",
      fontSize: "0.54rem",
      fontWeight: 500,
      letterSpacing: "0.1em",
      color: c.color,
      whiteSpace: "nowrap",
      justifyContent: "center",
    }}>
      {c.icon}{c.label}
    </span>
  );
}

function NetBadge({ symbol, net }) {
  const color = net > 0 ? "var(--green)" : net < 0 ? "var(--red)" : "var(--text-3)";
  const icon  = net > 0 ? <IconArrowUp /> : net < 0 ? <IconArrowDown /> : <IconMinus />;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
      <span style={{ color: "var(--text-3)", fontFamily: "var(--font-mono)", fontSize: "0.6rem" }}>{symbol}</span>
      <span style={{ color, fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "2px" }}>
        {icon}{fmt(net)}
      </span>
    </span>
  );
}

// Half of a card — pair name + badge on one line, data on one line (no wrap)
function PairCell({ p }) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* line 1: pair name + badge inline */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: "var(--text)",
          whiteSpace: "nowrap",
        }}>
          {p.pair}
        </span>
        <BiasTag bias={p.bias} />
      </div>
      {/* line 2: base · quote — stays on one line, no wrap */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "nowrap" }}>
        <NetBadge symbol={p.base.symbol}  net={p.base.net}  />
        <span style={{ color: "var(--border-2)", fontSize: "0.6rem" }}>vs</span>
        <NetBadge symbol={p.quote.symbol} net={p.quote.net} />
      </div>
    </div>
  );
}

// Plain row — no outer rectangle
function PairRow({ left, right, isLast }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      paddingBottom: isLast ? 0 : "8px",
      borderBottom: isLast ? "none" : "1px solid var(--border)",
    }}>
      <PairCell p={left} />
      {right && (
        <>
          <div style={{ width: "1px", alignSelf: "stretch", background: "var(--border)", flexShrink: 0 }} />
          <PairCell p={right} />
        </>
      )}
    </div>
  );
}

function MetalCard({ p }) {
  const baseColor  = p.base.net  > 0 ? "var(--green)" : p.base.net  < 0 ? "var(--red)" : "var(--text-3)";
  const quoteColor = p.quote.net > 0 ? "var(--green)" : p.quote.net < 0 ? "var(--red)" : "var(--text-3)";
  const baseIcon   = p.base.net  > 0 ? <IconArrowUp /> : p.base.net  < 0 ? <IconArrowDown /> : <IconMinus />;
  const quoteIcon  = p.quote.net > 0 ? <IconArrowUp /> : p.quote.net < 0 ? <IconArrowDown /> : <IconMinus />;

  return (
    <div style={{
      background: "var(--bg-2)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius)",
      padding: "14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: 500, color: "var(--text)" }}>
          {p.pair}
        </span>
        <BiasTag bias={p.bias} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {[
          { label: p.base.symbol,  net: p.base.net,  color: baseColor,  icon: baseIcon,  sub: "commercial"     },
          { label: p.quote.symbol, net: p.quote.net, color: quoteColor, icon: quoteIcon, sub: "non-commercial"  },
        ].map(({ label, net, color, icon, sub }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-3)" }}>{label}</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--text-3)", marginLeft: "4px", opacity: 0.6 }}>{sub}</span>
            </div>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 500, color, display: "inline-flex", alignItems: "center", gap: "3px" }}>
              {icon}{fmt(net)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Bias() {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/bias`)
      .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, []);

  const all = data ? [...(data.currencies || []), ...(data.metals || [])] : [];
  const counts = {
    BUY:       all.filter((p) => p.bias === "BUY").length,
    SELL:      all.filter((p) => p.bias === "SELL").length,
    UNCERTAIN: all.filter((p) => p.bias === "UNCERTAIN").length,
  };

  // chunk currencies into pairs of 2
  const currencyRows = [];
  if (data?.currencies) {
    for (let i = 0; i < data.currencies.length; i += 2) {
      currencyRows.push({ left: data.currencies[i], right: data.currencies[i + 1] || null });
    }
  }

  return (
    <div className="page">

      {/* Header — restored to match live site */}
      <div style={{ padding: "20px 0 16px" }}>
        <div className="hero-label" style={{ marginBottom: "6px" }}>INSTITUTIONAL POSITIONING BIAS</div>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "12px" }}>
          <h1 style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
            fontWeight: 600,
            color: "var(--text)",
            letterSpacing: "-0.02em",
            margin: 0,
          }}>
            COT Bias
          </h1>
          {data?.as_of && (
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-3)", whiteSpace: "nowrap" }}>
              as of {data.as_of}
            </span>
          )}
        </div>
        <p style={{ fontSize: "0.82rem", color: "var(--text-2)", lineHeight: 1.5, maxWidth: "460px", marginTop: "6px" }}>
          Institutional positioning signals from CFTC COT data. Currencies use non-commercial net.
          Metals use commercial net vs DXY non-commercial. Signal requires opposing sides.
        </p>
      </div>

      {loading && (
        <div style={{ padding: "24px 0", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-3)" }}>
          Loading...
        </div>
      )}
      {error && (
        <div className="docs-note" style={{ borderLeftColor: "var(--red)", marginTop: "8px" }}>
          Failed to load: {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary strip */}
          <div style={{
            display: "flex",
            gap: "1px",
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            marginBottom: "20px",
          }}>
            {[
              { label: "Buy",       count: counts.BUY,       color: "var(--green)"  },
              { label: "Sell",      count: counts.SELL,      color: "var(--red)"    },
              { label: "Uncertain", count: counts.UNCERTAIN, color: "var(--text-3)" },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ flex: 1, background: "var(--bg-2)", padding: "10px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "1.1rem", fontWeight: 500, color, lineHeight: 1 }}>{count}</span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Currencies — plain rows, no outer rectangle */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              paddingBottom: "7px",
              borderBottom: "1px solid var(--border)",
              marginBottom: "6px",
            }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>Currencies</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-3)" }}>non-commercial positioning</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {currencyRows.map(({ left, right }, index) => (
                <PairRow
                  key={left.pair}
                  left={left}
                  right={right}
                  isLast={index === currencyRows.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Metals — 2-col grid (unchanged) */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              paddingBottom: "7px",
              borderBottom: "1px solid var(--border)",
              marginBottom: "6px",
            }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "0.9rem", fontWeight: 600, color: "var(--text)" }}>Metals</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-3)" }}>commercial vs DXY non-commercial</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {data.metals.map((p) => <MetalCard key={p.pair} p={p} />)}
            </div>
          </div>

          {/* Legend */}
          <div style={{
            display: "flex",
            gap: "14px",
            flexWrap: "wrap",
            padding: "10px 0",
            borderTop: "1px solid var(--border)",
          }}>
            {[
              { icon: <IconArrowUp />,   label: "BUY — base ↑ quote ↓",  color: "var(--green)"  },
              { icon: <IconArrowDown />, label: "SELL — base ↓ quote ↑",  color: "var(--red)"    },
              { icon: <IconMinus />,     label: "— same direction",        color: "var(--text-3)" },
            ].map(({ icon, label, color }) => (
              <span key={label} style={{ fontFamily: "var(--font-mono)", fontSize: "0.62rem", color, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                {icon}{label}
              </span>
            ))}
          </div>

          {/* Disclaimer */}
          <div style={{
            marginTop: "16px",
            padding: "12px 14px",
            background: "var(--bg-3)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent-dim)",
            borderRadius: "var(--radius)",
          }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Disclaimer
            </span>
            <p style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.55, margin: "4px 0 0" }}>
              This page reflects raw CFTC COT positioning data only. Signals are not buy or sell
              recommendations. Always combine with price action, structure, and your own analysis
              before making any trading decisions.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
