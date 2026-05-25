import Topbar from "./components/Topbar";

export default function Success({
  goDashboard,
  goOptimized,
  logout,
  isLoggedIn,
  selectedProduct,
}) {
  const productNames = {
    resume: "Lebenslauf Optimierung",
    coverLetter: "Anschreiben Erstellung",
    bundle: "Bewerbung Bundle",
  };

  const productName =
    productNames[selectedProduct] ||
    "Bewerbung Bundle";

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-hidden">

      <Topbar
  goHome={goDashboard}
  logout={logout}
  isLoggedIn={isLoggedIn}
/>

      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-150px] left-[-120px] w-[500px] h-[500px] rounded-full bg-orange-500/20 blur-[120px]" />

        <div className="absolute bottom-[-180px] right-[-100px] w-[450px] h-[450px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">

          <div
            className="
              relative
              bg-white/[0.04]
              backdrop-blur-2xl
              border
              border-white/10
              rounded-[42px]
              p-8
              md:p-16
              overflow-hidden
              shadow-[0_25px_80px_rgba(0,0,0,0.45)]
            "
          >

            {/* TOP GLOW */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[180px] bg-orange-500/20 blur-[90px]" />

            {/* SUCCESS ICON */}
            <div className="relative flex justify-center mb-10">

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full bg-green-500 blur-[70px] opacity-25" />
              </div>

              <div
                className="
                  relative
                  w-32
                  h-32
                  rounded-full
                  bg-gradient-to-br
                  from-green-400
                  to-green-600
                  border
                  border-white/20
                  flex
                  items-center
                  justify-center
                  text-4xl
                  shadow-[0_10px_50px_rgba(34,197,94,0.45)]
                "
              >
                ✓
              </div>
            </div>

            {/* HEADINGS */}
            <div className="text-center max-w-3xl mx-auto">

              <div
                className="
                  inline-flex
                  items-center
                  gap-5
                  bg-green-500/10
                  border
                  border-green-500/20
                  text-green-400
                  px-5
                  py-2.5
                  rounded-full
                  text-sm
                  font-black
                  uppercase
                  tracking-[0.22em]
                  mb-7
                "
              >
                Zahlung erfolgreich
              </div>

              <h1
                className="
                  text-[42px]
                  md:text-[68px]
                  leading-[0.92]
                  font-black
                  tracking-tight
                  mb-7
                "
              >
                {productName}
                <br />

                <span className="text-orange-500">
                  freigeschaltet
                </span>
              </h1>

              <p className="text-gray-300 text-lg md:text-2xl leading-relaxed mb-10">
                Deine Zahlung war erfolgreich.
                BewerberFuchs erstellt jetzt dein
                Premium-Ergebnis mit KI, ATS-Optimierung
                und deinem ausgewählten Design.
              </p>

              <div className="max-w-xl mx-auto mb-14">

                <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                  <span>ATS Optimierung läuft</span>
                  <span>91%</span>
                </div>

                <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full w-[91%] bg-gradient-to-r from-orange-500 to-orange-400 rounded-full animate-pulse"></div>
                </div>

              </div>

            </div>

            {/* FEATURES */}
            <div className="grid md:grid-cols-3 gap-6 mb-14">
              {[
                {
                  title: "KI Analyse",
                  text: "Dein Lebenslauf wird professionell analysiert und optimiert.",
                  icon: "🧠",
                },
                {
                  title: "ATS Optimierung",
                  text: "Wichtige Keywords werden automatisch integriert.",
                  icon: "⚡",
                },
                {
                  title: "Premium PDF",
                  text: "Dein modernes Premium-Design wird vorbereitet.",
                  icon: "📄",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="
                    bg-black/25
                    border
                    border-white/10
                    rounded-[30px]
                    p-7
                    backdrop-blur-xl
                    gap-5
                    transition
                  "
                >
                  <div className="text-5xl mb-5">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-black mb-3">
                    {item.title}
                  </h3>

                  <p className="text-gray-400 leading-7">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center">

              <button
                onClick={goOptimized}
                className="
                  bg-gradient-to-r
                  from-orange-500
                  to-orange-600
                  hover:scale-[1.02]
                  transition
                  text-black
                  font-black
                  px-12
                  py-5
                  rounded-2xl
                  text-lg
                  shadow-[0_10px_40px_rgba(255,115,0,0.35)]
                "
              >
                🚀 Premium Bewerbung generieren
              </button>

              <button
                onClick={goDashboard}
                className="
                  bg-white/[0.04]
                  hover:bg-white/[0.08]
                  border
                  border-white/10
                  px-12
                  py-5
                  rounded-2xl
                  font-bold
                  text-lg
                  transition
                "
              >
                ← Neues Dokument starten
              </button>
            </div>

            {/* STATS */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-orange-400 font-black text-2xl mb-1">
                  ATS
                </div>
                <p className="text-gray-400 text-sm">
                  Optimiert
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-orange-400 font-black text-2xl mb-1">
                  PDF
                </div>
                <p className="text-gray-400 text-sm">
                  Export
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-orange-400 font-black text-2xl mb-1">
                  KI
                </div>
                <p className="text-gray-400 text-sm">
                  Analyse
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="text-orange-400 font-black text-2xl mb-1">
                  91%
                </div>
                <p className="text-gray-400 text-sm">
                  ATS Score
                </p>
              </div>

            </div>

            {/* FOOTER */}
            <div className="mt-12 text-center">
              <p className="text-gray-500 text-sm">
                Bitte schließe diese Seite nicht,
                bis dein Ergebnis vollständig erstellt wurde.
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}