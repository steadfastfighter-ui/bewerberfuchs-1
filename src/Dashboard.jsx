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

    reader.onload = () => {
      setProfilePhoto(reader.result);
    };

    reader.readAsDataURL(file);
  }

  function removeProfilePhoto() {
    setProfilePhoto("");
  }

  function parseAiResult(data) {
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
      alert(
        "Bitte füge zuerst deinen Lebenslauftext ein oder lade eine PDF/DOCX-Datei hoch."
      );
      return;
    }

    setLoading(true);
    setAnalyzed(false);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="min-h-screen bg-[#0b0f19] text-white">
      <Topbar goHome={goHome} />

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <p className="text-orange-400 font-semibold">
              BewerberFuchs Dashboard
            </p>

            <h1 className="text-5xl font-black mt-3">Dein ATS-Report</h1>

            <p className="text-gray-400 mt-4 text-lg">
              Lade eine Datei hoch, wähle ein Design und ergänze deine
              Bewerbungsdaten.
            </p>
          </div>

          <div className="mb-8 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <p className="text-orange-400 font-semibold mb-3">
              Persönliche Daten
            </p>

            <h2 className="text-3xl font-black mb-8">
              Angaben für Lebenslauf & Anschreiben
            </h2>

            <div className="grid md:grid-cols-2 gap-5">
              <input
                type="text"
                placeholder="Vorname Nachname"
                value={candidateData.fullName || ""}
                onChange={(e) => updateCandidateData("fullName", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Berufsbezeichnung"
                value={candidateData.jobTitle || ""}
                onChange={(e) => updateCandidateData("jobTitle", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="email"
                placeholder="E-Mail"
                value={candidateData.email || ""}
                onChange={(e) => updateCandidateData("email", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Telefon"
                value={candidateData.phone || ""}
                onChange={(e) => updateCandidateData("phone", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Adresse"
                value={candidateData.address || ""}
                onChange={(e) => updateCandidateData("address", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="LinkedIn / Website optional"
                value={candidateData.linkedin || ""}
                onChange={(e) => updateCandidateData("linkedin", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Firma"
                value={candidateData.company || ""}
                onChange={(e) => updateCandidateData("company", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Ansprechpartner"
                value={candidateData.recruiter || ""}
                onChange={(e) => updateCandidateData("recruiter", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Stellenbezeichnung"
                value={candidateData.position || ""}
                onChange={(e) => updateCandidateData("position", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />

              <input
                type="text"
                placeholder="Ort"
                value={candidateData.city || ""}
                onChange={(e) => updateCandidateData("city", e.target.value)}
                className="bg-black/30 border border-white/10 rounded-2xl p-4 outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="mb-8 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <p className="text-orange-400 font-semibold mb-3">
              Stellenanzeige
            </p>

            <h2 className="text-3xl font-black mb-5">
              Jobanzeige einfügen
            </h2>

            <p className="text-gray-400 mb-6">
              Füge hier die komplette Stellenbeschreibung ein. Dadurch erstellt
              die KI ein besser passendes Anschreiben.
            </p>

            <textarea
              value={jobText || ""}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Hier Stellenanzeige einfügen..."
              className="w-full min-h-[240px] bg-black/30 border border-white/10 rounded-2xl p-5 text-white placeholder:text-gray-500 outline-none focus:border-orange-500"
            />

            <div className="mt-6 grid md:grid-cols-3 gap-4">
              <button
                onClick={() => startCheckout("resume")}
                className="bg-black text-white p-5 rounded-2xl font-bold hover:bg-neutral-900 transition text-left border border-white/10"
              >
                <div className="text-2xl mb-2">📄</div>
                <div>Lebenslauf erstellen</div>
                <div className="text-white/60 text-sm mt-1">
                  Nur mit deinen Daten + Stellenanzeige
                </div>
              </button>

              <button
                onClick={() => startCheckout("coverLetter")}
                className="bg-orange-500 text-black p-5 rounded-2xl font-black hover:bg-orange-400 transition text-left"
              >
                <div className="text-2xl mb-2">✉️</div>
                <div>Anschreiben erstellen</div>
                <div className="text-black/70 text-sm mt-1">
                  Direkt aus der Stellenanzeige
                </div>
              </button>

              <button
                onClick={() => startCheckout("bundle")}
                className="bg-white text-black p-5 rounded-2xl font-black hover:bg-gray-100 transition text-left"
              >
                <div className="text-2xl mb-2">🔥</div>
                <div>Bundle erstellen</div>
                <div className="text-black/60 text-sm mt-1">
                  Lebenslauf + Anschreiben
                </div>
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8">
              <h2 className="text-3xl font-bold mb-6">
                Lebenslauf analysieren
              </h2>

              <div className="bg-black/20 border border-dashed border-white/10 rounded-[28px] p-8 text-center mb-6">
                {!uploadedFile ? (
                  <>
                    <div className="text-5xl mb-4">📄</div>

                    <h3 className="text-2xl font-bold mb-3">
                      PDF oder DOCX hochladen
                    </h3>

                    <p className="text-gray-400 mb-6">
                      Du kannst deine Datei direkt hochladen und ohne Textfeld
                      analysieren.
                    </p>

                    <label className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-4 rounded-2xl cursor-pointer">
                      Datei auswählen
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleUpload}
                      />
                    </label>

                    <p className="text-gray-500 text-sm mt-4">
                      Erlaubt: PDF oder DOCX · Maximal 5 MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-5xl mb-4">✅</div>

                    <h3 className="text-2xl font-bold mb-2">
                      Datei erfolgreich hochgeladen
                    </h3>

                    <p className="text-gray-400 mb-2">{uploadedFile.name}</p>

                    <p className="text-gray-500 text-sm mb-6">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={analyzeFile}
                        disabled={loading}
                        className="bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-black font-bold px-8 py-4 rounded-2xl"
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
                placeholder="Oder füge hier den Text aus deinem Lebenslauf ein..."
                className="w-full min-h-[220px] bg-black/30 border border-white/10 rounded-2xl p-5 text-white placeholder:text-gray-500 outline-none focus:border-orange-500"
              />

              <button
                onClick={analyzeText}
                disabled={loading}
                className="mt-5 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-black font-bold px-8 py-4 rounded-2xl"
              >
                {loading ? "Analyse läuft..." : "Text analysieren"}
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <p className="text-gray-400 mb-2">ATS Score</p>

              <h2 className="text-6xl font-black text-orange-400 mb-6">
                {loading ? "Scan..." : result?.score ? `${result.score}%` : "--"}
              </h2>

              <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-orange-500 rounded-full transition-all duration-700"
                  style={{
                    width: loading
                      ? "45%"
                      : result?.score
                      ? `${result.score}%`
                      : "0%",
                  }}
                />
              </div>

              {loading && (
                <div className="mb-6 space-y-3 text-sm text-gray-400">
                  <div className="animate-pulse">
                    🔍 Lebenslauf wird gescannt...
                  </div>
                  <div className="animate-pulse">
                    🧠 ATS Keywords werden geprüft...
                  </div>
                  <div className="animate-pulse">
                    📊 Score wird berechnet...
                  </div>
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
                  !loading && (
                    <div className="text-gray-500">
                      Noch keine Analyse gestartet.
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <p className="text-orange-400 font-semibold mb-3">
              Design auswählen
            </p>

            <h2 className="text-3xl font-black mb-6">
              Wähle eine Vorlage für Lebenslauf oder Anschreiben
            </h2>

            <div className="grid md:grid-cols-3 gap-5">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`text-left rounded-[28px] p-5 border transition ${
                    selectedTemplate === template.id
                      ? "bg-orange-500 text-black border-orange-400"
                      : "bg-black/20 text-white border-white/10 hover:border-orange-500/50"
                  }`}
                >
                  <div className="flex justify-between items-center mb-5">
                    <div className="text-4xl">{template.icon}</div>

                    {selectedTemplate === template.id && (
                      <div className="bg-black text-white text-xs px-3 py-1 rounded-full">
                        Ausgewählt
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl p-4 mb-5 text-black min-h-[210px]">
                    {template.id === "classic" && (
                      <div>
                        <div className="h-5 bg-gray-900 rounded w-2/3 mb-3"></div>
                        <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                        <div className="h-2 bg-gray-300 rounded w-5/6 mb-5"></div>

                        <div className="border-t border-gray-300 pt-3">
                          <div className="h-3 bg-gray-800 rounded w-1/3 mb-3"></div>
                          <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-2 bg-gray-300 rounded w-4/5"></div>
                        </div>
                      </div>
                    )}

                    {template.id === "modern" && (
                      <div className="flex gap-3">
                        <div className="w-1/3 bg-orange-500 rounded-xl p-2">
                          <div className="w-12 h-12 bg-white rounded-full mb-4"></div>
                          <div className="h-2 bg-white/80 rounded mb-2"></div>
                          <div className="h-2 bg-white/60 rounded"></div>
                        </div>

                        <div className="flex-1">
                          <div className="h-5 bg-gray-900 rounded w-3/4 mb-3"></div>
                          <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                          <div className="h-2 bg-gray-300 rounded w-4/5 mb-5"></div>
                          <div className="h-3 bg-gray-800 rounded w-1/2 mb-3"></div>
                          <div className="h-2 bg-gray-300 rounded w-full mb-2"></div>
                        </div>
                      </div>
                    )}

                    {template.id === "premium" && (
                      <div>
                        <div className="bg-gray-900 rounded-xl p-3 mb-4 flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-500 rounded-full"></div>

                          <div className="flex-1">
                            <div className="h-3 bg-white rounded w-2/3 mb-2"></div>
                            <div className="h-2 bg-white/60 rounded w-1/2"></div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <div className="h-3 bg-gray-800 rounded mb-3"></div>
                            <div className="h-2 bg-gray-300 rounded mb-2"></div>
                            <div className="h-2 bg-gray-300 rounded"></div>
                          </div>

                          <div>
                            <div className="h-3 bg-orange-500 rounded mb-3"></div>
                            <div className="h-2 bg-gray-300 rounded mb-2"></div>
                            <div className="h-2 bg-gray-300 rounded"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3 className="text-2xl font-black mb-2">{template.name}</h3>

                  <p
                    className={
                      selectedTemplate === template.id
                        ? "text-black/70"
                        : "text-gray-400"
                    }
                  >
                    {template.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-white/5 border border-white/10 rounded-[32px] p-8">
            <p className="text-orange-400 font-semibold mb-3">Bewerbungsfoto</p>

            <h2 className="text-3xl font-black mb-4">
              Optional Bewerbungsbild hinzufügen
            </h2>

            <p className="text-gray-400 mb-6">
              Dein Foto kann später in modernen und Premium-Vorlagen eingebaut
              werden.
            </p>

            {!profilePhoto ? (
              <label className="inline-block bg-orange-500 hover:bg-orange-400 text-black font-bold px-8 py-4 rounded-2xl cursor-pointer">
                Foto hochladen
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => saveProfilePhoto(e.target.files[0])}
                />
              </label>
            ) : (
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <img
                  src={profilePhoto}
                  alt="Bewerbungsfoto Vorschau"
                  className="w-32 h-32 rounded-3xl object-cover border border-white/10"
                />

                <div>
                  <p className="text-green-400 font-bold mb-3">
                    ✅ Bewerbungsfoto gespeichert
                  </p>

                  <button
                    onClick={removeProfilePhoto}
                    className="border border-red-500/30 hover:border-red-500 text-red-400 font-bold px-6 py-3 rounded-2xl"
                  >
                    Foto entfernen
                  </button>
                </div>
              </div>
            )}
          </div>

          {result && (
            <div className="mt-8 space-y-8">
              <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                <p className="text-gray-400 mb-3">ATS Score</p>

                <div className="text-7xl font-black text-orange-400">
                  {result.score}%
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                  <h2 className="text-2xl font-bold mb-6">Schwächen</h2>

                  <div className="space-y-4">
                    {result.weaknesses?.map((item, index) => (
                      <div key={index} className="text-gray-300">
                        ❌ {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                  <h2 className="text-2xl font-bold mb-6">
                    Fehlende Keywords
                  </h2>

                  <div className="flex flex-wrap gap-3">
                    {result.keywords?.map((item, index) => (
                      <div
                        key={index}
                        className="bg-orange-500/20 text-orange-300 px-4 py-2 rounded-full"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
                  <h2 className="text-2xl font-bold mb-6">Verbesserungen</h2>

                  <div className="space-y-4">
                    {result.improvements?.map((item, index) => (
                      <div key={index} className="text-gray-300">
                        ✅ {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {analyzed && (
            <div className="mt-8 bg-orange-500 text-black rounded-[32px] p-8">
              <div className="mb-8">
                <p className="font-bold mb-2">
                  Premium Optimierung freischalten
                </p>

                <h2 className="text-3xl font-black">
                  Was möchtest du erstellen lassen?
                </h2>

                <p className="mt-3 text-black/70">
                  Dein ausgewähltes Design wird für dein Ergebnis übernommen.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <button
                  onClick={() => startCheckout("resume")}
                  className="bg-black text-white p-5 rounded-2xl font-bold hover:bg-neutral-900 transition text-left"
                >
                  <div className="text-2xl mb-2">📄</div>
                  <div>Lebenslauf optimieren</div>
                  <div className="text-white/60 text-sm mt-1">3€ einmalig</div>
                </button>

                <button
                  onClick={() => startCheckout("coverLetter")}
                  className="bg-black text-white p-5 rounded-2xl font-bold hover:bg-neutral-900 transition text-left"
                >
                  <div className="text-2xl mb-2">✉️</div>
                  <div>Anschreiben erstellen</div>
                  <div className="text-white/60 text-sm mt-1">3€ einmalig</div>
                </button>

                <button
                  onClick={() => startCheckout("bundle")}
                  className="bg-white text-black p-5 rounded-2xl font-black hover:bg-gray-100 transition text-left"
                >
                  <div className="text-2xl mb-2">🔥</div>
                  <div>Bundle kaufen</div>
                  <div className="text-black/60 text-sm mt-1">
                    5€ Lebenslauf + Anschreiben
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}