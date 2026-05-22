export default function LandingPage({ goDashboard, goCheckout, goLegal }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const trustItems = [
    ["✓", "Keine Abos", "Faire Einmalzahlung"],
    ["🔒", "Sichere Zahlung", "Stripe Checkout"],
    ["📄", "PDF Download", "Direkt nach Erstellung"],
  ];

  const proofItems = [
    ["ATS-Check", "Kostenlos starten"],
    ["Keywords", "Aus Stellenanzeige"],
    ["PDF", "Lebenslauf + Anschreiben"],
  ];

  const steps = [
    ["1", "Lebenslauf einfügen", "Lade deinen Lebenslauf hoch oder füge deinen Text direkt ein."],
    ["2", "KI analysiert", "Die KI erkennt fehlende Keywords, Schwächen und Optimierungspotenzial."],
    ["3", "PDF erhalten", "Erstelle deinen Lebenslauf, dein Anschreiben oder das komplette Bundle."],
  ];

  const plans = [
    {
      title: "Kostenlos",
      price: "0€",
      text: "ATS-Check & Analyse",
      features: ["ATS Score", "Keyword-Analyse", "Optimierungstipps"],
      cta: "Gratis starten",
      action: goDashboard,
      highlight: false,
    },
    {
      title: "Lebenslauf",
      price: "3€",
      text: "Optimierter Lebenslauf als PDF",
      features: ["ATS optimiert", "Moderne Vorlage", "PDF Download"],
      cta: "Lebenslauf optimieren",
      action: () => goCheckout("resume"),
      highlight: false,
    },
    {
      title: "Anschreiben",
      price: "3€",
      text: "Passendes Anschreiben zur Stelle",
      features: ["Individuell angepasst", "ATS-Keywords integriert", "PDF Download"],
      cta: "Anschreiben erstellen",
      action: () => goCheckout("coverLetter"),
      highlight: false,
    },
    {
      title: "Bundle",
      price: "5€",
      text: "Lebenslauf + Anschreiben",
      features: ["Komplettes Paket", "ATS optimiert", "PDF Download"],
      cta: "Bundle starten",
      action: () => goCheckout("bundle"),
      highlight: true,
    },
  ];

  const faqs = [
    ["Ist die Analyse kostenlos?", "Ja. Der ATS-Check ist kostenlos und zeigt dir sofort, wo deine Bewerbung besser werden kann."],
    ["Kann ich PDFs herunterladen?", "Ja. Nach der Erstellung kannst du deine fertige Bewerbung direkt als PDF speichern."],
    ["Gibt es ein Abo?", "Nein. BewerberFuchs nutzt faire Einmalzahlungen. Kein Abo, keine versteckten Kosten."],
    ["Ist die Zahlung sicher?", "Ja. Die Zahlung läuft über Stripe und deine Verbindung ist SSL-verschlüsselt."],
  ];

  return (
    <div className="landing-page min-h-screen bg-[#03070d] text-white overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_80%_8%,rgba(255,107,0,0.22),transparent_30%),radial-gradient(circle_at_10%_25%,rgba(0,120,255,0.08),transparent_24%)]" />

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#03070d]/82 backdrop-blur-xl safe-area">
        <div className="container-page py-3 sm:py-4 flex items-center justify-between gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 min-w-0 text-left">
            <img src="/favicon.png" alt="BewerberFuchs" className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl object-cover shrink-0" />
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-extrabold leading-tight whitespace-nowrap">
                Bewerber<span className="text-orange-500">Fuchs</span>
              </div>
              <div className="text-[9px] sm:text-[11px] tracking-[3px] sm:tracking-[4px] text-gray-400 truncate">
                KI BEWERBUNGSTOOL
              </div>
            </div>
          </button>

          <div className="hidden lg:flex items-center gap-8 text-sm text-gray-300">
            <button onClick={() => scrollTo("funktion")} className="hover:text-white">So funktioniert's</button>
            <button onClick={() => scrollTo("preise")} className="hover:text-white">Preise</button>
            <button onClick={() => scrollTo("faq")} className="hover:text-white">FAQ</button>
          </div>

          <button onClick={goDashboard} className="btn-primary px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base shrink-0">
            Starten
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        <section className="container-page pt-8 sm:pt-12 lg:pt-16 pb-8 lg:pb-16 grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-center">
          <div className="relative z-20">
            <div className="inline-flex max-w-full items-center gap-2 px-3 sm:px-5 py-2 sm:py-3 rounded-2xl border border-white/15 bg-white/5 text-orange-500 text-xs sm:text-sm font-bold mb-5 sm:mb-7">
              ⚡ KI-POWERED BEWERBUNGSOPTIMIERUNG
            </div>

            <h1 className="hero-title font-extrabold tracking-tight mb-5 sm:mb-6">
              Dein Lebenslauf.
              <br />
              <span className="text-orange-500">ATS-optimiert</span>
              <br />
              in Minuten.
            </h1>

            <p className="text-[17px] sm:text-xl text-gray-300 leading-relaxed mb-6 sm:mb-8 max-w-[620px]">
              Erstelle bessere Lebensläufe und Anschreiben mit KI. Schnell, mobilfreundlich und ohne Abo.
            </p>
              <div className="glass-card p-4 sm:p-5 mb-7 max-w-[680px]">
  <div className="flex items-center gap-2 mb-3">
    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
    <span className="text-sm text-green-400 font-semibold">
      Kostenloser ATS-Check
    </span>
  </div>

  <textarea
    placeholder="Füge hier deinen Lebenslauf oder eine Stellenanzeige ein..."
    className="w-full min-h-[140px] rounded-2xl bg-[#0b1220] border border-white/10 px-4 py-4 text-white placeholder:text-gray-500 outline-none focus:border-orange-500 transition"
  />

  <div className="flex flex-col sm:flex-row gap-3 mt-4">
    <button
      onClick={goDashboard}
      className="btn-primary flex-1 py-4 text-base sm:text-lg"
    >
      🚀 Kostenlos analysieren
    </button>

    <div className="flex items-center justify-center px-4 text-sm text-gray-400">
      ⏱ Analyse dauert ca. 30 Sekunden
    </div>
  </div>
</div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button onClick={goDashboard} className="btn-primary py-4 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto">
                🚀 Kostenlos ATS-Check starten
              </button>
              <button onClick={() => scrollTo("preise")} className="btn-secondary py-4 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto">
                Preise ansehen
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[720px]">
              {trustItems.map((item) => (
                <div key={item[1]} className="mini-card">
                  <span className="text-orange-500 font-bold">{item[0]}</span>
                  <div>
                    <div className="font-bold text-white text-sm">{item[1]}</div>
                    <div className="text-gray-400 text-xs">{item[2]}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center min-h-[300px] sm:min-h-[460px] lg:min-h-[620px]">
            <div className="absolute w-[300px] h-[300px] sm:w-[520px] sm:h-[520px] lg:w-[680px] lg:h-[680px] rounded-full bg-orange-500/20 blur-[90px] sm:blur-[130px]" />
            <img src="/fox-hero.png" alt="BewerberFuchs Hero" className="relative z-10 w-full max-w-[430px] sm:max-w-[620px] lg:max-w-[790px] object-contain drop-shadow-[0_0_80px_rgba(255,115,0,0.42)]" />
          </div>
        </section>

        <section className="container-page py-5 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 glass-card p-5 sm:p-6">
            {proofItems.map((item) => (
              <div key={item[0]} className="flex items-center gap-4 sm:justify-center">
                <div className="w-11 h-11 rounded-2xl bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-500 font-black">✓</div>
                <div>
                  <div className="font-extrabold text-lg">{item[0]}</div>
                  <div className="text-gray-400 text-sm">{item[1]}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="funktion" className="container-page py-12 sm:py-16 scroll-mt-24">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-orange-500 font-bold text-sm mb-3">SO FUNKTIONIERT'S</p>
            <h2 className="section-title">In 3 einfachen Schritten</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {steps.map((item) => (
              <div key={item[0]} className="glass-card p-6 sm:p-7 text-center">
                <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-2xl font-black shadow-lg shadow-orange-500/20">
                  {item[0]}
                </div>
                <h3 className="text-xl font-extrabold mb-3">{item[1]}</h3>
                <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{item[2]}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="preise" className="container-page py-12 sm:py-16 scroll-mt-24">
          <div className="text-center mb-9 sm:mb-11">
            <p className="text-orange-500 font-bold text-sm mb-3">PREISE</p>
            <h2 className="section-title">Einmal zahlen. Sofort Ergebnis erhalten.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 items-stretch">
            {plans.map((plan) => (
              <div key={plan.title} className={plan.highlight ? "price-card price-card-highlight" : "price-card"}>
                {plan.highlight && <div className="popular-badge">BELIEBT</div>}
                <div className="relative z-10 flex flex-col h-full">
                  <h3 className="text-2xl font-extrabold mb-3">{plan.title}</h3>
                  <div className="text-6xl font-black tracking-tight mb-4">{plan.price}</div>
                  <p className={plan.highlight ? "text-white/90 mb-7" : "text-gray-300 mb-7"}>{plan.text}</p>

                  <div className="space-y-3 mb-8 text-base flex-1">
                    {plan.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <span className={plan.highlight ? "text-white" : "text-orange-500"}>✓</span>
                        <span className={plan.highlight ? "text-white" : "text-gray-300"}>{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={plan.action} className={plan.highlight ? "btn-dark w-full py-4" : "btn-outline w-full py-4"}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="container-page py-12 sm:py-16 scroll-mt-24">
          <div className="text-center mb-8 sm:mb-10">
            <p className="text-orange-500 font-bold text-sm mb-2">HÄUFIGE FRAGEN</p>
            <h2 className="section-title">FAQ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq) => (
              <details key={faq[0]} className="faq-card group">
                <summary className="cursor-pointer flex justify-between items-center gap-4 font-bold text-base sm:text-lg list-none">
                  <span>{faq[0]}</span>
                  <span className="group-open:rotate-180 transition shrink-0 text-orange-500">⌄</span>
                </summary>
                <p className="text-gray-400 mt-4 leading-relaxed">{faq[1]}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10">
        <div className="container-page py-10 sm:py-12 grid grid-cols-1 md:grid-cols-5 gap-8 text-sm">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img src="/favicon.png" alt="BewerberFuchs" className="w-11 h-11 rounded-xl object-cover" />
              <div>
                <div className="text-2xl font-extrabold">Bewerber<span className="text-orange-500">Fuchs</span></div>
                <div className="text-[11px] text-gray-400 tracking-[4px]">KI BEWERBUNGSTOOL</div>
              </div>
            </div>
            <p className="text-gray-400 max-w-sm">Mehr Vorstellungsgespräche durch bessere Bewerbungen. Schnell, klar und mobil optimiert.</p>
          </div>

          <div>
            <h4 className="font-bold mb-3">Produkt</h4>
            <div className="space-y-2 text-gray-400 flex flex-col items-start">
              <button onClick={() => scrollTo("funktion")}>ATS Analyse</button>
              <button onClick={() => scrollTo("preise")}>Preise</button>
              <button onClick={goDashboard}>Dashboard</button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">Rechtliches</h4>
            <div className="space-y-2 text-gray-400 flex flex-col items-start">
              <button onClick={() => goLegal("impressum")}>Impressum</button>
              <button onClick={() => goLegal("datenschutz")}>Datenschutz</button>
              <button onClick={() => goLegal("agb")}>AGB</button>
              <button onClick={() => goLegal("kontakt")}>Kontakt</button>
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-3">Sichere Zahlung</h4>
            <div className="text-2xl font-extrabold text-white mb-3">stripe&nbsp;&nbsp;VISA</div>
            <p className="text-gray-400">🔒 SSL verschlüsselt & sicher</p>
          </div>
        </div>
        <p className="text-center text-gray-500 text-sm pb-8 px-4">© 2026 BewerberFuchs. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
