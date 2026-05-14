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
    <div className="bg-white text-black min-h-[1120px] p-12">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h1 className="text-4xl font-black text-[#111827] mb-4">
            {fullName || "Vorname Nachname"}
          </h1>

          <div className="space-y-1 text-gray-700 text-sm">
            {address && <p>{address}</p>}
            {candidateData?.email && <p>{candidateData.email}</p>}
            {candidateData?.phone && <p>{candidateData.phone}</p>}
          </div>
        </div>

        <div className="text-right text-sm text-gray-600">
          {city && <p>{city}</p>}
          <p>{today}</p>
        </div>
      </div>

      <div className="mb-8 text-sm text-gray-800 leading-6">
        {company && <p className="font-semibold">{company}</p>}
        {recruiter && <p>{recruiter}</p>}
        {city && <p>{city}</p>}
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-black text-[#111827] border-b-4 border-orange-500 inline-block pb-2">
          Bewerbung als {position}
        </h2>
      </div>

      <div className="whitespace-pre-wrap leading-7 text-[15px] text-gray-800">
        {letterText}
      </div>

      <div className="mt-10">
        <p className="mb-8 text-gray-800">Mit freundlichen Grüßen</p>

        <p className="font-semibold text-[#111827]">{fullName}</p>
      </div>
    </div>
  );
}