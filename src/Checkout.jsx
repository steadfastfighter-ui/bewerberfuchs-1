import { useState } from "react";
import Topbar from "./components/Topbar";

const API_URL = "https://bewerberfuchs-1.onrender.com";

export default function Checkout({ goDashboard, selectedProduct }) {
  const [loading, setLoading] = useState(false);

  const isAdmin =
    new URLSearchParams(window.location.search).get("admin") === "true";

  const products = {
    resume: {
      title: "Lebenslauf Optimierung",
      price: "3€",
      description: "ATS optimierter Lebenslauf",
      features: [
        "ATS-freundliche Struktur",
        "Bessere Formulierungen",
        "Recruiter Keywords",
        "PDF Download",
      ],
      button: "Für 3€ freischalten",
    },
    coverLetter: {
      title: "Anschreiben Erstellung",
      price: "3€",
      description: "Professionelles KI-Anschreiben",
      features: [
        "Professionelles Anschreiben",
        "ATS Keywords integriert",
        "Sofort generiert",
        "Copy & PDF Export",
      ],
      button: "Für 3€ erstellen",
    },
    bundle: {
      title: "Bewerbung Bundle",
      price: "5€",
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
    if (isAdmin) {
      window.location.href = `/?success=true&product=${
        selectedProduct || "bundle"
      }&admin=true`;
      return;
    }

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
      } else {
        setLoading(false);
        alert("Stripe Checkout konnte nicht gestartet werden.");
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert("Fehler beim Starten der Zahlung.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Topbar goHome={goDashboard} />

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <button
            onClick={goDashboard}
            className="mb-8 text-gray-400 hover:text-white"
          >
            ← Zurück zum Dashboard
          </button>

          {isAdmin && (
            <div className="mb-8 bg-green-500/10 border border-green-500/30 text-green-300 rounded-2xl p-5 font-bold">
              Admin-Testmodus aktiv · Zahlung wird übersprungen
            </div>
          )}

          <div className="mb-12">
            <p className="text-orange-400 font-semibold mb-3">
              BewerberFuchs Checkout
            </p>

            <h1 className="text-5xl md:text-6xl font-black mb-6">
              {current.title}
            </h1>

            <p className="text-gray-400 text-lg">{current.description}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h2 className="text-3xl font-black mb-6">Enthalten</h2>

              <div className="space-y-4 text-gray-300">
                {current.features.map((feature) => (
                  <div key={feature}>✅ {feature}</div>
                ))}
              </div>
            </div>

            <div className="bg-orange-500 text-black rounded-[32px] p-8">
              <p className="font-semibold mb-3">
                {isAdmin ? "Admin-Test" : "Einmalzahlung"}
              </p>

              <div className="text-7xl font-black mb-8">
                {isAdmin ? "0€" : current.price}
              </div>

              <button
                onClick={startCheckout}
                disabled={loading}
                className="w-full bg-black text-white font-bold py-5 rounded-2xl hover:bg-neutral-900 transition text-lg disabled:opacity-60"
              >
                {loading
                  ? "Stripe wird geöffnet..."
                  : isAdmin
                  ? "Kostenlos testen"
                  : current.button}
              </button>

              <p className="text-black/70 text-sm mt-5">
                {isAdmin
                  ? "Nur für lokale Tests"
                  : "Keine Abos · Sichere Zahlung über Stripe · Sofortiger Zugriff"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}