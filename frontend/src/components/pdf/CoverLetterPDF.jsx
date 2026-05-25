export default function CoverLetterPDF({ optimizedText, candidateData }) {
  const today = new Date().toLocaleDateString("de-DE");
  const clean = (v = "") => v.trim();

  const fullName = clean(candidateData?.fullName) || "Vorname Nachname";
  const email = clean(candidateData?.email);
  const phone = clean(candidateData?.phone);
  const address = clean(candidateData?.address);
  const city = clean(candidateData?.city);
  const company = clean(candidateData?.company);
  const recruiter = clean(candidateData?.recruiter);
  const position =
    clean(candidateData?.position || candidateData?.jobTitle) ||
    "Mitarbeiter/in";

  const text = clean(optimizedText)
    .replace("=== ANSCHREIBEN ===", "")
    .replace(/Mit freundlichen Grüßen[\s\S]*$/i, "")
    .trim();

  return (
    <div className="w-[794px] min-h-[1123px] bg-white text-slate-900 font-sans">
      <div className="h-3 bg-orange-500" />

      <div className="px-16 py-14">
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-[42px] font-black leading-none">
              {fullName}
            </h1>
            <p className="text-orange-500 font-semibold mt-3 text-lg">
              Bewerbung als {position}
            </p>
          </div>

          <div className="text-right text-[14px] leading-7 text-slate-600">
            {address && <p>{address}</p>}
            {email && <p>{email}</p>}
            {phone && <p>{phone}</p>}
            <div className="mt-4">
              {city && <p>{city}</p>}
              <p>{today}</p>
            </div>
          </div>
        </div>

        <div className="mb-14 text-[15px] leading-8 text-slate-700">
          {company && (
            <p className="font-black text-slate-900 text-lg">{company}</p>
          )}
          {recruiter && <p>{recruiter}</p>}
          {city && <p>{city}</p>}
        </div>

        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-orange-500 font-black mb-4">
            Betreff
          </p>
          <h2 className="text-[30px] leading-tight font-black text-slate-900">
            Bewerbung als {position}
          </h2>
          <div className="w-24 h-1 bg-orange-500 rounded-full mt-5" />
        </div>

        <div className="text-[15px] leading-[1.9] text-slate-700 whitespace-pre-wrap">
          {text}
        </div>

        <div className="mt-20">
          <p className="text-slate-700 mb-12 text-lg">
            Mit freundlichen Grüßen
          </p>
          <p className="text-[28px] font-black text-slate-900">{fullName}</p>
        </div>
      </div>
    </div>
  );
}