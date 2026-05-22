import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Topbar from "./components/Topbar";
import ClassicTemplate from "./components/templates/ClassicTemplate";
import ModernTemplate from "./components/templates/ModernTemplate";
import PremiumTemplate from "./components/templates/PremiumTemplate";
import CoverLetterTemplate from "./components/templates/CoverLetterTemplate";

export default function OptimizedResume({
  goDashboard,
  resumeText,
  jobText,
  selectedProduct,
  selectedTemplate,
  profilePhoto,
  candidateData,
}) {
  const [optimizedText, setOptimizedText] = useState("");
  const [loading, setLoading] = useState(true);

  const resumeRef = useRef(null);
  const coverLetterRef = useRef(null);

  const titles = {
    resume: "Optimierter Lebenslauf",
    coverLetter: "Anschreiben",
    bundle: "Bewerbungspaket",
  };

  const title = titles[selectedProduct] || "Bewerbungspaket";

  function cleanCoverLetterText(text) {
    if (!text) return "";

    let cleaned = text;

    if (cleaned.includes("=== ANSCHREIBEN ===")) {
      cleaned = cleaned.split("=== ANSCHREIBEN ===")[1] || "";
    }

    if (cleaned.includes("ANSCHREIBEN")) {
      cleaned = cleaned.split("ANSCHREIBEN").pop() || "";
    }

    cleaned = cleaned
      .replace(/PROFIL[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/BERUFLICHE ERFAHRUNG[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/KENNTNISSE[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/STÄRKEN[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/AUSBILDUNG[\s\S]*?(?=Sehr geehrte|Sehr geehrter|Guten Tag|Hallo)/i, "")
      .replace(/\[Ort\],?\s*\[Datum\]/gi, "")
      .replace(/\[Name des Ansprechpartners\]/gi, "")
      .replace(/\[Firma\]/gi, "")
      .replace(/\[Adresse\]/gi, "")
      .replace(/\[Stellenbezeichnung\]/gi, "")
      .replace(/Betreff:\s*Bewerbung als.*$/gim, "")
      .replace(/Bewerbung als .*$/gim, "")
      .replace(/Mit freundlichen Grüßen[\s\S]*$/i, "")
      .trim();

    return cleaned;
  }

  const resumePart =
    selectedProduct === "bundle"
      ? optimizedText
          .split("=== ANSCHREIBEN ===")[0]
          .replace("=== LEBENSLAUF ===", "")
          .trim()
      : optimizedText;

  const coverLetterPart =
    selectedProduct === "bundle"
      ? cleanCoverLetterText(
          optimizedText.split("=== ANSCHREIBEN ===")[1]?.trim() || ""
        )
      : cleanCoverLetterText(optimizedText);

  useEffect(() => {
    async function optimize() {
      try {
        setLoading(true);
        setOptimizedText("");

        const response = await fetch("https://bewerberfuchs-1.onrender.com/optimize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText:
              resumeText ||
              "Motivierter Bewerber mit Teamfähigkeit und Berufserfahrung.",
            jobText: jobText || "",
            product: selectedProduct || "bundle",
            candidateData,
          }),
        });

        const data = await response.json();
        setOptimizedText(data.optimizedText || "Keine Optimierung erhalten.");
      } catch (error) {
        console.log(error);
        setOptimizedText(
          "Fehler bei der Optimierung. Bitte prüfe, ob das Backend läuft."
        );
      } finally {
        setLoading(false);
      }
    }

    optimize();
  }, [resumeText, jobText, selectedProduct, candidateData]);

  function copyText(text) {
    if (!text.trim()) {
      alert("Bitte warte, bis das Ergebnis fertig erstellt wurde.");
      return;
    }

    navigator.clipboard.writeText(text);
    alert("Text wurde kopiert.");
  }

  async function exportElementToPdf(element, filename) {
    if (!element) {
      alert("PDF konnte nicht erstellt werden.");
      return;
    }

    const canvas = await html2canvas(element, {
  scale: 1.5,
  useCORS: true,
  backgroundColor: "#ffffff",
  windowWidth: element.scrollWidth,
  windowHeight: element.scrollHeight,
});

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(filename);
  }

  function downloadResumePdf() {
    exportElementToPdf(resumeRef.current, "lebenslauf.pdf");
  }

  function downloadCoverLetterPdf() {
    exportElementToPdf(coverLetterRef.current, "anschreiben.pdf");
  }

  function renderResumeTemplate(text) {
    if (selectedTemplate === "modern") {
      return (
        <ModernTemplate
          title="Lebenslauf"
          optimizedText={text}
          profilePhoto={profilePhoto}
          candidateData={candidateData}
        />
      );
    }

    if (selectedTemplate === "premium") {
      return (
        <PremiumTemplate
          title="Lebenslauf"
          optimizedText={text}
          profilePhoto={profilePhoto}
          candidateData={candidateData}
        />
      );
    }

    return (
      <ClassicTemplate
        title="Lebenslauf"
        optimizedText={text}
        profilePhoto={profilePhoto}
        candidateData={candidateData}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <Topbar goHome={goDashboard} />
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,115,0,0.14),transparent_30%),radial-gradient(circle_at_left,rgba(0,90,255,0.08),transparent_25%)]" />
      <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-[1450px] mx-auto">
          <button
            onClick={goDashboard}
            className="mb-8 text-gray-400 hover:text-white"
          >
            ← Zurück zum Dashboard
          </button>

          <div className="mb-12 sm:mb-16">
            <p className="text-orange-400 font-semibold">Premium Ergebnis</p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-3 leading-[0.95] tracking-tight">{title}</h1>

            <p className="text-gray-400 mt-4 text-base sm:text-lg max-w-3xl leading-relaxed">
              Dein Ergebnis wurde mit KI optimiert und im passenden Design
              erstellt.
            </p>
          </div>

          {loading ? (
            <div className="bg-white/5 border border-white/10 bg-white/[0.03] hover:border-orange-500/40 hover:bg-white/5 transition rounded-[32px] p-8">
              <div className="space-y-4 text-gray-300">
                <div className="animate-pulse">
                  🧠 KI optimiert deinen Text...
                </div>
                <div className="animate-pulse">
                  📄 Dokument wird erstellt...
                </div>
                <div className="animate-pulse">
                  ✨ Design wird vorbereitet...
                </div>
              </div>
            </div>
          ) : selectedProduct === "bundle" ? (
            <div className="space-y-10">
              <div>
                <div className="mb-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <h2 className="text-3xl font-black">Lebenslauf</h2>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] transition">
                    <button
                      onClick={() => copyText(resumePart)}
                      className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-6 py-3 rounded-[22px]"
                    >
                      Text kopieren
                    </button>

                    <button
                      onClick={downloadResumePdf}
                      className="border border-white/10 bg-white/[0.03] hover:border-orange-500/40 hover:bg-white/5 transition hover:border-orange-500/40 px-6 py-3 rounded-[22px] font-bold"
                    >
                      Lebenslauf PDF
                    </button>
                  </div>
                </div>

                <div
                  ref={resumeRef}
                  className="bg-white text-black overflow-hidden rounded-[30px] shadow-[0_10px_50px_rgba(0,0,0,0.45)]"
                >
                  {renderResumeTemplate(resumePart)}
                </div>
              </div>

              <div>
                <div className="mb-5 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                  <h2 className="text-3xl font-black">Anschreiben</h2>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-[1.02] transition">
                    <button
                      onClick={() => copyText(coverLetterPart)}
                      className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-6 py-3 rounded-[22px]"
                    >
                      Text kopieren
                    </button>

                    <button
                      onClick={downloadCoverLetterPdf}
                      className="border border-white/10 bg-white/[0.03] hover:border-orange-500/40 hover:bg-white/5 transition hover:border-orange-500/40 px-6 py-3 rounded-[22px] font-bold"
                    >
                      Anschreiben PDF
                    </button>
                  </div>
                </div>

                <div
                  ref={coverLetterRef}
                  className="bg-white text-black overflow-hidden rounded-[30px] shadow-[0_10px_50px_rgba(0,0,0,0.45)]"
                >
                  <CoverLetterTemplate
                    optimizedText={coverLetterPart}
                    candidateData={candidateData}
                  />
                </div>
              </div>
            </div>
          ) : selectedProduct === "coverLetter" ? (
            <>
              <div
                ref={coverLetterRef}
                className="bg-white text-black overflow-hidden rounded-[30px] shadow-[0_10px_50px_rgba(0,0,0,0.45)]"
              >
                <CoverLetterTemplate
                  optimizedText={coverLetterPart}
                  candidateData={candidateData}
                />
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => copyText(coverLetterPart)}
                  className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-4 rounded-[22px]"
                >
                  Text kopieren
                </button>

                <button
                  onClick={downloadCoverLetterPdf}
                  className="border border-white/10 bg-white/[0.03] hover:border-orange-500/40 hover:bg-white/5 transition hover:border-orange-500/40 px-8 py-4 rounded-[22px] font-bold"
                >
                  Anschreiben PDF herunterladen
                </button>
              </div>
            </>
          ) : (
            <>
              <div
                ref={resumeRef}
                className="bg-white text-black overflow-hidden rounded-[30px] shadow-[0_10px_50px_rgba(0,0,0,0.45)]"
              >
                {renderResumeTemplate(optimizedText)}
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => copyText(optimizedText)}
                  className="bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-4 rounded-[22px]"
                >
                  Text kopieren
                </button>

                <button
                  onClick={downloadResumePdf}
                  className="border border-white/10 bg-white/[0.03] hover:border-orange-500/40 hover:bg-white/5 transition hover:border-orange-500/40 px-8 py-4 rounded-[22px] font-bold"
                >
                  Lebenslauf PDF herunterladen
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}