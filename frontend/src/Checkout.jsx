import { useState } from "react";
import Topbar from "./components/Topbar";

const API_URL = "https://bewerberfuchs-1.onrender.com";

export default function Checkout({ goDashboard, selectedProduct }) {
  const [loading, setLoading] = useState(false);

const products = {
  resume: {
    title: "Starter Paket",
    price: "4,99€",
    description: "ATS optimierter Lebenslauf",
    features: [
      "ATS-freundliche Struktur",
      "Bessere Formulierungen",
      "Recruiter Keywords",
      "PDF Download",
    ],
    button: "Starter freischalten",
  },

  coverLetter: {
    title: "Anschreiben Pro",
    price: "4,99€",
    description: "Professionelles KI-Anschreiben",
    features: [
      "Professionelles Anschreiben",
      "ATS Keywords integriert",
      "Sofort generiert",
      "Copy & PDF Export",
    ],
    button: "Anschreiben erstellen",
  },

  bundle: {
    title: "Pro Bundle",
    price: "7,99€",
    description: "Lebenslauf + Anschreiben",
    features: [
      "ATS Lebenslauf",
      "KI Anschreiben",
      "Premium Keywords",
      "Recruiter Optimierung",
      "PDF Export",
    ],
    button: "Bundle freischalten",
  },
};

  const current = products[selectedProduct] || products.bundle;

  async function startCheckout() {
    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          product: selectedProduct || "bundle",
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
        return;
      }

      setLoading(false);
      alert("Stripe Checkout konnte nicht gestartet werden.");
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Fehler beim Starten der Zahlung.");
    }
  }

 return (
  <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
    <Topbar goHome={goDashboard} />

    <section className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-14">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,115,0,0.18),transparent_30%),radial-gradient(circle_at_left,rgba(0,90,255,0.08),transparent_25%)]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        
        {/* BACK BUTTON */}
        <button
          onClick={goDashboard}
          className="mb-8 text-gray-400 hover:text-white transition text-sm sm:text-base"
        >
          ← Zurück zum Dashboard
        </button>

        {/* HEADER */}
        <div className="mb-10 sm:mb-16">
          <p className="text-orange-400 font-bold uppercase tracking-wide text-sm mb-3">
            BewerberFuchs Checkout
          </p>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[0.95] mb-5">
            {current.title}
          </h1>

          <p className="text-gray-400 text-base sm:text-lg max-w-2xl leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* GRID */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-10 items-start">
          
          {/* FEATURES */}
          <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl sm:rounded-[32px] p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-black mb-6">
              Enthalten
            </h2>
             <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-5">
  <div className="flex justify-between mb-2">
    <span className="text-gray-400">ATS Verbesserung</span>
    <span className="text-orange-500 font-bold">48% → 91%</span>
  </div>

  <div className="h-4 rounded-full bg-white/10 overflow-hidden">
    <div className="h-full w-[91%] bg-orange-500 rounded-full"></div>
  </div>

  <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-400">
    <div>✓ ATS Keywords</div>
    <div>✓ Recruiter optimiert</div>
    <div>✓ Moderne Struktur</div>
    <div>✓ PDF Export</div>
  </div>
</div>
            <div className="space-y-4">
              {current.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-3 text-gray-300 text-sm sm:text-base"
                >
                  <div className="w-7 h-7 rounded-full bg-orange-500/15 border border-orange-500/30 flex items-center justify-center text-orange-400 text-sm">
                    ✓
                  </div>

                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* PAYMENT CARD */}
          <div className="relative overflow-hidden rounded-3xl sm:rounded-[32px] bg-gradient-to-b from-orange-500 to-orange-600 p-[1px] shadow-[0_0_40px_rgba(255,115,0,0.25)]">
            
            <div className="rounded-3xl sm:rounded-[32px] bg-[#111827] p-6 sm:p-8 h-full">
              
              <div className="absolute top-0 right-0 w-56 h-56 bg-orange-500/20 blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <p className="text-orange-300 font-semibold mb-3 text-sm uppercase tracking-wide">
                  Einmalzahlung
                </p>

                <div className="text-[90px] sm:text-[110px] leading-none font-black mb-8">
                  {current.price}
                </div>

                <button
                 className="
                   w-full
                   py-5
                   rounded-2xl
                   bg-orange-500
                   hover:bg-orange-400
                   hover:scale-[1.01]
                    active:scale-[0.99]
                   transition-all
                    duration-300
                    text-white
                   text-xl sm:text-2xl
                   font-extrabold
                   shadow-[0_0_40px_rgba(255,120,0,0.35)]
                   disabled:opacity-60
                 "
                >
                  {loading
                    ? "Stripe wird geöffnet..."
                    : current.button}
                </button>

                <div className="mt-6 space-y-2 text-sm text-gray-400">
                  <div>✓ Keine Abos</div>
                  <div>✓ Sichere Stripe Zahlung</div>
                  <div>✓ Sofortiger Zugriff</div>
                  <div>✓ PDF Download inklusive</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRUST SECTION */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-orange-400 text-3xl font-black mb-2">
              4.9★
            </div>
            <p className="text-gray-400 text-sm">
              Zufriedene Nutzer
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-orange-400 text-3xl font-black mb-2">
              92%
            </div>
            <p className="text-gray-400 text-sm">
              ATS Erfolgsquote
            </p>
          </div>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-orange-400 text-3xl font-black mb-2">
              PDF
            </div>
            <p className="text-gray-400 text-sm">
              Sofort Downloadbar
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
);
}