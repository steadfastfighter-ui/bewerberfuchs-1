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
    <div className="bg-white text-[#111827] min-h-[1120px] p-14">
      <header className="border-b-4 border-orange-500 pb-8 mb-10 flex justify-between gap-8">
        <div>
          <h1 className="text-5xl font-black mb-3">
            {fullName || "Vorname Nachname"}
          </h1>

          <p className="text-xl text-gray-600 mb-5">
            {jobTitle || "Berufsbezeichnung"}
          </p>

          <div className="text-sm text-gray-600 space-y-1">
            {candidateData?.email && <p>{candidateData.email}</p>}
            {candidateData?.phone && <p>{candidateData.phone}</p>}
            {address && <p>{address}</p>}
            {candidateData?.linkedin && <p>{candidateData.linkedin}</p>}
          </div>
        </div>

        {profilePhoto && (
          <img
            src={profilePhoto}
            alt="Profilbild"
            className="w-36 h-36 rounded-2xl object-cover border-4 border-orange-500"
          />
        )}
      </header>

      {sections.profil && (
        <section className="mb-10">
          <h2 className="text-2xl font-black mb-4 uppercase tracking-wide">
            Profil
          </h2>

          <p className="leading-8 text-gray-700 whitespace-pre-wrap">
            {sections.profil}
          </p>
        </section>
      )}

      {sections.berufserfahrung && (
        <section className="mb-10">
          <h2 className="text-2xl font-black mb-5 uppercase tracking-wide">
            Berufserfahrung
          </h2>

          <div className="space-y-4">
            {lines(sections.berufserfahrung).map((item, index) => (
              <div key={index} className="border-l-4 border-orange-500 pl-5">
                <p className="leading-7 text-gray-700">{item}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid grid-cols-2 gap-10">
        {sections.kenntnisse && (
          <section>
            <h2 className="text-2xl font-black mb-5 uppercase tracking-wide">
              Kenntnisse
            </h2>

            <div className="space-y-2">
              {lines(sections.kenntnisse).map((item, index) => (
                <p key={index} className="text-gray-700">
                  • {item.replace("-", "").trim()}
                </p>
              ))}
            </div>
          </section>
        )}

        {sections.sprachen && (
          <section>
            <h2 className="text-2xl font-black mb-5 uppercase tracking-wide">
              Sprachen
            </h2>

            <div className="space-y-2">
              {lines(sections.sprachen).map((item, index) => (
                <p key={index} className="text-gray-700">
                  • {item.replace("-", "").trim()}
                </p>
              ))}
            </div>
          </section>
        )}
      </div>

      {sections.ausbildung && (
        <section className="mt-10">
          <h2 className="text-2xl font-black mb-5 uppercase tracking-wide">
            Ausbildung
          </h2>

          <div className="space-y-3">
            {lines(sections.ausbildung).map((item, index) => (
              <p key={index} className="text-gray-700 leading-7">
                {item}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
