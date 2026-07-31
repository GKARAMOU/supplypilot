import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import SupplyPilot from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SupplyPilot />
  </StrictMode>,
);
