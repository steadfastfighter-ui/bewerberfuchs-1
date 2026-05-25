import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Topbar from "./components/Topbar";
import ClassicTemplate from "./components/templates/ClassicTemplate";
import ModernTemplate from "./components/templates/ModernTemplate";
import PremiumTemplate from "./components/templates/PremiumTemplate";
import CoverLetterTemplate from "./components/templates/CoverLetterTemplate";

const API_URL = "https://bewerberfuchs-1.onrender.com";

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
  const [exporting, setExporting] = useState(false);

  const resumeRef = useRef(null);
  const coverLetterRef = useRef(null);

  const titles = {
    resume: "Optimierter Lebenslauf",
    coverLetter: "Anschreiben",
    bundle: "Bewerbungspaket",
  };

  const title = titles[selectedProduct] || "Bewerbungspaket";

  function cleanCoverLetterText(text = "") {
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
      .replace(/\[Stellenbezeichnung\]/gi, "")
      .replace(/Betreff:\s*Bewerbung als.*$/gim, "")
      .replace(/Bewerbung als .*$/gim, "")
      .replace(/Mit freundlichen Grüßen[\s\S]*$/i, "")
      .trim();
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

        const response = await fetch(`${API_URL}/optimize`, {
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

    try {
      setExporting(true);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position -= pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(filename);
    } catch (error) {
      console.log(error);
      alert("PDF konnte nicht erstellt werden. Bitte erneut versuchen.");
    } finally {
      setExporting(false);
    }
  }

  function downloadResumePdf() {
    exportElementToPdf(resumeRef.current, "lebenslauf.pdf");
  }

  function downloadCoverLetterPdf() {
    exportElementToPdf(coverLetterRef.current, "anschreiben.pdf");
  }

   function renderResumeTemplate(text) {
    const props = {
    title: "Lebenslauf",
    optimizedText: text,
    profilePhoto,
    candidateData,
  };

  if (selectedTemplate === "modern") return <ModernTemplate {...props} />;
  if (selectedTemplate === "premium") return <PremiumTemplate {...props} />;

  return <ClassicTemplate {...props} />;
}

/* HIER EINFÜGEN */

function DocumentFrame({ children, innerRef }) {
  return (
    <div className="w-full rounded-[32px] border border-white/10 bg-white/[0.03] p-4 md:p-8 overflow-x-auto">
      <div className="mx-auto w-[794px]">
        <div
          ref={innerRef}
          className="w-[794px] bg-white text-black overflow-hidden rounded-[24px] shadow-[0_20px_80px_rgba(0,0,0,0.45)]"
        >
          {children}
        </div>
      </div>
    </div>
  );
}

function ActionButtons({ onCopy, onDownload, downloadLabel }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button
        onClick={onCopy}
        className="bg-orange-500 hover:bg-orange-400 text-black font-black px-6 py-3 rounded-2xl transition"
      >
        Text kopieren
      </button>

      <button
        onClick={onDownload}
        disabled={exporting}
        className="border border-orange-500/30 bg-white/[0.04] hover:bg-orange-500 hover:text-black disabled:opacity-60 transition px-6 py-3 rounded-2xl font-black text-orange-400"
      >
        {exporting ? "PDF wird erstellt..." : downloadLabel}
      </button>
    </div>
  );
}
  function SectionHeader({ children, actions }) {
    return (
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-3xl font-black">{children}</h2>
        {actions}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <Topbar goHome={goDashboard} />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(255,115,0,0.14),transparent_30%),radial-gradient(circle_at_left,rgba(0,90,255,0.08),transparent_25%)]" />

      <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-[1180px] mx-auto">
          <button
            onClick={goDashboard}
            className="mb-8 text-gray-400 hover:text-white transition"
          >
            ← Zurück zum Dashboard
          </button>

          <div className="mb-10 sm:mb-14">
            <p className="text-orange-400 font-semibold">Premium Ergebnis</p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-3 leading-[0.95] tracking-tight">
              {title}
            </h1>

            <p className="text-gray-400 mt-4 text-base sm:text-lg max-w-3xl leading-relaxed">
              Dein Ergebnis wurde mit KI optimiert und im passenden Design erstellt.
              Du kannst den Text kopieren oder direkt als PDF herunterladen.
            </p>
          </div>

          {loading ? (
            <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8">
              <div className="space-y-4 text-gray-300">
                <div className="animate-pulse">🧠 KI optimiert deinen Text...</div>
                <div className="animate-pulse">📄 Dokument wird erstellt...</div>
                <div className="animate-pulse">✨ Design wird vorbereitet...</div>
              </div>
            </div>
          ) : selectedProduct === "bundle" ? (
            <div className="space-y-12">
              <section>
                <SectionHeader
                  actions={
                    <ActionButtons
                      onCopy={() => copyText(resumePart)}
                      onDownload={downloadResumePdf}
                      downloadLabel="Lebenslauf PDF"
                    />
                  }
                >
                  Lebenslauf
                </SectionHeader>

                <DocumentFrame innerRef={resumeRef}>
                  {renderResumeTemplate(resumePart)}
                </DocumentFrame>
              </section>

              <section>
                <SectionHeader
                  actions={
                    <ActionButtons
                      onCopy={() => copyText(coverLetterPart)}
                      onDownload={downloadCoverLetterPdf}
                      downloadLabel="Anschreiben PDF"
                    />
                  }
                >
                  Anschreiben
                </SectionHeader>

                <DocumentFrame innerRef={coverLetterRef}>
                  <CoverLetterTemplate
                    optimizedText={coverLetterPart}
                    candidateData={candidateData}
                  />
                </DocumentFrame>
              </section>
            </div>
          ) : selectedProduct === "coverLetter" ? (
            <section>
              <SectionHeader
                actions={
                  <ActionButtons
                    onCopy={() => copyText(coverLetterPart)}
                    onDownload={downloadCoverLetterPdf}
                    downloadLabel="Anschreiben PDF"
                  />
                }
              >
                Anschreiben
              </SectionHeader>

              <DocumentFrame innerRef={coverLetterRef}>
                <CoverLetterTemplate
                  optimizedText={coverLetterPart}
                  candidateData={candidateData}
                />
              </DocumentFrame>
            </section>
          ) : (
            <section>
              <SectionHeader
                actions={
                  <ActionButtons
                    onCopy={() => copyText(optimizedText)}
                    onDownload={downloadResumePdf}
                    downloadLabel="Lebenslauf PDF"
                  />
                }
              >
                Lebenslauf
              </SectionHeader>

              <DocumentFrame innerRef={resumeRef}>
                {renderResumeTemplate(optimizedText)}
              </DocumentFrame>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
