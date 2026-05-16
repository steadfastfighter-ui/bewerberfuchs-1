export default function CoverLetterTemplate({
  optimizedText,
  candidateData,
}) {
  const today = new Date().toLocaleDateString("de-DE");

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

  function cleanText(text) {
    if (!text) return "";

    let cleaned = text;

    if (cleaned.includes("=== ANSCHREIBEN ===")) {
      cleaned =
        cleaned.split("=== ANSCHREIBEN ===")[1] || "";
    }

    if (cleaned.includes("ANSCHREIBEN")) {
      cleaned =
        cleaned.split("ANSCHREIBEN").pop() || "";
    }

    return cleaned
      .replace(
        /PROFIL[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i,
        ""
      )
      .replace(
        /BERUFLICHE ERFAHRUNG[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i,
        ""
      )
      .replace(
        /KENNTNISSE[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i,
        ""
      )
      .replace(
        /STÄRKEN[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i,
        ""
      )
      .replace(
        /AUSBILDUNG[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i,
        ""
      )
      .replace(/\[Ort\],?\s*\[Datum\]/gi, "")
      .replace(
        /\[Name des Ansprechpartners\]/gi,
        ""
      )
      .replace(/\[Firma\]/gi, "")
      .replace(/\[Adresse\]/gi, "")
      .replace(
        /\[Stellenbezeichnung\]/gi,
        candidateData?.position ||
          candidateData?.jobTitle ||
          ""
      )
      .replace(
        /Betreff:\s*Bewerbung als.*$/gim,
        ""
      )
      .replace(
        /Bewerbung als .*$/gim,
        ""
      )
      .replace(
        /Mit freundlichen Grüßen[\s\S]*$/i,
        ""
      )
      .trim();
  }

  const fullName = formatName(
    candidateData?.fullName || ""
  );

  const address = formatText(
    candidateData?.address || ""
  );

  const city = formatText(
    candidateData?.city || ""
  );

  const company = formatText(
    candidateData?.company || ""
  );

  const recruiter = formatText(
    candidateData?.recruiter || ""
  );

  const position = formatText(
    candidateData?.position ||
      candidateData?.jobTitle ||
      "Mitarbeiter/in"
  );

  const letterText = cleanText(optimizedText);

  return (
    <div className="bg-[#eef2ff] min-h-[1120px] p-14">
      <div
        className="
          bg-white
          rounded-[38px]
          overflow-hidden
          shadow-[0_20px_70px_rgba(15,23,42,0.15)]
          border
          border-gray-200
        "
      >
        
        {/* HEADER */}
        <div
          className="
            relative
            bg-[#0f172a]
            text-white
            px-14
            py-12
            overflow-hidden
          "
        >
          <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange-500/20 rounded-full blur-3xl" />

          <div className="relative flex justify-between gap-10">
            
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-orange-500/15
                  border
                  border-orange-400/20
                  text-orange-400
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  font-black
                  tracking-[0.22em]
                  uppercase
                  mb-5
                "
              >
                Premium Anschreiben
              </div>

              <h1 className="text-[52px] font-black leading-[0.92] tracking-tight">
                {fullName || "Vorname Nachname"}
              </h1>

              <p className="text-gray-300 text-xl mt-4">
                Bewerbung als {position}
              </p>
            </div>

            <div className="text-right text-[15px] text-gray-300 leading-8">
              {address && <p>{address}</p>}
              {candidateData?.email && (
                <p>{candidateData.email}</p>
              )}
              {candidateData?.phone && (
                <p>{candidateData.phone}</p>
              )}

              <div className="mt-6">
                {city && <p>{city}</p>}
                <p>{today}</p>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="px-14 py-12">
          
          {/* INFO GRID */}
          <div className="grid grid-cols-[1fr_1.4fr] gap-10 mb-12">
            
            {/* EMPFÄNGER */}
            <div
              className="
                bg-orange-50
                border
                border-orange-100
                rounded-[28px]
                p-7
              "
            >
              <p
                className="
                  text-orange-500
                  font-black
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  mb-5
                "
              >
                Empfänger
              </p>

              <div className="text-[15px] text-gray-700 leading-8">
                {company && (
                  <p className="font-black text-[#111827] text-lg">
                    {company}
                  </p>
                )}

                {recruiter && <p>{recruiter}</p>}
                {city && <p>{city}</p>}
              </div>
            </div>

            {/* BETREFF */}
            <div className="flex flex-col justify-center">
              <p
                className="
                  text-orange-500
                  font-black
                  text-xs
                  uppercase
                  tracking-[0.25em]
                  mb-5
                "
              >
                Betreff
              </p>

              <h2 className="text-[40px] font-black leading-tight text-[#111827]">
                Bewerbung als {position}
              </h2>

              <div className="w-28 h-1 bg-orange-500 rounded-full mt-6" />
            </div>
          </div>

          {/* LETTER */}
          <div
            className="
              text-[17px]
              leading-[2.15]
              text-gray-800
              whitespace-pre-wrap
            "
          >
            {letterText}
          </div>

          {/* FOOTER */}
          <div className="mt-16 pt-10 border-t border-gray-200">
            <p className="text-gray-800 mb-10 text-lg">
              Mit freundlichen Grüßen
            </p>

            <p className="text-[26px] font-black text-[#111827]">
              {fullName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}