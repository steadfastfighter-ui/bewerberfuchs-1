import { useEffect, useState } from "react";
import CookieBanner from "./components/CookieBanner";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import Checkout from "./Checkout";
import Success from "./Success";
import OptimizedResume from "./OptimizedResume";
import LegalPage from "./LegalPage";
import AuthPage from "./AuthPage";

export default function App() {
  const [page, setPage] = useState("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("loggedIn") === "true"
  );

  const [resumeText, setResumeText] = useState(
    () => localStorage.getItem("resumeText") || ""
  );
  const [jobText, setJobText] = useState(
    () => localStorage.getItem("jobText") || ""
  );
  const [selectedProduct, setSelectedProduct] = useState(
    () => localStorage.getItem("selectedProduct") || ""
  );
  const [selectedTemplate, setSelectedTemplate] = useState(
    () => localStorage.getItem("selectedTemplate") || "classic"
  );
  const [profilePhoto, setProfilePhoto] = useState(
    () => localStorage.getItem("profilePhoto") || ""
  );

  const [candidateData, setCandidateData] = useState(() => {
    try {
      return (
        JSON.parse(localStorage.getItem("candidateData")) || {
          fullName: "",
          jobTitle: "",
          email: "",
          phone: "",
          address: "",
          linkedin: "",
          company: "",
          recruiter: "",
          position: "",
          city: "",
        }
      );
    } catch {
      return {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        address: "",
        linkedin: "",
        company: "",
        recruiter: "",
        position: "",
        city: "",
      };
    }
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  function loginSuccess() {
    localStorage.setItem("loggedIn", "true");
    setIsLoggedIn(true);
    setPage("dashboard");
  }

  function logout() {
    localStorage.removeItem("loggedIn");
    setIsLoggedIn(false);
    setPage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goStartseite() {
    setPage("landing");
    setPaymentSuccess(false);
    window.history.replaceState({}, "", "/");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goCheckout(product) {
    const selected = product || "bundle";
    setSelectedProduct(selected);
    localStorage.setItem("selectedProduct", selected);
    setPage("checkout");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function saveResumeText(text) {
    setResumeText(text);
    localStorage.setItem("resumeText", text);
  }

  function saveJobText(text) {
    setJobText(text);
    localStorage.setItem("jobText", text);
  }

  function saveTemplate(template) {
    setSelectedTemplate(template);
    localStorage.setItem("selectedTemplate", template);
  }

  function saveProfilePhoto(photo) {
    setProfilePhoto(photo);
    if (photo) localStorage.setItem("profilePhoto", photo);
    else localStorage.removeItem("profilePhoto");
  }

  function saveCandidateData(data) {
    setCandidateData(data);
    localStorage.setItem("candidateData", JSON.stringify(data));
  }

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("success") === "true") {
      const product = params.get("product") || "bundle";
      setSelectedProduct(product);
      localStorage.setItem("selectedProduct", product);
      setPaymentSuccess(true);
      setPage("success");
      window.history.replaceState({}, "", "/");
    }

    if (params.get("canceled") === "true") {
      const product = params.get("product") || "bundle";
      setSelectedProduct(product);
      localStorage.setItem("selectedProduct", product);
      setPaymentSuccess(false);
      setPage("checkout");
      alert("Zahlung wurde abgebrochen. Du kannst es jederzeit erneut versuchen.");
      window.history.replaceState({}, "", "/");
    }
  }, []);

  let content;

  if (page === "dashboard") {
    content = (
      <Dashboard
        goHome={goStartseite}
        logout={logout}
        isLoggedIn={isLoggedIn}
        goLogin={() => setPage("auth")}
        goCheckout={goCheckout}
        setAppResumeText={saveResumeText}
        selectedTemplate={selectedTemplate}
        setSelectedTemplate={saveTemplate}
        profilePhoto={profilePhoto}
        setProfilePhoto={saveProfilePhoto}
        candidateData={candidateData}
        setCandidateData={saveCandidateData}
        jobText={jobText}
        setJobText={saveJobText}
      />
    );
  } else if (page === "checkout") {
    content = (
      <Checkout
        goDashboard={() => setPage("dashboard")}
        logout={logout}
        isLoggedIn={isLoggedIn}
        selectedProduct={selectedProduct || "bundle"}
      />
    );
  } else if (page === "success") {
    content = (
      <Success
        goDashboard={goStartseite}
        logout={logout}
        isLoggedIn={isLoggedIn}
        goOptimized={() => {
          setPaymentSuccess(true);
          setPage("optimized");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        selectedProduct={selectedProduct || "bundle"}
      />
    );
  } else if (page === "optimized") {
    content = (
      <OptimizedResume
        goDashboard={goStartseite}
        logout={logout}
        isLoggedIn={isLoggedIn}
        resumeText={resumeText}
        jobText={jobText}
        selectedProduct={selectedProduct || "bundle"}
        selectedTemplate={selectedTemplate}
        profilePhoto={profilePhoto}
        candidateData={candidateData}
      />
    );
  } else if (page === "impressum") {
    content = <LegalPage type="impressum" goHome={goStartseite} />;
  } else if (page === "datenschutz") {
    content = <LegalPage type="datenschutz" goHome={goStartseite} />;
  } else if (page === "agb") {
    content = <LegalPage type="agb" goHome={goStartseite} />;
  } else if (page === "kontakt") {
    content = <LegalPage type="kontakt" goHome={goStartseite} />;
  } else if (page === "auth") {
    content = (
      <AuthPage
        goHome={goStartseite}
        onLoginSuccess={loginSuccess}
      />
    );
  } else {
    content = (
      <LandingPage
        goDashboard={() => setPage("dashboard")}
        goCheckout={goCheckout}
        goLegal={(legalPage) => setPage(legalPage)}
      />
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#030712] text-white">
      <div className="relative overflow-x-hidden">
        {content}
        <CookieBanner />
      </div>
    </div>
  );
}