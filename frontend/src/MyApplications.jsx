import { useEffect, useState } from "react";

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

import { auth, db } from "./firebase";
import toast from "react-hot-toast";
import Topbar from "./components/Topbar";

export default function MyApplications({
  goHome,
  logout,
  isLoggedIn,
}) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadApplications() {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(db, "users", auth.currentUser.uid, "applications"),
        orderBy("createdAt", "desc")
      );

      const snapshot = await getDocs(q);

      const docs = snapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));

      setApplications(docs);
    } catch {
      toast.error("Bewerbungen konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }

  async function removeApplication(id) {
    try {
      await deleteDoc(
        doc(db, "users", auth.currentUser.uid, "applications", id)
      );

      setApplications((prev) => prev.filter((item) => item.id !== id));
      toast.success("Bewerbung gelöscht.");
    } catch {
      toast.error("Löschen fehlgeschlagen.");
    }
  }

  function openSavedPdf(app) {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("PDF konnte nicht geöffnet werden.");
      return;
    }

    const safeTitle = app.title || "Bewerbung";
    const safeText = app.optimizedText || "";

    printWindow.document.write(`
      <html>
        <head>
          <title>${safeTitle}</title>
          <style>
            body {
              margin: 0;
              background: #e5e7eb;
              font-family: Arial, sans-serif;
              padding: 40px;
            }

            .page {
              max-width: 794px;
              min-height: 1123px;
              margin: auto;
              background: white;
              color: #111827;
              padding: 60px;
              box-sizing: border-box;
              line-height: 1.7;
              font-size: 15px;
            }

            h1 {
              font-size: 32px;
              margin-bottom: 30px;
            }

            pre {
              white-space: pre-wrap;
              font-family: Arial, sans-serif;
            }

            @media print {
              body {
                background: white;
                padding: 0;
              }

              .page {
                box-shadow: none;
                margin: 0;
                max-width: none;
              }
            }
          </style>
        </head>

        <body>
          <div class="page">
            <h1>${safeTitle}</h1>
            <pre>${safeText}</pre>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
    }, 500);
  }

  useEffect(() => {
    loadApplications();
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Topbar
        goHome={goHome}
        logout={logout}
        isLoggedIn={isLoggedIn}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-12">
          <p className="text-orange-400 font-bold mb-3">
            Cloud Speicher
          </p>

          <h1 className="text-4xl md:text-6xl font-black mb-5">
            Meine Bewerbungen
          </h1>

          <p className="text-gray-400 text-lg max-w-2xl">
            Hier findest du alle gespeicherten Bewerbungen und Optimierungen.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="animate-pulse rounded-3xl bg-white/5 h-32" />
            <div className="animate-pulse rounded-3xl bg-white/5 h-32" />
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-10 text-center">
            <div className="text-5xl mb-5">📂</div>

            <h2 className="text-3xl font-black mb-4">
              Noch keine Bewerbungen
            </h2>

            <p className="text-gray-400">
              Gespeicherte Bewerbungen erscheinen hier.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="rounded-[32px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div>
                    <p className="text-orange-400 font-bold mb-2">
                      {app.selectedProduct || "Bewerbung"}
                    </p>

                    <h2 className="text-3xl font-black mb-3">
                      {app.title || "Gespeicherte Bewerbung"}
                    </h2>

                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                        Vorlage: {app.selectedTemplate || "classic"}
                      </div>

                      <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm text-green-300">
                        Gespeichert
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(app.optimizedText || "");
                        toast.success("Text kopiert");
                      }}
                      className="bg-orange-500 hover:bg-orange-400 text-black font-black px-6 py-3 rounded-2xl"
                    >
                      Kopieren
                    </button>

                    <button
                      onClick={() => openSavedPdf(app)}
                      className="border border-orange-500/30 bg-orange-500/10 hover:bg-orange-500 hover:text-black text-orange-300 font-bold px-6 py-3 rounded-2xl transition-all"
                    >
                      PDF öffnen
                    </button>

                    <button
                      onClick={() => removeApplication(app.id)}
                      className="border border-red-500/20 bg-red-500/10 hover:bg-red-500 hover:text-white text-red-300 font-bold px-6 py-3 rounded-2xl transition-all"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}