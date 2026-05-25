export default function Topbar({
  goHome,
  logout,
  isLoggedIn,
  goLogin,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <button onClick={goHome} className="flex items-center gap-3 min-w-0">
          <img
            src="/favicon.png"
            alt="BewerberFuchs"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-lg shadow-orange-500/20"
          />

          <div className="leading-tight min-w-0">
            <div className="text-[22px] sm:text-[28px] font-black tracking-tight text-white truncate">
              Bewerber<span className="text-orange-500">Fuchs</span>
            </div>

            <div className="hidden sm:block text-[11px] tracking-[5px] text-gray-400 uppercase">
              KI Bewerbungstool
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm text-green-300">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Eingeloggt
            </div>
          )}

          <button
            onClick={goHome}
            className="shrink-0 bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105 transition text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-lg shadow-orange-500/20 text-sm sm:text-base"
          >
            Startseite
          </button>

          {!isLoggedIn && goLogin && (
            <button
              onClick={goLogin}
              className="shrink-0 bg-white/[0.06] border border-white/10 hover:bg-white/[0.12] transition text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base"
            >
              Einloggen
            </button>
          )}

          {isLoggedIn && (
            <button
              onClick={logout}
              className="shrink-0 bg-red-500/10 border border-red-500/20 hover:bg-red-500 transition text-red-300 hover:text-white font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-sm sm:text-base"
            >
              Abmelden
            </button>
          )}
        </div>
      </div>
    </header>
  );
}