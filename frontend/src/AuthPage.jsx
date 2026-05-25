import { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";

import Topbar from "./components/Topbar";

export default function AuthPage({ goHome, onLoginSuccess }) {
  const [mode, setMode] = useState("login");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const [accepted, setAccepted] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submitAuth() {
    try {
      setLoading(true);

      setErrorMessage("");
      setSuccessMessage("");

      if (!email || !password) {
        setErrorMessage(
          "Bitte E-Mail und Passwort eingeben."
        );
        return;
      }

      if (mode === "register") {
        if (!fullName.trim()) {
          setErrorMessage(
            "Bitte Vorname und Nachname eingeben."
          );
          return;
        }

        if (password.length < 8) {
          setErrorMessage(
            "Das Passwort muss mindestens 8 Zeichen haben."
          );
          return;
        }

        if (password !== passwordRepeat) {
          setErrorMessage(
            "Die Passwörter stimmen nicht überein."
          );
          return;
        }

        if (!accepted) {
          setErrorMessage(
            "Bitte AGB und Datenschutz akzeptieren."
          );
          return;
        }

        const userCredential =
          await createUserWithEmailAndPassword(
            auth,
            email,
            password
          );

        await updateProfile(userCredential.user, {
          displayName: fullName,
        });

        await sendEmailVerification(
          userCredential.user
        );

        setSuccessMessage(
          "Konto erstellt. Bitte bestätige deine E-Mail."
        );
      } else {
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
      }

      onLoginSuccess?.();
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Topbar goHome={goHome} />

      <div className="max-w-md mx-auto px-6 py-16">
        <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8 shadow-2xl">

          <p className="text-orange-400 font-bold mb-3">
            BewerberFuchs Account
          </p>

          <h1 className="text-4xl font-black mb-3">
            {mode === "login"
              ? "Einloggen"
              : "Konto erstellen"}
          </h1>

          <p className="text-gray-400 mb-8">
            Speichere deine Bewerbungen sicher
            und öffne sie später wieder.
          </p>

          {errorMessage && (
            <div className="mb-5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-5 rounded-2xl border border-green-500/30 bg-green-500/10 p-4 text-green-300">
              {successMessage}
            </div>
          )}

          {mode === "register" && (
            <input
              type="text"
              placeholder="Vorname und Nachname"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              className="w-full mb-4 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
            />
          )}

          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full mb-4 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full mb-4 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          />

          {mode === "register" && (
            <>
              <input
                type="password"
                placeholder="Passwort wiederholen"
                value={passwordRepeat}
                onChange={(e) =>
                  setPasswordRepeat(e.target.value)
                }
                className="w-full mb-4 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
              />

              <label className="flex gap-3 text-sm text-gray-400 mb-6">
                <input
                  type="checkbox"
                  checked={accepted}
                  onChange={(e) =>
                    setAccepted(e.target.checked)
                  }
                  className="mt-1"
                />

                <span>
                  Ich akzeptiere die AGB und die
                  Datenschutzerklärung.
                </span>
              </label>
            </>
          )}

          <button
            onClick={submitAuth}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-black font-black py-4 rounded-2xl transition"
          >
            {loading
              ? "Bitte warten..."
              : mode === "login"
              ? "Einloggen"
              : "Konto erstellen"}
          </button>

          <button
            onClick={() =>
              setMode(
                mode === "login"
                  ? "register"
                  : "login"
              )
            }
            className="w-full mt-5 text-gray-400 hover:text-white transition"
          >
            {mode === "login"
              ? "Noch kein Konto? Registrieren"
              : "Schon ein Konto? Einloggen"}
          </button>
        </div>
      </div>
    </div>
  );
}