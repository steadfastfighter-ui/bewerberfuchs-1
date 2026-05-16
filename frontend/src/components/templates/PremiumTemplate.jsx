import { parseResumeText, lines } from "./resumeParser";

export default function PremiumTemplate({
  optimizedText,
  candidateData,
  profilePhoto,
}) {
  const sections = parseResumeText(optimizedText);

  function clean(value = "") {
    return value.trim();
  }

  const fullName =
    clean(candidateData?.fullName) ||
    "Vorname Nachname";

  const jobTitle =
    clean(candidateData?.jobTitle) ||
    "Berufsbezeichnung";

  const contactItems = [
    candidateData?.email,
    candidateData?.phone,
    candidateData?.address,
    candidateData?.linkedin,
  ].filter(Boolean);

  function cleanLine(item) {
    return item
      .replace("-", "")
      .replace("•", "")
      .trim();
  }

  return (
    <div className="bg-[#eef2ff] min-h-[1200px] p-10 font-sans">
      
      <div
        className="
          grid
          grid-cols-[340px_1fr]
          min-h-[1200px]
          bg-white
          rounded-[42px]
          overflow-hidden
          shadow-[0_25px_80px_rgba(15,23,42,0.15)]
          border
          border-gray-200
        "
      >
        
        {/* SIDEBAR */}
        <aside
          className="
            relative
            bg-[#0f172a]
            text-white
            px-10
            py-12
            overflow-hidden
          "
        >
          {/* GLOW */}
          <div className="absolute top-0 right-0 w-[260px] h-[260px] bg-orange-500/20 rounded-full blur-3xl" />

          {/* PROFILE */}
          <div className="relative text-center">
            {profilePhoto ? (
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-orange-500 blur-2xl opacity-30" />

                <img
                  src={profilePhoto}
                  alt="Profilbild"
                  className="
                    relative
                    w-44
                    h-44
                    rounded-full
                    object-cover
                    border-[6px]
                    border-orange-500
                    shadow-[0_10px_40px_rgba(255,115,0,0.35)]
                    mx-auto
                    mb-7
                  "
                />
              </div>
            ) : (
              <div
                className="
                  w-44
                  h-44
                  rounded-full
                  bg-white/10
                  border-[6px]
                  border-orange-500
                  mx-auto
                  mb-7
                "
              />
            )}

            <h1 className="text-[40px] font-black leading-[0.95] tracking-tight">
              {fullName}
            </h1>

            <p
              className="
                text-orange-400
                mt-4
                text-sm
                font-black
                uppercase
                tracking-[0.22em]
              "
            >
              {jobTitle}
            </p>
          </div>

          {/* CONTACT */}
          <div className="mt-14">
            <h2
              className="
                text-orange-400
                font-black
                text-xs
                uppercase
                tracking-[0.3em]
                mb-6
              "
            >
              Kontakt
            </h2>

            <div className="space-y-4">
              {contactItems.map((item, index) => (
                <div
                  key={index}
                  className="
                    bg-white/5
                    border
                    border-white/10
                    rounded-2xl
                    px-5
                    py-4
                    text-[14px]
                    text-gray-200
                    break-words
                  "
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* KENNTNISSE */}
          {sections.kenntnisse && (
            <div className="mt-14">
              <h2
                className="
                  text-orange-400
                  font-black
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  mb-6
                "
              >
                Kenntnisse
              </h2>

              <div className="flex flex-wrap gap-3">
                {lines(sections.kenntnisse).map(
                  (item, index) => (
                    <span
                      key={index}
                      className="
                        bg-white/10
                        border
                        border-white/10
                        px-4
                        py-2.5
                        rounded-full
                        text-xs
                        font-semibold
                        text-gray-100
                      "
                    >
                      {cleanLine(item)}
                    </span>
                  )
                )}
              </div>
            </div>
          )}

          {/* SPRACHEN */}
          {sections.sprachen && (
            <div className="mt-14">
              <h2
                className="
                  text-orange-400
                  font-black
                  text-xs
                  uppercase
                  tracking-[0.3em]
                  mb-6
                "
              >
                Sprachen
              </h2>

              <div className="space-y-5">
                {lines(sections.sprachen).map(
                  (item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-2 text-sm">
                        <span className="text-gray-200">
                          {cleanLine(item)}
                        </span>

                        <span className="text-orange-400 font-semibold">
                          85%
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="w-[85%] h-full bg-orange-500 rounded-full" />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </aside>

        {/* MAIN */}
        <main className="p-14">
          <div className="space-y-12">
            
            {/* PROFIL */}
            {sections.profil && (
              <section>
                <div className="flex items-center gap-5 mb-6">
                  <div className="w-14 h-[5px] rounded-full bg-orange-500" />

                  <h2
                    className="
                      text-[30px]
                      font-black
                      uppercase
                      tracking-wide
                      text-[#0f172a]
                    "
                  >
                    Profil
                  </h2>
                </div>

                <div
                  className="
                    bg-orange-50
                    border
                    border-orange-100
                    rounded-[32px]
                    p-8
                  "
                >
                  <p
                    className="
                      text-gray-700
                      leading-9
                      text-[17px]
                      whitespace-pre-wrap
                    "
                  >
                    {sections.profil}
                  </p>
                </div>
              </section>
            )}

            {/* BERUFSERFAHRUNG */}
            {sections.berufserfahrung && (
              <section>
                <div className="flex items-center gap-5 mb-7">
                  <div className="w-14 h-[5px] rounded-full bg-orange-500" />

                  <h2
                    className="
                      text-[30px]
                      font-black
                      uppercase
                      tracking-wide
                      text-[#0f172a]
                    "
                  >
                    Berufserfahrung
                  </h2>
                </div>

                <div className="space-y-6">
                  {lines(
                    sections.berufserfahrung
                  ).map((item, index) => (
                    <div
                      key={index}
                      className="
                        relative
                        border-l-[5px]
                        border-orange-500
                        bg-[#f8fafc]
                        rounded-r-[28px]
                        px-7
                        py-6
                      "
                    >
                      <div className="absolute -left-[11px] top-7 w-4 h-4 rounded-full bg-orange-500" />

                      <p
                        className="
                          text-gray-700
                          leading-8
                          text-[16px]
                        "
                      >
                        {cleanLine(item)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* AUSBILDUNG */}
            {sections.ausbildung && (
              <section>
                <div className="flex items-center gap-5 mb-7">
                  <div className="w-14 h-[5px] rounded-full bg-orange-500" />

                  <h2
                    className="
                      text-[30px]
                      font-black
                      uppercase
                      tracking-wide
                      text-[#0f172a]
                    "
                  >
                    Ausbildung
                  </h2>
                </div>

                <div className="space-y-5">
                  {lines(sections.ausbildung).map(
                    (item, index) => (
                      <div
                        key={index}
                        className="
                          bg-[#f8fafc]
                          border
                          border-gray-200
                          rounded-[28px]
                          px-7
                          py-6
                        "
                      >
                        <p
                          className="
                            text-gray-700
                            leading-8
                            text-[16px]
                          "
                        >
                          {cleanLine(item)}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

            {!sections.profil &&
              !sections.berufserfahrung &&
              !sections.ausbildung && (
                <div
                  className="
                    bg-[#f8fafc]
                    border
                    border-gray-200
                    rounded-[32px]
                    p-8
                  "
                >
                  <p className="whitespace-pre-wrap leading-9 text-gray-700 text-[17px]">
                    {optimizedText}
                  </p>
                </div>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}