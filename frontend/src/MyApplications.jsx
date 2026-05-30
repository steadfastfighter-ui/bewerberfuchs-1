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
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  async function loadApplications() {
    if (!auth.currentUser) {
      setLoading(false);
      return;
    }

    try {
      const q = query(
        collection(
          db,
          "users",
          auth.currentUser.uid,
          "applications"
        ),
        orderBy("createdAt", "desc")
      );

      const snapshot =
        await getDocs(q);

      const docs = snapshot.docs.map(
        (doc) => ({
          id: doc.id,
          ...doc.data(),
        })
      );

      setApplications(docs);
    } catch {
      toast.error(
        "Bewerbungen konnten nicht geladen werden."
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeApplication(id) {
    try {
      await deleteDoc(
        doc(
          db,
          "users",
          auth.currentUser.uid,
          "applications",
          id
        )
      );

      setApplications((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      toast.success(
        "Bewerbung gelöscht."
      );
    } catch {
      toast.error(
        "Löschen fehlgeschlagen."
      );
    }
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
            Hier findest du alle
            gespeicherten Bewerbungen
            und Optimierungen.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <div className="animate-pulse rounded-3xl bg-white/5 h-32" />
            <div className="animate-pulse rounded-3xl bg-white/5 h-32" />
          </div>
        ) : applications.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-white/[0.04] p-10 text-center">
            <div className="text-5xl mb-5">
              📂
            </div>

            <h2 className="text-3xl font-black mb-4">
              Noch keine Bewerbungen
            </h2>

            <p className="text-gray-400">
              Gespeicherte Bewerbungen
              erscheinen hier.
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="
                  rounded-[32px]
                  border
                  border-white/10
                  bg-white/[0.04]
                  p-6
                  backdrop-blur-xl
                "
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  <div>
                    <p className="text-orange-400 font-bold mb-2">
                      {app.selectedProduct}
                    </p>

                    <h2 className="text-3xl font-black mb-3">
                      {app.title}
                    </h2>

                    <div className="flex flex-wrap gap-3">
                      <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300">
                        Vorlage:{" "}
                        {app.selectedTemplate}
                      </div>

                      <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-sm text-green-300">
                        Gespeichert
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4">

                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(
                          app.optimizedText || ""
                        );

                        toast.success(
                          "Text kopiert"
                        );
                      }}
                      className="
                        bg-orange-500
                        hover:bg-orange-400
                        text-black
                        font-black
                        px-6
                        py-3
                        rounded-2xl
                      "
                    >
                      Kopieren
                    </button>

                    <button
                      onClick={() =>
                        removeApplication(
                          app.id
                        )
                      }
                      className="
                        border
                        border-red-500/20
                        bg-red-500/10
                        hover:bg-red-500
                        hover:text-white
                        text-red-300
                        font-bold
                        px-6
                        py-3
                        rounded-2xl
                        transition-all
                      "
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