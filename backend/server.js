import Stripe from "stripe";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import multer from "multer";
import mammoth from "mammoth";
import { createRequire } from "module";

dotenv.config();

const requireModule = createRequire(import.meta.url);
const pdfParse = requireModule("pdf-parse");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

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
      result: completion.choices[0].message.content,
    });
  } catch (err) {
    console.log(err);
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
    } else {
      return res.status(400).json({
        error: "Nur PDF oder DOCX Dateien erlaubt.",
      });
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
      result: completion.choices[0].message.content,
      extractedText: resumeText,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Datei Analyse fehlgeschlagen." });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    const { product } = req.body;

    const products = {
      resume: {
        name: "Lebenslauf Optimierung",
        price: 300,
      },
      coverLetter: {
        name: "Anschreiben Erstellung",
        price: 300,
      },
      bundle: {
        name: "Bewerbung Bundle",
        price: 500,
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
    console.log(error);
    res.status(500).json({
      error: "Stripe Checkout konnte nicht erstellt werden.",
    });
  }
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
    console.log(error);

    res.status(500).json({
      error: "Optimierung fehlgeschlagen",
    });
  }
});

app.listen(4242, () => {
  console.log("Server läuft auf http://localhost:4242");
});