export default function LandingPage({ goDashboard, goCheckout, goLegal }) {
  function scrollTo(id) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0f19]/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center text-black font-black text-xl">
              🦊
            </div>
            <div className="text-left">
              <div className="text-xl font-black">
                Bewerber<span className="text-orange-400">Fuchs</span>
              </div>
              <div className="text-xs text-gray-400">KI Bewerbungstool</div>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-8 text-gray-300">
            <button onClick={() => scrollTo("funktion")} className="hover:text-white">
              So funktioniert’s
            </button>
            <button onClick={() => scrollTo("demo")} className="hover:text-white">
              Demo
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
            className="bg-orange-500 hover:bg-orange-400 transition text-black font-bold px-5 py-3 rounded-2xl"
          >
            Jetzt starten
          </button>
        </div>
      </nav>

      <section className="px-6 py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <div className="inline-flex px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-8">
            🚀 Lebenslauf & Anschreiben in Minuten erstellen
          </div>

          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            Bewirb dich schneller, besser und professioneller.
          </h1>

          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            BewerberFuchs analysiert deinen Lebenslauf, nutzt die Stellenanzeige
            und erstellt daraus optimierte Bewerbungsunterlagen mit modernem Design.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={goDashboard}
              className="bg-orange-500 hover:bg-orange-400 transition px-8 py-5 rounded-2xl text-black font-black text-lg"
            >
              Kostenlos starten
            </button>

            <button
              onClick={() => scrollTo("preise")}
              className="border border-white/10 hover:border-orange-500/40 transition px-8 py-5 rounded-2xl text-lg"
            >
              Preise ansehen
            </button>
          </div>

          <p className="text-gray-500 text-sm mt-6">
            Keine Abos · Sofort nutzbar · PDF-Download inklusive
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[36px] p-6 shadow-2xl">
          <div className="bg-black/40 rounded-[28px] p-6">
            <div className="flex justify-between mb-6">
              <div>
                <p className="text-gray-400 text-sm">ATS-Score</p>
                <h3 className="text-5xl font-black text-orange-400">91%</h3>
              </div>
              <div className="bg-green-500/20 text-green-400 px-4 py-2 rounded-full h-fit">
                Optimiert
              </div>
            </div>

            <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-8">
              <div className="h-full w-[91%] bg-orange-500 rounded-full"></div>
            </div>

            <div className="space-y-4">
              {[
                "Stellenanzeige erkannt",
                "ATS-Keywords übernommen",
                "Anschreiben angepasst",
                "Lebenslauf strukturiert",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between"
                >
                  <span>{item}</span>
                  <span className="text-green-400">✓</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="funktion" className="px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-orange-400 font-semibold mb-3">
              So funktioniert’s
            </p>
            <h2 className="text-4xl md:text-6xl font-black">
              In 3 Schritten zur Bewerbung
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              ["1", "Daten eingeben", "Name, Kontakt, Zielposition und optional Bewerbungsfoto eintragen."],
              ["2", "Stellenanzeige einfügen", "Die KI erkennt Anforderungen, Keywords und passende Formulierungen."],
              ["3", "PDF herunterladen", "Lebenslauf, Anschreiben oder Bundle direkt als PDF speichern."],
            ].map((item) => (
              <div
                key={item[0]}
                className="bg-white/5 border border-white/10 rounded-[28px] p-8"
              >
                <div className="w-14 h-14 bg-orange-500 text-black rounded-2xl flex items-center justify-center text-2xl font-black mb-6">
                  {item[0]}
                </div>
                <h3 className="text-2xl font-black mb-4">{item[1]}</h3>
                <p className="text-gray-400 leading-relaxed">{item[2]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="px-6 py-24 bg-black/20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-orange-400 font-semibold mb-3">Live-Vorteil</p>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Nicht nur schreiben. Passend zur Stelle optimieren.
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              BewerberFuchs nutzt nicht nur deinen Lebenslauf, sondern auch die
              Stellenanzeige. Dadurch werden Anschreiben und Lebenslauf gezielter,
              relevanter und überzeugender.
            </p>

            <button
              onClick={goDashboard}
              className="bg-orange-500 hover:bg-orange-400 text-black font-black px-8 py-5 rounded-2xl"
            >
              Bewerbung erstellen
            </button>
          </div>

          <div className="bg-white text-black rounded-[32px] p-8">
            <div className="border-b-4 border-orange-500 pb-5 mb-6">
              <h3 className="text-3xl font-black">Bewerbung als Lagerarbeiter</h3>
              <p className="text-gray-500 mt-2">Automatisch angepasst</p>
            </div>

            <div className="space-y-4 text-gray-700">
              <p>✓ Erfahrung mit Lager und Versand hervorgehoben</p>
              <p>✓ SAP, Navision und Staplerschein erkannt</p>
              <p>✓ Formulierungen professionell verbessert</p>
              <p>✓ Anschreiben passend zur Firma erstellt</p>
            </div>
          </div>
        </div>
      </section>

      <section id="preise" className="px-6 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-orange-400 font-semibold mb-3">Preise</p>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              Einmal zahlen. Sofort Ergebnis erhalten.
            </h2>
            <p className="text-gray-400 text-lg">
              Keine Abos. Keine versteckten Kosten.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              ["Kostenlos", "0€", "ATS-Check & Analyse", "Gratis starten", goDashboard],
              ["Lebenslauf", "3€", "Optimierter Lebenslauf als PDF", "Optimieren", () => goCheckout("resume")],
              ["Anschreiben", "3€", "Passendes Anschreiben zur Stelle", "Erstellen", () => goCheckout("coverLetter")],
            ].map((item) => (
              <div
                key={item[0]}
                className="bg-white/5 border border-white/10 rounded-[28px] p-6"
              >
                <h3 className="text-2xl font-bold mb-3">{item[0]}</h3>
                <div className="text-5xl font-black mb-6">{item[1]}</div>
                <p className="text-gray-400 mb-6">{item[2]}</p>
                <button
                  onClick={item[4]}
                  className="w-full bg-orange-500 text-black py-4 rounded-2xl font-bold"
                >
                  {item[3]}
                </button>
              </div>
            ))}

            <div className="bg-orange-500 text-black rounded-[28px] p-6">
              <p className="bg-black text-white inline-block px-3 py-1 rounded-full text-xs font-bold mb-4">
                BELIEBT
              </p>
              <h3 className="text-2xl font-black mb-3">Bundle</h3>
              <div className="text-5xl font-black mb-6">5€</div>
              <p className="text-black/70 mb-6">
                Lebenslauf + Anschreiben als Paket
              </p>
              <button
                onClick={() => goCheckout("bundle")}
                className="w-full bg-black text-white py-4 rounded-2xl font-bold"
              >
                Bundle starten
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="px-6 py-24 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-orange-400 font-semibold mb-3">FAQ</p>
            <h2 className="text-4xl md:text-6xl font-black">
              Häufige Fragen
            </h2>
          </div>

          <div className="space-y-5">
            {[
              ["Ist die Analyse kostenlos?", "Ja. Der ATS-Check ist kostenlos. Du zahlst nur für fertige Unterlagen."],
              ["Brauche ich eine Datei?", "Nein. Du kannst auch nur persönliche Daten und eine Stellenanzeige eingeben."],
              ["Kann ich PDF herunterladen?", "Ja. Nach der Erstellung kannst du dein Ergebnis als PDF speichern."],
              ["Gibt es ein Abo?", "Nein. BewerberFuchs nutzt faire Einmalzahlungen."],
            ].map((item) => (
              <div
                key={item[0]}
                className="bg-white/5 border border-white/10 rounded-[24px] p-6"
              >
                <h3 className="text-xl font-bold mb-3">{item[0]}</h3>
                <p className="text-gray-400 leading-relaxed">{item[1]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 border-t border-white/10 pb-24 md:pb-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-6 text-gray-400 text-sm">
          <div>
            <p className="font-bold text-white mb-2">BewerberFuchs</p>
            <p>Mehr Vorstellungsgespräche durch bessere Bewerbungen.</p>
          </div>

          <div className="flex flex-wrap gap-6">
            <button onClick={() => goLegal("impressum")} className="hover:text-white">
              Impressum
            </button>
            <button onClick={() => goLegal("datenschutz")} className="hover:text-white">
              Datenschutz
            </button>
            <button onClick={() => goLegal("agb")} className="hover:text-white">
              AGB
            </button>
            <button onClick={() => goLegal("kontakt")} className="hover:text-white">
              Kontakt
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}