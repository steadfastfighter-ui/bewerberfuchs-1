export default function Topbar({ goHome, logout, isLoggedIn }) {
  return (
    <div className="sticky top-0 z-50 backdrop-blur-2xl bg-[#060b14]/80 border-b border-white/5">
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        <button onClick={goHome} className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-[22px] bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-black font-black text-2xl">
            🦊
          </div>

          <div className="text-left">
            <div className="font-black text-[24px] leading-none text-white">
              Bewerber<span className="text-orange-500">Fuchs</span>
            </div>
            <div className="text-[11px] uppercase tracking-[0.28em] text-gray-400 mt-1.5">
              KI Bewerbung Optimierung
            </div>
          </div>
        </button>

        <div className="flex items-center gap-3">
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm text-green-300">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Eingeloggt
            </div>
          )}

          <button
            onClick={goHome}
            className="bg-white/[0.05] hover:bg-orange-500 hover:text-black transition-all border border-white/10 px-5 py-3 rounded-2xl font-bold text-white"
          >
            Startseite
          </button>

          {isLoggedIn && (
            <button
              onClick={logout}
              className="bg-red-500/10 hover:bg-red-500 hover:text-white transition-all border border-red-500/20 px-5 py-3 rounded-2xl font-bold text-red-300"
            >
              Abmelden
            </button>
          )}
        </div>
      </div>
    </div>
  );
}