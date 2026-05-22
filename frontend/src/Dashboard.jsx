import { useState } from "react";
import Topbar from "./components/Topbar";

const API_URL = "https://bewerberfuchs-1.onrender.com";

export default function Dashboard({
  goHome,
  goCheckout,
  setAppResumeText,
  selectedTemplate,
  setSelectedTemplate,
  profilePhoto,
  setProfilePhoto,
  candidateData,
  setCandidateData,
  jobText,
  setJobText,
}) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resumeText, setResumeText] = useState("");

  const inputClass =
    "w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-[16px] md:text-lg text-white placeholder:text-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all";

  const textareaClass =
    "w-full min-h-[190px] md:min-h-[230px] rounded-[24px] border border-orange-500/40 bg-[#060b14] text-white placeholder:text-gray-500 text-[16px] md:text-lg leading-relaxed px-6 py-6 outline-none resize-none focus:border-orange-400 focus:ring-4 focus:ring-orange-500/20 transition-all";

  const cardClass =
    "bg-gradient-to-b from-white/[0.07] to-white/[0.03] border border-white/10 rounded-[28px] md:rounded-[36px] px-6 py-7 md:p-10 shadow-[0_10px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl";

  const templates = [
    {
      id: "classic",
      name: "Klassisch",
      description: "Seriös, schlicht, perfekt für Behörden, Lager und Büro.",
      icon: "📄",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Frisch, klar und ideal für moderne Unternehmen.",
      icon: "✨",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Hochwertiger Look mit starkem ersten Eindruck.",
      icon: "🔥",
    },
  ];

  function updateCandidateData(field, value) {
    setCandidateData({
      ...candidateData,
      [field]: value,
    });
  }

  function saveResumeText(text) {
    setResumeText(text);
    setAppResumeText(text);
    localStorage.setItem("resumeText", text);
  }

  function startCheckout(product) {
    localStorage.setItem("selectedProduct", product);
    goCheckout(product);
  }

  function saveProfilePhoto(file) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Bitte lade nur ein Bild hoch.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      alert("Das Bild ist zu groß. Bitte maximal 3 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function removeProfilePhoto() {
    setProfilePhoto("");
  }

  function parseAiResult(data) {
    if (typeof data.result === "object") return data.result;

    try {
      return JSON.parse(data.result);
    } catch {
      return {
        score: 75,
        weaknesses: ["Die KI-Antwort konnte nicht sauber gelesen werden."],
        keywords: ["ATS", "Erfahrung", "Skills"],
        improvements: ["Bitte Analyse erneut starten oder Datei/Text kürzen."],
      };
    }
  }

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Bitte lade nur eine PDF- oder DOCX-Datei hoch.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Die Datei ist zu groß. Bitte maximal 5 MB hochladen.");
      return;
    }

    setUploadedFile(file);
    setAnalyzed(false);
    setResult(null);
  }

  async function analyzeText() {
    if (!resumeText.trim()) {
      alert("Bitte füge zuerst deinen Lebenslauftext ein oder lade eine PDF/DOCX-Datei hoch.");
      return;
    }

    setLoading(true);
    setAnalyzed(false);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Analyse fehlgeschlagen.");
        return;
      }

      setResult(parseAiResult(data));
      setAnalyzed(true);
    } catch {
      setResult({
        score: 0,
        weaknesses: ["Fehler bei der Analyse. Prüfe, ob dein Backend läuft."],
        keywords: [],
        improvements: ["Backend-Verbindung prüfen."],
      });
      setAnalyzed(true);
    } finally {
      setLoading(false);
    }
  }

  async function analyzeFile() {
    if (!uploadedFile) {
      alert("Bitte lade zuerst eine PDF- oder DOCX-Datei hoch.");
      return;
    }

    setLoading(true);
    setAnalyzed(false);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("resume", uploadedFile);

      const response = await fetch(`${API_URL}/analyze-pdf`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Datei Analyse fehlgeschlagen.");
        return;
      }

      setResult(parseAiResult(data));
      saveResumeText(data.extractedText || "");
      setAnalyzed(true);
    } catch {
      alert("Datei Analyse fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  function removeFile() {
    setUploadedFile(null);
    setAnalyzed(false);
    setResult(null);
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-white overflow-x-hidden">
      <Topbar goHome={goHome} />

      <div className="px-5 md:px-8 xl:px-14 py-8 md:py-10 bg-[radial-gradient(circle_at_top,rgba(255,122,0,0.08),transparent_35%)]">
        <div className="max-w-[1450px] mx-auto">
          <div className="mb-8 md:mb-12 max-w-5xl">
            <div className="inline-flex px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 mb-5 md:mb-6 text-sm md:text-base">
              🚀 Kostenloser ATS-Check
            </div>

            <h1 className="text-4xl md:text-6xl xl:text-7xl font-black leading-[1.02] tracking-tight mb-5 md:mb-7 max-w-6xl">
              Mehr Einladungen mit ATS-optimierten Bewerbungen.
            </h1>

            <p className="text-gray-400 text-base md:text-xl max-w-4xl leading-relaxed">
              Analysiere deinen Lebenslauf kostenlos in unter 30 Sekunden. BewerberFuchs erkennt ATS-Keywords,
              Schwächen und Optimierungspotenzial.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-10 items-start">
            <div className={`lg:col-span-2 ${cardClass}`}>
              <div className="mb-6">
                <p className="text-orange-400 font-bold mb-3">Schritt 1</p>
                <h2 className="text-3xl md:text-4xl font-black mb-3">
                  Lebenslauf hochladen oder Text einfügen
                </h2>
                <p className="text-gray-400 text-base md:text-lg">
                  Starte mit deinem Lebenslauf. Du kannst eine PDF/DOCX-Datei hochladen oder den Text direkt einfügen.
                </p>
              </div>

              <div className="bg-white/[0.03] border border-dashed border-orange-500/25 rounded-[24px] md:rounded-[28px] p-5 md:p-8 text-center mb-6">
                {!uploadedFile ? (
                  <>
                    <div className="text-4xl md:text-5xl mb-4">📄</div>
                    <h3 className="text-2xl md:text-3xl font-black mb-3">
                      PDF oder DOCX hochladen
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Die Datei wird automatisch ausgelesen und analysiert.
                    </p>

                    <label className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-black px-8 py-4 rounded-2xl cursor-pointer shadow-[0_0_35px_rgba(255,120,0,0.2)] transition-all">
                      Datei auswählen
                      <input type="file" accept=".pdf,.docx" className="hidden" onChange={handleUpload} />
                    </label>

                    <p className="text-gray-500 text-sm mt-4">
                      Erlaubt: PDF oder DOCX · Maximal 5 MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl md:text-5xl mb-4">✅</div>
                    <h3 className="text-2xl md:text-3xl font-black mb-2">
                      Datei erfolgreich hochgeladen
                    </h3>
                    <p className="text-gray-400 mb-2 break-words">{uploadedFile.name}</p>
                    <p className="text-gray-500 text-sm mb-6">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={analyzeFile}
                        disabled={loading}
                        className="bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-black font-black px-8 py-4 rounded-2xl"
                      >
                        {loading ? "Analyse läuft..." : "Datei analysieren"}
                      </button>

                      <button
                        onClick={removeFile}
                        disabled={loading}
                        className="border border-red-500/30 hover:border-red-500 disabled:opacity-60 text-red-400 font-bold px-8 py-4 rounded-2xl"
                      >
                        Datei entfernen
                      </button>
                    </div>
                  </>
                )}
              </div>

              <textarea
                value={resumeText}
                onChange={(e) => saveResumeText(e.target.value)}
                placeholder="Oder füge hier deinen Lebenslauftext ein..."
                className={textareaClass}
              />

              <button
                onClick={analyzeText}
                disabled={loading}
                className="mt-6 w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-black font-black text-lg py-5 rounded-2xl shadow-[0_0_35px_rgba(255,120,0,0.25)] transition-all"
              >
                {loading ? "Analyse läuft..." : "🚀 Lebenslauf kostenlos analysieren"}
              </button>
            </div>

            <div className="bg-gradient-to-b from-orange-500/10 to-black border border-orange-500/20 rounded-[36px] p-8 shadow-[0_0_50px_rgba(255,120,0,0.12)] backdrop-blur-xl">
              <p className="text-gray-400 mb-2">ATS Score</p>

              <h2 className="text-5xl md:text-6xl xl:text-7xl font-black text-orange-400 mb-8 tracking-tight">
                {loading ? "Scan..." : result?.score ? `${result.score}%` : "--"}
              </h2>

              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-700"
                  style={{
                    width: loading ? "45%" : result?.score ? `${result.score}%` : "0%",
                  }}
                />
              </div>

              {loading && (
                <div className="mb-6 space-y-3 text-sm text-gray-400">
                  <div className="animate-pulse">🔍 Lebenslauf wird gescannt...</div>
                  <div className="animate-pulse">🧠 ATS Keywords werden geprüft...</div>
                  <div className="animate-pulse">📊 Score wird berechnet...</div>
                </div>
              )}

              <div className="space-y-4 text-gray-300">
                {analyzed ? (
                  <>
                    <div>✅ Analyse abgeschlossen</div>
                    <div>✅ ATS-Score berechnet</div>
                    <div>✅ Keywords geprüft</div>
                    <div>⚠️ Empfehlungen unten ansehen</div>
                  </>
                ) : (
                  !loading && <div className="text-gray-500">Noch keine Analyse gestartet.</div>
                )}
              </div>
            </div>
          </div>

          <div className={`${cardClass} mt-8 md:mt-10`}>
            <p className="text-orange-400 font-semibold mb-3">Schritt 2</p>

            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Stelle mit analysieren
            </h2>

            <p className="text-gray-400 mb-6 leading-relaxed text-base md:text-lg">
              Füge hier die komplette Stellenanzeige ein. BewerberFuchs erkennt automatisch ATS-Keywords,
              Fähigkeiten und Anforderungen.
            </p>

            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Kopiere hier die Stellenanzeige hinein..."
              className={textareaClass}
            />
          </div>

          <div className={`${cardClass} mt-8 md:mt-10`}>
            <div className="mb-6">
              <p className="text-orange-400 font-bold mb-3">Schritt 3</p>

              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Vorlage wählen
              </h2>

              <p className="text-gray-400 text-base md:text-lg">
                Wähle einen Stil für deine fertigen Unterlagen. Du kannst die Vorlage später noch ändern.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => {
                const active = selectedTemplate === template.id;

                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`relative text-left rounded-[24px] border p-4 transition-all overflow-hidden ${
                      active
                        ? "bg-orange-500 text-black border-orange-400 shadow-2xl shadow-orange-500/20"
                        : "bg-black/30 text-white border-white/10 hover:border-orange-500/60 hover:bg-white/5"
                    }`}
                  >
                    {active && (
                      <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                        Ausgewählt
                      </div>
                    )}

                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${
                        active ? "bg-black/15" : "bg-white/5"
                      }`}>
                        {template.icon}
                      </div>

                      <div className="pr-8">
                        <h3 className="text-xl md:text-2xl font-black">{template.name}</h3>
                        <p className={active ? "text-black/70 text-sm" : "text-gray-400 text-sm"}>
                          {template.description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-3 mb-4 text-black h-[110px] md:h-[150px] overflow-hidden">
                      {template.id === "classic" && (
                        <div>
                          <div className="h-4 bg-gray-900 rounded w-2/3 mb-3"></div>
                          <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-2 bg-gray-300 rounded w-5/6 mb-4"></div>
                          <div className="border-t border-gray-300 pt-3">
                            <div className="h-3 bg-gray-800 rounded w-1/3 mb-3"></div>
                            <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                          </div>
                        </div>
                      )}

                      {template.id === "modern" && (
                        <div className="flex gap-3 h-full">
                          <div className="w-1/3 bg-orange-500 rounded-xl p-2">
                            <div className="w-9 h-9 bg-white rounded-full mb-3"></div>
                            <div className="h-2 bg-white/80 rounded mb-2"></div>
                          </div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-900 rounded w-3/4 mb-3"></div>
                            <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                            <div className="h-2 bg-gray-300 rounded w-4/5 mb-4"></div>
                            <div className="h-3 bg-gray-800 rounded w-1/2 mb-3"></div>
                          </div>
                        </div>
                      )}

                      {template.id === "premium" && (
                        <div>
                          <div className="bg-gray-900 rounded-xl p-3 mb-4 flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-500 rounded-full"></div>
                            <div className="flex-1">
                              <div className="h-3 bg-white rounded w-2/3 mb-2"></div>
                              <div className="h-2 bg-white/60 rounded w-1/2"></div>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <div className="h-3 bg-gray-800 rounded mb-3"></div>
                              <div className="h-2 bg-gray-300 rounded"></div>
                            </div>
                            <div>
                              <div className="h-3 bg-orange-500 rounded mb-3"></div>
                              <div className="h-2 bg-gray-300 rounded"></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className={`w-full text-center rounded-2xl py-3 font-black ${
                      active ? "bg-black text-white" : "bg-orange-500 text-black"
                    }`}>
                      {active ? "✓ Vorlage ausgewählt" : "Diese Vorlage wählen"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <details className={`${cardClass} mt-8 md:mt-10`}>
            <summary className="cursor-pointer list-none">
              <p className="text-orange-400 font-semibold mb-3">Optional</p>
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Persönliche Angaben hinzufügen
              </h2>
              <p className="text-gray-400">
                Öffnen, wenn du Daten direkt für Lebenslauf und Anschreiben speichern möchtest.
              </p>
            </summary>

            <div className="grid md:grid-cols-2 gap-4 md:gap-5 mt-8">
              <input type="text" placeholder="Vorname Nachname" value={candidateData.fullName || ""} onChange={(e) => updateCandidateData("fullName", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Berufsbezeichnung" value={candidateData.jobTitle || ""} onChange={(e) => updateCandidateData("jobTitle", e.target.value)} className={inputClass} />
              <input type="email" placeholder="E-Mail" value={candidateData.email || ""} onChange={(e) => updateCandidateData("email", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Telefon" value={candidateData.phone || ""} onChange={(e) => updateCandidateData("phone", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Adresse" value={candidateData.address || ""} onChange={(e) => updateCandidateData("address", e.target.value)} className={inputClass} />
              <input type="text" placeholder="LinkedIn / Website optional" value={candidateData.linkedin || ""} onChange={(e) => updateCandidateData("linkedin", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Firma" value={candidateData.company || ""} onChange={(e) => updateCandidateData("company", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Ansprechpartner" value={candidateData.recruiter || ""} onChange={(e) => updateCandidateData("recruiter", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Stellenbezeichnung" value={candidateData.position || ""} onChange={(e) => updateCandidateData("position", e.target.value)} className={inputClass} />
              <input type="text" placeholder="Ort" value={candidateData.city || ""} onChange={(e) => updateCandidateData("city", e.target.value)} className={inputClass} />
            </div>
          </details>

          <div className={`${cardClass} mt-8`}>
            <p className="text-orange-400 font-semibold mb-3">Optional</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Bewerbungsbild hinzufügen</h2>
            <p className="text-gray-400 mb-6">
              Dein Foto kann später in modernen und Premium-Vorlagen eingebaut werden.
            </p>

            {!profilePhoto ? (
              <label className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-4 rounded-2xl cursor-pointer">
                Foto hochladen
                <input type="file" accept="image/*" className="hidden" onChange={(e) => saveProfilePhoto(e.target.files[0])} />
              </label>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <img src={profilePhoto} alt="Bewerbungsfoto Vorschau" className="w-32 h-32 rounded-3xl object-cover border border-white/10" />
                <div>
                  <p className="text-green-400 font-bold mb-3">✅ Bewerbungsfoto gespeichert</p>
                  <button onClick={removeProfilePhoto} className="border border-red-500/30 hover:border-red-500 text-red-400 font-bold px-6 py-3 rounded-2xl">
                    Foto entfernen
                  </button>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="mt-8 space-y-8">
              <div className={cardClass}>
                <p className="text-gray-400 mb-3">ATS Score</p>
                <div className="text-5xl md:text-7xl font-black text-orange-400">{result.score}%</div>
              </div>

              <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                <div className={cardClass}>
                  <h2 className="text-2xl font-bold mb-6">Schwächen</h2>
                  <div className="space-y-4">
                    {result.weaknesses?.map((item, index) => (
                      <div key={index} className="text-gray-300">❌ {item}</div>
                    ))}
                  </div>
                </div>

                <div className={cardClass}>
                  <h2 className="text-2xl font-bold mb-6">Fehlende Keywords</h2>
                  <div className="flex flex-wrap gap-3">
                    {result.keywords?.map((item, index) => (
                      <div key={index} className="bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full">{item}</div>
                    ))}
                  </div>
                </div>

                <div className={cardClass}>
                  <h2 className="text-2xl font-bold mb-6">Verbesserungen</h2>
                  <div className="space-y-4">
                    {result.improvements?.map((item, index) => (
                      <div key={index} className="text-gray-300">✅ {item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {analyzed && (
            <div className="mt-10 rounded-[32px] border border-orange-500/20 bg-gradient-to-br from-orange-500 to-orange-600 p-[1px] shadow-[0_0_60px_rgba(255,120,0,0.18)]">
              <div className="rounded-[32px] bg-[#111827] p-6 md:p-10">
                <div className="mb-8 text-center">
                  <p className="text-orange-400 font-bold uppercase tracking-wide mb-3">
                    Premium Optimierung
                  </p>

                  <h2 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
                    Deine Bewerbung professionell optimieren
                  </h2>

                  <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
                    ATS optimierte Unterlagen mit modernen Vorlagen,
                    Recruiter Keywords und sofortigem PDF Export.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <button
                    onClick={() => startCheckout("resume")}
                    className="group rounded-[28px] border border-white/10 bg-black/30 hover:border-orange-500/40 hover:bg-black/40 transition-all p-6 text-left"
                  >
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-2xl font-black mb-2 text-white">Starter</h3>
                    <div className="text-5xl font-black text-orange-400 mb-4">4,99€</div>

                    <div className="space-y-2 text-gray-300 mb-6 text-sm">
                      <div>✓ ATS optimierter Lebenslauf</div>
                      <div>✓ Moderne Vorlage</div>
                      <div>✓ PDF Download</div>
                    </div>

                    <div className="w-full rounded-2xl bg-orange-500 text-black font-black py-4 text-center group-hover:bg-orange-400 transition">
                      Starter freischalten
                    </div>
                  </button>

                  <button
                    onClick={() => startCheckout("coverLetter")}
                    className="group rounded-[28px] border border-white/10 bg-black/30 hover:border-orange-500/40 hover:bg-black/40 transition-all p-6 text-left"
                  >
                    <div className="text-4xl mb-4">✉️</div>
                    <h3 className="text-2xl font-black mb-2 text-white">Anschreiben Pro</h3>
                    <div className="text-5xl font-black text-orange-400 mb-4">4,99€</div>

                    <div className="space-y-2 text-gray-300 mb-6 text-sm">
                      <div>✓ Individuelles Anschreiben</div>
                      <div>✓ ATS Keywords integriert</div>
                      <div>✓ Sofortiger Export</div>
                    </div>

                    <div className="w-full rounded-2xl bg-orange-500 text-black font-black py-4 text-center group-hover:bg-orange-400 transition">
                      Anschreiben erstellen
                    </div>
                  </button>

                  <button
                    onClick={() => startCheckout("bundle")}
                    className="group relative overflow-hidden rounded-[28px] border border-orange-400 bg-orange-500 text-black p-6 text-left shadow-[0_0_40px_rgba(255,120,0,0.25)]"
                  >
                    <div className="absolute top-4 right-4 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                      BELIEBT
                    </div>

                    <div className="text-4xl mb-4">🔥</div>
                    <h3 className="text-2xl font-black mb-2">Pro Bundle</h3>
                    <div className="text-6xl font-black mb-4">7,99€</div>

                    <div className="space-y-2 mb-6 text-sm">
                      <div>✓ Lebenslauf + Anschreiben</div>
                      <div>✓ Premium ATS Optimierung</div>
                      <div>✓ Recruiter Keywords</div>
                      <div>✓ PDF Download</div>
                    </div>

                    <div className="w-full rounded-2xl bg-black text-white font-black py-4 text-center hover:bg-neutral-900 transition">
                      Bundle starten
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
