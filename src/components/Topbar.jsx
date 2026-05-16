export default function Topbar({ goHome }) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/85 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        
        {/* LOGO */}
        <button
          onClick={goHome}
          className="flex items-center gap-3 min-w-0"
        >
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

        {/* BUTTON */}
        <button
          onClick={goHome}
          className="
            shrink-0
            bg-gradient-to-r
            from-orange-500
            to-orange-600
            hover:scale-105
            transition
            text-white
            font-bold
            px-4 sm:px-6
            py-2.5 sm:py-3
            rounded-2xl
            shadow-lg
            shadow-orange-500/20
            text-sm sm:text-base
          "
        >
          Startseite
        </button>
      </div>
    </header>
  );
}