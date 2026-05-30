import { useState } from "react";
import toast from "react-hot-toast";
import Topbar from "./components/Topbar";

const API_URL = "https://bewerberfuchs-1.onrender.com";

export default function Dashboard({
  goHome,
  logout,
  isLoggedIn,
  goLogin,
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
    "w-full bg-black/30 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-gray-500 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition";

  const textareaClass =
    "w-full min-h-[220px] rounded-[28px] border border-white/10 bg-white/[0.04] text-white placeholder:text-gray-500 px-6 py-5 outline-none resize-none focus:border-orange-500/40 focus:ring-4 focus:ring-orange-500/10 transition leading-8";

  const cardClass =
    "bg-white/[0.04] border border-white/10 rounded-[32px] p-6 md:p-8 shadow-2xl backdrop-blur-xl";

  const templates = [
    {
      id: "classic",
      name: "Klassisch",
      description: "Seriös und schlicht.",
      icon: "📄",
    },
    {
      id: "modern",
      name: "Modern",
      description: "Klar und zeitgemäß.",
      icon: "✨",
    },
    {
      id: "premium",
      name: "Premium",
      description: "Hochwertiger erster Eindruck.",
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
      toast.error("Bitte lade nur ein Bild hoch.");
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error("Das Bild ist zu groß. Maximal 3 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setProfilePhoto(reader.result);
    reader.readAsDataURL(file);
  }

  function removeProfilePhoto() {
    setProfilePhoto("");
    toast.success("Foto entfernt.");
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
        improvements: ["Bitte Analyse erneut starten oder Text kürzen."],
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
      toast.error("Bitte nur PDF oder DOCX hochladen.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Die Datei ist zu groß. Maximal 5 MB.");
      return;
    }

    setUploadedFile(file);
    setAnalyzed(false);
    setResult(null);
    toast.success("Datei erfolgreich hochgeladen.");
  }

  async function analyzeText() {
    if (!resumeText.trim()) {
      toast.error("Bitte zuerst Lebenslauftext einfügen oder Datei hochladen.");
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
        toast.error(data.error || "Analyse fehlgeschlagen.");
        return;
      }

      setResult(parseAiResult(data));
      setAnalyzed(true);
      toast.success("Analyse abgeschlossen.");
    } catch {
      setResult({
        score: 0,
        weaknesses: ["Fehler bei der Analyse. Prüfe dein Backend."],
        keywords: [],
        improvements: ["Backend-Verbindung prüfen."],
      });
      setAnalyzed(true);
      toast.error("Analyse fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  async function analyzeFile() {
    if (!uploadedFile) {
      toast.error("Bitte zuerst eine PDF- oder DOCX-Datei hochladen.");
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
        toast.error(data.error || "Datei-Analyse fehlgeschlagen.");
        return;
      }

      setResult(parseAiResult(data));
      saveResumeText(data.extractedText || "");
      setAnalyzed(true);
      toast.success("Datei erfolgreich analysiert.");
    } catch {
      toast.error("Datei-Analyse fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  }

  function removeFile() {
    setUploadedFile(null);
    setAnalyzed(false);
    setResult(null);
    toast.success("Datei entfernt.");
  }

  return (
    <div className="min-h-screen bg-[#070b14] text-white overflow-x-hidden">
      <Topbar
        goHome={goHome}
        logout={logout}
        isLoggedIn={isLoggedIn}
        goLogin={goLogin}
      />

      <main className="px-5 md:px-8 xl:px-14 py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto">

          <section className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center mb-14 md:mb-20">
            <div>
              <div className="inline-flex px-4 py-2 rounded-full bg-orange-400/10 border border-orange-500/20 text-orange-400 mb-5 text-sm font-bold">
                Kostenloser ATS-Check
              </div>

              <h1 className="text-4xl md:text-5xl xl:text-6xl font-black leading-[1.02] tracking-tight mb-5">
                Mehr Interviews mit
                <span className="block text-orange-500">
                  besseren Bewerbungen.
                </span>
              </h1>
                <div className="flex items-center gap-3 mb-7">
  <div className="flex -space-x-2">
    <div className="w-8 h-8 rounded-full bg-orange-500 border border-black" />
    <div className="w-8 h-8 rounded-full bg-white border border-black" />
    <div className="w-8 h-8 rounded-full bg-green-500 border border-black" />
  </div>

  <p className="text-sm text-gray-400">
    Bereits über <span className="text-white font-bold">500+</span> Bewerbungen optimiert
  </p>
</div>
              <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-8">
                Analysiere deinen Lebenslauf, erkenne fehlende Keywords und
                optimiere deine Bewerbung für Recruiter und ATS-Systeme.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-7">
                <button
                  onClick={() => (uploadedFile ? analyzeFile() : analyzeText())}
                  disabled={loading}
                  className="bg-orange-400 hover:bg-orange-400 disabled:opacity-60 text-black font-black px-8 py-4 rounded-2xl text-base md:text-lg transition"
                >
                  {loading ? "Analyse läuft..." : "Kostenlos analysieren"}
                </button>

                <button
                  onClick={() =>
                    document
                      .getElementById("templates")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="border border-white/10 hover:border-orange-500/40 bg-white/[0.03] px-8 py-4 rounded-2xl font-bold text-white transition"
                >
                  Vorlagen ansehen
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div>Keine Abos</div>
                <div>ATS optimiert</div>
                <div>PDF Export</div>
                <div>Sofort nutzbar</div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-orange-400/10 blur-[80px] rounded-full" />

              <div className="relative bg-white/[0.04] border border-white/10 rounded-[34px] p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-gray-400 text-sm">Live Vorschau</p>
                    <h3 className="text-2xl font-black">
                      BewerberFuchs AI
                    </h3>
                  </div>

                  <div className="bg-orange-400 text-black px-4 py-2 rounded-2xl font-black">
                    91%
                  </div>
                </div>

                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-8">
                  <div className="h-full w-[91%] bg-orange-400 rounded-full" />
                </div>

                <div className="rounded-[28px] border border-white/10 bg-black/25 p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-black text-orange-400">12</div>
                      <p className="text-gray-500 text-xs">Keywords</p>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-green-400">+43%</div>
                      <p className="text-gray-500 text-xs">ATS Plus</p>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">30s</div>
                      <p className="text-gray-500 text-xs">Analyse</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              ["500+", "Bewerbungen optimiert"],
              ["91%", "ATS Erfolgsquote"],
              ["<30s", "Analysezeit"],
              ["PDF", "Sofortiger Export"],
            ].map((item) => (
              <div
                key={item[0]}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl"
              >
                <div className="text-2xl font-black text-orange-400 mb-1">
                  {item[0]}
                </div>
                <p className="text-gray-400 text-sm">{item[1]}</p>
              </div>
            ))}
          </section>

          <section className="grid lg:grid-cols-3 gap-8 items-start">
            <div className={`lg:col-span-2 ${cardClass}`}>
              <p className="text-orange-400 font-bold mb-3">Schritt 1</p>

              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Lebenslauf einfügen oder hochladen
              </h2>

              <p className="text-gray-400 text-base md:text-lg mb-7">
                Lade eine PDF/DOCX hoch oder füge den Text direkt ein.
              </p>

              <div className="bg-white/[0.03] border border-dashed border-orange-500/25 rounded-[28px] p-6 text-center mb-5">
                {!uploadedFile ? (
                  <>
                    <div className="text-4xl mb-4">📄</div>
                    <h3 className="text-2xl font-black mb-3">
                      PDF oder DOCX hochladen
                    </h3>
                    <p className="text-gray-400 mb-5">
                      Die Datei wird automatisch ausgelesen.
                    </p>

                    <label className="inline-block bg-orange-400 hover:bg-orange-400 text-black font-black px-7 py-4 rounded-2xl cursor-pointer transition">
                      Datei auswählen
                      <input
                        type="file"
                        accept=".pdf,.docx"
                        className="hidden"
                        onChange={handleUpload}
                      />
                    </label>

                    <p className="text-gray-500 text-sm mt-4">
                      PDF oder DOCX · maximal 5 MB
                    </p>
                  </>
                ) : (
                  <>
                    <div className="text-4xl mb-4">✅</div>
                    <h3 className="text-2xl font-black mb-2">
                      Datei hochgeladen
                    </h3>

                    <p className="text-gray-400 mb-2 break-words">
                      {uploadedFile.name}
                    </p>

                    <p className="text-gray-500 text-sm mb-5">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <button
                        onClick={analyzeFile}
                        disabled={loading}
                        className="bg-orange-400 hover:bg-orange-400 disabled:opacity-60 text-black font-black px-7 py-4 rounded-2xl"
                      >
                        {loading ? "Analyse läuft..." : "Datei analysieren"}
                      </button>

                      <button
                        onClick={removeFile}
                        disabled={loading}
                        className="border border-red-500/30 hover:border-red-500 disabled:opacity-60 text-red-400 font-bold px-7 py-4 rounded-2xl"
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
                className="mt-6 w-full bg-orange-400 hover:bg-orange-400 disabled:opacity-60 text-black font-black text-lg py-5 rounded-2xl transition"
              >
                {loading ? "Analyse läuft..." : "Lebenslauf kostenlos analysieren"}
              </button>
            </div>

            <div className={cardClass}>
              <p className="text-gray-400 mb-2">ATS Score</p>

              <h2 className="text-5xl md:text-6xl font-black text-orange-400 mb-7">
                {loading ? "Scan..." : result?.score ? `${result.score}%` : "--"}
              </h2>

              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-7">
                <div
                  className="h-full bg-orange-400 rounded-full transition-all duration-700"
                  style={{
                    width: loading ? "45%" : result?.score ? `${result.score}%` : "0%",
                  }}
                />
              </div>

              {loading ? (
                <div className="space-y-3 text-sm text-gray-400">
                  <div>Lebenslauf wird gescannt...</div>
                  <div>ATS Keywords werden geprüft...</div>
                  <div>Score wird berechnet...</div>
                </div>
              ) : analyzed ? (
                <div className="space-y-3 text-gray-300">
                  <div>Analyse abgeschlossen</div>
                  <div>ATS-Score berechnet</div>
                  <div>Keywords geprüft</div>
                </div>
              ) : (
                <div className="text-gray-500">
                  Noch keine Analyse gestartet.
                </div>
              )}
            </div>
          </section>

          <section className={`${cardClass} mt-8`}>
            <p className="text-orange-400 font-bold mb-3">Schritt 2</p>

            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Stellenanzeige hinzufügen
            </h2>

            <p className="text-gray-400 mb-5">
              Optional: Füge die Stellenanzeige ein, damit BewerberFuchs relevante Keywords erkennt.
            </p>

            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Kopiere hier die Stellenanzeige hinein..."
              className={textareaClass}
            />
          </section>

          <section id="templates" className={`${cardClass} mt-8`}>
            <p className="text-orange-400 font-bold mb-3">Schritt 3</p>

            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Vorlage wählen
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {templates.map((template) => {
                const active = selectedTemplate === template.id;

                return (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`text-left rounded-[24px] border p-5 transition ${
                      active
                        ? "bg-orange-400 text-black border-orange-400"
                        : "bg-black/30 text-white border-white/10 hover:border-orange-500/50"
                    }`}
                  >
                    <div className="text-3xl mb-4">{template.icon}</div>
                    <h3 className="text-xl font-black mb-2">
                      {template.name}
                    </h3>
                    <p className={active ? "text-black/70" : "text-gray-400"}>
                      {template.description}
                    </p>

                    <div
                      className={`mt-5 rounded-2xl py-3 text-center font-black ${
                        active
                          ? "bg-black text-white"
                          : "bg-orange-400 text-black"
                      }`}
                    >
                      {active ? "Ausgewählt" : "Auswählen"}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <details className={`${cardClass} mt-8`}>
            <summary className="cursor-pointer list-none">
              <p className="text-orange-400 font-bold mb-3">Optional</p>
              <h2 className="text-3xl md:text-4xl font-black mb-3">
                Persönliche Angaben
              </h2>
              <p className="text-gray-400">
                Öffnen, wenn du Daten direkt für Lebenslauf und Anschreiben speichern möchtest.
              </p>
            </summary>

            <div className="grid md:grid-cols-2 gap-4 mt-8">
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

          <section className={`${cardClass} mt-8`}>
            <p className="text-orange-400 font-bold mb-3">Optional</p>

            <h2 className="text-3xl md:text-4xl font-black mb-4">
              Bewerbungsbild
            </h2>

            {!profilePhoto ? (
              <label className="inline-block bg-orange-400 hover:bg-orange-400 text-black font-bold px-7 py-4 rounded-2xl cursor-pointer">
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
                    Bewerbungsfoto gespeichert
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
          </section>

          {result && (
            <section className="mt-8 grid lg:grid-cols-3 gap-6">
              <div className={cardClass}>
                <h2 className="text-2xl font-black mb-5">Schwächen</h2>
                <div className="space-y-3 text-gray-300">
                  {result.weaknesses?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </div>

              <div className={cardClass}>
                <h2 className="text-2xl font-black mb-5">Keywords</h2>
                <div className="flex flex-wrap gap-3">
                  {result.keywords?.map((item, index) => (
                    <div
                      key={index}
                      className="bg-orange-400/15 text-orange-300 px-4 py-2 rounded-full"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className={cardClass}>
                <h2 className="text-2xl font-black mb-5">Verbesserungen</h2>
                <div className="space-y-3 text-gray-300">
                  {result.improvements?.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {analyzed && (
            <section className="mt-10 rounded-[32px] border border-orange-500/20 bg-orange-400 p-[1px]">
              <div className="rounded-[32px] bg-[#111827] p-6 md:p-10">
                <div className="text-center mb-8">
                  <p className="text-orange-400 font-bold mb-3">
                    Premium Optimierung
                  </p>

                  <h2 className="text-3xl md:text-5xl font-black mb-4">
                    Bewerbung professionell optimieren
                  </h2>

                  <p className="text-gray-400 max-w-2xl mx-auto">
                    ATS optimierte Unterlagen mit modernen Vorlagen,
                    Recruiter Keywords und PDF Export.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-5">
                  <PremiumCard
                    icon="📄"
                    title="Starter"
                    price="4,99€"
                    items={["ATS Lebenslauf", "Moderne Vorlage", "PDF Download"]}
                    onClick={() => startCheckout("resume")}
                  />

                  <PremiumCard
                    icon="✉️"
                    title="Anschreiben Pro"
                    price="4,99€"
                    items={["Individuelles Anschreiben", "ATS Keywords", "Sofort Export"]}
                    onClick={() => startCheckout("coverLetter")}
                  />

                  <PremiumCard
                    icon="🔥"
                    title="Pro Bundle"
                    price="7,99€"
                    items={["Lebenslauf + Anschreiben", "Premium ATS", "PDF Download"]}
                    highlight
                    onClick={() => startCheckout("bundle")}
                  />
                </div>
              </div>
            </section>
          )}

          <div className="h-24 md:hidden" />
        </div>
      </main>
    </div>
  );
}

function PremiumCard({ icon, title, price, items, onClick, highlight }) {
  return (
    <button
      onClick={onClick}
      className={`group rounded-[28px] border p-6 text-left transition ${
        highlight
          ? "bg-orange-400 text-black border-orange-400"
          : "bg-black/30 text-white border-white/10 hover:border-orange-500/40"
      }`}
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-2xl font-black mb-2">{title}</h3>
      <div className="text-5xl font-black mb-5">{price}</div>

      <div className="space-y-2 mb-5 text-sm">
        {items.map((item) => (
          <div key={item}>✓ {item}</div>
        ))}
      </div>

      <div
        className={`w-full rounded-2xl py-4 text-center font-black ${
          highlight
            ? "bg-black text-white"
            : "bg-orange-400 text-black"
        }`}
      >
        Auswählen
      </div>
    </button>
  );
}