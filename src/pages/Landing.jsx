import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE = "https://cotapi.onrender.com";

export default function Landing() {
  const navigate = useNavigate();
  const [live, setLive] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetch(`${BASE}/api/last-updated`)
      .then((r) => r.json())
      .then((d) => setLastUpdated(d.last_updated))
      .catch(() => {});

    fetch(`${BASE}/api/metals/GOLD`)
      .then((r) => r.json())
      .then((d) => setLive(d))
      .catch(() => {});
  }, []);

  return (
    <div className="page landing">
      <div className="hero">
        <div className="hero-label">FREE — OPEN — NO KEY REQUIRED</div>
        <h1 className="hero-title">OpenCOT</h1>
        <p className="hero-sub">
          A clean REST API for CFTC Commitments of Traders data.
          Metals and currencies, structured for developers.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => navigate("/docs")}>
            Read the Docs
          </button>
          <button className="btn-ghost" onClick={() => navigate("/playground")}>
            Try the Playground
          </button>
        </div>
        {lastUpdated && (
          <div className="hero-meta">Data as of {lastUpdated}</div>
        )}
      </div>

      <div className="divider" />

      <section className="section">
        <h2 className="section-title">Live Sample</h2>
        <p className="section-sub">
          Real response from{" "}
          <span className="mono">GET /api/metals/GOLD</span>
        </p>
        <div className="code-block">
          <pre>
            {live
              ? JSON.stringify(live, null, 2)
              : "Fetching live data..."}
          </pre>
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <h2 className="section-title">What is OpenCOT</h2>
        <div className="prose-grid">
          <div className="prose-card">
            <div className="prose-card-title">Source</div>
            <p>
              Data is pulled directly from the CFTC every Friday after
              the official 3:30 PM EST release. No middlemen, no
              transformations beyond structuring.
            </p>
          </div>
          <div className="prose-card">
            <div className="prose-card-title">Coverage</div>
            <p>
              13 instruments across metals and currencies including
              GOLD, SILVER, EUR, GBP, JPY, AUD, CAD, CHF, NZD, MXN,
              BRL, ZAR, and the US Dollar Index.
            </p>
          </div>
          <div className="prose-card">
            <div className="prose-card-title">History</div>
            <p>
              Full historical positioning data from 2010 to present.
              Query by symbol, group, field, date range, or number of
              weeks.
            </p>
          </div>
          <div className="prose-card">
            <div className="prose-card-title">Free</div>
            <p>
              No API key. No sign-up. No rate limit beyond 60 requests
              per minute per IP. Built for developers building trading
              systems.
            </p>
          </div>
        </div>
      </section>

      <div className="divider" />

      <section className="section">
        <h2 className="section-title">Quick Start</h2>
        <div className="snippet-list">
          {[
            ["Full GOLD positioning", "GET /api/metals/GOLD"],
            ["Commercial net position", "GET /api/metals/GOLD/commercial/net"],
            ["EUR non-commercial longs", "GET /api/currencies/EUR/noncommercial/long"],
            ["Last 12 weeks of GOLD", "GET /api/history/GOLD?weeks=12"],
            ["Commercial shorts history", "GET /api/history/GBP/commercial/short?weeks=8"],
            ["Date range query", "GET /api/history/GOLD?from_date=2026-01-01&to_date=2026-05-01"],
          ].map(([label, endpoint]) => (
            <div className="snippet-row" key={endpoint}>
              <div className="snippet-label">{label}</div>
              <div className="snippet-endpoint mono">{endpoint}</div>
            </div>
          ))}
        </div>
        <button
          className="btn-primary mt"
          onClick={() => navigate("/docs")}
        >
          Full Reference
        </button>
      </section>
    </div>
  );
}