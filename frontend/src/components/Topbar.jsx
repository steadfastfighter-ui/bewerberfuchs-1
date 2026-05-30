export default function Topbar({
  goHome,
  logout,
  isLoggedIn,
  goLogin,
}) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <button
          onClick={goHome}
          className="flex items-center gap-3 min-w-0"
        >
          <img
            src="/favicon.png"
            alt="BewerberFuchs"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl object-cover shadow-lg shadow-orange-500/20"
          />

          <div className="leading-tight min-w-0">
            <div className="text-[20px] sm:text-[28px] font-black tracking-tight text-white truncate">
              Bewerber<span className="text-orange-500">Fuchs</span>
            </div>

            <div className="hidden sm:block text-[10px] tracking-[4px] text-gray-400 uppercase truncate">
              KI Bewerbungstool
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 shrink-0">
          {isLoggedIn && (
            <div className="hidden lg:flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-sm text-green-300">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              Eingeloggt
            </div>
          )}

          <button
            onClick={goHome}
            className="hidden md:flex items-center justify-center h-11 px-5 rounded-2xl bg-white/[0.05] border border-white/10 hover:border-orange-500/40 hover:bg-orange-500/10 transition-all text-white font-semibold"
          >
            Startseite
          </button>

          {!isLoggedIn && goLogin && (
            <button
              onClick={goLogin}
              className="h-11 px-5 rounded-2xl bg-orange-500 hover:bg-orange-400 transition-all text-black font-black shadow-lg shadow-orange-500/20"
            >
              Einloggen
            </button>
          )}

          {isLoggedIn && (
            <button
              onClick={logout}
              className="h-11 px-5 rounded-2xl bg-red-500/10 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all text-red-300 font-bold"
            >
              Abmelden
            </button>
          )}
        </div>
      </div>
    </header>
  );
}