import { useEffect, useState } from "react";

const BASE = "https://cotapi.onrender.com";

function fmt(n) {
  if (n === null || n === undefined) return "—";
  return (n >= 0 ? "+" : "") + n.toLocaleString();
}

function BiasTag({ bias }) {
  const style = {
    display: "inline-block",
    fontFamily: "var(--font-mono)",
    fontSize: "0.68rem",
    fontWeight: 500,
    letterSpacing: "0.08em",
    padding: "2px 8px",
    borderRadius: "var(--radius)",
    background:
      bias === "BUY"
        ? "rgba(74,154,106,0.15)"
        : bias === "SELL"
        ? "rgba(154,74,74,0.15)"
        : "rgba(90,82,72,0.15)",
    color:
      bias === "BUY"
        ? "var(--green)"
        : bias === "SELL"
        ? "var(--red)"
        : "var(--text-3)",
    border: `1px solid ${
      bias === "BUY"
        ? "rgba(74,154,106,0.3)"
        : bias === "SELL"
        ? "rgba(154,74,74,0.3)"
        : "rgba(90,82,72,0.2)"
    }`,
  };
  return <span style={style}>{bias}</span>;
}

function NetValue({ value }) {
  const color =
    value > 0 ? "var(--green)" : value < 0 ? "var(--red)" : "var(--text-3)";
  return (
    <span style={{ color, fontFamily: "var(--font-mono)", fontSize: "0.78rem" }}>
      {fmt(value)}
    </span>
  );
}

function PairTable({ title, pairs }) {
  if (!pairs || pairs.length === 0) return null;

  return (
    <div className="docs-group">
      <div className="docs-group-title">{title}</div>
      <div className="docs-group-note">
        {title === "Currencies"
          ? "Non-commercial positioning (large speculators & banks). Both sides must oppose for a valid signal."
          : "Commercial positioning for the asset vs non-commercial DXY. Opposing sides required."}
      </div>
      <div
        style={{
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "100px 1fr 1fr 80px",
            gap: "12px",
            padding: "8px 18px",
            background: "var(--bg-3)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.67rem",
            color: "var(--text-3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <span>Pair</span>
          <span>Base</span>
          <span>Quote</span>
          <span>Signal</span>
        </div>

        {pairs.map((p, i) => (
          <div
            key={p.pair}
            style={{
              display: "grid",
              gridTemplateColumns: "100px 1fr 1fr 80px",
              gap: "12px",
              padding: "11px 18px",
              alignItems: "center",
              borderTop: i === 0 ? "none" : "1px solid var(--border)",
              background: "var(--bg-2)",
            }}
          >
            {/* Pair */}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                color: "var(--text)",
                fontWeight: 500,
              }}
            >
              {p.pair}
            </span>

            {/* Base */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  color: "var(--accent-dim)",
                }}
              >
                {p.base.symbol} · {p.base.positioning}
              </span>
              <NetValue value={p.base.net} />
            </div>

            {/* Quote */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.68rem",
                  color: "var(--accent-dim)",
                }}
              >
                {p.quote.symbol} · {p.quote.positioning}
              </span>
              <NetValue value={p.quote.net} />
            </div>

            {/* Signal */}
            <BiasTag bias={p.bias} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Bias() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/bias`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, []);

  const buyCount = data
    ? [...(data.currencies || []), ...(data.metals || [])].filter(
        (p) => p.bias === "BUY"
      ).length
    : 0;
  const sellCount = data
    ? [...(data.currencies || []), ...(data.metals || [])].filter(
        (p) => p.bias === "SELL"
      ).length
    : 0;
  const uncertainCount = data
    ? [...(data.currencies || []), ...(data.metals || [])].filter(
        (p) => p.bias === "UNCERTAIN"
      ).length
    : 0;

  return (
    <div className="page">
      {/* Header */}
      <div className="hero" style={{ paddingBottom: "32px" }}>
        <div className="hero-label">INSTITUTIONAL POSITIONING BIAS</div>
        <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)" }}>
          COT Bias Analysis
        </h1>
        <p className="hero-sub">
          Derived from CFTC COT data. Currencies use non-commercial positioning.
          Metals use commercial positioning for the asset vs non-commercial for
          the US Dollar Index. A signal requires both sides to oppose each other.
        </p>
        {data?.as_of && (
          <div className="hero-meta">Data as of {data.as_of}</div>
        )}
      </div>

      <div className="divider" />

      {loading && (
        <div
          style={{
            padding: "48px 0",
            textAlign: "center",
            fontFamily: "var(--font-mono)",
            fontSize: "0.78rem",
            color: "var(--text-3)",
          }}
        >
          Loading bias data...
        </div>
      )}

      {error && (
        <div className="docs-note" style={{ borderLeftColor: "var(--red)" }}>
          Failed to load bias data: {error}. Make sure the API is reachable.
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary strip */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              overflow: "hidden",
              marginBottom: "36px",
            }}
          >
            {[
              { label: "Buy Signals", count: buyCount, color: "var(--green)" },
              { label: "Sell Signals", count: sellCount, color: "var(--red)" },
              { label: "Uncertain", count: uncertainCount, color: "var(--text-3)" },
            ].map(({ label, count, color }) => (
              <div
                key={label}
                style={{
                  background: "var(--bg-2)",
                  padding: "20px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.67rem",
                    color: "var(--text-3)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.6rem",
                    fontWeight: 500,
                    color,
                  }}
                >
                  {count}
                </span>
              </div>
            ))}
          </div>

          <PairTable title="Currencies" pairs={data.currencies} />
          <PairTable title="Metals" pairs={data.metals} />

          {/* Methodology note */}
          <div className="docs-note" style={{ marginTop: "8px" }}>
            <strong style={{ color: "var(--text)" }}>How it works: </strong>
            Currencies check non-commercial (large speculator) net positioning.
            Metals check commercial net on the asset and non-commercial net on the DXY.
            A <span style={{ color: "var(--green)" }}>BUY</span> signal means the
            base is net long and the quote is net short. A{" "}
            <span style={{ color: "var(--red)" }}>SELL</span> signal means the
            base is net short and the quote is net long. When both sides point
            the same direction the signal is{" "}
            <span style={{ color: "var(--text-3)" }}>UNCERTAIN</span> and should
            be ignored.
          </div>

          {/* Raw endpoint */}
          <div style={{ marginTop: "24px" }}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.67rem",
                color: "var(--text-3)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "8px",
              }}
            >
              Raw endpoint
            </div>
            <div className="code-block sm">
              <pre>GET https://cotapi.onrender.com/api/bias</pre>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
