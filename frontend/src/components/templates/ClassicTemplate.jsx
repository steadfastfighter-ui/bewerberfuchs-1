import { parseResumeText, lines } from "./resumeParser";

export default function ClassicTemplate({
  optimizedText,
  candidateData,
  profilePhoto,
}) {
  const sections = parseResumeText(optimizedText);

  function formatName(value = "") {
    return value
      .trim()
      .split(" ")
      .filter(Boolean)
      .map(
        (word) =>
          word.charAt(0).toUpperCase() +
          word.slice(1).toLowerCase()
      )
      .join(" ");
  }

  function formatText(value = "") {
    const cleaned = value.trim();

    if (!cleaned) return "";

    return (
      cleaned.charAt(0).toUpperCase() +
      cleaned.slice(1)
    );
  }

  const fullName = formatName(
    candidateData?.fullName || ""
  );

  const jobTitle = formatText(
    candidateData?.jobTitle || ""
  );

  const address = formatText(
    candidateData?.address || ""
  );

  return (
    <div className="bg-white text-[#111827] min-h-[1120px] p-16 shadow-2xl">
      
      {/* HEADER */}
      <header className="relative border-b-[5px] border-orange-500 pb-10 mb-12 flex justify-between gap-10 items-start">
        
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-600 px-4 py-2 rounded-full text-xs font-bold tracking-wide uppercase mb-5">
            ATS Optimierter Lebenslauf
          </div>

          <h1 className="text-[58px] leading-[0.9] font-black tracking-tight mb-4 text-[#0f172a]">
            {fullName || "Vorname Nachname"}
          </h1>

          <p className="text-[24px] font-semibold text-orange-500 mb-7">
            {jobTitle || "Berufsbezeichnung"}
          </p>

          <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-[15px] text-gray-600">
            {candidateData?.email && (
              <p>✉ {candidateData.email}</p>
            )}

            {candidateData?.phone && (
              <p>☎ {candidateData.phone}</p>
            )}

            {address && (
              <p>📍 {address}</p>
            )}

            {candidateData?.linkedin && (
              <p>{candidateData.linkedin}</p>
            )}
          </div>
        </div>

        {profilePhoto && (
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-[30px] bg-orange-500 blur-2xl opacity-20" />

            <img
              src={profilePhoto}
              alt="Profilbild"
              className="
                relative
                w-44
                h-44
                rounded-[30px]
                object-cover
                border-[6px]
                border-orange-500
                shadow-[0_10px_40px_rgba(255,115,0,0.25)]
              "
            />
          </div>
        )}
      </header>

      {/* PROFIL */}
      {sections.profil && (
        <section className="mb-12">
          <h2 className="text-[28px] font-black uppercase tracking-wide mb-5 text-[#0f172a]">
            Profil
          </h2>

          <div className="bg-orange-50 border border-orange-100 rounded-[28px] p-7">
            <p className="leading-9 text-[17px] text-gray-700 whitespace-pre-wrap">
              {sections.profil}
            </p>
          </div>
        </section>
      )}

      {/* BERUFSERFAHRUNG */}
      {sections.berufserfahrung && (
        <section className="mb-14">
          <h2 className="text-[28px] font-black uppercase tracking-wide mb-7 text-[#0f172a]">
            Berufserfahrung
          </h2>

          <div className="space-y-6">
            {lines(sections.berufserfahrung).map(
              (item, index) => (
                <div
                  key={index}
                  className="
                    relative
                    border-l-[5px]
                    border-orange-500
                    pl-7
                    py-1
                  "
                >
                  <div className="absolute -left-[11px] top-2 w-4 h-4 rounded-full bg-orange-500" />

                  <p className="leading-8 text-[16px] text-gray-700">
                    {item}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}

      {/* GRID */}
      <div className="grid grid-cols-2 gap-12">
        
        {/* KENNTNISSE */}
        {sections.kenntnisse && (
          <section>
            <h2 className="text-[28px] font-black uppercase tracking-wide mb-6 text-[#0f172a]">
              Kenntnisse
            </h2>

            <div className="flex flex-wrap gap-3">
              {lines(sections.kenntnisse).map(
                (item, index) => (
                  <div
                    key={index}
                    className="
                      bg-orange-50
                      border
                      border-orange-200
                      text-orange-700
                      px-4
                      py-2
                      rounded-full
                      text-sm
                      font-semibold
                    "
                  >
                    {item.replace("-", "").trim()}
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {/* SPRACHEN */}
        {sections.sprachen && (
          <section>
            <h2 className="text-[28px] font-black uppercase tracking-wide mb-6 text-[#0f172a]">
              Sprachen
            </h2>

            <div className="space-y-3">
              {lines(sections.sprachen).map(
                (item, index) => (
                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      justify-between
                      border
                      border-gray-200
                      rounded-2xl
                      px-5
                      py-4
                    "
                  >
                    <span className="font-medium text-gray-700">
                      {item.replace("-", "").trim()}
                    </span>

                    <div className="w-24 h-2 rounded-full bg-orange-100 overflow-hidden">
                      <div className="w-[85%] h-full bg-orange-500 rounded-full" />
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}
      </div>

      {/* AUSBILDUNG */}
      {sections.ausbildung && (
        <section className="mt-14">
          <h2 className="text-[28px] font-black uppercase tracking-wide mb-7 text-[#0f172a]">
            Ausbildung
          </h2>

          <div className="space-y-5">
            {lines(sections.ausbildung).map(
              (item, index) => (
                <div
                  key={index}
                  className="
                    border
                    border-gray-200
                    rounded-[24px]
                    p-6
                  "
                >
                  <p className="text-gray-700 leading-8 text-[16px]">
                    {item}
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      )}
    </div>
  );
}