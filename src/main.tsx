/// <reference types="vite/client" />
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabase";
import App from "./App";
import "./index.css";
import "./lib/firebase"; // to initialize Firebase
import { AuthProvider } from "@/contexts/AuthProvider";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { TrendProvider } from "@/contexts/TrendContext";
import { initCompactMode, initKeyboardShortcut } from "./lib/compactMode";

// Initialize compact mode
initCompactMode();
initKeyboardShortcut();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Failed to find the root element");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <AuthProvider>
        <SubscriptionProvider>
          <TrendProvider>
            <Router>
              <App />
            </Router>
          </TrendProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </SessionContextProvider>
  </React.StrictMode>
);
