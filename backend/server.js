import Stripe from "stripe";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import mammoth from "mammoth";
import { createRequire } from "module";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

dotenv.config();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const requireModule = createRequire(import.meta.url);
const pdfParse = requireModule("pdf-parse");

const app = express();

app.use(helmet());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

const allowedOrigins = [
  "http://localhost:5173",
  "https://bewerberfuchs.eu",
  "https://www.bewerberfuchs.eu",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Nicht erlaubte CORS Origin"));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Nur PDF oder DOCX erlaubt."));
    }

    cb(null, true);
  },
});

function safeParseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    return {
      score: 70,
      weaknesses: ["Die Analyse konnte nicht sauber gelesen werden."],
      keywords: [],
      improvements: ["Bitte Analyse erneut starten."],
    };
  }
}

function buildAnalysisPrompt(resumeText) {
  return `
Analysiere diesen Lebenslauf professionell auf Deutsch.

Antworte NUR als valides JSON.
Keine Markdown-Zeichen.
Keine Erklärung außerhalb vom JSON.

Format:
{
  "score": 85,
  "weaknesses": ["Schwäche 1"],
  "keywords": ["Keyword 1"],
  "improvements": ["Verbesserung 1"]
}

Lebenslauf:
${resumeText || ""}
`;
}

function buildProductPrompt(product) {
  if (product === "coverLetter") {
    return `
Erstelle NUR den Haupttext eines professionellen deutschen Anschreibens.

WICHTIG:
- KEIN Lebenslauf.
- KEINE Abschnitte wie PROFIL, BERUFLICHE ERFAHRUNG, KENNTNISSE, STÄRKEN oder AUSBILDUNG.
- KEINE Absenderdaten.
- KEINE Empfängerdaten.
- KEIN Datum.
- KEIN Betreff.
- KEINE Grußformel.
- KEINE Wiederholung von "Mit freundlichen Grüßen".
- Beginne direkt mit der Anrede.
- Schreibe nur das Anschreiben.
- Passe das Anschreiben gezielt auf die Stellenanzeige an.
`;
  }

  if (product === "resume") {
    return `
Erstelle NUR einen professionell optimierten Lebenslauftext.

WICHTIG:
- KEIN Anschreiben.
- Keine Anrede.
- Keine Grußformel.
- Keine Absenderdaten.
- Keine Empfängerdaten.
- Nur Lebenslauf-Inhalte.
- Optimiere den Lebenslauf passend zur Stellenanzeige.

Gib den Lebenslauf EXAKT in diesem Format aus:

PROFIL
Kurzes professionelles Profil ohne Überschrift im Satz.

BERUFSERFAHRUNG
Saubere Einträge mit Zeitraum, Position, Unternehmen und Aufgaben.

KENNTNISSE
Kurze Stichpunkte zu relevanten Kenntnissen.

SPRACHEN
Kurze Stichpunkte zu Sprachkenntnissen.

AUSBILDUNG
Saubere Ausbildungsangaben.
`;
  }

  return `
Erstelle ein komplettes Bewerbungspaket.

Trenne exakt so:

=== LEBENSLAUF ===
PROFIL
Kurzes professionelles Profil ohne Überschrift im Satz.

BERUFSERFAHRUNG
Saubere Einträge mit Zeitraum, Position, Unternehmen und Aufgaben.

KENNTNISSE
Kurze Stichpunkte zu relevanten Kenntnissen.

SPRACHEN
Kurze Stichpunkte zu Sprachkenntnissen.

AUSBILDUNG
Saubere Ausbildungsangaben.

=== ANSCHREIBEN ===
Professionelles Anschreiben ohne Absenderdaten, ohne Empfängerdaten, ohne Datum, ohne Betreff und ohne Grußformel.
`;
}

app.get("/", (req, res) => {
  res.send("Server läuft 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
  });
});

app.post("/analyze", async (req, res) => {
  try {
    const { resumeText } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein professioneller deutscher ATS-Lebenslaufanalyst. Antworte immer nur mit validem JSON.",
        },
        {
          role: "user",
          content: buildAnalysisPrompt(resumeText || ""),
        },
      ],
    });

    res.json({
      result: safeParseJson(completion.choices[0].message.content),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Analyse fehlgeschlagen" });
  }
});

app.post("/analyze-pdf", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Keine Datei hochgeladen." });
    }

    let resumeText = "";

    if (req.file.mimetype === "application/pdf") {
      const parsedPdf = await pdfParse(req.file.buffer);
      resumeText = parsedPdf.text || "";
    } else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const result = await mammoth.extractRawText({
        buffer: req.file.buffer,
      });

      resumeText = result.value || "";
    }

    if (!resumeText.trim()) {
      return res.status(400).json({
        error: "Datei konnte nicht gelesen werden.",
      });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content:
            "Du bist ein professioneller deutscher ATS-Lebenslaufanalyst. Antworte immer nur mit validem JSON.",
        },
        {
          role: "user",
          content: buildAnalysisPrompt(resumeText),
        },
      ],
    });

    res.json({
      result: safeParseJson(completion.choices[0].message.content),
      extractedText: resumeText,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Datei Analyse fehlgeschlagen." });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { product } = req.body;

   const products = {
  resume: {
    name: "Starter Paket",
    price: 499,
  },

  coverLetter: {
    name: "Anschreiben Pro",
    price: 499,
  },

  bundle: {
    name: "Pro Bundle",
    price: 799,
  },

  premium: {
    name: "Premium Bewerbungspaket",
    price: 1299,
  },
};

    const selectedProduct = products[product] || products.bundle;
    const selectedProductKey = products[product] ? product : "bundle";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: selectedProduct.name,
            },
            unit_amount: selectedProduct.price,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_URL}/?success=true&product=${selectedProductKey}`,
      cancel_url: `${process.env.FRONTEND_URL}/?canceled=true&product=${selectedProductKey}`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Stripe Checkout konnte nicht erstellt werden.",
    });
  }
});
app.post("/admin-unlock", (req, res) => {
  const { email } = req.body;

  if (
    email &&
    ADMIN_EMAIL &&
    email.toLowerCase() === ADMIN_EMAIL.toLowerCase()
  ) {
    return res.json({
      success: true,
    });
  }

  return res.status(403).json({
    success: false,
  });
});
app.post("/optimize", async (req, res) => {
  try {
    const { resumeText, jobText, product, candidateData } = req.body;

    const selectedProduct = product || "bundle";
    const productPrompt = buildProductPrompt(selectedProduct);

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
Du bist ein professioneller deutscher Bewerbungscoach.

WICHTIGE REGELN:
- Halte dich strikt an das gewünschte Produkt.
- Schreibe ausschließlich saubere deutsche Bewerbungsunterlagen.
- Keine Markdown-Symbole.
- Keine Sterne.
- Keine Emojis.
- Keine Tabellen.
- Keine erfundenen Daten.
- Keine erfundenen Firmen.
- Keine erfundenen Abschlüsse.
- Keine erfundenen Arbeitgeber.
- Keine erfundenen Fähigkeiten.
- Keine erfundenen Zeiträume.
- Keine doppelten Überschriften.
- Keine Wiederholungen.
- Kein KI-Hinweis.
- Keine Platzhalter wie [Firma], [Ort] oder [Datum].
- Nutze relevante Keywords aus der Stellenanzeige.
- Passe Inhalte gezielt auf die Stelle an.
- Verwende nur Informationen aus Bewerberdaten, Lebenslauf und Stellenanzeige.
- Wenn Informationen fehlen, neutral und professionell formulieren.
`,
        },
        {
          role: "user",
          content: `
Produkt:
${selectedProduct}

Aufgabe:
${productPrompt}

Bewerberdaten:
Name: ${candidateData?.fullName || ""}
Beruf/Zielstelle: ${candidateData?.jobTitle || ""}
E-Mail: ${candidateData?.email || ""}
Telefon: ${candidateData?.phone || ""}
Adresse: ${candidateData?.address || ""}
Firma: ${candidateData?.company || ""}
Ansprechpartner: ${candidateData?.recruiter || ""}
Stellenbezeichnung: ${candidateData?.position || ""}
Ort: ${candidateData?.city || ""}

Stellenanzeige:
${jobText || "Keine Stellenanzeige angegeben."}

Lebenslauf / Ausgangstext:
${resumeText || ""}
`,
        },
      ],
    });

    res.json({
      optimizedText: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Optimierung fehlgeschlagen",
    });
  }
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});