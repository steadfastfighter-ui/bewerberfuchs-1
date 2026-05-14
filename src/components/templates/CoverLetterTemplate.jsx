export default function CoverLetterTemplate({ optimizedText, candidateData }) {
  const today = new Date().toLocaleDateString("de-DE");

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

  function cleanText(text) {
    if (!text) return "";

    let cleaned = text;

    if (cleaned.includes("=== ANSCHREIBEN ===")) {
      cleaned = cleaned.split("=== ANSCHREIBEN ===")[1] || "";
    }

    if (cleaned.includes("ANSCHREIBEN")) {
      cleaned = cleaned.split("ANSCHREIBEN").pop() || "";
    }

    return cleaned
      .replace(/PROFIL[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/BERUFLICHE ERFAHRUNG[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/KENNTNISSE[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/STÄRKEN[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/AUSBILDUNG[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/\[Ort\],?\s*\[Datum\]/gi, "")
      .replace(/\[Name des Ansprechpartners\]/gi, "")
      .replace(/\[Firma\]/gi, "")
      .replace(/\[Adresse\]/gi, "")
      .replace(/\[Stellenbezeichnung\]/gi, candidateData?.position || candidateData?.jobTitle || "")
      .replace(/Betreff:\s*Bewerbung als.*$/gim, "")
      .replace(/Bewerbung als .*$/gim, "")
      .replace(/Mit freundlichen Grüßen[\s\S]*$/i, "")
      .trim();
  }

  const fullName = formatName(candidateData?.fullName || "");
  const address = formatText(candidateData?.address || "");
  const city = formatText(candidateData?.city || "");
  const company = formatText(candidateData?.company || "");
  const recruiter = formatText(candidateData?.recruiter || "");
  const position = formatText(
    candidateData?.position || candidateData?.jobTitle || "Mitarbeiter/in"
  );

  const letterText = cleanText(optimizedText);

  return (
    <div className="bg-[#f3f4f6] text-[#111827] min-h-[1120px] p-10 font-sans">
      <div className="bg-white rounded-[32px] overflow-hidden border border-gray-200 shadow-sm">
        <div className="bg-[#0f172a] text-white px-10 py-9 flex justify-between gap-8">
          <div>
            <p className="text-orange-400 text-sm font-black uppercase tracking-[0.25em] mb-3">
              Bewerbung
            </p>

            <h1 className="text-4xl font-black leading-tight">
              {fullName || "Vorname Nachname"}
            </h1>

            <p className="text-gray-300 mt-3">
              Bewerbung als {position}
            </p>
          </div>

          <div className="text-right text-sm text-gray-300 leading-6">
            {address && <p>{address}</p>}
            {candidateData?.email && <p>{candidateData.email}</p>}
            {candidateData?.phone && <p>{candidateData.phone}</p>}
            {city && <p className="mt-4">{city}</p>}
            <p>{today}</p>
          </div>
        </div>

        <div className="px-10 py-10">
          <div className="grid grid-cols-[1fr_1.4fr] gap-10 mb-10">
            <div className="bg-[#f9fafb] border border-gray-100 rounded-2xl p-6">
              <p className="text-orange-500 font-black text-xs uppercase tracking-[0.25em] mb-4">
                Empfänger
              </p>

              <div className="text-sm text-gray-700 leading-7">
                {company && <p className="font-bold text-[#111827]">{company}</p>}
                {recruiter && <p>{recruiter}</p>}
                {city && <p>{city}</p>}
              </div>
            </div>

            <div>
              <p className="text-orange-500 font-black text-xs uppercase tracking-[0.25em] mb-4">
                Betreff
              </p>

              <h2 className="text-3xl font-black leading-tight">
                Bewerbung als {position}
              </h2>
            </div>
          </div>

          <div className="whitespace-pre-wrap leading-8 text-[15px] text-gray-800">
            {letterText}
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="mb-8 text-gray-800">Mit freundlichen Grüßen</p>
            <p className="font-black text-[#111827] text-lg">{fullName}</p>
          </div>
        </div>
      </div>
    </div>
  );
}