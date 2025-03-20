import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import AppRouter from "./routes";
import AlertProvider from "./context/AlertsContext/AlertsContext";
import UserProvider from "./context/UserContext/UserContext";
import LanguageProvider from "@context/LanguageContext/LanguageContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AlertProvider>
      <LanguageProvider>
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </LanguageProvider>
    </AlertProvider>
  </StrictMode>,
);
