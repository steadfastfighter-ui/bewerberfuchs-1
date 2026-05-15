export default function LandingPage({ goDashboard, goCheckout, goLegal }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const benefits = [
    ["↗", "+12%", "mehr Interview-Einladungen"],
    ["☆", "92%", "ATS Erfolgsquote"],
    ["●", "4.9★", "Zufriedene Nutzer"],
  ];

  const steps = [
    ["☁", "Lebenslauf hochladen", "Lade deinen Lebenslauf hoch oder füge deinen Text ein."],
    ["🧠", "KI analysiert", "Die KI erkennt Schwächen, fehlende Keywords und Optimierungspotenziale."],
    ["▣", "PDF herunterladen", "Erhalte Lebenslauf, Anschreiben oder Bundle direkt als PDF."],
  ];

  const plans = [
    ["Kostenlos", "0€", "ATS-Check & Analyse", ["ATS Score", "Keyword-Analyse", "Optimierungstipps"], "Gratis starten", goDashboard],
    ["Lebenslauf", "3€", "Optimierter Lebenslauf als PDF", ["ATS optimiert", "Moderne Vorlage", "PDF Download"], "Optimieren", () => goCheckout("resume")],
    ["Anschreiben", "3€", "Passendes Anschreiben zur Stelle", ["Individuell angepasst", "ATS-Keywords integriert", "PDF Download"], "Erstellen", () => goCheckout("coverLetter")],
  ];

  const faqs = [
    ["Ist die Analyse kostenlos?", "Ja. Der ATS-Check ist kostenlos."],
    ["Kann ich PDFs herunterladen?", "Ja. Nach der Erstellung kannst du deine Bewerbung direkt als PDF speichern."],
    ["Gibt es ein Abo?", "Nein. BewerberFuchs nutzt faire Einmalzahlungen."],
    ["Ist die Zahlung sicher?", "Ja. Die Zahlung läuft sicher über Stripe."],
  ];

  return (
    <div className="min-h-screen bg-[#03070d] text-white overflow-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_78%_12%,rgba(255,107,0,0.22),transparent_30%),radial-gradient(circle_at_18%_28%,rgba(0,120,255,0.07),transparent_24%)]" />

      <nav className="relative z-50 border-b border-white/10 bg-black/35 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
          >
            <img
              src="/favicon.png"
              alt="BewerberFuchs"
              className="w-11 h-11 rounded-xl object-cover"
            />

            <div className="text-left">
              <div className="text-2xl font-extrabold tracking-tight">
                Bewerber<span className="text-orange-500">Fuchs</span>
              </div>
              <div className="text-[11px] tracking-[4px] text-gray-400">
                KI BEWERBUNGSTOOL
              </div>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-9 text-sm text-gray-300">
            <button className="text-orange-500 border-b border-orange-500 pb-1">
              Home
            </button>
            <button onClick={() => scrollTo("funktion")} className="hover:text-white">
              ATS Analyse
            </button>
            <button onClick={goDashboard} className="hover:text-white">
              Dashboard
            </button>
            <button onClick={() => scrollTo("preise")} className="hover:text-white">
              Preise
            </button>
            <button onClick={() => scrollTo("faq")} className="hover:text-white">
              FAQ
            </button>
          </div>

          <button
            onClick={goDashboard}
            className="bg-orange-500 hover:bg-orange-400 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20"
          >
            Login / Starten
          </button>
        </div>
      </nav>

<main className="relative z-10">

  <section className="max-w-[1500px] mx-auto px-8 xl:px-14 pt-10 pb-24 grid lg:grid-cols-[0.9fr_1.1fr] gap-14 items-center min-h-[92vh]">

  {/* LEFT SIDE */}
  <div className="max-w-[620px]">
    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl border border-white/15 bg-white/5 text-orange-500 text-sm font-bold mb-8">
      ⚡ KI-POWERED BEWERBUNGSOPTIMIERUNG
    </div>

    <h1 className="text-5xl xl:text-[72px] leading-[0.98] font-extrabold tracking-tight mb-7">
      Professionelle
      <br />
      Bewerbungen
      <br />
      <span className="text-orange-500">
        in wenigen Minuten.
      </span>
    </h1>

    <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-[580px]">
      ATS-optimierte Lebensläufe und Anschreiben,
      erstellt mit künstlicher Intelligenz.
      Mehr Interviews. Mehr Jobangebote.
      Weniger Absagen.
    </p>

    <div className="flex flex-wrap gap-4 mb-7">
      <button
        onClick={goDashboard}
        className="bg-orange-500 hover:bg-orange-400 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-orange-500/20"
      >
        🚀 Jetzt kostenlos analysieren
      </button>

      <button
        onClick={() => scrollTo("preise")}
        className="border border-white/15 bg-white/5 hover:bg-white/10 px-8 py-4 rounded-2xl font-semibold"
      >
        Preise ansehen ›
      </button>
    </div>

    <div className="flex flex-wrap gap-6 text-sm text-gray-300">
      <span><span className="text-orange-500">✓</span> Keine Abos</span>
      <span><span className="text-orange-500">✓</span> Sichere Zahlung</span>
      <span><span className="text-orange-500">✓</span> PDF Download inklusive</span>
    </div>
  </div>

  {/* RIGHT SIDE */}
  <div className="relative flex items-center justify-center min-h-[900px]">

    {/* Glow */}
    <div className="absolute w-[780px] h-[780px] rounded-full bg-orange-500/20 blur-[140px]" />

    {/* Hero Image */}
    <img
      src="/fox-hero.png"
      alt="BewerberFuchs Hero"
      className="
        relative
        z-10
        w-full
        max-w-[980px]
        object-contain
        drop-shadow-[0_0_60px_rgba(255,115,0,0.45)]
      "
    />

  </div>

</section>
     
      <section className="max-w-7xl mx-auto px-6 py-8">
         
          <div className="grid md:grid-cols-3 gap-6 bg-white/[0.03] border border-white/10 rounded-3xl p-7">
            {benefits.map((item) => (
              <div
                key={item[1]}
                className="flex items-center gap-5 md:border-r md:border-white/10 last:border-r-0"
              >
                <div className="w-16 h-16 rounded-full border border-orange-500/50 text-orange-500 flex items-center justify-center text-3xl">
                  {item[0]}
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-orange-500">
                    {item[1]}
                  </div>
                  <p className="text-gray-300">{item[2]}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="funktion" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-bold text-sm mb-3">
              SO FUNKTIONIERT'S
            </p>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              In 3 einfachen Schritten
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {steps.map((item, index) => (
              <div
                key={item[1]}
                className="relative bg-white/[0.03] border border-white/10 rounded-2xl p-9 text-center min-h-[250px]"
              >
                <div className="text-orange-500 text-5xl mb-6">{item[0]}</div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <h3 className="text-xl font-bold">{item[1]}</h3>
                </div>

                <p className="text-gray-400 leading-relaxed">{item[2]}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="preise" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-bold text-sm mb-3">PREISE</p>
            <h2 className="text-3xl md:text-4xl font-extrabold">
              Einmal zahlen. Sofort Ergebnis erhalten.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan[0]}
                className="bg-white/[0.03] border border-white/10 rounded-2xl p-7"
              >
                <h3 className="text-xl font-bold mb-4">{plan[0]}</h3>
                <div className="text-5xl font-extrabold mb-4">{plan[1]}</div>
                <p className="text-gray-300 text-sm mb-7">{plan[2]}</p>

                <div className="space-y-3 mb-8 text-sm text-gray-300">
                  {plan[3].map((feature) => (
                    <div key={feature}>
                      <span className="text-orange-500">✓</span> {feature}
                    </div>
                  ))}
                </div>

                <button
                  onClick={plan[5]}
                  className="w-full border border-orange-500/70 hover:bg-orange-500 hover:text-white text-orange-500 py-4 rounded-xl font-bold"
                >
                  {plan[4]}
                </button>
              </div>
            ))}

            <div className="relative bg-gradient-to-b from-orange-500 to-orange-700 text-white rounded-2xl p-7 shadow-2xl shadow-orange-500/30">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-orange-400 px-4 py-1 rounded-md text-xs font-bold">
                BELIEBT
              </div>

              <h3 className="text-xl font-bold mb-4">Bundle</h3>
              <div className="text-6xl font-extrabold mb-4">5€</div>
              <p className="text-white/90 text-sm mb-7">
                Lebenslauf + Anschreiben
              </p>

              <div className="space-y-3 mb-8 text-sm">
                <div>✓ Komplettes Paket</div>
                <div>✓ ATS optimiert</div>
                <div>✓ PDF Download</div>
              </div>

              <button
                onClick={() => goCheckout("bundle")}
                className="w-full bg-black hover:bg-neutral-900 text-white py-4 rounded-xl font-bold"
              >
                Bundle starten
              </button>
            </div>
          </div>
        </section>

        <section id="faq" className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-10">
            <p className="text-orange-500 font-bold text-sm mb-2">
              HÄUFIGE FRAGEN
            </p>
            <h2 className="text-4xl font-extrabold">FAQ</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {faqs.map((faq) => (
              <details
                key={faq[0]}
                className="group bg-white/[0.03] border border-white/10 rounded-xl p-5"
              >
                <summary className="cursor-pointer flex justify-between items-center font-medium">
                  {faq[0]}
                  <span className="group-open:rotate-180 transition">⌄</span>
                </summary>
                <p className="text-gray-400 mt-4 leading-relaxed">{faq[1]}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 px-6 py-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/favicon.png"
                alt="BewerberFuchs"
                className="w-11 h-11 rounded-xl object-cover"
              />

              <div>
                <div className="text-2xl font-extrabold">
                  Bewerber<span className="text-orange-500">Fuchs</span>
                </div>
                <div className="text-[11px] text-gray-400 tracking-[4px]">
                  KI BEWERBUNGSTOOL
                </div>
              </div>
            </div>

            <p className="text-gray-400 max-w-xs">
              Mehr Vorstellungsgespräche durch bessere Bewerbungen.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Produkt</h4>
            <div className="space-y-2 text-gray-400">
              <button onClick={() => scrollTo("funktion")}>ATS Analyse</button>
              <br />
              <button onClick={() => scrollTo("preise")}>Preise</button>
              <br />
              <button onClick={goDashboard}>Dashboard</button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">Rechtliches</h4>
            <div className="space-y-2 text-gray-400">
              <button onClick={() => goLegal("impressum")}>Impressum</button>
              <br />
              <button onClick={() => goLegal("datenschutz")}>
                Datenschutz
              </button>
              <br />
              <button onClick={() => goLegal("agb")}>AGB</button>
              <br />
              <button onClick={() => goLegal("kontakt")}>Kontakt</button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">Sichere Zahlung</h4>
            <div className="text-2xl font-extrabold text-white mb-3">
              stripe &nbsp; VISA
            </div>
            <p className="text-gray-400">🔒 SSL verschlüsselt & sicher</p>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-10">
          © 2026 BewerberFuchs. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
}