export const REPORTS_SECTION_ID = "reports";

// Element render hone tak thora intezar karo (data async load hota hai), phir smooth scroll
export const scrollToSection = (id, attempts = 20) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  if (attempts > 0) {
    window.setTimeout(() => scrollToSection(id, attempts - 1), 100);
  }
};
