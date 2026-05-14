import { parseResumeText, lines } from "./resumeParser";

export default function ModernTemplate({
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
    <div className="min-h-[1120px] bg-white grid grid-cols-[320px_1fr]">
      <aside className="bg-orange-500 text-white p-10">
        <div className="flex flex-col items-center text-center">
          {profilePhoto ? (
            <img
              src={profilePhoto}
              alt="Profilbild"
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-xl"
            />
          ) : (
            <div className="w-40 h-40 rounded-full bg-white/20 border-4 border-white" />
          )}

          <h1 className="text-3xl font-black mt-6">
            {fullName || "Vorname Nachname"}
          </h1>

          <p className="mt-2 text-white/90">
            {jobTitle || "Berufsbezeichnung"}
          </p>
        </div>

        <div className="mt-12">
          <h2 className="text-xl font-black mb-5 uppercase">
            Kontakt
          </h2>

          <div className="space-y-3 text-sm leading-6">
            {candidateData?.email && <p>{candidateData.email}</p>}
            {candidateData?.phone && <p>{candidateData.phone}</p>}
            {address && <p>{address}</p>}
            {candidateData?.linkedin && <p>{candidateData.linkedin}</p>}
          </div>
        </div>

        {sections.kenntnisse && (
          <div className="mt-12">
            <h2 className="text-xl font-black mb-5 uppercase">
              Kenntnisse
            </h2>

            <div className="space-y-3 text-sm">
              {lines(sections.kenntnisse).map((item, index) => (
                <p key={index}>
                  • {item.replace("-", "").trim()}
                </p>
              ))}
            </div>
          </div>
        )}

        {sections.sprachen && (
          <div className="mt-12">
            <h2 className="text-xl font-black mb-5 uppercase">
              Sprachen
            </h2>

            <div className="space-y-3 text-sm">
              {lines(sections.sprachen).map((item, index) => (
                <p key={index}>
                  • {item.replace("-", "").trim()}
                </p>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="p-12 text-[#111827]">
        {sections.profil && (
          <section className="mb-12">
            <h2 className="text-3xl font-black mb-5 border-b-4 border-orange-500 inline-block pb-2">
              Profil
            </h2>

            <p className="leading-8 text-gray-700 whitespace-pre-wrap">
              {sections.profil}
            </p>
          </section>
        )}

        {sections.berufserfahrung && (
          <section className="mb-12">
            <h2 className="text-3xl font-black mb-6 border-b-4 border-orange-500 inline-block pb-2">
              Berufserfahrung
            </h2>

            <div className="space-y-5">
              {lines(sections.berufserfahrung).map((item, index) => (
                <div
                  key={index}
                  className="border-l-4 border-orange-500 pl-5"
                >
                  <p className="leading-7 text-gray-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {sections.ausbildung && (
          <section>
            <h2 className="text-3xl font-black mb-6 border-b-4 border-orange-500 inline-block pb-2">
              Ausbildung
            </h2>

            <div className="space-y-4">
              {lines(sections.ausbildung).map((item, index) => (
                <p
                  key={index}
                  className="leading-7 text-gray-700"
                >
                  {item}
                </p>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
