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

  const fullName = clean(candidateData?.fullName) || "Vorname Nachname";
  const jobTitle = clean(candidateData?.jobTitle) || "Berufsbezeichnung";

  const contactItems = [
    candidateData?.email,
    candidateData?.phone,
    candidateData?.address,
    candidateData?.linkedin,
  ].filter(Boolean);

  function cleanLine(item) {
    return item.replace("-", "").replace("•", "").trim();
  }

  return (
    <div className="bg-[#f3f4f6] min-h-[1200px] text-[#111827] font-sans">
      <div className="grid grid-cols-[300px_1fr] min-h-[1200px]">
        <aside className="bg-[#0f172a] text-white p-9">
          <div className="text-center">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profilbild"
                className="w-36 h-36 rounded-full object-cover border-4 border-orange-500 mx-auto mb-6 shadow-xl"
              />
            ) : (
              <div className="w-36 h-36 rounded-full bg-white/10 border-4 border-orange-500 mx-auto mb-6" />
            )}

            <h1 className="text-3xl font-black leading-tight">
              {fullName}
            </h1>

            <p className="text-orange-400 mt-3 text-sm font-bold uppercase tracking-wide">
              {jobTitle}
            </p>
          </div>

          <div className="mt-12">
            <h2 className="text-orange-400 font-black text-sm uppercase tracking-[0.2em] mb-5">
              Kontakt
            </h2>

            <div className="space-y-3 text-sm text-gray-300 break-words">
              {contactItems.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>

          {sections.kenntnisse && (
            <div className="mt-12">
              <h2 className="text-orange-400 font-black text-sm uppercase tracking-[0.2em] mb-5">
                Kenntnisse
              </h2>

              <div className="flex flex-wrap gap-2">
                {lines(sections.kenntnisse).map((item, index) => (
                  <span
                    key={index}
                    className="bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs text-gray-100"
                  >
                    {cleanLine(item)}
                  </span>
                ))}
              </div>
            </div>
          )}

          {sections.sprachen && (
            <div className="mt-12">
              <h2 className="text-orange-400 font-black text-sm uppercase tracking-[0.2em] mb-5">
                Sprachen
              </h2>

              <div className="space-y-3 text-sm text-gray-300">
                {lines(sections.sprachen).map((item, index) => (
                  <div key={index} className="flex gap-2">
                    <span className="text-orange-400">•</span>
                    <span>{cleanLine(item)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="p-12">
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-200">
            {sections.profil && (
              <section className="mb-10">
                <p className="text-orange-500 font-black text-sm uppercase tracking-[0.25em] mb-3">
                  Profil
                </p>
                <p className="text-gray-700 leading-8 text-[15px] whitespace-pre-wrap">
                  {sections.profil}
                </p>
              </section>
            )}

            {sections.berufserfahrung && (
              <section className="mb-10">
                <p className="text-orange-500 font-black text-sm uppercase tracking-[0.25em] mb-5">
                  Berufserfahrung
                </p>

                <div className="space-y-4">
                  {lines(sections.berufserfahrung).map((item, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-orange-500 bg-[#f9fafb] rounded-r-2xl px-5 py-4"
                    >
                      <p className="text-gray-700 leading-7 text-[15px]">
                        {cleanLine(item)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sections.ausbildung && (
              <section className="mb-10">
                <p className="text-orange-500 font-black text-sm uppercase tracking-[0.25em] mb-5">
                  Ausbildung
                </p>

                <div className="space-y-4">
                  {lines(sections.ausbildung).map((item, index) => (
                    <div
                      key={index}
                      className="bg-[#f9fafb] border border-gray-100 rounded-2xl px-5 py-4"
                    >
                      <p className="text-gray-700 leading-7 text-[15px]">
                        {cleanLine(item)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {!sections.profil &&
              !sections.berufserfahrung &&
              !sections.ausbildung && (
                <p className="whitespace-pre-wrap leading-8 text-gray-700">
                  {optimizedText}
                </p>
              )}
          </div>
        </main>
      </div>
    </div>
  );
}