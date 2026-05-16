export function parseResumeText(text = "") {
  const clean = text
    .replace(/\*\*/g, "")
    .replace(/\r/g, "")
    .trim();

  const sections = {
    profil: "",
    berufserfahrung: "",
    kenntnisse: "",
    ausbildung: "",
    sprachen: "",
    sonstiges: "",
  };

  const map = [
    ["profil", ["PROFIL", "PERSÖNLICHES PROFIL"]],
    ["berufserfahrung", ["BERUFLICHE ERFAHRUNG", "BERUFSERFAHRUNG"]],
    ["kenntnisse", ["KENNTNISSE", "FACHLICHE KENNTNISSE", "STÄRKEN"]],
    ["ausbildung", ["AUSBILDUNG", "SCHULBILDUNG", "BERUFSAUSBILDUNG UND STUDIUM"]],
    ["sprachen", ["SPRACHKENNTNISSE", "SPRACHEN"]],
  ];

  let current = "sonstiges";

  clean.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const upper = trimmed.toUpperCase().replace(":", "");

    const found = map.find(([, titles]) =>
      titles.some((title) => upper.includes(title))
    );

    if (found) {
      current = found[0];
      return;
    }

    sections[current] += trimmed + "\n";
  });

  return sections;
}

export function lines(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

