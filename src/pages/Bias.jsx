import { useEffect, useState } from "react";

const BASE = "https://cotapi.onrender.com";

function fmt(n) {
  if (n === null || n === undefined) return "—";
  return (n >= 0 ? "+" : "") + n.toLocaleString();
}

function BiasTag({ bias }) {
  const colors = {
    BUY:       { bg: "rgba(74,154,106,0.12)", color: "var(--green)", border: "rgba(74,154,106,0.25)" },
    SELL:      { bg: "rgba(154,74,74,0.12)",  color: "var(--red)",   border: "rgba(154,74,74,0.25)"  },
    UNCERTAIN: { bg: "rgba(90,82,72,0.1)",    color: "var(--text-3)",border: "rgba(90,82,72,0.15)"  },
  };
  const c = colors[bias] || colors.UNCERTAIN;
  return (
    <span style={{
      fontFamily: "var(--font-mono)",
      fontSize: "0.62rem",
      fontWeight: 500,
      letterSpacing: "0.1em",
      padding: "2px 7px",
      borderRadius: "var(--radius)",
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      whiteSpace: "nowrap",
    }}>
      {bias === "UNCERTAIN" ? "—" : bias}
    </span>
  );
}

function PairRow({ p, i }) {
  const baseColor  = p.base.net  > 0 ? "var(--green)" : p.base.net  < 0 ? "var(--red)" : "var(--text-3)";
  const quoteColor = p.quote.net > 0 ? "var(--green)" : p.quote.net < 0 ? "var(--red)" : "var(--text-3)";

  return (
    <div style={{
      padding: "9px 16px",
      borderTop: i === 0 ? "none" : "1px solid var(--border)",
      background: "var(--bg-2)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.78rem",
          fontWeight: 500,
          color: "var(--text)",
          letterSpacing: "0.02em",
        }}>
          {p.pair}
        </span>
        <BiasTag bias={p.bias} />
      </div>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-mono)",
        fontSize: "0.7rem",
        flexWrap: "wrap",
      }}>
        <span style={{ color: "var(--text-3)" }}>{p.base.symbol}</span>
        <span style={{ color: baseColor, fontWeight: 500 }}>{fmt(p.base.net)}</span>
        <span style={{ color: "var(--border-2)" }}>·</span>
        <span style={{ color: "var(--text-3)" }}>{p.quote.symbol}</span>
        <span style={{ color: quoteColor, fontWeight: 500 }}>{fmt(p.quote.net)}</span>
      </div>
    </div>
  );
}

function PairTable({ title, pairs, note }) {
  if (!pairs || pairs.length === 0) return null;
  return (
    <div style={{ marginBottom: "20px" }}>
      <div style={{
        display: "flex",
        alignItems: "baseline",
        justifyContent: "space-between",
        gap: "12px",
        paddingBottom: "8px",
        borderBottom: "1px solid var(--border)",
        marginBottom: "4px",
      }}>
        <span style={{
          fontFamily: "var(--font-serif)",
          fontSize: "0.95rem",
          fontWeight: 600,
          color: "var(--text)",
        }}>{title}</span>
        <span style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.62rem",
          color: "var(--text-3)",
          whiteSpace: "nowrap",
        }}>{note}</span>
      </div>
      <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius)", overflow: "hidden" }}>
        {pairs.map((p, i) => <PairRow key={p.pair} p={p} i={i} />)}
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

  return (
    <div className="page">
      <div style={{ padding: "24px 0 20px" }}>
        <div className="hero-label" style={{ marginBottom: "10px" }}>INSTITUTIONAL POSITIONING BIAS</div>
        <h1 style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          fontWeight: 600,
          color: "var(--text)",
          letterSpacing: "-0.02em",
          marginBottom: "8px",
        }}>
          COT Bias
        </h1>
        <p style={{ fontSize: "0.88rem", color: "var(--text-2)", lineHeight: 1.55, maxWidth: "480px" }}>
          Institutional positioning signals from CFTC COT data. Currencies use non-commercial net.
          Metals use commercial net vs DXY non-commercial. Signal requires opposing sides.
        </p>
        {data?.as_of && (
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-3)", marginTop: "10px" }}>
            as of {data.as_of}
          </div>
        )}
      </div>

      <div className="divider" style={{ margin: "0 0 20px" }} />

      {loading && (
        <div style={{ padding: "32px 0", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--text-3)" }}>
          Loading...
        </div>
      )}

      {error && (
        <div className="docs-note" style={{ borderLeftColor: "var(--red)" }}>
          Failed to load: {error}
        </div>
      )}

      {data && !loading && (
        <>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1px",
            background: "var(--border)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
            marginBottom: "24px",
          }}>
            {[
              { label: "Buy",       count: counts.BUY,       color: "var(--green)"  },
              { label: "Sell",      count: counts.SELL,      color: "var(--red)"    },
              { label: "Uncertain", count: counts.UNCERTAIN, color: "var(--text-3)" },
            ].map(({ label, count, color }) => (
              <div key={label} style={{ background: "var(--bg-2)", padding: "14px 16px" }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.6rem",
                  color: "var(--text-3)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: "4px",
                }}>{label}</div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                  color,
                  lineHeight: 1,
                }}>{count}</div>
              </div>
            ))}
          </div>

          <PairTable title="Currencies" pairs={data.currencies} note="non-commercial" />
          <PairTable title="Metals"     pairs={data.metals}     note="commercial vs DXY" />

          <div style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            padding: "12px 0",
            borderTop: "1px solid var(--border)",
            marginTop: "4px",
          }}>
            {[
              { label: "BUY — base ↑ quote ↓",  color: "var(--green)"  },
              { label: "SELL — base ↓ quote ↑",  color: "var(--red)"    },
              { label: "— — same direction",      color: "var(--text-3)" },
            ].map(({ label, color }) => (
              <span key={label} style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color }}>{label}</span>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
