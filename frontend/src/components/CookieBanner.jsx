import { useEffect, useState } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieAccepted");

    if (!accepted) {
      setVisible(true);
    }
  }, []);

  function acceptCookies() {
    localStorage.setItem("cookieAccepted", "true");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[999] w-[95%] max-w-3xl">
      <div className="bg-[#111827] border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-5 md:items-center md:justify-between">
          <div>
            <h3 className="font-black text-lg mb-2">
              🍪 Datenschutz & Cookies
            </h3>

            <p className="text-gray-400 text-sm leading-relaxed">
              BewerberFuchs verwendet technische Cookies und LocalStorage,
              um die Website korrekt bereitzustellen und Bewerbungsdaten
              zwischenzuspeichern.
            </p>
          </div>

          <button
            onClick={acceptCookies}
            className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-6 py-3 rounded-2xl whitespace-nowrap"
          >
            Verstanden
          </button>
        </div>
      </div>
    </div>
  );
}