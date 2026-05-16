export default function Topbar({ goHome }) {
  return (
    <div
      className="
        sticky
        top-0
        z-50
        backdrop-blur-2xl
        bg-[#060b14]/80
        border-b
        border-white/5
      "
    >
      <div className="max-w-[1500px] mx-auto px-6 lg:px-10 py-4 flex items-center justify-between">
        
        {/* LOGO */}
        <button
          onClick={goHome}
          className="flex items-center gap-4 group"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500 blur-xl opacity-40 rounded-3xl" />

            <div
              className="
                relative
                w-14
                h-14
                rounded-[22px]
                bg-gradient-to-br
                from-orange-400
                to-orange-600
                flex
                items-center
                justify-center
                text-black
                font-black
                text-2xl
                shadow-[0_10px_30px_rgba(255,115,0,0.35)]
              "
            >
              🦊
            </div>
          </div>

          <div className="text-left">
            <div
              className="
                font-black
                text-[24px]
                leading-none
                tracking-tight
                text-white
              "
            >
              Bewerber
              <span className="text-orange-500">
                Fuchs
              </span>
            </div>

            <div
              className="
                text-[11px]
                uppercase
                tracking-[0.28em]
                text-gray-400
                mt-1.5
              "
            >
              KI Bewerbung Optimierung
            </div>
          </div>
        </button>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">
          
          <div
            className="
              hidden
              md:flex
              items-center
              gap-2
              bg-white/[0.04]
              border
              border-white/10
              rounded-full
              px-4
              py-2
              text-sm
              text-gray-300
            "
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

            ATS KI aktiv
          </div>

          <button
            onClick={goHome}
            className="
              bg-white/[0.05]
              hover:bg-orange-500
              hover:text-black
              transition-all
              duration-300
              border
              border-white/10
              px-6
              py-3
              rounded-2xl
              font-bold
              text-white
              shadow-lg
            "
          >
            Startseite
          </button>
        </div>
      </div>
    </div>
  );
}