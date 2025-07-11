import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./lib/firebase"; // to initialize Firebase
import { TrendProvider } from "@/contexts/TrendContext";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <TrendProvider>
      <App />
    </TrendProvider>
  </React.StrictMode>
);
