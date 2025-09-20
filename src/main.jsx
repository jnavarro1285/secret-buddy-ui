import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import SecretBuddyApp from "./secret-buddy-app";

import "./index.css";

const rawBase = import.meta.env.VITE_BASE || '/';
const baseName = rawBase === '/' ? '/' : rawBase.replace(/\/$/, '');

createRoot(document.getElementById("root")).render(
  <BrowserRouter basename={baseName}>
    <SecretBuddyApp />
  </BrowserRouter>
);
