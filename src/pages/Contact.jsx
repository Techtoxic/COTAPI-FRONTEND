export default function Contact() {
  const contacts = [
    {
      label: "GitHub",
      value: "Techtoxic/COTAPI",
      href: "https://github.com/Techtoxic/COTAPI",
      note: "Source code, issues, pull requests",
    },
    {
      label: "WhatsApp",
      value: "+254 114 712 455",
      href: "https://wa.me/254114712455",
      note: "Direct message",
    },
    {
      label: "Telegram",
      value: "@maxxciey",
      href: "https://t.me/maxxciey",
      note: "Direct message",
    },
  ];

  return (
    <div className="page contact">
      <div className="docs-header">
        <h1 className="section-title">Contact</h1>
        <p className="section-sub">
          Built and maintained by Techtoxic. Reach out for questions,
          bugs, feature requests, or integrations.
        </p>
      </div>

      <div className="divider" />

      <div className="contact-list">
        {contacts.map((c) => (
          <a
            key={c.label}
            className="contact-card"
            href={c.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="contact-label">{c.label}</div>
            <div className="contact-value mono">{c.value}</div>
            <div className="contact-note">{c.note}</div>
          </a>
        ))}
      </div>

      <div className="divider" />

      <div className="section">
        <h2 className="section-title">Contributing</h2>
        <p className="section-sub">
          OpenCOT is open source. If you find a bug, want to add a new
          instrument, or improve the API, open an issue or pull request
          on GitHub. Data requests and new symbol additions are welcome.
        </p>
      </div>
    </div>
  );
}