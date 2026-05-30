import { useEffect, useRef, useState } from "react";
import { auth, db } from "./firebase";

import {
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";

import toast from "react-hot-toast";
import Topbar from "./components/Topbar";

import ClassicTemplate from "./components/templates/ClassicTemplate";
import ModernTemplate from "./components/templates/ModernTemplate";
import PremiumTemplate from "./components/templates/PremiumTemplate";
import CoverLetterTemplate from "./components/templates/CoverLetterTemplate";

const API_URL = "https://bewerberfuchs-1.onrender.com";

export default function OptimizedResume({
  goDashboard,
  logout,
  resumeText,
  jobText,
  selectedProduct,
  selectedTemplate,
  profilePhoto,
  candidateData,
}) {
  const [optimizedText, setOptimizedText] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [editableResume, setEditableResume] = useState("");
  const [editableCoverLetter, setEditableCoverLetter] =
    useState("");

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
   async function saveApplication() {
  if (!auth.currentUser) {
    toast.error(
      "Bitte zuerst einloggen, um Bewerbungen zu speichern."
    );
    return;
  }

  try {
    await addDoc(
      collection(
        db,
        "users",
        auth.currentUser.uid,
        "applications"
      ),
     {
  title,
  selectedProduct,
  selectedTemplate,

  optimizedText: editMode
    ? `${editableResume}

=== ANSCHREIBEN ===

${editableCoverLetter}`
    : optimizedText,

  resumeText,
  jobText,
  candidateData,
  createdAt: serverTimestamp(),
}
    );

    toast.success(
      "Bewerbung erfolgreich gespeichert."
    );
  } catch {
    toast.error(
      "Speichern fehlgeschlagen."
    );
  }
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
          optimizedText.split(
            "=== ANSCHREIBEN ==="
          )[1] || ""
        )
      : cleanCoverLetterText(optimizedText);

  useEffect(() => {
    async function optimize() {
      try {
        setLoading(true);

        const response = await fetch(
          `${API_URL}/optimize`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              resumeText:
                resumeText ||
                "Motivierter Bewerber mit Teamfähigkeit.",
              jobText: jobText || "",
              product:
                selectedProduct || "bundle",
              candidateData,
            }),
          }
        );

        const data = await response.json();

        setOptimizedText(
          data.optimizedText ||
            "Keine Optimierung erhalten."
        );

        const savedResume =
          localStorage.getItem("editedResume");

        const savedCover =
          localStorage.getItem(
            "editedCoverLetter"
          );

        if (savedResume) {
          setEditableResume(savedResume);
        }

        if (savedCover) {
          setEditableCoverLetter(savedCover);
        }
      } catch {
        setOptimizedText(
          "Fehler bei der Optimierung."
        );
      } finally {
        setLoading(false);
      }
    }

    optimize();
  }, [
    resumeText,
    jobText,
    selectedProduct,
    candidateData,
  ]);

  function copyText(text) {
    navigator.clipboard.writeText(text || "");
    toast.success("Text kopiert");
  }

  function saveChanges() {
    localStorage.setItem(
      "editedResume",
      editableResume
    );

    localStorage.setItem(
      "editedCoverLetter",
      editableCoverLetter
    );

    setOptimizedText(
      `${editableResume}

=== ANSCHREIBEN ===

${editableCoverLetter}`
    );

    setEditMode(false);
  }

  function exportElementToPdf(
    content,
    filename
  ) {
    const printWindow = window.open(
      "",
      "_blank"
    );

    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>${filename}</title>

          <script src="https://cdn.tailwindcss.com"></script>

          <style>
            body{
              margin:0;
              background:#e5e7eb;
              display:flex;
              justify-content:center;
              padding:40px;
            }

            @page{
              size:A4;
              margin:0;
            }

            *{
              -webkit-print-color-adjust:exact;
              print-color-adjust:exact;
              box-sizing:border-box;
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
      const root =
        printWindow.document.getElementById(
          "pdf-root"
        );

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

    if (selectedTemplate === "modern") {
      return <ModernTemplate {...props} />;
    }

    if (selectedTemplate === "premium") {
      return <PremiumTemplate {...props} />;
    }

    return <ClassicTemplate {...props} />;
  }

function DocumentFrame({ children, innerRef }) {
  return (
    <div className="w-full rounded-[36px] border border-white/10 bg-white/[0.03] p-4 md:p-8 overflow-x-auto">
      <div className="w-full max-w-5xl mx-auto px-2 sm:px-4">
        <div
          ref={innerRef}
          className="
            w-full
            bg-white
            text-black
            overflow-hidden
            rounded-[32px]
            shadow-[0_30px_100px_rgba(0,0,0,0.55)]
            border
            border-black/5
          "
        >
          {children}
        </div>
      </div>
    </div>
  );
}

  function ActionButtons({
    onCopy,
    onDownload,
    downloadLabel,
  }) {
    return (
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={onCopy}
          className="
bg-orange-500
hover:bg-orange-400
text-black
font-black
px-7
py-3
rounded-2xl
shadow-xl
shadow-orange-500/30
transition-all
duration-300
hover:scale-105
"
        >
          Text kopieren
        </button>

        <button
          onClick={onDownload}
          disabled={exporting}
          className="
            border
            border-orange-500/30
            bg-black/30
            hover:bg-orange-500
            hover:text-black
            disabled:opacity-60
            transition-all
            duration-300
            px-6
            py-3
            rounded-2xl
            font-black
            text-orange-400
          "
        >
          {exporting
            ? "PDF wird erstellt..."
            : downloadLabel}
        </button>
      </div>
    );
  }

  function SectionHeader({
    children,
    actions,
  }) {
    return (
      <div className="mb-6 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <h2 className="text-3xl font-black">
          {children}
        </h2>

        {actions}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-x-hidden">
      <Topbar
  goHome={goDashboard}
  logout={logout}
  isLoggedIn={auth.currentUser}
  goLogin={() => window.location.reload()}
/>

      <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-[1280px] mx-auto">

          <button
            onClick={goDashboard}
            className="mb-10 text-gray-400 hover:text-white transition"
          >
            ← Zurück zum Dashboard
          </button>

          <div className="mb-14">

            <p className="text-orange-400 font-semibold">
              Premium Ergebnis
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mt-3 leading-[0.95] tracking-tight">
              {title}
            </h1>

            <p className="text-gray-400 mt-5 text-base sm:text-lg max-w-3xl leading-relaxed">
              Lebenslauf und Anschreiben
              sind getrennt. Jede Datei kann
              einzeln geöffnet, gespeichert
              oder gedruckt werden.
            </p>

            <div className="flex gap-4 mt-8 flex-wrap">

              <button
                onClick={() => {
                  setEditableResume(
                    resumePart
                  );

                  setEditableCoverLetter(
                    coverLetterPart
                  );

                  setEditMode(true);
                }}
                className="
                  bg-orange-500
                  hover:bg-orange-400
                  text-black
                  font-black
                  px-6
                  py-3
                  rounded-2xl
                  transition-all
                  duration-300
                "
              >
                Text bearbeiten
              </button>
              <button
  onClick={saveApplication}
  className="
    border
    border-white/10
    bg-white/[0.04]
    hover:border-orange-500/40
    hover:bg-orange-500/10
    text-white
    font-bold
    px-6
    py-3
    rounded-2xl
    transition-all
    duration-300
  "
>
  Bewerbung speichern
</button>

              {editMode && (
                <button
                  onClick={saveChanges}
                  className="
                    border
                    border-green-500
                    text-green-400
                    hover:bg-green-500
                    hover:text-black
                    font-black
                    px-6
                    py-3
                    rounded-2xl
                    transition-all
                    duration-300
                  "
                >
                  Änderungen speichern
                </button>
              )}

            </div>
          </div>

          {editMode && (
            <div className="mb-14 space-y-8">

              <div>
                <h3 className="text-2xl font-black mb-4">
                  Lebenslauf bearbeiten
                </h3>

                <textarea
                  value={editableResume}
                  onChange={(e) =>
                    setEditableResume(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    min-h-[320px]
                    rounded-[32px]
                    bg-white/[0.04]
                    border
                    border-white/10
                    p-6
                    text-white
                    outline-none
                    focus:border-orange-500/40
                    focus:ring-4
                    focus:ring-orange-500/10
                    transition
                    resize-none
                    leading-8
                  "
                />
              </div>

              <div>
                <h3 className="text-2xl font-black mb-4">
                  Anschreiben bearbeiten
                </h3>

                <textarea
                  value={editableCoverLetter}
                  onChange={(e) =>
                    setEditableCoverLetter(
                      e.target.value
                    )
                  }
                  className="
                    w-full
                    min-h-[320px]
                    rounded-[32px]
                    bg-white/[0.04]
                    border
                    border-white/10
                    p-6
                    text-white
                    outline-none
                    focus:border-orange-500/40
                    focus:ring-4
                    focus:ring-orange-500/10
                    transition
                    resize-none
                    leading-8
                  "
                />
              </div>

            </div>
          )}

          {loading ? (
            <div className="rounded-[36px] border border-white/10 bg-white/[0.04] p-10">
              <div className="space-y-5 text-gray-300">

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
            <div className="space-y-24">

              <section>
                <SectionHeader
                  actions={
                    <ActionButtons
                      onCopy={() =>
                        copyText(resumePart)
                      }
                      onDownload={() =>
                        exportElementToPdf(
                          resumeRef.current
                            .innerHTML,
                          "lebenslauf.pdf"
                        )
                      }
                      downloadLabel="PDF herunterladen"
                    />
                  }
                >
                  Lebenslauf
                </SectionHeader>

                <DocumentFrame
                  innerRef={resumeRef}
                >
                  {renderResumeTemplate(
                    resumePart
                  )}
                </DocumentFrame>
              </section>

              <section>
                <SectionHeader
                  actions={
                    <ActionButtons
                      onCopy={() =>
                        copyText(
                          coverLetterPart
                        )
                      }
                      onDownload={() =>
                        exportElementToPdf(
                          coverLetterRef.current
                            .innerHTML,
                          "anschreiben.pdf"
                        )
                      }
                      downloadLabel="PDF herunterladen"
                    />
                  }
                >
                  Anschreiben
                </SectionHeader>

                <DocumentFrame
                  innerRef={coverLetterRef}
                >
                  <CoverLetterTemplate
                    optimizedText={
                      coverLetterPart
                    }
                    candidateData={
                      candidateData
                    }
                  />
                </DocumentFrame>
              </section>

            </div>
          ) : selectedProduct ===
            "coverLetter" ? (
            <section>
              <SectionHeader
                actions={
                  <ActionButtons
                    onCopy={() =>
                      copyText(
                        coverLetterPart
                      )
                    }
                    onDownload={() =>
                      exportElementToPdf(
                        coverLetterRef.current
                          .innerHTML,
                        "anschreiben.pdf"
                      )
                    }
                    downloadLabel="PDF herunterladen"
                  />
                }
              >
                Anschreiben
              </SectionHeader>

              <DocumentFrame
                innerRef={coverLetterRef}
              >
                <CoverLetterTemplate
                  optimizedText={
                    coverLetterPart
                  }
                  candidateData={
                    candidateData
                  }
                />
              </DocumentFrame>
            </section>
          ) : (
            <section>
              <SectionHeader
                actions={
                  <ActionButtons
                    onCopy={() =>
                      copyText(
                        optimizedText
                      )
                    }
                    onDownload={() =>
                      exportElementToPdf(
                        resumeRef.current
                          .innerHTML,
                        "lebenslauf.pdf"
                      )
                    }
                    downloadLabel="PDF herunterladen"
                  />
                }
              >
                Lebenslauf
              </SectionHeader>

              <DocumentFrame
                innerRef={resumeRef}
              >
                {renderResumeTemplate(
                  optimizedText
                )}
              </DocumentFrame>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}