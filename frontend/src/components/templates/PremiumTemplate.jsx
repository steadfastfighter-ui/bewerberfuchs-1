import { parseResumeText, lines } from "./resumeParser";

export default function PremiumTemplate({
  optimizedText,
  candidateData,
  profilePhoto,
}) {
  const sections = parseResumeText(optimizedText);

  const clean = (value = "") => value.trim();

  const fullName = clean(candidateData?.fullName) || "Vorname Nachname";
  const jobTitle = clean(candidateData?.jobTitle) || "Berufsbezeichnung";

  const contactItems = [
    candidateData?.email,
    candidateData?.phone,
    candidateData?.address,
    candidateData?.linkedin,
  ].filter(Boolean);

  const cleanLine = (item = "") =>
    item.replace(/^[-•]\s*/, "").trim();

  const renderList = (text) =>
    lines(text).map((item, index) => (
      <div key={index} className="flex gap-3 text-[14px] leading-7 text-slate-700">
        <span className="mt-2 h-2 w-2 rounded-full bg-orange-500 flex-shrink-0" />
        <span>{cleanLine(item)}</span>
      </div>
    ));

  return (
    <div className="bg-slate-100 p-8 font-sans">
      <div className="mx-auto w-full max-w-[794px] min-h-[1123px] bg-white shadow-2xl overflow-hidden">
        <div className="grid grid-cols-[280px_1fr] min-h-[1123px]">
          
          <aside className="bg-slate-950 text-white p-8">
            <div className="text-center mb-10">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profil"
                  className="w-32 h-32 rounded-full object-cover mx-auto border-4 border-orange-500 mb-5"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/10 mx-auto border-4 border-orange-500 mb-5" />
              )}

              <h1 className="text-3xl font-black leading-tight">
                {fullName}
              </h1>

              <p className="mt-3 text-orange-400 text-xs font-black uppercase tracking-[0.22em]">
                {jobTitle}
              </p>
            </div>

            {contactItems.length > 0 && (
              <section className="mb-10">
                <h2 className="text-orange-400 text-xs font-black uppercase tracking-[0.25em] mb-4">
                  Kontakt
                </h2>

                <div className="space-y-3 text-sm text-slate-300 break-words">
                  {contactItems.map((item, index) => (
                    <div key={index} className="border-b border-white/10 pb-3">
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {sections.kenntnisse && (
              <section className="mb-10">
                <h2 className="text-orange-400 text-xs font-black uppercase tracking-[0.25em] mb-4">
                  Kenntnisse
                </h2>

                <div className="flex flex-wrap gap-2">
                  {lines(sections.kenntnisse).map((item, index) => (
                    <span
                      key={index}
                      className="bg-white/10 border border-white/10 rounded-full px-3 py-2 text-xs text-slate-200"
                    >
                      {cleanLine(item)}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {sections.sprachen && (
              <section>
                <h2 className="text-orange-400 text-xs font-black uppercase tracking-[0.25em] mb-4">
                  Sprachen
                </h2>

                <div className="space-y-3 text-sm text-slate-300">
                  {lines(sections.sprachen).map((item, index) => (
                    <div key={index}>{cleanLine(item)}</div>
                  ))}
                </div>
              </section>
            )}
          </aside>

          <main className="p-10 text-slate-900">
            {sections.profil && (
              <section className="mb-9">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-4 border-b-4 border-orange-500 pb-2">
                  Profil
                </h2>

                <p className="text-[15px] leading-8 text-slate-700 whitespace-pre-wrap">
                  {sections.profil}
                </p>
              </section>
            )}

            {sections.berufserfahrung && (
              <section className="mb-9">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-5 border-b-4 border-orange-500 pb-2">
                  Berufserfahrung
                </h2>

                <div className="space-y-4">
                  {renderList(sections.berufserfahrung)}
                </div>
              </section>
            )}

            {sections.ausbildung && (
              <section className="mb-9">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-5 border-b-4 border-orange-500 pb-2">
                  Ausbildung
                </h2>

                <div className="space-y-4">
                  {renderList(sections.ausbildung)}
                </div>
              </section>
            )}

            {sections.staerken && (
              <section className="mb-9">
                <h2 className="text-2xl font-black uppercase tracking-tight mb-5 border-b-4 border-orange-500 pb-2">
                  Stärken
                </h2>

                <div className="space-y-4">
                  {renderList(sections.staerken)}
                </div>
              </section>
            )}

            {!sections.profil &&
              !sections.berufserfahrung &&
              !sections.ausbildung && (
                <section>
                  <h2 className="text-2xl font-black uppercase tracking-tight mb-5 border-b-4 border-orange-500 pb-2">
                    Lebenslauf
                  </h2>

                  <p className="text-[15px] leading-8 text-slate-700 whitespace-pre-wrap">
                    {optimizedText}
                  </p>
                </section>
              )}
          </main>
        </div>
      </div>
    </div>
  );
}