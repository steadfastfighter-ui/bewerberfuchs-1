export default function Topbar({ goHome }) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0f19]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={goHome}
          className="flex items-center gap-3 group"
        >
          <div className="w-11 h-11 rounded-2xl bg-orange-500 flex items-center justify-center text-black font-black text-xl">
            🦊
          </div>

          <div>
            <div className="font-black text-xl text-white">
              BewerberFuchs
            </div>

            <div className="text-xs text-gray-400">
              KI Bewerbung Optimierung
            </div>
          </div>
        </button>

        <button
          onClick={goHome}
          className="bg-white/5 hover:bg-orange-500 hover:text-black transition border border-white/10 px-5 py-3 rounded-2xl font-bold"
        >
          Startseite
        </button>
      </div>
    </div>
  );
}
