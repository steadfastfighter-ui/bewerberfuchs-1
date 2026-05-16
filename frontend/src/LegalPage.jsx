import Topbar from "./components/Topbar";

export default function LegalPage({ type, goHome }) {
  const content = {
    impressum: {
      title: "Impressum",
      text: `
BewerberFuchs

Max Mustermann
Musterstraße 1
76133 Karlsruhe

E-Mail: kontakt@bewerberfuchs.eu

Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
Max Mustermann
`,
    },

    datenschutz: {
      title: "Datenschutzerklärung",
      text: `
Wir verarbeiten personenbezogene Daten ausschließlich im Rahmen der gesetzlichen Datenschutzbestimmungen.

Beim Verwenden unserer Plattform können technische Daten verarbeitet werden, um die Funktionalität der Website sicherzustellen.

Hochgeladene Lebensläufe werden ausschließlich zur Analyse und Optimierung verwendet.
`,
    },

    agb: {
      title: "AGB",
      text: `
Mit dem Kauf eines digitalen Produktes akzeptiert der Kunde die Bereitstellung digitaler Inhalte.

Alle Produkte werden digital bereitgestellt.

Es besteht kein Anspruch auf physische Lieferung.
`,
    },

    kontakt: {
      title: "Kontakt",
      text: `
Du erreichst uns unter:

kontakt@bewerberfuchs.eu

Antwortzeit in der Regel innerhalb von 24 Stunden.
`,
    },
  };

  const current = content[type];

  if (!current) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Topbar goHome={goHome} />

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={goHome}
            className="mb-8 text-gray-400 hover:text-white"
          >
            ← Zurück zur Startseite
          </button>

          <div className="bg-white/5 border border-white/10 rounded-[32px] p-10">
            <p className="text-orange-400 font-semibold mb-3">
              BewerberFuchs
            </p>

            <h1 className="text-5xl font-black mb-8">
              {current.title}
            </h1>

            <div className="text-gray-300 whitespace-pre-wrap leading-8 text-lg">
              {current.text}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}