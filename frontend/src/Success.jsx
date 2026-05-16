import Topbar from "./components/Topbar";

export default function Success({ goDashboard, goOptimized, selectedProduct }) {
  const productNames = {
    resume: "Lebenslauf Optimierung",
    coverLetter: "Anschreiben Erstellung",
    bundle: "Bewerbung Bundle",
  };

  const productName = productNames[selectedProduct] || "Bewerbung Bundle";

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Topbar goHome={goDashboard} />

      <div className="p-6 bg-[radial-gradient(circle_at_top,rgba(255,122,0,0.1),transparent_35%)]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-[36px] p-10 md:p-14 text-center shadow-2xl shadow-black/40">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 border border-green-500/30 text-5xl mb-8">
              ✅
            </div>

            <p className="text-orange-400 font-semibold mb-3">
              Zahlung erfolgreich
            </p>

            <h1 className="text-5xl md:text-6xl font-black mb-6">
              {productName} freigeschaltet
            </h1>

            <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
              Deine Zahlung war erfolgreich. BewerberFuchs erstellt jetzt dein Premium-Ergebnis mit KI und deinem ausgewählten Design.
            </p>

            <div className="grid md:grid-cols-3 gap-4 mb-10">
              {[
                "KI optimiert deinen Text",
                "ATS-Keywords werden übernommen",
                "PDF-Download wird vorbereitet",
              ].map((item) => (
                <div
                  key={item}
                  className="bg-black/30 border border-white/10 rounded-2xl p-5 text-sm text-gray-300"
                >
                  ✅ {item}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goOptimized}
                className="bg-orange-500 hover:bg-orange-400 text-black font-black px-10 py-5 rounded-2xl text-lg"
              >
                Jetzt Ergebnis erstellen
              </button>

              <button
                onClick={goDashboard}
                className="border border-white/10 hover:border-orange-500/40 px-10 py-5 rounded-2xl font-bold"
              >
                Zur Startseite
              </button>
            </div>

            <p className="text-gray-500 text-sm mt-8">
              Tipp: Bitte schließe diese Seite nicht, bis dein Ergebnis erstellt wurde.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}