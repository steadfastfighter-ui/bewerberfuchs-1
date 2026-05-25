import { useState } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import Topbar from "./components/Topbar";

export default function AuthPage({ goHome, onLoginSuccess }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submitAuth() {
    try {
      if (mode === "register") {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      onLoginSuccess?.();
    } catch (error) {
      alert("Login fehlgeschlagen: " + error.message);
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <Topbar goHome={goHome} />

      <div className="max-w-md mx-auto px-6 py-20">
        <div className="bg-white/[0.04] border border-white/10 rounded-[32px] p-8">
          <h1 className="text-4xl font-black mb-3">
            {mode === "login" ? "Einloggen" : "Registrieren"}
          </h1>

          <p className="text-gray-400 mb-8">
            Speichere deine Bewerbungen und öffne sie später wieder.
          </p>

          <input
            type="email"
            placeholder="E-Mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          />

          <input
            type="password"
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-6 bg-black/30 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-orange-500"
          />

          <button
            onClick={submitAuth}
            className="w-full bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded-2xl"
          >
            {mode === "login" ? "Einloggen" : "Konto erstellen"}
          </button>

          <button
            onClick={() =>
              setMode(mode === "login" ? "register" : "login")
            }
            className="w-full mt-5 text-gray-400 hover:text-white"
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