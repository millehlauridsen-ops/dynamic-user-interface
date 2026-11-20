import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./globals.css";
import "./themes/rave.css";
import "./themes/pokemon.css";
import "./themes/habbo.css";
import "./themes/dark.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
