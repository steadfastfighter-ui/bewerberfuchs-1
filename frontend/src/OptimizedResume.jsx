import { useEffect, useRef, useState } from "react";
import Topbar from "./components/Topbar";
import ClassicTemplate from "./components/templates/ClassicTemplate";
import ModernTemplate from "./components/templates/ModernTemplate";
import PremiumTemplate from "./components/templates/PremiumTemplate";
import CoverLetterTemplate from "./components/templates/CoverLetterTemplate";
import ResumePDF from "./components/pdf/ResumePDF";
import CoverLetterPDF from "./components/pdf/CoverLetterPDF";

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

  const title =
    selectedProduct === "resume"
      ? "Optimierter Lebenslauf"
      : selectedProduct === "coverLetter"
      ? "Anschreiben"
      : "Bewerbungspaket";

  function cleanCoverLetterText(text = "") {
    return text
      .replace("=== ANSCHREIBEN ===", "")
      .replace(/Mit freundlichen Grüßen[\s\S]*$/i, "")
      .trim();
  }

  const resumePart =
    selectedProduct === "bundle"
      ? optimizedText.split("=== ANSCHREIBEN ===")[0].replace("=== LEBENSLAUF ===", "").trim()
      : optimizedText;

  const coverLetterPart =
    selectedProduct === "bundle"
      ? cleanCoverLetterText(optimizedText.split("=== ANSCHREIBEN ===")[1] || "")
      : cleanCoverLetterText(optimizedText);

  useEffect(() => {
    async function optimize() {
      try {
        setLoading(true);

        const response = await fetch(`${API_URL}/optimize`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText: resumeText || "Motivierter Bewerber mit Teamfähigkeit und Berufserfahrung.",
            jobText: jobText || "",
            product: selectedProduct || "bundle",
            candidateData,
          }),
        });

        const data = await response.json();
        setOptimizedText(data.optimizedText || "Keine Optimierung erhalten.");
      } catch {
        setOptimizedText("Fehler bei der Optimierung.");
      } finally {
        setLoading(false);
      }
    }

    optimize();
  }, [resumeText, jobText, selectedProduct, candidateData]);

  function copyText(text) {
    navigator.clipboard.writeText(text || "");
    alert("Text wurde kopiert.");
  }

  function exportElementToPdf(content, filename) {
  const printWindow = window.open("", "_blank");

  if (!printWindow) {
    alert("Popup wurde blockiert.");
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>${filename}</title>

        <script src="https://cdn.tailwindcss.com"></script>

        <style>
          body {
            margin: 0;
            background: #e5e7eb;
            display: flex;
            justify-content: center;
            padding: 40px;
          }

          @page {
            size: A4;
            margin: 0;
          }

          * {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            box-sizing: border-box;
          }
        </style>
      </head>

      <body>
        <div id="pdf-root"></div>
      </body>
    </html>
  `);

  printWindow.document.close();

  setTimeout(() => {
    const root = printWindow.document.getElementById("pdf-root");
    root.innerHTML = content;
  }, 300);
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
              Lebenslauf und Anschreiben sind getrennt. Jede Datei kann einzeln als PDF geöffnet, gespeichert oder gedruckt werden.
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
            <div className="space-y-16">
              <section>
                <SectionHeader
                  actions={
                    <ActionButtons
                      onCopy={() => copyText(resumePart)}
                      onDownload={() => exportElementToPdf(resumeRef.current, "lebenslauf.pdf")}
                      downloadLabel="Lebenslauf PDF öffnen"
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
                      onDownload={() =>
  exportElementToPdf(
    coverLetterRef.current.innerHTML,
    "anschreiben.pdf"
  )
}
                      downloadLabel="Anschreiben PDF öffnen"
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
                    onDownload={() =>
  exportElementToPdf(
    coverLetterRef.current.innerHTML,
    "anschreiben.pdf"
  )
}
                    downloadLabel="Anschreiben PDF öffnen"
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
                    onDownload={() => exportElementToPdf(resumeRef.current, "lebenslauf.pdf")}
                    downloadLabel="Lebenslauf PDF öffnen"
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