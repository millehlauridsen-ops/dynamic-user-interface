import { useEffect, useState } from "react";

const validThemes = ["default", "rave", "pokemon", "habbo"];

export function useTheme() {
  const [selectedTheme, setSelectedTheme] = useState(() => {
    const savedTheme = localStorage.getItem("app-theme");
    return validThemes.includes(savedTheme) ? savedTheme : "default";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = selectedTheme;
    localStorage.setItem("app-theme", selectedTheme);
  }, [selectedTheme]);

  return [selectedTheme, setSelectedTheme];
}
