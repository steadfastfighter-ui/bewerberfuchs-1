import Topbar from "./components/Topbar";

export default function LegalPage({ type, goHome }) {
  const content = {
    impressum: {
      title: "Impressum",
      text: `
Angaben gemäß § 5 DDG

BewerberFuchs

Tarik Ouaissa
Ettlingen, Deutschland

E-Mail: kontakt@bewerberfuchs.eu

Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV:
Paul Nurzermann

EU-Streitschlichtung:
https://ec.europa.eu/consumers/odr/

Wir sind nicht verpflichtet und nicht bereit,
an Streitbeilegungsverfahren vor einer
Verbraucherschlichtungsstelle teilzunehmen.
`,
    },

    datenschutz: {
      title: "Datenschutzerklärung",
      text: `
Wir verarbeiten personenbezogene Daten ausschließlich
im Rahmen der gesetzlichen Datenschutzbestimmungen.

Beim Besuch dieser Website können technische Daten wie:
- IP-Adresse
- Browsertyp
- Geräteinformationen
verarbeitet werden.

Hochgeladene Lebensläufe und Stellenanzeigen
werden ausschließlich zur Analyse und Optimierung
der Bewerbung verwendet.

Zahlungen werden über Stripe verarbeitet:
https://stripe.com/de/privacy

Wir speichern keine vollständigen Zahlungsdaten.

Kontakt:
kontakt@bewerberfuchs.eu
`,
    },

    agb: {
      title: "AGB",
      text: `
Mit dem Kauf digitaler Produkte akzeptiert
der Kunde die sofortige Bereitstellung digitaler Inhalte.

Alle Produkte werden ausschließlich digital bereitgestellt.

Es besteht kein Anspruch auf physische Lieferung.

Das Widerrufsrecht kann gemäß § 356 Abs. 5 BGB
bei digitalen Produkten vorzeitig erlöschen.

BewerberFuchs übernimmt keine Garantie
für Bewerbungserfolge oder Einstellungen.
`,
    },

    kontakt: {
      title: "Kontakt",
      text: `
Du erreichst uns unter:

kontakt@bewerberfuchs.eu

Antwortzeit:
meist innerhalb von 24 Stunden.
`,
    },
  };

  const current = content[type];

  if (!current) return null;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Topbar goHome={goHome} />

      <div className="p-6 md:p-10">
        <div className="max-w-4xl mx-auto">

          <button
            onClick={goHome}
            className="mb-8 text-gray-400 hover:text-white transition"
          >
            ← Zurück zur Startseite
          </button>

          <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8 md:p-12 backdrop-blur-xl">

            <p className="text-orange-400 font-semibold mb-3">
              BewerberFuchs
            </p>

            <h1 className="text-4xl md:text-6xl font-black mb-8">
              {current.title}
            </h1>

            <div className="text-gray-300 whitespace-pre-wrap leading-8 text-base md:text-lg">
              {current.text}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}