import { parseResumeText, lines } from "./resumeParser";

export default function PremiumTemplate({
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
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  function formatText(value = "") {
    const cleaned = value.trim();
    if (!cleaned) return "";
    return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  const fullName = formatName(candidateData?.fullName || "");
  const jobTitle = formatText(candidateData?.jobTitle || "");
  const address = formatText(candidateData?.address || "");

  return (
    <div className="bg-[#f8fafc] min-h-[1200px] text-[#111827]">
      <div className="grid grid-cols-[320px_1fr]">
        <aside className="bg-[#111827] text-white p-10">
          <div className="flex flex-col items-center text-center">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profilbild"
                className="w-40 h-40 rounded-full object-cover border-4 border-orange-500 shadow-2xl mb-6"
              />
            ) : (
              <div className="w-40 h-40 rounded-full bg-white/10 border-4 border-orange-500 mb-6" />
            )}

            <h1 className="text-3xl font-black">
              {fullName || "Vorname Nachname"}
            </h1>

            <p className="text-orange-400 mt-3 text-sm font-semibold">
              {jobTitle || "Berufsbezeichnung"}
            </p>
          </div>

          <div className="mt-14">
            <h2 className="text-orange-400 font-black text-lg mb-5">
              Kontakt
            </h2>

            <div className="space-y-3 text-sm text-gray-300">
              {candidateData?.email && <p>{candidateData.email}</p>}
              {candidateData?.phone && <p>{candidateData.phone}</p>}
              {address && <p>{address}</p>}
              {candidateData?.linkedin && <p>{candidateData.linkedin}</p>}
            </div>
          </div>

          {sections.sprachen && (
            <div className="mt-14">
              <h2 className="text-orange-400 font-black text-lg mb-5">
                Sprachen
              </h2>

              <div className="space-y-3 text-sm text-gray-300">
                {lines(sections.sprachen).map((item, index) => (
                  <div key={index}>• {item.replace("-", "").trim()}</div>
                ))}
              </div>
            </div>
          )}

          {sections.kenntnisse && (
            <div className="mt-14">
              <h2 className="text-orange-400 font-black text-lg mb-5">
                Kenntnisse
              </h2>

              <div className="flex flex-wrap gap-2">
                {lines(sections.kenntnisse).map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-xs"
                  >
                    {item.replace("-", "").trim()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main className="p-14">
          {sections.profil && (
            <section className="mb-14">
              <h2 className="text-2xl font-black mb-5 border-b-4 border-orange-500 inline-block pb-2">
                Profil
              </h2>

              <p className="text-gray-700 leading-8 whitespace-pre-wrap">
                {sections.profil}
              </p>
            </section>
          )}

          {sections.berufserfahrung && (
            <section className="mb-14">
              <h2 className="text-2xl font-black mb-6 border-b-4 border-orange-500 inline-block pb-2">
                Berufserfahrung
              </h2>

              <div className="space-y-6">
                {lines(sections.berufserfahrung).map((item, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
                  >
                    <p className="leading-7 text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sections.ausbildung && (
            <section>
              <h2 className="text-2xl font-black mb-6 border-b-4 border-orange-500 inline-block pb-2">
                Ausbildung
              </h2>

              <div className="space-y-5">
                {lines(sections.ausbildung).map((item, index) => (
                  <div
                    key={index}
                    className="border-l-4 border-orange-500 pl-5 py-1"
                  >
                    <p className="text-gray-700 leading-7">{item}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
