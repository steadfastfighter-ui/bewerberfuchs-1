import { useEffect, useState } from "react";

import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";
import Checkout from "./Checkout";
import Success from "./Success";
import OptimizedResume from "./OptimizedResume";
import LegalPage from "./LegalPage";

export default function App() {
  const [page, setPage] = useState("landing");

  const [resumeText, setResumeText] = useState(() => {
    return localStorage.getItem("resumeText") || "";
  });

  const [jobText, setJobText] = useState(() => {
    return localStorage.getItem("jobText") || "";
  });

  const [selectedProduct, setSelectedProduct] = useState(() => {
    return localStorage.getItem("selectedProduct") || "";
  });

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem("selectedTemplate") || "classic";
  });

  const [profilePhoto, setProfilePhoto] = useState(() => {
    return localStorage.getItem("profilePhoto") || "";
  });

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

    if (photo) {
      localStorage.setItem("profilePhoto", photo);
    } else {
      localStorage.removeItem("profilePhoto");
    }
  }

  function saveCandidateData(data) {
    setCandidateData(data);
    localStorage.setItem("candidateData", JSON.stringify(data));
  }

  function goStartseite() {
    window.history.replaceState({}, "", "/");
    setPaymentSuccess(false);
    setPage("landing");
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

      alert(
        "Zahlung wurde abgebrochen. Du kannst es jederzeit erneut versuchen."
      );

      window.history.replaceState({}, "", "/");
    }
  }, []);

  if (page === "dashboard") {
    return (
      <Dashboard
        goHome={goStartseite}
        goCheckout={(product) => {
          setSelectedProduct(product || "bundle");
          localStorage.setItem(
            "selectedProduct",
            product || "bundle"
          );
          setPage("checkout");
        }}
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
  }

  if (page === "checkout") {
    return (
      <Checkout
        goDashboard={() => setPage("dashboard")}
        selectedProduct={selectedProduct || "bundle"}
      />
    );
  }

  if (page === "success" && paymentSuccess) {
    return (
      <Success
        goDashboard={goStartseite}
        goOptimized={() => setPage("optimized")}
        selectedProduct={selectedProduct || "bundle"}
      />
    );
  }

  if (page === "optimized" && paymentSuccess) {
    return (
      <OptimizedResume
        goDashboard={goStartseite}
        resumeText={resumeText}
        jobText={jobText}
        selectedProduct={selectedProduct || "bundle"}
        selectedTemplate={selectedTemplate}
        profilePhoto={profilePhoto}
        candidateData={candidateData}
      />
    );
  }

  if (page === "impressum") {
    return <LegalPage type="impressum" goHome={goStartseite} />;
  }

  if (page === "datenschutz") {
    return <LegalPage type="datenschutz" goHome={goStartseite} />;
  }

  if (page === "agb") {
    return <LegalPage type="agb" goHome={goStartseite} />;
  }

  if (page === "kontakt") {
    return <LegalPage type="kontakt" goHome={goStartseite} />;
  }

  return (
    <LandingPage
      goDashboard={() => setPage("dashboard")}
      goCheckout={(product) => {
        setSelectedProduct(product || "bundle");
        localStorage.setItem(
          "selectedProduct",
          product || "bundle"
        );
        setPage("checkout");
      }}
      goLegal={(legalPage) => setPage(legalPage)}
    />
  );
}