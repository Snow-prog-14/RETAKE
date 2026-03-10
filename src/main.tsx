console.log("MAIN.TSX RUNNING ✅");
import React from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { initBackground } from "./background";
import App from "./App";

initBackground();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
