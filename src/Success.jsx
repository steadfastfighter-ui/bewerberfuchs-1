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

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-[36px] p-10 text-center">
            <div className="text-7xl mb-6">✅</div>

            <p className="text-orange-400 font-semibold mb-3">
              Zahlung erfolgreich
            </p>

            <h1 className="text-5xl font-black mb-6">
              {productName} freigeschaltet
            </h1>

            <p className="text-gray-400 text-lg mb-10">
              Deine Premium-Optimierung ist bereit. Klicke unten, um dein Ergebnis zu erstellen.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={goOptimized}
                className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-4 rounded-2xl"
              >
                Ergebnis erstellen
              </button>

              <button
                onClick={goDashboard}
                className="border border-white/10 hover:border-orange-500/40 px-8 py-4 rounded-2xl font-bold"
              >
                Zur Startseite
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}