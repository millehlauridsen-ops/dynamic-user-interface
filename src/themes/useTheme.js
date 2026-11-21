import { useEffect, useState } from "react";

const validThemes = ["default", "rave", "pokemon", "habbo"];

export function useTheme() {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return validThemes.includes(savedTheme) ? savedTheme : "default";
  });

  // Gemmer brugerens valg af mørk tilstand
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("app-dark-mode") === "true",
  );

  useEffect(() => {
    document.documentElement.dataset.theme = selectedTheme;
    localStorage.setItem("app-theme", selectedTheme);
  }, [selectedTheme]);

  useEffect(() => {
    // Mørk tilstand gælder kun Default-temaet
    document.documentElement.dataset.mode =
      selectedTheme === "default" && darkMode ? "dark" : "light";

    localStorage.setItem("app-dark-mode", String(darkMode));
  }, [selectedTheme, darkMode]);

  return [selectedTheme, setSelectedTheme, darkMode, setDarkMode];
}
