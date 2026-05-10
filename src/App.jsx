import { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Docs from "./pages/Docs";
import Playground from "./pages/Playground";
import Contact from "./pages/Contact";
import "./App.css";

function Nav() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const links = [
    { to: "/", label: "Home" },
    { to: "/docs", label: "Docs" },
    { to: "/playground", label: "Playground" },
    { to: "/contact", label: "Contact" },
  ];

  return (
    <nav className="nav">
      <NavLink to="/" className="nav-brand">
        OpenCOT
      </NavLink>
      <div className={`nav-links${open ? " open" : ""}`}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === "/"}
            className={({ isActive }) =>
              `nav-link${isActive ? " active" : ""}`
            }
            onClick={() => setOpen(false)}
          >
            {l.label}
          </NavLink>
        ))}
      </div>
      <button
        className="nav-burger"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="mono">OpenCOT</span>
        <span>Data sourced from CFTC. Updated every Friday.</span>
        <a
          href="https://github.com/Techtoxic/COTAPI"
          target="_blank"
          rel="noopener noreferrer"
          className="footer-link"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Nav />
        <main className="main">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/playground" element={<Playground />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}